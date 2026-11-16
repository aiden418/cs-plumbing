/**
 * Reads what the font scripts need out of a production build (.next):
 * the font files next/font wrote, and the real headline strings in the
 * prerendered pages.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const NEXT = path.join(ROOT, ".next");

function walk(dir, keep) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, keep));
    else if (keep(entry.name)) out.push(full);
  }
  return out;
}

export function requireBuild() {
  if (!existsSync(path.join(NEXT, "BUILD_ID"))) {
    throw new Error("No production build found. Run `npx next build` first.");
  }
}

/**
 * Every @font-face next/font wrote, in stylesheet order:
 * { family, file, bytes, latin, weight, stretch, fallback: { src, sizeAdjust, ascent, descent, lineGap } | null }
 */
export function fontFaces() {
  requireBuild();
  const faces = [];
  for (const cssFile of walk(path.join(NEXT, "static"), (name) => name.endsWith(".css"))) {
    const css = readFileSync(cssFile, "utf8");
    for (const match of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
      const body = match[1];
      const get = (name) => body.match(new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]*)`))?.[1].trim();
      const family = (get("font-family") ?? "").replace(/^["']|["']$/g, "");
      const src = get("src") ?? "";
      const url = src.match(/url\(([^)]+)\)/)?.[1].replace(/^["']|["']$/g, "");
      const file = url ? path.resolve(path.dirname(cssFile), url) : null;
      const range = get("unicode-range") ?? "";
      faces.push({
        family,
        file,
        bytes: file && existsSync(file) ? statSync(file).size : null,
        // Basic Latin first: U+0000-00FF, which Lightning CSS shortens to U+??
        latin: /^U\+(\?\?|0{1,4}-0{0,2}FF)(?![0-9A-F?])/i.test(range),
        weight: get("font-weight") ?? "normal",
        stretch: get("font-stretch") ?? "normal",
        fallback: url
          ? null
          : {
              src,
              sizeAdjust: get("size-adjust") ?? null,
              ascent: get("ascent-override") ?? null,
              descent: get("descent-override") ?? null,
              lineGap: get("line-gap-override") ?? null,
            },
      });
    }
  }
  return faces;
}

/** The Latin subset of a family, e.g. latinFace("Archivo"). */
export function latinFace(family) {
  const face = fontFaces().find((f) => f.family === family && f.latin && f.file);
  if (!face) throw new Error(`No Latin @font-face for "${family}" in the build. Is it declared in src/app/layout.tsx?`);
  return face;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function textOf(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (whole, name) => ENTITIES[name.toLowerCase()] ?? whole)
    .replace(/\s+/g, " ")
    .trim();
}

/** Pages whose headings are not set in the display face (they keep the pre-redesign fonts). */
const NOT_DISPLAY = new Set(["/builders/capability-statement", "/builders/prequal-packet", "/terms"]);

/**
 * Headline strings as they are in the prerendered HTML:
 * { routes, h1: [{ route, text }], h2: [{ route, text }] }
 */
export function headings() {
  requireBuild();
  const appDir = path.join(NEXT, "server", "app");
  const h1 = [];
  const h2 = [];
  let routes = 0;
  for (const file of walk(appDir, (name) => name.endsWith(".html")).sort()) {
    const rel = path.relative(appDir, file).replace(/\.html$/, "");
    if (rel.startsWith("_")) continue;
    const route = rel === "index" ? "/" : `/${rel}`;
    if (NOT_DISPLAY.has(route)) continue;
    routes++;
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/<h([12])\b[^>]*>([\s\S]*?)<\/h\1>/g)) {
      const text = textOf(match[2]);
      if (text) (match[1] === "1" ? h1 : h2).push({ route, text });
    }
  }
  return { routes, h1, h2 };
}

/** The prerendered route whose H1 has the most characters. */
export function longestH1() {
  return headings().h1.reduce((longest, entry) => (entry.text.length > longest.text.length ? entry : longest));
}

/** The first article linked from the blog index, or null. */
export function firstBlogPost() {
  requireBuild();
  const index = path.join(NEXT, "server", "app", "blog.html");
  if (!existsSync(index)) return null;
  return readFileSync(index, "utf8").match(/href="(\/blog\/[^"#?]+)"/)?.[1] ?? null;
}
