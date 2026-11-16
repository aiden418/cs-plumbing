#!/usr/bin/env node
/**
 * Project photo ingest.
 *
 * Turns a folder of raw job-site photos into web-ready pictures that the
 * project page finds on its own. No page code and no pasted lists: the photos
 * land in the project's folder and the image manifest picks them up.
 *
 * Drop photos here (folder names become the URL, so use the real slugs):
 *
 *   photo-inbox/<project-slug>/<phase-slug>/*.{jpg,jpeg,png,heic,heif,webp,avif,tif}
 *
 * Then:
 *
 *   npm run photos                       # every project and the gallery
 *   npm run photos:ingest -- <slug>      # just one project
 *   npm run photos:ingest -- --dry-run   # report only, write nothing
 *
 * What it does to each photo:
 *   - iPhone HEIC/HEIF is first converted to a temporary JPEG with macOS's
 *     built-in `sips` (the image library used here cannot read it). On other
 *     systems a HEIC file is skipped with a message and stays in the inbox.
 *   - auto-rotates using the EXIF orientation flag, then drops all metadata.
 *     That strips embedded GPS coordinates, which on a customer's home is a
 *     privacy leak we must not publish.
 *   - downscales to MAX_WIDTH (never upscales) and encodes WebP
 *   - names output photo-1..photo-N, continuing after whatever is already in
 *     the destination folder. Nothing is ever overwritten.
 *   - adds an entry for the new file to the folder's images.json (created when
 *     missing, existing entries untouched) with an empty "alt", so
 *     `npm run photos:check` lists it until someone describes the photo.
 *   - moves the original to photo-inbox/_done/<same path>.
 *
 * Output lands in public/images/projects/<slug>/<phase>/, and the run ends by
 * rebuilding the image manifest (scripts/build-image-manifest.mjs).
 *
 * The helpers below are shared with scripts/ingest-gallery-photos.mjs.
 */

import { execFile, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { copyFile, mkdir, mkdtemp, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import sharp from "sharp";
import { naturalCompare, parseArgs, parseOwnerJson } from "./build-image-manifest.mjs";

const execFileAsync = promisify(execFile);
const MANIFEST = path.join(path.dirname(fileURLToPath(import.meta.url)), "build-image-manifest.mjs");

export const MAX_WIDTH = 2400;
export const WEBP_QUALITY = 82;
export const SOURCE_EXT = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".tif", ".tiff",
]);
const HEIC_EXT = new Set([".heic", ".heif"]);
/** Inbox folders that are not projects. Folders starting with "_" or "." are skipped as well. */
const NOT_A_PROJECT = new Set(["gallery"]);

export const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
export const titleize = (slug) =>
  slug.split("-").map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
const firstLine = (text) => String(text ?? "").trim().split("\n")[0];

/** Sub-folders in natural order (IMG_2 before IMG_10), minus private and reserved ones. */
export async function listDirs(dir, reserved = new Set()) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith(".") && !reserved.has(e.name))
    .map((e) => e.name)
    .sort(naturalCompare);
}

export async function listSourceImages(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && !e.name.startsWith(".") && SOURCE_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort(naturalCompare);
}

/**
 * Highest N already used by <prefix>-N.* in the given folders, so a follow-up
 * batch continues the sequence instead of overwriting the first one.
 */
export async function highestIndex(prefix, ...dirs) {
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, (ch) => `\\${ch}`);
  const pattern = new RegExp(`^${escaped}-(\\d+)\\.`, "i");
  let max = 0;
  for (const dir of dirs) {
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (!e.isFile()) continue;
      const m = pattern.exec(e.name);
      if (m) max = Math.max(max, Number(m[1]));
    }
  }
  return max;
}

/**
 * One original in, one web-ready WebP out. Never overwrites: an existing
 * target is an error, not a replacement. Returns { ok, bytesOut } or
 * { ok: false, reason } with a reason that finishes the sentence "<file> ...".
 */
export async function convertPhoto(from, to, tmpDir) {
  let input = from;
  let tmp = null;
  if (HEIC_EXT.has(path.extname(from).toLowerCase())) {
    if (process.platform !== "darwin") {
      return {
        ok: false,
        reason:
          "is an iPhone HEIC photo, which can only be converted on a Mac; export it as a JPEG (or set the iPhone to Settings > Camera > Formats > Most Compatible) and drop it in again",
      };
    }
    tmp = path.join(tmpDir, `${randomUUID()}.jpg`);
    try {
      // The bundled image library cannot decode HEIC; macOS can.
      await execFileAsync("/usr/bin/sips", ["-s", "format", "jpeg", "-s", "formatOptions", "100", from, "--out", tmp]);
    } catch (err) {
      await rm(tmp, { force: true });
      return { ok: false, reason: `could not be converted by macOS (${firstLine(err.stderr || err.message)})` };
    }
    input = tmp;
  }
  try {
    const data = await sharp(input, { failOn: "none" })
      // No-arg rotate() applies the EXIF orientation flag. Every later op
      // then works on upright pixels, and the flag itself is discarded with
      // the rest of the metadata (GPS included) since we never call
      // withMetadata().
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    await writeFile(to, data, { flag: "wx" });
    return { ok: true, bytesOut: data.length };
  } catch (err) {
    if (err.code === "EEXIST") return { ok: false, reason: "would have replaced a photo that is already there, so it was left alone" };
    return { ok: false, reason: `could not be read as a picture (${firstLine(err.message)})` };
  } finally {
    if (tmp) await rm(tmp, { force: true });
  }
}

/**
 * Add entries to a folder's images.json: created when missing, existing
 * entries and their order untouched, 2-space JSON. A file with a typo is
 * never rewritten; the caller gets { ok: false, where } and tells the owner.
 */
export async function appendEntries(folderAbs, additions) {
  const file = path.join(folderAbs, "images.json");
  let data = {};
  if (existsSync(file)) {
    const parsed = parseOwnerJson(await readFile(file, "utf8"));
    if (!parsed.ok) return { ok: false, where: parsed.where };
    if (parsed.data === null || typeof parsed.data !== "object" || Array.isArray(parsed.data)) {
      return { ok: false, where: "it is not one { } block" };
    }
    data = parsed.data;
  }
  let added = 0;
  for (const [name, entry] of additions) {
    if (Object.hasOwn(data, name)) continue;
    data[name] = entry;
    added += 1;
  }
  if (added > 0) {
    const tmp = `${file}.tmp-${process.pid}`;
    await writeFile(tmp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    await rename(tmp, file);
  }
  return { ok: true, added };
}

/** Move an ingested original to photo-inbox/_done/<same path>. An earlier original of the same name is kept. */
export async function moveToDone(from, inboxRoot) {
  const relPath = path.relative(inboxRoot, from);
  const ext = path.extname(relPath);
  const base = path.join(inboxRoot, "_done", relPath.slice(0, relPath.length - ext.length));
  let target = `${base}${ext}`;
  for (let n = 2; existsSync(target); n += 1) target = `${base}-${n}${ext}`;
  await mkdir(path.dirname(target), { recursive: true });
  try {
    await rename(from, target);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    await copyFile(from, target);
    await rm(from);
  }
  return target;
}

/**
 * Convert every photo in one inbox folder into one destination folder.
 * `nameFor(n)` gives the output file name for sequence number n and
 * `entryFor(fileName, k)` the images.json entry for the k-th new photo.
 */
export async function ingestFolder({ root, inboxRoot, srcDir, outDir, startAt, nameFor, entryFor, dryRun, tmpDir, log }) {
  const sources = await listSourceImages(srcDir);
  if (sources.length === 0) return null;
  const relOut = path.relative(root, outDir).split(path.sep).join("/");
  if (!dryRun) await mkdir(outDir, { recursive: true });

  const done = [];
  const skipped = [];
  let bytesIn = 0;
  let bytesOut = 0;
  let n = startAt;
  for (const source of sources) {
    const from = path.join(srcDir, source);
    const size = (await stat(from)).size;
    if (dryRun) {
      n += 1;
      bytesIn += size;
      done.push({ source, file: nameFor(n) });
      continue;
    }
    // Skip over any number that is somehow taken already, so nothing is replaced.
    let file;
    do {
      n += 1;
      file = nameFor(n);
    } while (existsSync(path.join(outDir, file)));
    const result = await convertPhoto(from, path.join(outDir, file), tmpDir);
    if (!result.ok) {
      n -= 1;
      skipped.push(source);
      log(`    ! ${source} ${result.reason}.`);
      continue;
    }
    bytesIn += size;
    bytesOut += result.bytesOut;
    done.push({ source, file });
    await moveToDone(from, inboxRoot);
  }

  let settings = null;
  if (!dryRun && done.length > 0) {
    settings = await appendEntries(outDir, done.map((d, k) => [d.file, entryFor(d.file, k)]));
    if (!settings.ok) {
      log(`    ! ${relOut}/images.json has a typo (${settings.where}), so the new photos were added without entries; fix the file and they can be described there.`);
    }
  }
  return { relOut, done, skipped, bytesIn, bytesOut, startAt, settings };
}

/** Finish an ingest: rebuild the manifest so the new photos are on the site's lists. */
export function rebuildManifest(root) {
  const result = spawnSync(process.execPath, [MANIFEST, "--root", root], { stdio: "inherit" });
  return result.status ?? 1;
}

export const isMain = (metaUrl) => Boolean(process.argv[1]) && metaUrl === pathToFileURL(path.resolve(process.argv[1])).href;

async function main() {
  const { flags, root, rest: onlySlugs } = parseArgs(process.argv.slice(2));
  const dryRun = flags.has("dry-run");
  const inbox = path.join(root, "photo-inbox");
  const outRoot = path.join(root, "public", "images", "projects");
  const log = console.log;

  if (!existsSync(inbox)) {
    log(`No photo-inbox/ folder here, so there are no project photos to add.`);
    log(`Layout: photo-inbox/<project-slug>/<phase-slug>/your-photos.jpg`);
    return 0;
  }

  let slugs = await listDirs(inbox, NOT_A_PROJECT);
  if (onlySlugs.length > 0) {
    const known = new Set(slugs);
    const missing = onlySlugs.filter((s) => !known.has(s));
    if (missing.length > 0) {
      console.error(`Not in the inbox: ${missing.join(", ")}`);
      return 1;
    }
    slugs = onlySlugs;
  }

  if (dryRun) log("DRY RUN: nothing will be written.\n");

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), "cs-ingest-"));
  let totalIn = 0;
  let totalOut = 0;
  let totalPhotos = 0;
  let totalSkipped = 0;
  const toDescribe = [];
  try {
    for (const slug of slugs) {
      const phases = await listDirs(path.join(inbox, slug));
      const isNew = !existsSync(path.join(outRoot, slug));
      const lines = [];
      for (const phase of phases) {
        const outDir = path.join(outRoot, slug, phase);
        const notes = [];
        const result = await ingestFolder({
          root,
          inboxRoot: inbox,
          srcDir: path.join(inbox, slug, phase),
          outDir,
          startAt: await highestIndex("photo", outDir),
          nameFor: (n) => `photo-${n}.webp`,
          entryFor: () => ({ alt: "" }),
          dryRun,
          tmpDir,
          log: (line) => notes.push(line),
        });
        // Most phase folders are committed placeholders waiting for photos;
        // staying quiet about the empty ones keeps the report to what happened.
        if (!result) continue;
        const { done, skipped, bytesIn, bytesOut, startAt, relOut } = result;
        totalIn += bytesIn;
        totalOut += bytesOut;
        totalPhotos += done.length;
        totalSkipped += skipped.length;
        if (done.length > 0) {
          const appended = startAt > 0 ? `, continuing after photo-${startAt}` : "";
          const saved = dryRun ? "" : ` -> ${mb(bytesOut)}`;
          const range = done.length === 1 ? done[0].file : `${done[0].file} to ${done.at(-1).file}`;
          lines.push(`  ${phase}: ${done.length} photo${done.length === 1 ? "" : "s"} (${mb(bytesIn)}${saved}${appended}) as ${range}`);
          if (!dryRun) toDescribe.push(`${relOut}/images.json`);
        } else {
          lines.push(`  ${phase}: nothing added`);
        }
        lines.push(...notes);
      }
      if (lines.length === 0) continue;
      log(`\n${slug}${isNew ? "  (a new project folder: it has no page until a project with this slug is added to COMPLETED_PROJECT_TEXT in src/lib/constants.ts)" : ""}`);
      for (const line of lines) log(line);
    }
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }

  if (totalPhotos === 0 && totalSkipped === 0) {
    log(`No new project photos. Drop them in photo-inbox/<project-slug>/<phase-slug>/ and run this again.`);
    return 0;
  }
  log(`\n${totalPhotos} project photo${totalPhotos === 1 ? "" : "s"}${dryRun ? " would be added" : ` added: ${mb(totalIn)} -> ${mb(totalOut)}`}${totalSkipped > 0 ? `; ${totalSkipped} skipped (still in the inbox)` : ""}.`);
  if (dryRun || totalPhotos === 0) return 0;
  log(`Originals moved to photo-inbox/_done/. Next: describe each new photo ("alt") in`);
  for (const file of toDescribe) log(`  ${file}`);
  log("");
  return rebuildManifest(root);
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
