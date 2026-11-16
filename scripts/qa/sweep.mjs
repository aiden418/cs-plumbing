#!/usr/bin/env node
/**
 * Loads every built page at a phone and a desktop width and checks that it is
 * intact:
 *
 *   - the document answers HTTP 200
 *   - no console error, no uncaught exception
 *   - no first-party request fails or returns 4xx/5xx
 *   - the page is not wider than the viewport (no sideways scroll)
 *   - no broken image (every <img> is forced to load, then naturalWidth > 0)
 *   - exactly one visible <h1>
 *   - no analytics or ad tag request gets past the block
 *
 *   node scripts/qa/sweep.mjs --base http://localhost:3111 --out sweep
 *
 * writes sweep.md and sweep.json and exits 1 when any page fails.
 */

import { launchChrome, resolveViewports, sleep } from "./lib/chrome.mjs";
import {
  cell,
  cli,
  hostFacts,
  intArg,
  listArg,
  mapPool,
  normalizeBase,
  pairsArg,
  progress,
  run,
  truncate,
  UsageError,
  writeFile,
  writeJson,
} from "./lib/util.mjs";
import { loadRoutes } from "./routes.mjs";

const USAGE = `
Usage: node scripts/qa/sweep.mjs --base http://localhost:PORT --out PREFIX [options]

  --base URL          origin of the running production build
  --out PREFIX        writes PREFIX.md and PREFIX.json (a trailing .md or .json is ignored)
  --next-dir DIR      build output to read the page list from (default .next)
  --routes LIST       only these paths instead of every built page
  --widths LIST       viewport widths, default 375,1440 (below 768: phone emulation @2x)
  --expect-tags MODE  any (default): tag requests may be attempted, they are blocked and counted
                      none: a tags-off build; any attempted tag request fails the page
  --storage LIST      localStorage entries to set before load, key=value ("now" = current time in ms)
  --concurrency N     pages in parallel, default 4
  --timeout MS        page load timeout, default 45000
`;

/** Runs in the page after the scroll pass. */
function inspectPage() {
  const describe = (el) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).slice(0, 3).join(".")}` : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };
  const isVisible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    return el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true });
  };
  const h1 = [...document.querySelectorAll("h1")].map((el) => ({
    text: (el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160),
    visible: isVisible(el),
  }));
  const images = [...document.images].map((img) => ({
    src: img.currentSrc || img.getAttribute("src") || "",
    alt: img.getAttribute("alt"),
    complete: img.complete,
    naturalWidth: img.naturalWidth,
    where: describe(img.parentElement ?? img),
  }));

  const viewportWidth = document.documentElement.clientWidth;
  const offenders = [];
  const unclipped = (el) => {
    for (let node = el.parentElement; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
      if (getComputedStyle(node).overflowX !== "visible") return false;
    }
    return true;
  };
  const flagged = new Set();
  for (const el of document.body.querySelectorAll("*")) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (rect.right <= viewportWidth + 1 && rect.left >= -1) continue;
    if (el.parentElement && flagged.has(el.parentElement)) {
      flagged.add(el); // inside something already reported
      continue;
    }
    if (getComputedStyle(el).position === "fixed" && !isVisible(el)) continue;
    if (!unclipped(el)) continue;
    flagged.add(el);
    if (offenders.length < 6) offenders.push({ element: describe(el), left: Math.round(rect.left), right: Math.round(rect.right) });
  }
  return { h1, images, offenders, viewportWidth };
}

async function sweepOne(browser, job, options) {
  const started = Date.now();
  const { route, viewport } = job;
  const result = { route, width: viewport.width, viewport: `${viewport.width}x${viewport.height}@${viewport.deviceScaleFactor}x`, failures: [], warnings: [] };
  const fail = (check, detail) => result.failures.push({ check, detail });
  const page = await browser.newPage({
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.mobile,
    touch: viewport.touch,
  });
  try {
    await page.seedLocalStorage(options.storage);
    const nav = await page.goto(job.url, { waitUntil: "networkidle", timeout: options.timeout });
    result.status = nav.status;
    if (nav.status !== 200) fail("status", `HTTP ${nav.status}`);
    await page.evaluate(() => document.fonts.ready.then(() => true));
    const scroll = await page.steppedScroll({ delay: 80, settle: 300 });
    // Lazy images that never came on screen (hidden variants, carousel slides) are loaded now so they can be judged.
    const forced = await page.evaluate(() => {
      let count = 0;
      for (const img of document.images) {
        if (!img.complete && img.loading === "lazy") {
          img.loading = "eager";
          count += 1;
        }
      }
      return count;
    });
    if (forced) await page.waitForNetworkIdle({ idleMs: 400, timeout: 15000 });

    // Entrance animations can leave the headline transparent for a moment.
    let dom = await page.evaluate(inspectPage);
    for (let i = 0; i < 6 && dom.h1.filter((h) => h.visible).length !== 1; i++) {
      await sleep(500);
      dom = await page.evaluate(inspectPage);
    }
    const metrics = await page.layoutMetrics();
    result.scrollHeight = metrics.scrollHeight;
    result.scrollWidth = metrics.scrollWidth;
    result.networkIdle = Boolean(nav.idle) && scroll.idle;
    if (!result.networkIdle) result.warnings.push({ check: "network", detail: `never went quiet; still loading: ${page.inflightUrls().slice(0, 3).join(", ") || "(unknown)"}` });

    if (metrics.overflowsViewport) {
      fail("overflow", `scrollWidth ${metrics.scrollWidth} > viewport ${metrics.viewportWidth}: ${dom.offenders.map((o) => `${o.element} [${o.left}..${o.right}]`).join("; ") || "(no element found)"}`);
    } else if (metrics.clippedOverflow) {
      result.warnings.push({
        check: "clipped overflow",
        detail: `content reaches ${metrics.unclippedScrollWidth} px but html/body clip it: ${dom.offenders.map((o) => `${o.element} [${o.left}..${o.right}]`).join("; ") || "(no element found)"}`,
      });
    }

    const visibleH1 = dom.h1.filter((h) => h.visible);
    result.h1 = dom.h1;
    if (visibleH1.length !== 1) {
      fail("h1", `${visibleH1.length} visible <h1> (${dom.h1.length} in the DOM): ${dom.h1.map((h) => `"${h.text}"${h.visible ? "" : " [hidden]"}`).join(", ") || "none"}`);
    }

    const requestFor = (src) => {
      for (let i = page.requests.length - 1; i >= 0; i--) if (page.requests[i].url === src) return page.requests[i];
      return null;
    };
    const broken = [];
    let pending = 0;
    for (const img of dom.images) {
      if (!img.src || img.src.startsWith("data:")) continue;
      const request = requestFor(img.src);
      if (request?.tagHost) continue; // a tracking pixel the harness blocked
      if (!img.complete) {
        pending += 1;
        continue;
      }
      if (img.naturalWidth > 0) continue;
      // An SVG without intrinsic size reports 0 although it loaded fine.
      if (request && request.status === 200 && /svg/i.test(request.mimeType ?? "")) continue;
      broken.push({ src: img.src, alt: img.alt, where: img.where, status: request?.status ?? null, error: request?.errorText ?? null });
    }
    result.images = { total: dom.images.length, forcedToLoad: forced, stillLoading: pending, broken };
    for (const img of broken) fail("image", `${img.src} (${img.status ?? img.error ?? "no response"}) in ${img.where}`);
    if (pending) result.warnings.push({ check: "image", detail: `${pending} image(s) still loading when the page was judged` });

    const consoleErrors = page.consoleErrors();
    result.consoleErrors = consoleErrors.map((e) => ({ source: e.source, text: truncate(e.text, 400), url: e.url }));
    for (const error of result.consoleErrors) fail("console", `${error.source}: ${error.text}${error.url ? ` (${error.url})` : ""}`);

    const failedRequests = page.failedFirstPartyRequests();
    result.failedRequests = failedRequests;
    for (const request of failedRequests) fail("request", `${request.status ?? request.errorText} ${request.type} ${request.url}`);

    const attempts = page.tagAttempts();
    const leaks = page.tagLeaks();
    result.tags = {
      attempts: attempts.length,
      blocked: attempts.filter((a) => a.blocked).length,
      hosts: [...new Set(attempts.map((a) => a.host))].sort(),
      leaks: leaks.map((a) => a.url),
    };
    for (const leak of leaks) fail("tag leak", leak.url);
    if (options.expectTags === "none") for (const attempt of attempts) fail("tag request", `${attempt.url} (tags are expected to be off)`);

    const env = await page.env();
    result.env = { webdriver: env.webdriver, userAgent: env.userAgent, effectiveType: env.effectiveType };
  } catch (err) {
    fail("error", err.message);
  } finally {
    await page.close();
  }
  result.ok = result.failures.length === 0;
  result.ms = Date.now() - started;
  return result;
}

function markdown(report) {
  const lines = [];
  const add = (line = "") => lines.push(line);
  const { results, summary } = report;
  add("# Page sweep");
  add();
  add(`- Base: ${report.base} — ${report.generatedAt}`);
  add(`- Browser: ${report.browser?.product}; navigator.webdriver ${results[0]?.env?.webdriver}; connection ${results[0]?.env?.effectiveType}`);
  add(`- User agent: \`${results[0]?.env?.userAgent ?? report.browser?.userAgent}\``);
  add(`- Widths: ${report.widths.join(", ")} px; tag requests ${report.expectTags === "none" ? "must not be attempted" : "are blocked and counted"}`);
  add();
  add(`## Result: ${summary.failedPages === 0 ? "PASS" : "FAIL"} — ${summary.pages - summary.failedPages}/${summary.pages} page loads clean (${summary.routes} routes x ${report.widths.length} widths)`);
  add();
  add("| Check | Failing page loads |");
  add("|---|---:|");
  for (const [label, key] of [
    ["HTTP 200", "status"],
    ["No console errors", "console"],
    ["No failed first-party requests", "request"],
    ["No horizontal overflow", "overflow"],
    ["No broken images", "image"],
    ["Exactly one visible H1", "h1"],
    ["No tag request past the block", "tag leak"],
    ...(report.expectTags === "none" ? [["No tag request attempted", "tag request"]] : []),
    ["Page could be loaded and inspected", "error"],
  ]) {
    add(`| ${label} | ${summary.byCheck[key] ?? 0} |`);
  }
  add();
  add(`Tag requests attempted: ${summary.tagAttempts} (${summary.tagBlocked} blocked by the harness, ${summary.tagLeaks} got through) to ${summary.tagHosts.join(", ") || "no host"}.`);
  add(`Warnings: ${summary.warnings}. Images checked: ${summary.images} (${summary.imagesForced} lazy images had to be forced to load).`);
  add();

  const failed = results.filter((r) => !r.ok);
  add("## Failures");
  add();
  if (!failed.length) add("None.");
  for (const r of failed) {
    add(`- \`${r.route}\` at ${r.width} px`);
    for (const f of r.failures.slice(0, 12)) add(`  - **${f.check}**: ${cell(truncate(f.detail, 600))}`);
    if (r.failures.length > 12) add(`  - … ${r.failures.length - 12} more`);
  }
  add();

  const warned = results.filter((r) => r.warnings.length);
  add("## Warnings");
  add();
  if (!warned.length) add("None.");
  const grouped = new Map();
  for (const r of warned) {
    for (const w of r.warnings) {
      const key = `${w.check}: ${w.detail}`;
      grouped.set(key, [...(grouped.get(key) ?? []), `${r.route} @${r.width}`]);
    }
  }
  for (const [text, where] of [...grouped].sort((a, b) => b[1].length - a[1].length)) {
    add(`- ${cell(truncate(text, 500))} — ${where.length === 1 ? `\`${where[0]}\`` : `${where.length} page loads: ${where.slice(0, 4).map((w) => `\`${w}\``).join(", ")}${where.length > 4 ? ", …" : ""}`}`);
  }
  add();

  add("## Every route");
  add();
  add(`| Route | ${report.widths.map((w) => `${w} px | height at ${w}`).join(" | ")} |`);
  add(`|---|${report.widths.map(() => "---|---:").join("|")}|`);
  const byRoute = new Map();
  for (const r of results) byRoute.set(r.route, [...(byRoute.get(r.route) ?? []), r]);
  for (const [route, list] of byRoute) {
    const cells = report.widths.map((w) => {
      const r = list.find((x) => x.width === w);
      if (!r) return "– | –";
      const state = r.ok ? "ok" : `FAIL: ${[...new Set(r.failures.map((f) => f.check))].join(", ")}`;
      return `${state} | ${r.scrollHeight ?? "–"}`;
    });
    add(`| \`${cell(route)}\` | ${cells.join(" | ")} |`);
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const { values } = cli(USAGE, {
    base: { type: "string" },
    out: { type: "string" },
    "next-dir": { type: "string", default: ".next" },
    routes: { type: "string", multiple: true },
    widths: { type: "string", multiple: true },
    "expect-tags": { type: "string", default: "any" },
    storage: { type: "string", multiple: true },
    concurrency: { type: "string" },
    timeout: { type: "string" },
  });
  if (!values.out) throw new UsageError("--out is required");
  if (!["any", "none"].includes(values["expect-tags"])) throw new UsageError("--expect-tags must be any or none");
  const base = normalizeBase(values.base);
  const prefix = values.out.replace(/\.(md|json)$/i, "");
  const widths = (listArg(values.widths).length ? listArg(values.widths) : ["375", "1440"]).map((w) => intArg(w, "widths"));
  const viewports = resolveViewports(widths.map(String));
  const only = listArg(values.routes);
  const routes = only.length ? only : loadRoutes(values["next-dir"]).pages.map((p) => p.path);
  const bad = routes.filter((r) => !r.startsWith("/"));
  if (bad.length) throw new UsageError(`Routes must start with "/": ${bad.join(", ")}`);
  const options = {
    timeout: intArg(values.timeout, "timeout", 45000),
    expectTags: values["expect-tags"],
    storage: pairsArg(values.storage, "storage"),
  };

  const jobs = routes.flatMap((route) => viewports.map((viewport) => ({ route, viewport, url: base + route })));
  progress(`Sweeping ${routes.length} route(s) at ${widths.join(" and ")} px: ${jobs.length} page loads`);
  const browser = await launchChrome();
  const browserInfo = browser.info();
  let results;
  try {
    let done = 0;
    results = await mapPool(jobs, intArg(values.concurrency, "concurrency", 4), async (job) => {
      const result = await sweepOne(browser, job, options);
      done += 1;
      if (!result.ok) progress(`  [${done}/${jobs.length}] FAIL ${job.route} @${job.viewport.width}: ${result.failures.map((f) => f.check).join(", ")}`);
      else if (done % 20 === 0 || done === jobs.length) progress(`  [${done}/${jobs.length}] …`);
      return result;
    });
  } finally {
    await browser.close();
  }

  const byCheck = {};
  for (const r of results) for (const check of new Set(r.failures.map((f) => f.check))) byCheck[check] = (byCheck[check] ?? 0) + 1;
  const summary = {
    routes: routes.length,
    pages: results.length,
    failedPages: results.filter((r) => !r.ok).length,
    byCheck,
    warnings: results.reduce((n, r) => n + r.warnings.length, 0),
    images: results.reduce((n, r) => n + (r.images?.total ?? 0), 0),
    imagesForced: results.reduce((n, r) => n + (r.images?.forcedToLoad ?? 0), 0),
    tagAttempts: results.reduce((n, r) => n + (r.tags?.attempts ?? 0), 0),
    tagBlocked: results.reduce((n, r) => n + (r.tags?.blocked ?? 0), 0),
    tagLeaks: results.reduce((n, r) => n + (r.tags?.leaks.length ?? 0), 0),
    tagHosts: [...new Set(results.flatMap((r) => r.tags?.hosts ?? []))].sort(),
  };
  const report = {
    kind: "cs-qa-sweep",
    version: 1,
    generatedAt: new Date().toISOString(),
    base,
    widths,
    expectTags: options.expectTags,
    host: hostFacts(),
    browser: browserInfo,
    summary,
    results,
  };
  writeJson(`${prefix}.json`, report);
  writeFile(`${prefix}.md`, markdown(report));
  process.stdout.write(
    `${summary.failedPages === 0 ? "PASS" : "FAIL"}: ${summary.pages - summary.failedPages}/${summary.pages} page loads clean` +
      `${summary.failedPages ? ` — failing checks: ${Object.entries(byCheck).map(([k, n]) => `${k} ${n}`).join(", ")}` : ""}\n` +
      `  tag requests attempted ${summary.tagAttempts}, blocked ${summary.tagBlocked}, leaked ${summary.tagLeaks}; warnings ${summary.warnings}\n` +
      `  report: ${prefix}.md\n`
  );
  return summary.failedPages === 0 ? 0 : 1;
}

run(main);
