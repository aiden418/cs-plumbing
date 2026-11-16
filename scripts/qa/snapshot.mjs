#!/usr/bin/env node
/**
 * Content snapshot of every built route, for a before/after "nothing lost"
 * comparison (scripts/qa/diff-snapshots.mjs).
 *
 * For each page in the build manifests it GETs the raw server HTML and parses
 * it in a blank Chrome page with DOMParser, so none of the page's scripts run
 * and nothing is requested from anywhere. Recorded per route: status, title,
 * description, canonical, robots, og:/twitter: tags, H1s, the H2/H3 outline,
 * JSON-LD (parsed, keys sorted), element ids, links (header / main / footer),
 * tel:/sms:/mailto: links, images (underlying source + alt) and the text
 * blocks inside <main>. Also: the bytes of robots.txt, sitemap.xml, llms.txt,
 * llms-full.txt, the web manifest and icons; every redirect's observed status
 * and Location; the 404 page; and whether each og:image URL answers.
 *
 *   node scripts/qa/snapshot.mjs --base http://localhost:3111 --out snapshot.json
 *
 * Run it from the project root after `next build`, against `next start` of
 * that same build.
 */

import { execFileSync } from "node:child_process";
import { launchChrome, tagHostFor } from "./lib/chrome.mjs";
import { extractContent } from "./lib/extract.mjs";
import { cli, hostFacts, intArg, listArg, mapPool, normalizeBase, progress, sha256, writeJson } from "./lib/util.mjs";
import { loadRoutes } from "./routes.mjs";

const USAGE = `
Usage: node scripts/qa/snapshot.mjs --base http://localhost:PORT --out FILE.json [options]

  --base URL          origin of the running production build (next start)
  --out FILE          where to write the snapshot JSON
  --next-dir DIR      build output to read the route list from (default .next)
  --site ORIGIN       production origin whose absolute URLs count as internal
                      (default https://www.csplumbinglee.com; repeatable)
  --routes LIST       only these page paths (comma separated) instead of every built page
  --rendered MODE     auto (default): also read the rendered DOM of routes whose server HTML
                      leaves a section to the browser; all: every route; none: never
  --no-og-images      do not request each route's og:image / twitter:image
  --concurrency N     parallel requests (default 6)
`;

const USER_AGENT = "Mozilla/5.0 (compatible; cs-qa-snapshot)";
const NOT_FOUND_PROBE = "/qa-snapshot-missing-page";
const TEXT_TYPES = /^(text\/|application\/(json|xml|manifest\+json|ld\+json|rss\+xml|atom\+xml))/i;

async function get(url, accept = "text/html,application/xhtml+xml") {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { redirect: "manual", headers: { accept, "user-agent": USER_AGENT } });
      const buffer = Buffer.from(await res.arrayBuffer());
      return {
        status: res.status,
        location: res.headers.get("location"),
        contentType: res.headers.get("content-type"),
        buffer,
      };
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw new Error(`GET ${url} failed: ${lastError?.cause?.message ?? lastError?.message}`);
}

/** Same value, object keys sorted at every depth, so two renderings compare equal. */
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonical(value[key])])
    );
  }
  return value;
}

function parseJsonLd(blocks) {
  return blocks.map((raw) => {
    try {
      return { data: canonical(JSON.parse(raw)) };
    } catch (err) {
      return { parseError: err.message, raw };
    }
  });
}

function gitFacts() {
  const run = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  try {
    return { commit: run("rev-parse", "HEAD"), branch: run("rev-parse", "--abbrev-ref", "HEAD"), dirty: run("status", "--porcelain").length > 0 };
  } catch {
    return null;
  }
}

/** Finish a record extracted in the browser: parse JSON-LD, split off tag beacons. */
function finish(extracted) {
  const beacons = extracted.images.filter((img) => tagHostFor(img.src));
  return {
    ...extracted,
    images: extracted.images.filter((img) => !tagHostFor(img.src)),
    beacons: beacons.map((img) => img.src),
    jsonLd: parseJsonLd(extracted.jsonLd),
  };
}

/** A redirect source with no parameters can be requested as is; the framework's trailing-slash rule needs a sample. */
function redirectProbe(redirect, pages) {
  if (!/[:*(]/.test(redirect.source)) return { requested: redirect.source, expected: redirect.destination };
  if (redirect.source === "/:path+/" && redirect.destination === "/:path+") {
    const sample = pages.find((p) => p.path !== "/" && !p.path.slice(1).includes("/")) ?? pages.find((p) => p.path !== "/");
    if (sample) return { requested: `${sample.path}/`, expected: sample.path };
  }
  return null;
}

function toPath(location, base) {
  if (!location) return null;
  try {
    const url = new URL(location, base);
    return url.origin === base ? url.pathname + url.search + url.hash : url.href;
  } catch {
    return location;
  }
}

async function main() {
  const { values } = cli(USAGE, {
    base: { type: "string" },
    out: { type: "string" },
    "next-dir": { type: "string", default: ".next" },
    site: { type: "string", multiple: true },
    routes: { type: "string", multiple: true },
    rendered: { type: "string", default: "auto" },
    "no-og-images": { type: "boolean" },
    concurrency: { type: "string" },
  });
  if (!values.out) throw new Error("--out is required");
  if (!["auto", "all", "none"].includes(values.rendered)) throw new Error("--rendered must be auto, all or none");
  const base = normalizeBase(values.base);
  const concurrency = intArg(values.concurrency, "concurrency", 6);
  const siteOrigins = [...new Set([...(listArg(values.site).length ? listArg(values.site) : ["https://www.csplumbinglee.com"]), base])];

  const built = loadRoutes(values["next-dir"]);
  const only = listArg(values.routes);
  const pages = only.length ? built.pages.filter((p) => only.includes(p.path)) : built.pages;
  const unknown = only.filter((r) => !built.pages.some((p) => p.path === r));
  if (unknown.length) throw new Error(`Not a built page: ${unknown.join(", ")}`);
  const warnings = [];
  const warn = (message) => {
    warnings.push(message);
    progress(`  ! ${message}`);
  };

  progress(`Fetching ${pages.length} pages from ${base} …`);
  const raw = await mapPool([...pages.map((p) => p.path), NOT_FOUND_PROBE], concurrency, (path) => get(base + path));

  progress("Parsing the server HTML (no scripts run) …");
  const browser = await launchChrome();
  const browserInfo = browser.info();
  const routes = {};
  let notFound = null;
  const renderedRoutes = [];
  try {
    const parser = await browser.newPage({ width: 800, height: 600 });
    const parse = async (response) => {
      const html = response.buffer.toString("utf8");
      const record = {
        status: response.status,
        location: response.location,
        contentType: response.contentType,
        htmlBytes: response.buffer.length,
        // <!--$!--> opens a Suspense boundary the server gave up on: its content only exists after hydration.
        clientOnlyBoundaries: (html.match(/<!--\$!-->/g) ?? []).length,
      };
      if (!/html/i.test(response.contentType ?? "")) return record;
      return { ...record, ...finish(await parser.evaluate(extractContent, [html, siteOrigins])) };
    };

    for (let i = 0; i < pages.length; i++) {
      const path = pages[i].path;
      const record = { kind: pages[i].kind, srcRoute: pages[i].srcRoute, ...(await parse(raw[i])) };
      routes[path] = record;
      if (record.status !== 200) warn(`${path}: HTTP ${record.status}`);
      else {
        if (!record.hasMain) warn(`${path}: no <main>`);
        if (record.h1.length !== 1) warn(`${path}: ${record.h1.length} <h1> elements in the server HTML`);
        if (!record.title) warn(`${path}: no <title>`);
        if (!record.description) warn(`${path}: no meta description`);
        if (!record.canonical) warn(`${path}: no canonical`);
        for (const block of record.jsonLd) if (block.parseError) warn(`${path}: JSON-LD does not parse (${block.parseError})`);
        if (values.rendered === "all" || (values.rendered === "auto" && record.clientOnlyBoundaries > 0)) renderedRoutes.push(path);
      }
    }
    notFound = { requested: NOT_FOUND_PROBE, ...(await parse(raw[pages.length])) };
    if (notFound.status !== 404) warn(`${NOT_FOUND_PROBE}: expected 404, got ${notFound.status}`);
    await parser.close();

    if (renderedRoutes.length) {
      progress(`Reading the rendered DOM of ${renderedRoutes.length} route(s) with client-only sections …`);
      for (const path of renderedRoutes) {
        const page = await browser.newPage({ width: 1440, height: 900 });
        try {
          const nav = await page.goto(base + path, { waitUntil: "networkidle", timeout: 45000 });
          await page.evaluate(() => document.fonts.ready.then(() => new Promise((resolve) => setTimeout(resolve, 1000))));
          const live = finish(await page.evaluate(extractContent, [null, siteOrigins]));
          routes[path].rendered = {
            status: nav.status,
            viewport: "1440x900",
            h1: live.h1,
            outline: live.outline,
            ids: live.ids,
            links: live.links,
            externalLinks: live.externalLinks,
            contactLinks: live.contactLinks,
            images: live.images,
            media: live.media,
            text: live.text,
            mainText: live.mainText,
            tagAttempts: page.tagAttempts().length,
            tagLeaks: page.tagLeaks().length,
          };
          if (page.tagLeaks().length) warn(`${path}: a tag request was not blocked`);
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  progress(`Fetching ${built.files.length} file routes …`);
  const files = {};
  const fileResponses = await mapPool(built.files, concurrency, (f) => get(base + f.path, "*/*"));
  built.files.forEach((f, i) => {
    const res = fileResponses[i];
    files[f.path] = {
      status: res.status,
      contentType: res.contentType,
      bytes: res.buffer.length,
      sha256: sha256(res.buffer),
      ...(TEXT_TYPES.test(res.contentType ?? "") ? { text: res.buffer.toString("utf8") } : {}),
    };
    if (res.status !== 200) warn(`${f.path}: HTTP ${res.status}`);
  });

  progress(`Checking ${built.redirects.length} redirects …`);
  const redirects = [];
  for (const redirect of built.redirects) {
    const probe = redirectProbe(redirect, built.pages);
    if (!probe) {
      redirects.push({ ...redirect, requested: null, note: "pattern source: not requested" });
      warn(`redirect ${redirect.source}: pattern source, not requested`);
      continue;
    }
    const res = await get(base + probe.requested);
    const location = toPath(res.location, base);
    const target = location && location.startsWith("/") ? await get(base + location) : null;
    const ok = res.status === redirect.statusCode && location === probe.expected;
    redirects.push({
      source: redirect.source,
      destination: redirect.destination,
      statusCode: redirect.statusCode,
      internal: redirect.internal,
      requested: probe.requested,
      expectedLocation: probe.expected,
      status: res.status,
      location,
      targetStatus: target ? target.status : null,
      ok,
    });
    if (!ok) warn(`redirect ${probe.requested}: expected ${redirect.statusCode} -> ${probe.expected}, got ${res.status} -> ${location}`);
  }

  let socialImages = null;
  if (!values["no-og-images"]) {
    const wanted = new Map(); // local path -> absolute URL as written in the page
    for (const record of Object.values(routes)) {
      for (const tag of [...(record.og ?? []), ...(record.twitter ?? [])]) {
        if (tag.key !== "og:image" && tag.key !== "twitter:image") continue;
        try {
          const url = new URL(tag.content);
          if (siteOrigins.includes(url.origin)) wanted.set(url.pathname + url.search, tag.content);
        } catch {
          // not a URL; the diff still compares the tag's text
        }
      }
    }
    progress(`Requesting ${wanted.size} distinct og:image / twitter:image URLs …`);
    const paths = [...wanted.keys()].sort();
    const responses = await mapPool(paths, Math.min(concurrency, 4), (path) => get(base + path, "image/*,*/*"));
    socialImages = {};
    paths.forEach((path, i) => {
      const res = responses[i];
      socialImages[path] = { status: res.status, contentType: res.contentType, bytes: res.buffer.length, sha256: sha256(res.buffer) };
      if (res.status !== 200 || !/^image\//.test(res.contentType ?? "")) warn(`social image ${path}: HTTP ${res.status} ${res.contentType}`);
    });
  }

  const records = Object.values(routes);
  const sum = (fn) => records.reduce((total, record) => total + (fn(record) ?? 0), 0);
  const snapshot = {
    kind: "cs-qa-snapshot",
    version: 1,
    generatedAt: new Date().toISOString(),
    base,
    siteOrigins,
    build: { buildId: built.buildId, nextDir: built.nextDir, git: gitFacts() },
    host: hostFacts(),
    browser: browserInfo,
    counts: {
      routes: records.length,
      status200: records.filter((r) => r.status === 200).length,
      files: Object.keys(files).length,
      redirects: redirects.length,
      redirectsOk: redirects.filter((r) => r.ok).length,
      socialImages: socialImages ? Object.keys(socialImages).length : null,
      renderedRoutes: renderedRoutes.length,
      h1: sum((r) => r.h1?.length),
      jsonLdBlocks: sum((r) => r.jsonLd?.length),
      ids: sum((r) => r.ids?.length),
      internalLinks: sum((r) => (r.links ? Object.values(r.links).reduce((n, list) => n + list.length, 0) : 0)),
      externalLinks: sum((r) => r.externalLinks?.length),
      contactLinks: sum((r) => r.contactLinks?.length),
      images: sum((r) => r.images?.length),
      textBlocks: sum((r) => r.text?.length),
      warnings: warnings.length,
    },
    warnings,
    routes,
    notFound,
    files,
    redirects,
    socialImages,
  };
  writeJson(values.out, snapshot);
  const c = snapshot.counts;
  process.stdout.write(
    `Snapshot written to ${values.out}\n` +
      `  ${c.routes} routes (${c.status200} with HTTP 200), ${c.files} files, ${c.redirectsOk}/${c.redirects} redirects as declared\n` +
      `  ${c.h1} H1, ${c.jsonLdBlocks} JSON-LD blocks, ${c.internalLinks} internal links, ${c.images} images, ${c.textBlocks} text blocks, ${c.ids} ids\n` +
      `  ${c.renderedRoutes} route(s) also read from the rendered DOM, ${c.warnings} warning(s)\n`
  );
}

main().catch((err) => {
  process.stderr.write(`${err.stack ?? err}\n`);
  process.exit(1);
});
