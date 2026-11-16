#!/usr/bin/env node
/**
 * Lists every route the last `next build` produced, read from the build
 * manifests (not the sitemap, so unlisted pages are covered too):
 *
 *   .next/prerender-manifest.json    every prerendered path: static pages,
 *                                     generateStaticParams pages, and file
 *                                     routes (robots.txt, sitemap.xml, …)
 *   .next/routes-manifest.json       static paths rendered on demand, the
 *                                     dynamic route patterns, and redirects
 *   .next/app-path-routes-manifest.json   page vs. route-handler for each
 *
 *   node scripts/qa/routes.mjs                 # table of pages, files, redirects
 *   node scripts/qa/routes.mjs --json          # everything as JSON
 *   node scripts/qa/routes.mjs --pages         # one page path per line
 *   node scripts/qa/routes.mjs --next-dir /path/to/.next
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { cli, readJson } from "./lib/util.mjs";

/** Framework-internal entries that are not addressable pages. */
const INTERNAL = new Set(["/_not-found", "/_global-error", "/_error", "/404", "/500"]);

const byPath = (a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path));

/**
 * @param {string} [nextDir=".next"]
 * @returns {{
 *   nextDir: string, buildId: string|null,
 *   pages: { path: string, kind: "static"|"prerendered-dynamic"|"server-rendered", srcRoute: string, revalidate: number|null }[],
 *   files: { path: string, contentType: string|null }[],
 *   handlers: { path: string }[],
 *   dynamicPatterns: string[],
 *   redirects: { source: string, destination: string, statusCode: number, internal: boolean, regex: string|null }[],
 * }}
 */
export function loadRoutes(nextDir = ".next") {
  const dir = path.resolve(nextDir);
  const file = (name) => path.join(dir, name);
  if (!existsSync(file("prerender-manifest.json")) || !existsSync(file("routes-manifest.json"))) {
    throw new Error(`No build manifests in ${dir}. Run "next build" first, or pass --next-dir.`);
  }
  const prerender = readJson(file("prerender-manifest.json"));
  const routesManifest = readJson(file("routes-manifest.json"));
  const appPaths = existsSync(file("app-path-routes-manifest.json")) ? readJson(file("app-path-routes-manifest.json")) : {};
  // BUILD_ID is plain text, not JSON.
  const buildId = existsSync(file("BUILD_ID")) ? readFileSync(file("BUILD_ID"), "utf8").trim() : null;

  // "/about/page" -> page, "/robots.txt/route" -> route handler
  const handlerKind = new Map();
  for (const [source, route] of Object.entries(appPaths)) {
    handlerKind.set(route, source.endsWith("/route") ? "route" : "page");
  }

  const pages = [];
  const files = [];
  const handlers = [];
  const seen = new Set();

  for (const [route, info] of Object.entries(prerender.routes ?? {})) {
    if (INTERNAL.has(route)) continue;
    seen.add(route);
    const srcRoute = info.srcRoute ?? route;
    const isHandler = info.routeType ? info.routeType === "route" : handlerKind.get(srcRoute) === "route";
    if (isHandler) {
      files.push({ path: route, contentType: info.initialHeaders?.["content-type"] ?? null });
    } else {
      pages.push({
        path: route,
        kind: srcRoute === route ? "static" : "prerendered-dynamic",
        srcRoute,
        revalidate: typeof info.initialRevalidateSeconds === "number" ? info.initialRevalidateSeconds : null,
      });
    }
  }

  // Static paths that are rendered on demand rather than prerendered.
  for (const { page } of routesManifest.staticRoutes ?? []) {
    if (INTERNAL.has(page) || seen.has(page)) continue;
    seen.add(page);
    if (handlerKind.get(page) === "page") {
      pages.push({ path: page, kind: "server-rendered", srcRoute: page, revalidate: null });
    } else {
      handlers.push({ path: page });
    }
  }

  const redirects = (routesManifest.redirects ?? []).map((r) => ({
    source: r.source,
    destination: r.destination,
    statusCode: r.statusCode ?? (r.permanent ? 308 : 307),
    internal: Boolean(r.internal),
    regex: r.regex ?? null,
  }));

  return {
    nextDir: dir,
    buildId,
    pages: pages.sort(byPath),
    files: files.sort(byPath),
    handlers: handlers.sort(byPath),
    dynamicPatterns: (routesManifest.dynamicRoutes ?? []).map((r) => r.page),
    redirects,
  };
}

const USAGE = `
Usage: node scripts/qa/routes.mjs [--next-dir .next] [--json | --pages | --files | --redirects]

Lists the routes of the last "next build" from its manifests.
  --next-dir DIR   build output to read (default .next in the current directory)
  --json           print everything as JSON
  --pages          print page paths only, one per line
  --files          print prerendered file routes only (robots.txt, sitemap.xml, …)
  --redirects      print redirects only: "status source -> destination"
`;

function main() {
  const { values } = cli(USAGE, {
    "next-dir": { type: "string", default: ".next" },
    json: { type: "boolean" },
    pages: { type: "boolean" },
    files: { type: "boolean" },
    redirects: { type: "boolean" },
  });
  const routes = loadRoutes(values["next-dir"]);
  const out = (line) => process.stdout.write(`${line}\n`);

  if (values.json) return out(JSON.stringify(routes, null, 2));
  if (values.pages) return routes.pages.forEach((p) => out(p.path));
  if (values.files) return routes.files.forEach((f) => out(f.path));
  if (values.redirects) {
    return routes.redirects.forEach((r) => out(`${r.statusCode} ${r.source} -> ${r.destination}${r.internal ? "  (framework)" : ""}`));
  }

  const kinds = {};
  for (const p of routes.pages) kinds[p.kind] = (kinds[p.kind] ?? 0) + 1;
  out(`Build ${routes.buildId ?? "(unknown id)"} in ${routes.nextDir}`);
  out(`${routes.pages.length} pages (${Object.entries(kinds).map(([k, n]) => `${n} ${k}`).join(", ")})`);
  for (const p of routes.pages) {
    const notes = [p.kind === "static" ? "" : p.kind === "prerendered-dynamic" ? `from ${p.srcRoute}` : "rendered on demand"];
    if (p.revalidate) notes.push(`revalidate ${p.revalidate}s`);
    out(`  ${p.path}${notes.filter(Boolean).length ? `   [${notes.filter(Boolean).join(", ")}]` : ""}`);
  }
  out(`${routes.files.length} prerendered file routes`);
  for (const f of routes.files) out(`  ${f.path}`);
  out(`${routes.handlers.length} on-demand handlers (API routes, generated social images)`);
  for (const h of routes.handlers) out(`  ${h.path}`);
  out(`${routes.redirects.length} redirects`);
  for (const r of routes.redirects) out(`  ${r.statusCode} ${r.source} -> ${r.destination}${r.internal ? "  (framework)" : ""}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
