#!/usr/bin/env node
/**
 * Full-page screenshots (JPEG) of a list of routes at named viewports.
 *
 *   node scripts/qa/capture.mjs --base http://localhost:3111 --out shots \
 *     --routes /,/about,/contact --viewports desktop,mobile
 *
 * Each page is loaded, scrolled to the bottom in steps and back to the top
 * (so lazy images load and scroll reveals fire), then captured from the top
 * with the viewport left at its real size: a 100vh hero is one screen tall,
 * and fixed or sticky chrome appears once, where it sits at scroll position 0.
 *
 * Alongside the images it writes capture.json and capture.md with, per
 * capture, the document scrollHeight and whether scrollWidth exceeds the
 * viewport. Analytics and ad tag hosts are blocked; attempts are counted.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { launchChrome, resolveViewports, sleep } from "./lib/chrome.mjs";
import {
  cell,
  cli,
  hostFacts,
  imageSize,
  intArg,
  listArg,
  mapPool,
  normalizeBase,
  pairsArg,
  progress,
  readJsonIfExists,
  routeSlug,
  run,
  UsageError,
  writeFile,
  writeJson,
} from "./lib/util.mjs";
import { loadRoutes } from "./routes.mjs";

const USAGE = `
Usage: node scripts/qa/capture.mjs --base http://localhost:PORT --out DIR [options]

Routes (one of):
  --routes LIST        comma separated paths, e.g. /,/about,/contact (a query string is allowed: "/?intro=1")
  --routes-file FILE   one path per line
  --all                every built page (reads --next-dir, default .next)

Viewports:
  --viewports LIST     desktop (1440x900 @1x) and/or mobile (390x844 @2x, mobile + touch emulation); default desktop,mobile
  --widths LIST        extra widths, e.g. 320,768,1920 (below 768: phone emulation @2x, 812 tall; otherwise 900 tall @1x)
  --sizes LIST         extra WIDTHxHEIGHT sizes, e.g. 844x390 for a phone held sideways
  --height N           height for --widths
  --dpr N              device pixel ratio for every viewport
  --reduced-motion     emulate prefers-reduced-motion: reduce (files get a -reduced-motion suffix)

Output:
  --format jpeg|png    default jpeg
  --quality N          JPEG quality, default 80
  --fold               also save the first screen alone (…--fold.jpg)

Page state:
  --show-coupon        leave the coupon pop-up armed (by default localStorage cs-coupon-seen=now keeps it closed)
  --storage LIST       extra localStorage entries, key=value (the value "now" becomes the current time in ms)
  --settle MS          wait after scrolling back to the top, default 600
  --timeout MS         page load timeout, default 45000
  --concurrency N      pages captured in parallel, default 2
`;

async function captureOne(browser, job, options) {
  const started = Date.now();
  const { route, viewport } = job;
  const record = {
    route,
    url: job.url,
    viewport: viewport.label,
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
    reducedMotion: options.reducedMotion,
    file: job.file,
  };
  const page = await browser.newPage({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
    touch: viewport.touch,
    reducedMotion: options.reducedMotion,
  });
  try {
    await page.seedLocalStorage(options.storage);
    const nav = await page.goto(job.url, { waitUntil: "networkidle", timeout: options.timeout });
    record.status = nav.status;
    record.finalUrl = nav.finalUrl;
    await page.evaluate(() => document.fonts.ready.then(() => true));
    if (options.fold) {
      const fold = await page.screenshot({ path: path.join(options.out, job.foldFile), format: options.format, quality: options.quality });
      record.foldFile = job.foldFile;
      record.foldBytes = fold.bytes;
    }
    const scroll = await page.steppedScroll();
    await sleep(options.settle);
    const metrics = await page.layoutMetrics();
    const shot = await page.screenshot({
      path: path.join(options.out, job.file),
      fullPage: true,
      format: options.format,
      quality: options.quality,
    });
    const written = imageSize(shot.buffer);
    Object.assign(record, {
      scrollHeight: metrics.scrollHeight,
      scrollWidth: metrics.scrollWidth,
      overflowsViewport: metrics.overflowsViewport,
      unclippedScrollWidth: metrics.unclippedScrollWidth,
      clippedOverflow: metrics.clippedOverflow,
      scrollSteps: scroll.steps,
      unloadedImages: scroll.unloadedImages,
      networkIdle: Boolean(nav.idle) && scroll.idle,
      bytes: shot.bytes,
      pixelWidth: written?.width ?? shot.pixelWidth,
      pixelHeight: written?.height ?? shot.pixelHeight,
      tiles: shot.tiles,
      scale: shot.scale,
    });
    if (written && (written.width !== shot.pixelWidth || written.height !== shot.pixelHeight)) {
      record.warning = `image is ${written.width}x${written.height}, expected ${shot.pixelWidth}x${shot.pixelHeight}`;
    }
    record.env = await page.env();
    const report = page.report();
    Object.assign(record, {
      consoleErrors: report.consoleErrors.length,
      failedFirstPartyRequests: report.failedFirstPartyRequests.length,
      tagAttempts: report.tagAttempts,
      tagAttemptsBlocked: report.tagAttemptsBlocked,
      tagAttemptHosts: report.tagAttemptHosts,
      tagLeaks: report.tagLeaks.length,
    });
  } catch (err) {
    record.error = err.message;
  } finally {
    await page.close();
  }
  record.ms = Date.now() - started;
  return record;
}

function markdown(report) {
  const lines = [];
  const add = (line = "") => lines.push(line);
  const captures = Object.values(report.captures).sort((a, b) => a.route.localeCompare(b.route) || a.viewport.localeCompare(b.viewport));
  add("# Screenshots");
  add();
  add(`- Base: ${report.base}`);
  add(`- Updated: ${report.updatedAt}`);
  add(`- Browser: ${report.browser?.product} — \`${report.browser?.userAgent}\``);
  add(`- Method: load, wait for the network to go quiet, scroll to the bottom in steps and back, then capture the whole page from the top with the viewport at its real size.`);
  add();
  add("| Route | Viewport | Size (CSS px) | HTTP | scrollHeight | Wider than viewport | Unloaded images | Console errors | Tag requests (blocked) | File |");
  add("|---|---|---|---:|---:|---|---:|---:|---|---|");
  for (const c of captures) {
    if (c.error) {
      add(`| \`${cell(c.route)}\` | ${c.viewport} | ${c.width}x${c.height} | ${c.status ?? "–"} | – | – | – | – | – | FAILED: ${cell(c.error)} |`);
      continue;
    }
    const wide = c.overflowsViewport
      ? `YES (${c.scrollWidth})`
      : c.clippedOverflow
        ? `clipped (${c.unclippedScrollWidth})`
        : "no";
    add(
      `| \`${cell(c.route)}\` | ${c.viewport}${c.reducedMotion ? " (reduced motion)" : ""} | ${c.width}x${c.height} @${c.deviceScaleFactor}x | ${c.status} | ${c.scrollHeight} | ${wide} | ${c.unloadedImages} | ${c.consoleErrors} | ${c.tagAttempts} (${c.tagAttemptsBlocked})${c.tagLeaks ? ` LEAKED ${c.tagLeaks}` : ""} | ${cell(c.file)}${c.scale !== 1 ? ` (scaled ${c.scale.toFixed(3)})` : ""} |`
    );
  }
  add();
  add("\"clipped\" means content is wider than the viewport but html/body clip it, so the page cannot be scrolled sideways.");
  add("\"Unloaded images\" are lazy images that never came on screen (for example slides of a carousel that were not shown).");
  return `${lines.join("\n")}\n`;
}

async function main() {
  const { values } = cli(USAGE, {
    base: { type: "string" },
    out: { type: "string" },
    routes: { type: "string", multiple: true },
    "routes-file": { type: "string" },
    all: { type: "boolean" },
    "next-dir": { type: "string", default: ".next" },
    viewports: { type: "string", multiple: true },
    widths: { type: "string", multiple: true },
    sizes: { type: "string", multiple: true },
    height: { type: "string" },
    dpr: { type: "string" },
    "reduced-motion": { type: "boolean" },
    format: { type: "string", default: "jpeg" },
    quality: { type: "string" },
    fold: { type: "boolean" },
    "show-coupon": { type: "boolean" },
    storage: { type: "string", multiple: true },
    settle: { type: "string" },
    timeout: { type: "string" },
    concurrency: { type: "string" },
  });
  if (!values.out) throw new UsageError("--out is required");
  if (!["jpeg", "png"].includes(values.format)) throw new UsageError("--format must be jpeg or png");
  const base = normalizeBase(values.base);

  let routes = listArg(values.routes);
  if (values["routes-file"]) {
    routes.push(
      ...readFileSync(values["routes-file"], "utf8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
    );
  }
  if (values.all) routes.push(...loadRoutes(values["next-dir"]).pages.map((p) => p.path));
  routes = [...new Set(routes)];
  if (!routes.length) throw new UsageError("No routes: pass --routes, --routes-file or --all");
  const bad = routes.filter((r) => !r.startsWith("/"));
  if (bad.length) throw new UsageError(`Routes must start with "/": ${bad.join(", ")}`);

  const named = listArg(values.viewports);
  const extra = [...listArg(values.widths), ...listArg(values.sizes)];
  let viewports;
  try {
    viewports = resolveViewports([...(named.length || extra.length ? named : ["desktop", "mobile"]), ...extra], {
      height: values.height === undefined ? undefined : intArg(values.height, "height"),
      deviceScaleFactor: values.dpr === undefined ? undefined : intArg(values.dpr, "dpr"),
    });
  } catch (err) {
    throw new UsageError(err.message);
  }

  const options = {
    out: values.out,
    format: values.format,
    quality: intArg(values.quality, "quality", 80),
    fold: Boolean(values.fold),
    reducedMotion: Boolean(values["reduced-motion"]),
    settle: intArg(values.settle, "settle", 600),
    timeout: intArg(values.timeout, "timeout", 45000),
    storage: { ...(values["show-coupon"] ? {} : { "cs-coupon-seen": "now" }), ...pairsArg(values.storage, "storage") },
  };
  const ext = options.format === "jpeg" ? "jpg" : "png";
  const jobs = [];
  for (const route of routes) {
    for (const viewport of viewports) {
      const stem = `${routeSlug(route)}--${viewport.label}${options.reducedMotion ? "-reduced-motion" : ""}`;
      jobs.push({ route, viewport, url: base + route, file: `${stem}.${ext}`, foldFile: `${stem}--fold.${ext}` });
    }
  }

  progress(`Capturing ${jobs.length} page(s): ${routes.length} route(s) x ${viewports.map((v) => v.label).join(", ")}`);
  const browser = await launchChrome();
  const browserInfo = browser.info();
  let records;
  try {
    let done = 0;
    records = await mapPool(jobs, intArg(values.concurrency, "concurrency", 2), async (job) => {
      const record = await captureOne(browser, job, options);
      done += 1;
      progress(
        record.error
          ? `  [${done}/${jobs.length}] FAILED ${job.route} ${job.viewport.label}: ${record.error}`
          : `  [${done}/${jobs.length}] ${job.file}  ${record.pixelWidth}x${record.pixelHeight}  scrollHeight ${record.scrollHeight}${record.overflowsViewport ? "  WIDER THAN VIEWPORT" : ""}`
      );
      return record;
    });
  } finally {
    await browser.close();
  }

  const jsonFile = path.join(values.out, "capture.json");
  const previous = readJsonIfExists(jsonFile);
  const captures = { ...(previous?.kind === "cs-qa-capture" ? previous.captures : {}) };
  for (const record of records) captures[record.file] = record;
  const report = {
    kind: "cs-qa-capture",
    version: 1,
    updatedAt: new Date().toISOString(),
    base,
    host: hostFacts(),
    browser: browserInfo,
    options: { format: options.format, quality: options.quality, settle: options.settle, storage: options.storage, reducedMotion: options.reducedMotion },
    captures,
  };
  writeJson(jsonFile, report);
  writeFile(path.join(values.out, "capture.md"), markdown(report));

  const failed = records.filter((r) => r.error);
  const leaks = records.filter((r) => r.tagLeaks);
  const wide = records.filter((r) => r.overflowsViewport);
  const notOk = records.filter((r) => !r.error && r.status !== 200);
  process.stdout.write(
    `${records.length - failed.length}/${records.length} captured into ${values.out}` +
      ` (${wide.length} wider than the viewport, ${failed.length} failed, ${leaks.length} with an unblocked tag request)\n` +
      (notOk.length ? `  not HTTP 200: ${notOk.map((r) => `${r.route} (${r.status})`).join(", ")}\n` : "") +
      `  index: ${path.join(values.out, "capture.md")}\n`
  );
  return failed.length || leaks.length ? 1 : 0;
}

run(main);
