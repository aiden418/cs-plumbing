#!/usr/bin/env node
/**
 * Gallery photo ingest.
 *
 * The companion to ingest-project-photos.mjs. Same treatment of the pixels,
 * different destination: /gallery is a flat filterable grid rather than a
 * project broken into phases, so photos are grouped by category instead.
 *
 * Drop photos here (folder name is the category, and must be one of the four
 * the GalleryItem union allows):
 *
 *   photo-inbox/_gallery/<category>/*.{jpg,jpeg,png,heic,heif,webp,avif,tif}
 *
 * Then:
 *
 *   npm run gallery:ingest              # every category in the inbox
 *   npm run gallery:ingest -- <cat>     # just one category
 *   npm run gallery:ingest -- --dry-run # report only, write nothing
 *
 * Each photo gets auto-rotated, stripped of all metadata (GPS included — on a
 * customer's home that is their address), downscaled and encoded to WebP,
 * exactly as the project ingest does.
 *
 * Output lands in public/images/gallery/ and the generated TypeScript goes to
 * photo-inbox/_generated/_gallery.ts.txt, ready to paste into `galleryItems`
 * in src/app/gallery/GalleryPage.tsx.
 *
 * Two things this deliberately does NOT try to guess, because a filename like
 * IMG_4864.jpeg carries no meaning:
 *   - the output filename, which lands as <category>-<n>.webp
 *   - the `title`, which is emitted as a TODO
 * Both want a human (or a pass with eyes on the photo) before they ship.
 */

import { readdir, mkdir, stat, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = path.join(ROOT, "photo-inbox", "_gallery");
const OUT_DIR = path.join(ROOT, "public", "images", "gallery");
const GENERATED = path.join(ROOT, "photo-inbox", "_generated");
const GALLERY_PAGE = path.join(ROOT, "src", "app", "gallery", "GalleryPage.tsx");

const MAX_WIDTH = 2400;
const WEBP_QUALITY = 82;
const SOURCE_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".tif", ".tiff",
]);

/** Mirrors the GalleryItem["category"] union in src/lib/types.ts. */
const CATEGORIES = new Set([
  "residential", "commercial", "new-construction", "remodel",
]);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyCategories = args.filter((a) => !a.startsWith("--"));

/** Sort so IMG_2 lands before IMG_10 rather than after it. */
const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const titleize = (slug) =>
  slug.split("-").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");

/**
 * Highest existing numeric id in galleryItems, so appended entries continue the
 * sequence. Ids are strings ("1".."64") but numerically ordered, and the array
 * is a plain literal, so a regex beats parsing the TSX.
 */
async function highestExistingId() {
  if (!existsSync(GALLERY_PAGE)) return 0;
  const src = await readFile(GALLERY_PAGE, "utf8");
  let max = 0;
  const re = /\bid:\s*"(\d+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) max = Math.max(max, Number(m[1]));
  return max;
}

/** Highest N already used by <category>-N.webp, so a second batch appends. */
async function highestExistingFileIndex(category) {
  if (!existsSync(OUT_DIR)) return 0;
  const entries = await readdir(OUT_DIR, { withFileTypes: true });
  let max = 0;
  const re = new RegExp(`^${category}-(\\d+)\\.`, "i");
  for (const e of entries) {
    if (!e.isFile()) continue;
    const m = re.exec(e.name);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

async function listDirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort(naturalSort);
}

async function listSourceImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && SOURCE_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort(naturalSort);
}

async function ingestCategory(category, nextId) {
  const srcDir = path.join(INBOX, category);
  const sources = await listSourceImages(srcDir);
  if (sources.length === 0) return null;

  const startAt = await highestExistingFileIndex(category);
  if (!dryRun) await mkdir(OUT_DIR, { recursive: true });

  const items = [];
  let bytesIn = 0;
  let bytesOut = 0;

  for (let i = 0; i < sources.length; i += 1) {
    const n = startAt + i + 1;
    const from = path.join(srcDir, sources[i]);
    const outName = `${category}-${n}.webp`;
    const to = path.join(OUT_DIR, outName);

    bytesIn += (await stat(from)).size;

    if (!dryRun) {
      await sharp(from, { failOn: "none" })
        // No-arg rotate() applies the EXIF orientation flag, so every later op
        // works on upright pixels. The flag goes out with the rest of the
        // metadata (GPS included) because withMetadata() is never called.
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(to);
      bytesOut += (await stat(to)).size;
    }

    items.push({
      id: String(nextId + i),
      src: `/images/gallery/${outName}`,
      category,
      from: sources[i],
    });
  }

  return { category, items, bytesIn, bytesOut, startAt };
}

/** Render entries in the same shape/indentation galleryItems uses. */
function renderItems(items) {
  return items
    .map((it) =>
      [
        `  {`,
        `    id: "${it.id}",`,
        `    src: "${it.src}",`,
        `    alt: "TODO — describe the photo for a screen reader (from ${it.from}).",`,
        `    category: "${it.category}",`,
        `    title: "TODO — short caption",`,
        `  },`,
      ].join("\n"),
    )
    .join("\n");
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function main() {
  if (!existsSync(INBOX)) {
    console.error(`No gallery inbox at ${path.relative(ROOT, INBOX)}/ — create it and drop photos in.`);
    console.error(`Layout: photo-inbox/_gallery/<category>/your-photos.jpg`);
    console.error(`Categories: ${[...CATEGORIES].join(", ")}`);
    process.exitCode = 1;
    return;
  }

  let categories = await listDirs(INBOX);

  const unknown = categories.filter((c) => !CATEGORIES.has(c));
  if (unknown.length > 0) {
    console.error(`Not a gallery category: ${unknown.join(", ")}`);
    console.error(`GalleryItem only allows: ${[...CATEGORIES].join(", ")}`);
    process.exitCode = 1;
    return;
  }

  if (onlyCategories.length > 0) {
    const known = new Set(categories);
    const missing = onlyCategories.filter((c) => !known.has(c));
    if (missing.length > 0) {
      console.error(`Not in the gallery inbox: ${missing.join(", ")}`);
      process.exitCode = 1;
      return;
    }
    categories = onlyCategories;
  }

  if (categories.length === 0) {
    console.log(`Gallery inbox is empty. Drop photos in photo-inbox/_gallery/<category>/ and re-run.`);
    return;
  }

  if (dryRun) console.log("DRY RUN — nothing will be written.\n");

  let nextId = (await highestExistingId()) + 1;
  const rendered = [];
  let totalIn = 0;
  let totalOut = 0;
  let totalPhotos = 0;

  for (const category of categories) {
    const result = await ingestCategory(category, nextId);
    // The four category folders are committed placeholders, so most runs touch
    // only one or two. Staying quiet about the empty ones keeps the report to
    // what actually happened.
    if (!result) continue;
    const { items, bytesIn, bytesOut, startAt } = result;
    nextId += items.length;
    totalIn += bytesIn;
    totalOut += bytesOut;
    totalPhotos += items.length;

    const appended = startAt > 0 ? `, appended after ${category}-${startAt}` : "";
    const saved = dryRun ? "" : ` -> ${mb(bytesOut)}`;
    console.log(`${titleize(category)}: ${items.length} photos (${mb(bytesIn)}${saved}${appended})`);
    rendered.push(renderItems(items));
  }

  if (rendered.length > 0 && !dryRun) {
    await mkdir(GENERATED, { recursive: true });
    const out = path.join(GENERATED, "_gallery.ts.txt");
    await writeFile(out, `${rendered.join("\n")}\n`, "utf8");
    console.log(`\n-> ${path.relative(ROOT, out)}`);
  }

  console.log(
    `\n${totalPhotos} photos${dryRun ? "" : `: ${mb(totalIn)} -> ${mb(totalOut)}`}`,
  );
  if (!dryRun && totalPhotos > 0) {
    console.log(`Paste the generated entries into galleryItems in src/app/gallery/GalleryPage.tsx,`);
    console.log(`fill in the TODO alt/title, then: npm run photos:check`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
