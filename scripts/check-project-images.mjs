#!/usr/bin/env node
/**
 * Image reference check.
 *
 * Every "/images/..." path written in src/ must exist in public/, or the page
 * ships a broken image. Next/Image fails at request time, not build time, so
 * nothing else in the pipeline catches a typo or a photo that was renamed.
 *
 *   npm run photos:check
 *
 * Exits non-zero on a broken reference. Orphans (a file in public/ that no
 * source file mentions) are reported but never fail the run — plenty are
 * referenced through a template literal or held deliberately.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif"]);
const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);

async function walk(dir, keepExt) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, keepExt)));
    else if (keepExt.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function main() {
  const onDisk = new Set(
    (await walk(path.join(PUBLIC, "images"), IMAGE_EXT)).map(
      (f) => `/${path.relative(PUBLIC, f).split(path.sep).join("/")}`,
    ),
  );

  // Only literal "/images/..." strings. A path built by interpolation can't be
  // resolved statically, so it is simply not checked rather than guessed at.
  const referenced = new Map();
  for (const file of await walk(SRC, SOURCE_EXT)) {
    const text = await readFile(file, "utf8");
    for (const m of text.matchAll(/["'`](\/images\/[^"'`${}\s]+)["'`]/g)) {
      if (!IMAGE_EXT.has(path.extname(m[1]).toLowerCase())) continue;
      if (!referenced.has(m[1])) referenced.set(m[1], new Set());
      referenced.get(m[1]).add(path.relative(ROOT, file));
    }
  }

  const broken = [...referenced.keys()].filter((p) => !onDisk.has(p)).sort();
  const orphaned = [...onDisk].filter((p) => !referenced.has(p)).sort();

  console.log(`${onDisk.size} images in public/images, ${referenced.size} referenced from src/`);

  if (orphaned.length > 0) {
    console.log(`\n${orphaned.length} on disk, never referenced (not an error):`);
    for (const p of orphaned) console.log(`  ${p}`);
  }

  if (broken.length > 0) {
    console.error(`\n${broken.length} referenced but MISSING from public/:`);
    for (const p of broken) {
      console.error(`  ${p}`);
      for (const f of [...referenced.get(p)].sort()) console.error(`      ${f}`);
    }
    process.exit(1);
  }

  console.log("\nNo broken image references.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
