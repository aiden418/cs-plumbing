#!/usr/bin/env node
/**
 * Which pictures does each built page show, by content?
 *
 * Reads the prerendered HTML of a production build (.next/server/app/**\/*.html)
 * and resolves every image URL back to the file behind it and that file's
 * SHA-256, whatever form the URL takes:
 *
 *   /_next/image?url=<encoded>&w=..&q=..    -> the inner URL
 *   /_next/static/media/<name>.<hash>.<ext>  -> .next/static/media/...
 *   /images/...                              -> public/images/...
 *
 * Two builds can then be compared picture by picture, so switching a page
 * from "/images/..." URLs to hashed static imports can be proven to lose
 * nothing:
 *
 *   npm run build
 *   node scripts/qa/dump-page-images.mjs --out before.json
 *   ... change things, build again ...
 *   node scripts/qa/dump-page-images.mjs --out after.json
 *   node scripts/qa/dump-page-images.mjs --compare before.json after.json
 *
 * Per route the dump lists:
 *   rendered    pictures in real markup: <img>, <source>, image preloads,
 *               video posters, inline background images, linked stylesheets
 *   referenced  pictures that only appear in the page's data (the payload a
 *               lightbox or carousel reads) or in meta tags and JSON-LD
 *   missing     URLs that resolve to no file: a broken image
 *   external    absolute URLs on other hosts (listed, not hashed)
 *
 * --compare exits 1 when a route lost a picture (or disappeared) and prints
 * what was added and removed per route. Options: --dir <.next folder>,
 * --root <project root>, --out <file> (default: stdout), --json with --compare.
 */

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const IMAGE_EXT = "jpe?g|png|webp|avif|gif|svg|ico";
const IMAGE_FILE = new RegExp(`\\.(?:${IMAGE_EXT})$`, "i");

const posix = (p) => p.split(path.sep).join("/");

async function walk(dir, keep, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, keep, out);
    else if (keep(entry.name)) out.push(full);
  }
  return out;
}

const hashCache = new Map();
async function sha256(file) {
  if (!hashCache.has(file)) {
    hashCache.set(file, createHash("sha256").update(await readFile(file)).digest("hex"));
  }
  return hashCache.get(file);
}

const ENTITIES = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
export function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, body) => {
    if (body[0] === "#") {
      const code = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[body.toLowerCase()] ?? whole;
  });
}

/**
 * The start tags of an HTML document with their attributes (names lower-cased,
 * values entity-decoded). A small scanner rather than a regex so a ">" inside
 * a quoted attribute cannot end the tag early.
 */
export function* startTags(html, wanted) {
  const open = /<([a-zA-Z][a-zA-Z0-9-]*)/g;
  let m;
  while ((m = open.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    let i = open.lastIndex;
    const attrs = {};
    for (;;) {
      while (i < html.length && /\s/.test(html[i])) i += 1;
      if (i >= html.length || html[i] === ">") break;
      if (html[i] === "/") {
        i += 1;
        continue;
      }
      let j = i;
      while (j < html.length && !/[\s=>/]/.test(html[j])) j += 1;
      const name = html.slice(i, j).toLowerCase();
      i = j;
      while (i < html.length && /\s/.test(html[i])) i += 1;
      let value = "";
      if (html[i] === "=") {
        i += 1;
        while (i < html.length && /\s/.test(html[i])) i += 1;
        const quote = html[i];
        if (quote === '"' || quote === "'") {
          const end = html.indexOf(quote, i + 1);
          value = html.slice(i + 1, end < 0 ? html.length : end);
          i = end < 0 ? html.length : end + 1;
        } else {
          j = i;
          while (j < html.length && !/[\s>]/.test(html[j])) j += 1;
          value = html.slice(i, j);
          i = j;
        }
      }
      if (name) attrs[name] = decodeEntities(value);
      else i += 1;
    }
    open.lastIndex = i;
    if (tag === "script" || tag === "style") {
      // Their contents are code, not markup: a "<img" inside a string is not a tag.
      const close = new RegExp(`</${tag}\\s*>`, "gi");
      close.lastIndex = i;
      open.lastIndex = close.exec(html) ? close.lastIndex : html.length;
    }
    if (!wanted || wanted.has(tag)) yield { tag, attrs };
  }
}

/** The URLs of a srcset / imagesrcset attribute. */
export function srcsetUrls(value) {
  return String(value ?? "")
    .split(/,\s+/)
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

const cssUrls = (css) => [...String(css ?? "").matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)].map((m) => m[2]);

/** Every image URL in one page, with how the page uses it. */
export function extractImageUrls(html) {
  const found = [];
  const add = (url, via) => {
    if (url && !url.startsWith("data:") && !url.startsWith("blob:")) found.push({ url, via });
  };
  const stylesheets = [];
  for (const { tag, attrs } of startTags(html)) {
    if (tag === "img") {
      add(attrs.src, "img");
      for (const u of srcsetUrls(attrs.srcset)) add(u, "img");
    } else if (tag === "source") {
      for (const u of srcsetUrls(attrs.srcset)) add(u, "source");
      if (attrs.src && IMAGE_FILE.test(attrs.src.split(/[?#]/)[0])) add(attrs.src, "source");
    } else if (tag === "video") {
      add(attrs.poster, "poster");
    } else if (tag === "input" && (attrs.type ?? "").toLowerCase() === "image") {
      add(attrs.src, "img");
    } else if (tag === "link") {
      const rel = (attrs.rel ?? "").toLowerCase();
      if (rel.includes("preload") && (attrs.as ?? "").toLowerCase() === "image") {
        add(attrs.href, "preload");
        for (const u of srcsetUrls(attrs.imagesrcset)) add(u, "preload");
      } else if (rel.includes("stylesheet") && attrs.href) {
        stylesheets.push(attrs.href);
      }
    } else if (tag === "meta") {
      const key = (attrs.property ?? attrs.name ?? "").toLowerCase();
      if (/^(?:og:image(?::(?:url|secure_url))?|twitter:image(?::src)?)$/.test(key)) add(attrs.content, "meta");
    }
    if (attrs.style) for (const u of cssUrls(attrs.style)) add(u, "style");
  }

  // Everything else the document mentions: the data payload that client
  // components read, and JSON-LD. Quotes inside those are backslash-escaped
  // and "&" may be written as &, so a URL ends at either.
  const text = html.replace(/\\u0026/g, "&");
  for (const m of text.matchAll(/\/_next\/image\?url=([^&"'\\\s<>]+)[^"'\\\s<>]*/g)) add(m[0], "data");
  for (const m of text.matchAll(new RegExp(`\\/_next\\/static\\/media\\/[^"'\\\\\\s<>?#)]+\\.(?:${IMAGE_EXT})`, "gi"))) add(m[0], "data");
  for (const m of text.matchAll(new RegExp(`(?:https?:\\/\\/[a-z0-9.-]+)?\\/images\\/[^"'\\\\<>?#)\\n]+?\\.(?:${IMAGE_EXT})(?![a-z0-9])`, "gi"))) add(m[0], "data");
  return { found, stylesheets };
}

const RENDERED_VIA = new Set(["img", "source", "preload", "poster", "style", "css"]);

function safeDecode(text) {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}

/**
 * Follow one URL to the file behind it.
 * -> { file, abs } | { external } | { missing } | null (not an image we track)
 */
export function resolveUrl(url, ctx, depth = 0) {
  if (depth > 3) return { missing: url };
  let pathname = url;
  let search = "";
  if (/^https?:\/\//i.test(url)) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return { missing: url };
    }
    if (!ctx.siteHosts.test(parsed.hostname)) return { external: url };
    pathname = parsed.pathname;
    search = parsed.search;
  } else if (url.startsWith("//")) {
    return { external: url };
  } else {
    const q = url.indexOf("?");
    if (q >= 0) {
      pathname = url.slice(0, q);
      search = url.slice(q);
    }
    pathname = pathname.split("#")[0];
  }
  if (!pathname.startsWith("/")) return null;

  if (pathname === "/_next/image") {
    const inner = new URLSearchParams(search).get("url");
    return inner ? resolveUrl(inner, ctx, depth + 1) : { missing: url };
  }
  const decoded = safeDecode(pathname);
  if (decoded.startsWith("/_next/static/")) {
    const abs = path.join(ctx.dist, "static", decoded.slice("/_next/static/".length));
    return existsSync(abs) ? { abs } : { missing: url };
  }
  if (decoded.startsWith("/_next/")) return null;
  const abs = path.join(ctx.root, "public", decoded);
  if (existsSync(abs)) return { abs };
  // A generated route (icon, Open Graph image) is not a file on disk.
  return IMAGE_FILE.test(decoded) ? { missing: url } : null;
}

/**
 * @typedef {{ sha256: string, file: string, via: string[], sample: string }} PageImage
 * @typedef {{ rendered: PageImage[], referenced: PageImage[], missing: string[], external: string[] }} RouteImages
 * @typedef {{ version: number, dist: string, routes: Record<string, RouteImages> }} PageImageDump
 * @typedef {{ file: string, sha256: string }} ImageChange
 * @typedef {{ removed: ImageChange[], added: ImageChange[], noLongerRendered: ImageChange[], newlyRendered: ImageChange[], newlyMissing: string[] }} RouteChange
 * @typedef {{ routesRemoved: string[], routesAdded: string[], changed: Record<string, RouteChange>, unchanged: number, lost: number }} DumpComparison
 */

/**
 * Build the dump for a built project.
 * @returns {Promise<PageImageDump>}
 */
export async function dumpPageImages({ root = REPO_ROOT, dist = path.join(root, ".next"), siteHosts = /(?:^|\.)csplumbinglee\.com$/i } = {}) {
  const appDir = path.join(dist, "server", "app");
  const htmlFiles = (await walk(appDir, (name) => name.endsWith(".html"))).sort();
  if (htmlFiles.length === 0) {
    throw new Error(`No prerendered pages under ${posix(path.relative(root, appDir))}: run a production build first.`);
  }

  // Name a picture by where its bytes come from: a hashed copy in
  // .next/static/media is reported as the public (or generated) file it was made from.
  const origin = new Map();
  const sources = [
    ...(await walk(path.join(root, "public"), (name) => IMAGE_FILE.test(name))),
    ...(await walk(path.join(root, "src", "generated", "derived"), (name) => IMAGE_FILE.test(name))),
  ].sort();
  for (const file of sources) {
    const digest = await sha256(file);
    if (!origin.has(digest)) origin.set(digest, posix(path.relative(root, file)));
  }

  const ctx = { root, dist, siteHosts };
  const cssCache = new Map();
  /** @type {Record<string, RouteImages>} */
  const routes = {};
  for (const file of htmlFiles) {
    const relHtml = posix(path.relative(appDir, file)).replace(/\.html$/, "");
    const route = relHtml === "index" ? "/" : `/${relHtml.replace(/\/index$/, "")}`;
    const html = await readFile(file, "utf8");
    const { found, stylesheets } = extractImageUrls(html);

    for (const href of stylesheets) {
      const resolved = resolveUrl(href, ctx);
      if (!resolved?.abs) continue;
      if (!cssCache.has(resolved.abs)) cssCache.set(resolved.abs, cssUrls(await readFile(resolved.abs, "utf8")));
      for (const u of cssCache.get(resolved.abs)) {
        if (IMAGE_FILE.test(u.split(/[?#]/)[0]) || u.startsWith("/_next/image")) found.push({ url: u, via: "css" });
      }
    }

    const byHash = new Map();
    const missing = new Set();
    const external = new Set();
    for (const { url, via } of found) {
      const resolved = resolveUrl(url, ctx);
      if (!resolved) continue;
      if (resolved.external) {
        if (via !== "data") external.add(resolved.external);
        continue;
      }
      if (resolved.missing) {
        missing.add(url);
        continue;
      }
      const digest = await sha256(resolved.abs);
      if (!byHash.has(digest)) {
        byHash.set(digest, { sha256: digest, file: origin.get(digest) ?? posix(path.relative(root, resolved.abs)), via: new Set(), sample: url });
      }
      byHash.get(digest).via.add(via);
    }
    const entries = [...byHash.values()]
      .map((e) => ({ sha256: e.sha256, file: e.file, via: [...e.via].sort(), sample: e.sample }))
      .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : 0));
    routes[route] = {
      rendered: entries.filter((e) => e.via.some((v) => RENDERED_VIA.has(v))),
      referenced: entries.filter((e) => !e.via.some((v) => RENDERED_VIA.has(v))),
      missing: [...missing].sort(),
      external: [...external].sort(),
    };
  }
  /** @type {Record<string, RouteImages>} */
  const sorted = {};
  for (const route of Object.keys(routes).sort()) sorted[route] = routes[route];
  return { version: 1, dist: posix(path.relative(root, dist)) || ".", routes: sorted };
}

/**
 * Per route: which picture contents were added or removed, whatever their URLs look like.
 * @param {PageImageDump} before
 * @param {PageImageDump} after
 * @returns {DumpComparison}
 */
export function compareDumps(before, after) {
  /** @type {DumpComparison} */
  const report = { routesRemoved: [], routesAdded: [], changed: {}, unchanged: 0, lost: 0 };
  const index = (list) => new Map(list.map((e) => [e.sha256, e.file]));
  for (const route of Object.keys(before.routes).sort()) {
    const b = before.routes[route];
    const a = after.routes[route];
    if (!a) {
      report.routesRemoved.push(route);
      report.lost += b.rendered.length;
      continue;
    }
    const bRendered = index(b.rendered);
    const aRendered = index(a.rendered);
    const bAll = index([...b.rendered, ...b.referenced]);
    const aAll = index([...a.rendered, ...a.referenced]);
    const diff = (from, to) => [...from].filter(([digest]) => !to.has(digest)).map(([digest, file]) => ({ file, sha256: digest }));
    const entry = {
      // Gone from the page entirely (not in markup, not in its data).
      removed: diff(bAll, aAll),
      added: diff(aAll, bAll),
      // Still known to the page, but no longer in real markup (or the other way round).
      noLongerRendered: diff(bRendered, aRendered).filter((e) => aAll.has(e.sha256)),
      newlyRendered: diff(aRendered, bRendered).filter((e) => bAll.has(e.sha256)),
      newlyMissing: a.missing.filter((u) => !b.missing.includes(u)),
    };
    if (Object.values(entry).some((list) => list.length > 0)) report.changed[route] = entry;
    else report.unchanged += 1;
    report.lost += entry.removed.length;
  }
  for (const route of Object.keys(after.routes).sort()) {
    if (!before.routes[route]) report.routesAdded.push(route);
  }
  return report;
}

function printComparison(report) {
  const line = console.log;
  for (const [route, d] of Object.entries(report.changed)) {
    line(`\n${route}`);
    for (const e of d.removed) line(`  - removed          ${e.file}  ${e.sha256.slice(0, 12)}`);
    for (const e of d.added) line(`  + added            ${e.file}  ${e.sha256.slice(0, 12)}`);
    for (const e of d.noLongerRendered) line(`  ~ now only in data ${e.file}  ${e.sha256.slice(0, 12)}`);
    for (const e of d.newlyRendered) line(`  ~ now in markup    ${e.file}  ${e.sha256.slice(0, 12)}`);
    for (const u of d.newlyMissing) line(`  ! broken           ${u}`);
  }
  if (report.routesRemoved.length > 0) line(`\nRoutes no longer built: ${report.routesRemoved.join(", ")}`);
  if (report.routesAdded.length > 0) line(`\nNew routes: ${report.routesAdded.join(", ")}`);
  const changed = Object.keys(report.changed).length;
  line(`\n${report.unchanged} route(s) show exactly the same pictures; ${changed} changed; ${report.lost} picture(s) lost.`);
}

function parseArgs(argv) {
  const out = { flags: new Set(), values: {}, rest: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (["--dir", "--root", "--out"].includes(arg)) {
      out.values[arg.slice(2)] = argv[i + 1];
      i += 1;
    } else if (arg.startsWith("--")) out.flags.add(arg.slice(2));
    else out.rest.push(arg);
  }
  return out;
}

async function main() {
  const { flags, values, rest } = parseArgs(process.argv.slice(2));
  if (flags.has("compare")) {
    if (rest.length !== 2) throw new Error("Usage: dump-page-images.mjs --compare before.json after.json");
    const [before, after] = await Promise.all(rest.map(async (f) => JSON.parse(await readFile(f, "utf8"))));
    const report = compareDumps(before, after);
    if (flags.has("json")) console.log(JSON.stringify(report, null, 2));
    else printComparison(report);
    const broken = Object.values(report.changed).some((d) => d.newlyMissing.length > 0);
    return report.lost > 0 || report.routesRemoved.length > 0 || broken ? 1 : 0;
  }
  const root = path.resolve(values.root ?? REPO_ROOT);
  const dist = path.resolve(root, values.dir ?? ".next");
  const dump = await dumpPageImages({ root, dist });
  const json = `${JSON.stringify(dump, null, 2)}\n`;
  if (!values.out) {
    process.stdout.write(json);
    return 0;
  }
  await writeFile(values.out, json);
  const routes = Object.values(dump.routes);
  const pictures = new Set(routes.flatMap((r) => r.rendered.map((e) => e.sha256)));
  const missing = routes.reduce((n, r) => n + r.missing.length, 0);
  console.log(`${routes.length} routes, ${pictures.size} different pictures rendered, ${missing} broken image URL(s) -> ${values.out}`);
  return 0;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((err) => {
      console.error(`dump-page-images: ${err.message}`);
      process.exitCode = 1;
    });
}
