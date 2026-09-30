#!/usr/bin/env node
/**
 * Published-photo metadata scrub.
 *
 * The ingest scripts drop EXIF on the way in, but photos committed before
 * they existed (or dropped straight into public/) still carry it — including
 * GPS coordinates that pin a customer's home. Project case studies promise
 * EXIF-stripped phase photos, so this enforces it for everything we serve.
 *
 *   npm run photos:strip           # rewrite any file that still has EXIF
 *   npm run photos:strip -- --check  # report only; exit 1 if any remain
 *
 * Rewrites in place, same path and format, after applying the EXIF
 * orientation (so nothing turns sideways once the flag is gone). JPEGs are
 * re-encoded at q90 mozjpeg — visually lossless at our display sizes.
 */

import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = path.join(ROOT, "public", "images");
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const CHECK_ONLY = process.argv.includes("--check");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (RASTER.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

function encode(pipeline, ext) {
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return pipeline.jpeg({ quality: 90, mozjpeg: true });
    case ".png":
      return pipeline.png({ compressionLevel: 9 });
    case ".webp":
      return pipeline.webp({ quality: 90 });
    case ".avif":
      return pipeline.avif({ quality: 70 });
    default:
      throw new Error(`unsupported ${ext}`);
  }
}

async function main() {
  const dirty = [];
  for (const file of await walk(IMAGES)) {
    const meta = await sharp(file, { failOn: "none" }).metadata();
    if (meta.exif) dirty.push(file);
  }

  if (dirty.length === 0) {
    console.log("✓ No published image carries EXIF metadata.");
    return;
  }

  for (const file of dirty) {
    const rel = path.relative(ROOT, file);
    if (CHECK_ONLY) {
      console.log(`  EXIF  ${rel}`);
      continue;
    }
    // No withMetadata(): sharp drops EXIF/GPS/XMP on output by default.
    const buf = await encode(sharp(file, { failOn: "none" }).rotate(), path.extname(file).toLowerCase()).toBuffer();
    await writeFile(file, buf);
    console.log(`  stripped  ${rel}`);
  }

  if (CHECK_ONLY) {
    console.error(`\n✗ ${dirty.length} image(s) still carry EXIF. Run: npm run photos:strip`);
    process.exit(1);
  }
  console.log(`\n✓ Stripped metadata from ${dirty.length} image(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
