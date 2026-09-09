#!/usr/bin/env node
/**
 * Project photo ingest.
 *
 * Turns a folder of raw job-site photos into web-ready assets plus the
 * TypeScript block that COMPLETED_PROJECTS expects, so adding a project phase
 * stops being a hand-edit of 20+ image paths in src/lib/constants.ts.
 *
 * Drop photos here (folder names become the URL, so use the real slugs):
 *
 *   photo-inbox/<project-slug>/<phase-slug>/*.{jpg,jpeg,png,heic,heif,webp,avif,tif}
 *
 * Then:
 *
 *   npm run photos:ingest              # every project in the inbox
 *   npm run photos:ingest -- <slug>    # just one project
 *   npm run photos:ingest -- --dry-run # report only, write nothing
 *
 * What it does to each photo:
 *   - reads HEIC/HEIF straight off an iPhone, plus jpg/png/webp/avif/tif
 *   - auto-rotates using the EXIF orientation flag, then drops all metadata.
 *     That strips embedded GPS coordinates, which on a customer's home is a
 *     privacy leak we must not publish.
 *   - downscales to MAX_WIDTH (never upscales) and encodes WebP
 *   - names output photo-1..photo-N, continuing after whatever is already in
 *     the destination folder so a second batch appends instead of clobbering
 *
 * Output lands in public/images/projects/<slug>/<phase>/ and the generated
 * TypeScript is written to photo-inbox/_generated/<slug>.ts.txt.
 */

import { readdir, mkdir, stat, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = path.join(ROOT, "photo-inbox");
const OUT_ROOT = path.join(ROOT, "public", "images", "projects");
const GENERATED = path.join(INBOX, "_generated");
const CONSTANTS = path.join(ROOT, "src", "lib", "constants.ts");

const MAX_WIDTH = 2400;
const WEBP_QUALITY = 82;
const SOURCE_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".tif", ".tiff",
]);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlySlugs = args.filter((a) => !a.startsWith("--"));

/** Sort so IMG_2 lands before IMG_10 rather than after it. */
const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

const titleize = (slug) =>
  slug.split("-").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");

/**
 * Pull slug -> project name out of constants.ts so generated alt text matches
 * the project it belongs to. Regex rather than a TS parse: the file is a plain
 * literal array and we only need two adjacent string fields. Falls back to the
 * titleized slug for a project that isn't in constants.ts yet.
 */
async function readProjectNames() {
  const names = new Map();
  if (!existsSync(CONSTANTS)) return names;
  const src = await readFile(CONSTANTS, "utf8");
  const re = /slug:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) names.set(m[1], m[2]);
  return names;
}

/**
 * Strip the parenthetical/em-dash qualifier a project name carries for display
 * ("1119 Harvest Ave — New Construction (Lehigh Acres)") down to the label the
 * existing alt text uses ("1119 Harvest Ave").
 */
const altLabel = (projectName, slug) =>
  (projectName ? projectName.split("—")[0].split("(")[0].trim() : titleize(slug)) || titleize(slug);

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

/**
 * Highest N already used by photo-N.* in the destination, so a follow-up batch
 * continues the sequence instead of overwriting the first one.
 */
async function highestExistingIndex(dir) {
  if (!existsSync(dir)) return 0;
  const entries = await readdir(dir, { withFileTypes: true });
  let max = 0;
  for (const e of entries) {
    if (!e.isFile()) continue;
    const m = /^photo-(\d+)\./i.exec(e.name);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}

async function ingestPhase({ slug, phase, projectName }) {
  const srcDir = path.join(INBOX, slug, phase);
  const outDir = path.join(OUT_ROOT, slug, phase);
  const sources = await listSourceImages(srcDir);
  if (sources.length === 0) return null;

  const startAt = await highestExistingIndex(outDir);
  if (!dryRun) await mkdir(outDir, { recursive: true });

  const label = altLabel(projectName, slug);
  const phaseWords = titleize(phase).toLowerCase();
  const images = [];
  let bytesIn = 0;
  let bytesOut = 0;

  for (let i = 0; i < sources.length; i += 1) {
    const n = startAt + i + 1;
    const from = path.join(srcDir, sources[i]);
    const outName = `photo-${n}.webp`;
    const to = path.join(outDir, outName);

    bytesIn += (await stat(from)).size;

    if (!dryRun) {
      await sharp(from, { failOn: "none" })
        // No-arg rotate() applies the EXIF orientation flag. Every later op
        // then works on upright pixels, and the flag itself is discarded with
        // the rest of the metadata (GPS included) since we never call
        // withMetadata().
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(to);
      bytesOut += (await stat(to)).size;
    }

    images.push({
      src: `/images/projects/${slug}/${phase}/${outName}`,
      alt: `${label} ${phaseWords} plumbing ${n}`,
      from: sources[i],
    });
  }

  return { slug, phase, images, bytesIn, bytesOut, startAt };
}

/** Render the phase object literal in the same shape/indentation constants.ts uses. */
function renderPhaseBlock({ phase, images }) {
  const lines = images
    .map((im) => `          { src: "${im.src}", alt: "${im.alt}" },`)
    .join("\n");
  return [
    `      {`,
    `        name: "${titleize(phase)}",`,
    `        slug: "${phase}",`,
    `        description: "TODO — one line on what this phase covered.",`,
    `        images: [`,
    lines,
    `        ],`,
    `      },`,
  ].join("\n");
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function main() {
  if (!existsSync(INBOX)) {
    console.error(`No inbox at ${path.relative(ROOT, INBOX)}/ — create it and drop photos in.`);
    console.error(`Layout: photo-inbox/<project-slug>/<phase-slug>/your-photos.jpg`);
    process.exitCode = 1;
    return;
  }

  const projectNames = await readProjectNames();
  let slugs = await listDirs(INBOX);
  if (onlySlugs.length > 0) {
    const known = new Set(slugs);
    const missing = onlySlugs.filter((s) => !known.has(s));
    if (missing.length > 0) {
      console.error(`Not in the inbox: ${missing.join(", ")}`);
      process.exitCode = 1;
      return;
    }
    slugs = onlySlugs;
  }

  if (slugs.length === 0) {
    console.log(`Inbox is empty. Drop photos in photo-inbox/<project-slug>/<phase-slug>/ and re-run.`);
    return;
  }

  if (dryRun) console.log("DRY RUN — nothing will be written.\n");

  let totalIn = 0;
  let totalOut = 0;
  let totalPhotos = 0;

  for (const slug of slugs) {
    const phases = await listDirs(path.join(INBOX, slug));
    if (phases.length === 0) {
      console.log(`${slug}: no phase folders — expected photo-inbox/${slug}/<phase-slug>/`);
      continue;
    }

    const isNew = !projectNames.has(slug);
    console.log(`\n${slug}${isNew ? "  (not yet in constants.ts — needs a new project entry)" : ""}`);

    const blocks = [];
    for (const phase of phases) {
      const result = await ingestPhase({ slug, phase, projectName: projectNames.get(slug) });
      if (!result) {
        console.log(`  ${phase}: no images found`);
        continue;
      }
      const { images, bytesIn, bytesOut, startAt } = result;
      totalIn += bytesIn;
      totalOut += bytesOut;
      totalPhotos += images.length;
      const appended = startAt > 0 ? `, appended after photo-${startAt}` : "";
      const saved = dryRun ? "" : ` -> ${mb(bytesOut)}`;
      console.log(`  ${phase}: ${images.length} photos (${mb(bytesIn)}${saved}${appended})`);
      blocks.push(renderPhaseBlock(result));
    }

    if (blocks.length > 0 && !dryRun) {
      await mkdir(GENERATED, { recursive: true });
      const out = path.join(GENERATED, `${slug}.ts.txt`);
      await writeFile(out, `${blocks.join("\n")}\n`, "utf8");
      console.log(`  -> ${path.relative(ROOT, out)}`);
    }
  }

  console.log(
    `\n${totalPhotos} photos${dryRun ? "" : `: ${mb(totalIn)} -> ${mb(totalOut)}`}`,
  );
  if (!dryRun && totalPhotos > 0) {
    console.log(`Paste the generated phase blocks into COMPLETED_PROJECTS, then: npm run photos:check`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
