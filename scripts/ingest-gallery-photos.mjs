#!/usr/bin/env node
/**
 * Gallery photo ingest.
 *
 * The companion to ingest-project-photos.mjs. Same treatment of the pixels,
 * different destination: /gallery is a filterable grid rather than a project
 * broken into phases, so photos are grouped by category instead.
 *
 * Drop photos here (the folder name is the category):
 *
 *   photo-inbox/gallery/<category>/*.{jpg,jpeg,png,heic,heif,webp,avif,tif}
 *
 * Then:
 *
 *   npm run photos                        # every project and the gallery
 *   npm run gallery:ingest -- <cat>       # just one category
 *   npm run gallery:ingest -- --dry-run   # report only, write nothing
 *
 * Each photo gets auto-rotated, stripped of all metadata (GPS included: on a
 * customer's home that is their address), downscaled and encoded to WebP,
 * exactly as the project ingest does (HEIC through macOS `sips` first).
 *
 * Output lands in public/images/gallery/<category>/ as <category>-<n>.webp,
 * and every new photo gets an entry in that folder's images.json:
 *
 *   "remodel-3.webp": { "id": "67", "alt": "", "title": "", "category": "remodel" }
 *
 *   - `id` continues after the highest id used anywhere in the gallery data
 *     (every images.json under public/images/gallery, plus the older list in
 *     src/lib/gallery-data.ts while it still exists), so ids never collide.
 *   - `category` is the folder the photo was dropped in.
 *   - `alt` and `title` are left empty on purpose. A file name like
 *     IMG_4864.jpeg carries no meaning, and both are read by people and by
 *     search engines; `npm run photos:check` lists what still needs words.
 *
 * Originals move to photo-inbox/_done/, and the run ends by rebuilding the
 * image manifest. The older inbox photo-inbox/_gallery/<category>/ is still
 * read, so nothing dropped there is stranded.
 */

import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parseArgs, parseOwnerJson } from "./build-image-manifest.mjs";
import { highestIndex, ingestFolder, isMain, listDirs, mb, rebuildManifest, titleize } from "./ingest-project-photos.mjs";

/** The filter chips on /gallery (GalleryItem["category"] in src/lib/types.ts). */
export const CATEGORIES = ["residential", "commercial", "new-construction", "remodel"];

/**
 * Highest numeric id in use anywhere in the gallery data, so new entries
 * continue the sequence. Reads every images.json under the gallery folder (a
 * file with a typo is still scanned as text) and the older TypeScript lists.
 */
export async function highestGalleryId(root) {
  let max = 0;
  const bump = (value) => {
    const n = Number(value);
    if (Number.isInteger(n) && n > max) max = n;
  };
  async function walk(dir) {
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.name === "images.json") {
        const raw = await readFile(full, "utf8");
        const parsed = parseOwnerJson(raw);
        if (parsed.ok && parsed.data && typeof parsed.data === "object") {
          for (const value of Object.values(parsed.data)) {
            if (value && typeof value === "object") bump(value.id);
          }
        } else {
          for (const m of raw.matchAll(/"id"\s*:\s*"?(\d+)/g)) bump(m[1]);
        }
      }
    }
  }
  await walk(path.join(root, "public", "images", "gallery"));
  for (const legacy of ["src/lib/gallery-data.ts", "src/app/gallery/GalleryPage.tsx"]) {
    const file = path.join(root, legacy);
    if (!existsSync(file)) continue;
    for (const m of (await readFile(file, "utf8")).matchAll(/\bid:\s*"(\d+)"/g)) bump(m[1]);
  }
  return max;
}

async function main() {
  const { flags, root, rest: onlyCategories } = parseArgs(process.argv.slice(2));
  const dryRun = flags.has("dry-run");
  const inboxRoot = path.join(root, "photo-inbox");
  const inboxes = [path.join(inboxRoot, "gallery"), path.join(inboxRoot, "_gallery")];
  const galleryDir = path.join(root, "public", "images", "gallery");
  const log = console.log;

  if (!existsSync(inboxRoot)) {
    log(`No photo-inbox/ folder here, so there are no gallery photos to add.`);
    return 0;
  }
  if (!inboxes.some((dir) => existsSync(dir))) {
    if (!dryRun) for (const category of CATEGORIES) await mkdir(path.join(inboxes[0], category), { recursive: true });
    log(`No gallery photos waiting. Drop them in photo-inbox/gallery/<category>/ (${CATEGORIES.join(", ")}) and run this again.`);
    return 0;
  }

  // Folder -> category. A folder that is not a category is reported, never guessed at.
  const found = new Set();
  for (const dir of inboxes) for (const name of await listDirs(dir)) found.add(name);
  const unknown = [...found].filter((c) => !CATEGORIES.includes(c));
  let categories = CATEGORIES.filter((c) => found.has(c));
  if (onlyCategories.length > 0) {
    const missing = onlyCategories.filter((c) => !categories.includes(c));
    if (missing.length > 0) {
      console.error(`Not in the gallery inbox: ${missing.join(", ")}`);
      return 1;
    }
    categories = onlyCategories;
  }

  if (dryRun) log("DRY RUN: nothing will be written.\n");

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "cs-ingest-"));
  let nextId = (await highestGalleryId(root)) + 1;
  let totalIn = 0;
  let totalOut = 0;
  let totalPhotos = 0;
  let totalSkipped = 0;
  const toDescribe = new Set();
  try {
    for (const category of categories) {
      const outDir = path.join(galleryDir, category);
      for (const inbox of inboxes) {
        const srcDir = path.join(inbox, category);
        if (!existsSync(srcDir)) continue;
        const notes = [];
        const firstId = nextId;
        const result = await ingestFolder({
          root,
          inboxRoot,
          srcDir,
          outDir,
          // Numbers continue after <category>-N both here and in the flat gallery folder older runs wrote to.
          startAt: await highestIndex(category, outDir, galleryDir),
          nameFor: (n) => `${category}-${n}.webp`,
          entryFor: (_file, k) => ({ id: String(firstId + k), alt: "", title: "", category }),
          dryRun,
          tmpDir,
          log: (line) => notes.push(line),
        });
        if (!result) continue;
        const { done, skipped, bytesIn, bytesOut, startAt, relOut } = result;
        nextId += done.length;
        totalIn += bytesIn;
        totalOut += bytesOut;
        totalPhotos += done.length;
        totalSkipped += skipped.length;
        if (done.length > 0) {
          const appended = startAt > 0 ? `, continuing after ${category}-${startAt}` : "";
          const saved = dryRun ? "" : ` -> ${mb(bytesOut)}`;
          const range = done.length === 1 ? done[0].file : `${done[0].file} to ${done.at(-1).file}`;
          const ids = done.length === 1 ? `id ${firstId}` : `ids ${firstId} to ${firstId + done.length - 1}`;
          log(`${titleize(category)}: ${done.length} photo${done.length === 1 ? "" : "s"} (${mb(bytesIn)}${saved}${appended}) as ${range}, ${ids}`);
          if (!dryRun) toDescribe.add(`${relOut}/images.json`);
        } else {
          log(`${titleize(category)}: nothing added`);
        }
        for (const line of notes) log(line);
      }
    }
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }

  for (const name of unknown) {
    console.error(`"${name}" is not a gallery category, so the photos in photo-inbox/gallery/${name}/ were left alone; move them into one of: ${CATEGORIES.join(", ")}.`);
  }

  if (totalPhotos === 0 && totalSkipped === 0) {
    log(`No new gallery photos. Drop them in photo-inbox/gallery/<category>/ and run this again.`);
    return unknown.length > 0 ? 1 : 0;
  }
  log(`\n${totalPhotos} gallery photo${totalPhotos === 1 ? "" : "s"}${dryRun ? " would be added" : ` added: ${mb(totalIn)} -> ${mb(totalOut)}`}${totalSkipped > 0 ? `; ${totalSkipped} skipped (still in the inbox)` : ""}.`);
  if (dryRun || totalPhotos === 0) return unknown.length > 0 ? 1 : 0;
  log(`Originals moved to photo-inbox/_done/. Next: fill in "alt" (what the photo shows) and "title" (the caption on the tile) in`);
  for (const file of toDescribe) log(`  ${file}`);
  log("");
  const code = rebuildManifest(root);
  return code !== 0 ? code : unknown.length > 0 ? 1 : 0;
}

if (isMain(import.meta.url)) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
