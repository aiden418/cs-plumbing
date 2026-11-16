#!/usr/bin/env node
/**
 * Image check: is everything in public/images safe and ready to publish?
 *
 *   npm run photos:check                    # full report, with the list of photos to describe
 *   node scripts/check-images.mjs --gate    # what the deploy runs (short output)
 *
 * Both modes stop (exit 1) for the same four things, and only for these:
 *
 *   1. a "/images/..." path written in src/ (ts, tsx, js, mjs, json, css) for
 *      a file that is not on disk. Capital letters count, because the live
 *      site's file system is case-sensitive even though a Mac's is not.
 *   2. a slot or crop in src/content/media.json whose picture is missing (or
 *      a media.json that cannot be read at all).
 *   3. a published picture that still carries EXIF camera data, which on a
 *      phone photo includes the GPS position of a customer's home.
 *      `npm run photos:strip` removes it.
 *   4. a HEIC, HEIF, TIFF or PSD file inside public/images: browsers cannot
 *      show them.
 *
 * Everything else is a note that never stops a deploy: a gallery or project
 * photo without alt text, files over 1.5 MB, two covers in one project, an
 * images.json entry for a file that is gone, an empty photo folder.
 *
 * One deliberate softening of rule 1: a folder that has an images.json is an
 * owner-managed collection (the gallery, a project phase). The owner may
 * delete a photo there, and pages resolve those photos through image() in
 * src/lib/media.ts, which simply skips a missing file. A path into such a
 * folder that is still written somewhere in src/ is therefore reported as a
 * note naming the place, not as a failure. A missing picture anywhere else
 * (logo, hero, team, service and area photos) still stops the deploy.
 *
 * This supersedes scripts/check-project-images.mjs (which now forwards here)
 * and the `--check` pass of scripts/strip-image-metadata.mjs.
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  LARGE_FILE_BYTES,
  RASTER_EXT,
  REPO_ROOT,
  VECTOR_EXT,
  analyse,
  compareFileNames,
  comparePaths,
  nameList,
  parseArgs,
} from "./build-image-manifest.mjs";

const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"]);
/** Full URLs on the site's own domain are checked like plain paths (JSON-LD and social-card images). */
const SITE_HOST = /(?:^|\.)csplumbinglee\.com$/i;

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

async function walkSource(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walkSource(full, out);
    else if (SOURCE_EXT.has(path.extname(entry.name).toLowerCase()) && !entry.name.endsWith(".d.ts")) out.push(full);
  }
  return out;
}

/**
 * Every literal picture path in src/ (the generated folder excluded), with
 * the places that name it. A path built with ${...} cannot be resolved
 * without running the code, so it is not checked rather than guessed at.
 */
export async function scanReferences(root) {
  const src = path.join(root, "src");
  const generated = path.join(src, "generated") + path.sep;
  // Slots and crops get their own, clearer message; no need to report them twice.
  const settings = path.join(src, "content", "media.json");
  const refs = new Map();
  const add = (raw, file, line) => {
    let p = raw.split(/[?#]/)[0];
    if (p.includes("${")) return;
    const ext = path.extname(p).toLowerCase();
    if (!RASTER_EXT.has(ext) && !VECTOR_EXT.has(ext)) return;
    if (p.includes("%")) {
      try {
        p = decodeURI(p);
      } catch {
        /* keep the text as written */
      }
    }
    if (!refs.has(p)) refs.set(p, []);
    refs.get(p).push(`${path.relative(root, file).split(path.sep).join("/")} (line ${line})`);
  };
  for (const file of (await walkSource(src)).sort()) {
    if (file.startsWith(generated) || file === settings) continue;
    const text = await readFile(file, "utf8");
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (!line.includes("/images/")) continue;
      for (const m of line.matchAll(/(["'`])(\/images\/[^"'`]+?)\1/g)) add(m[2], file, i + 1);
      for (const m of line.matchAll(/url\(\s*(\/images\/[^)"'`\s]+)\s*\)/g)) add(m[1], file, i + 1);
      for (const m of line.matchAll(/https?:\/\/([a-z0-9.-]+)(\/images\/[^"'`\s)]+)/gi)) {
        if (SITE_HOST.test(m[1])) add(m[2], file, i + 1);
      }
    }
  }
  return refs;
}

const places = (list) => {
  const unique = [...new Set(list)];
  return unique.length <= 2 ? unique.join(" and ") : `${unique[0]} and ${unique.length - 1} more places`;
};

/**
 * Run the whole check. Returns { errors, notes, exitCode, summary }; every
 * error and note is one sentence.
 */
export async function checkImages({ root = REPO_ROOT, gate = false, useCache = true } = {}) {
  const analysis = await analyse({ root, useCache });
  const errors = [];
  const notes = [];

  /* 1. paths written in src/ ------------------------------------------------ */
  const refs = await scanReferences(root);
  const onDisk = new Set();
  for (const f of [...analysis.scan.files, ...analysis.scan.held, ...analysis.scan.unsupported]) onDisk.add(`/images/${f.rel}`);
  const lower = new Map([...onDisk].map((p) => [p.toLowerCase(), p]));
  for (const ref of [...refs.keys()].sort()) {
    if (onDisk.has(ref)) continue;
    const where = places(refs.get(ref));
    const near = lower.get(ref.toLowerCase());
    const folder = path.posix.dirname(ref).replace(/^\/images\/?/, "");
    if (near) {
      errors.push(`${where} names ${ref}, but the file is called ${near}; capital letters matter on the live site, so make the two match.`);
    } else if (analysis.folderState.get(folder) === "ok") {
      notes.push(`${ref} is no longer in its folder but is still named in ${where}; pages skip it, so remove that mention when convenient.`);
    } else {
      errors.push(`${where} names ${ref}, but that file is not in public/images; put the picture back or correct the name.`);
    }
  }

  /* 2. media.json ----------------------------------------------------------- */
  const SLOT_ERRORS = new Set(["media-json-invalid", "slot-invalid", "crop-invalid", "slot-image-missing", "crop-image-missing"]);
  const PASS_THROUGH = new Set([
    "json-invalid",
    "json-shape",
    "json-unknown-key",
    "entry-missing-file",
    "unreadable-file",
    "slot-hidden",
    "crop-clamped",
    "multiple-covers",
  ]);
  for (const problem of analysis.problems) {
    if (SLOT_ERRORS.has(problem.code)) errors.push(problem.message);
    else if (problem.code === "claims") {
      // The manifest step is what stops a build for this; here it is listed so
      // `npm run photos:check` shows everything that needs attention.
      (gate ? notes : errors).push(problem.message);
    } else if (PASS_THROUGH.has(problem.code)) notes.push(problem.message);
  }

  /* 3. EXIF / GPS ----------------------------------------------------------- */
  const carriesData = (r) => r.exif || r.gps;
  for (const record of [...analysis.records.values()].filter(carriesData).sort((a, b) => comparePaths(a.rel, b.rel))) {
    const what = record.gps ? "hidden camera data, including the GPS location where it was taken" : "hidden camera data (EXIF)";
    if (record.exif) {
      errors.push(`public/images/${record.rel} still carries ${what}; run \`npm run photos:strip\` to remove it, then check again.`);
    } else {
      errors.push(`public/images/${record.rel} still carries the GPS location where it was taken, in a form \`npm run photos:strip\` does not remove; export a fresh copy without location data and replace the file.`);
    }
  }
  for (const record of analysis.heldRecords.filter(carriesData).sort((a, b) => comparePaths(a.rel, b.rel))) {
    const what = record.gps ? "hidden camera data, including the GPS location where it was taken" : "hidden camera data (EXIF)";
    errors.push(`public/images/${record.rel} still carries ${what}, and everything inside public/ is published; move it to photo-inbox/ and run \`npm run photos\`.`);
  }

  /* 4. files a browser cannot show ------------------------------------------ */
  for (const file of [...analysis.unsupported].sort((a, b) => comparePaths(a.rel, b.rel))) {
    const fix = /Photoshop/.test(file.what)
      ? "export it as a JPG or PNG and remove this file"
      : "move it to photo-inbox/ and run `npm run photos` to convert it";
    errors.push(`public/images/${file.rel} is ${file.what}, which browsers cannot show; ${fix}.`);
  }

  /* notes ------------------------------------------------------------------- */
  const visible = (r) => !r.settings.hidden && !r.mobileOf;

  // Collection photos nobody has described yet.
  const undescribed = [];
  for (const folder of analysis.folders) {
    if (!analysis.inCollection(folder)) continue;
    const names = (analysis.byFolder.get(folder) ?? [])
      .filter((r) => visible(r) && !r.settings.alt)
      .map((r) => r.file)
      .sort(compareFileNames);
    if (names.length > 0) undescribed.push({ folder, names });
  }
  const undescribedTotal = undescribed.reduce((n, f) => n + f.names.length, 0);
  if (gate) {
    if (undescribedTotal > 0) {
      notes.push(`${plural(undescribedTotal, "photo")} in ${plural(undescribed.length, "folder")} ${undescribedTotal === 1 ? "has" : "have"} no description (alt text) yet; run \`npm run photos:check\` for the list.`);
    }
  } else {
    for (const { folder, names } of undescribed) {
      notes.push(`${plural(names.length, "photo")} in public/images/${folder} ${names.length === 1 ? "has" : "have"} no description (alt text) yet; add "alt" in that folder's images.json for ${nameList(names, 8)}.`);
    }
  }

  // Heavy files: one line, however many there are.
  const large = [...analysis.records.values()].filter((r) => r.kind === "raster" && r.bytes > LARGE_FILE_BYTES).sort((a, b) => b.bytes - a.bytes);
  if (large.length > 0) {
    const top = large[0];
    notes.push(`${plural(large.length, "picture")} ${large.length === 1 ? "is" : "are"} larger than 1.5 MB (the largest is public/images/${top.rel} at ${(top.bytes / 1024 / 1024).toFixed(1)} MB); they still work, but pages load faster when new photos go through \`npm run photos\`.`);
  }

  // Photo folders with nothing to show.
  for (const folder of analysis.folders) {
    if (!analysis.inCollection(folder)) continue;
    const hasChildren = analysis.folders.some((f) => f !== folder && f.startsWith(`${folder}/`));
    if (hasChildren) continue;
    const all = analysis.byFolder.get(folder) ?? [];
    if (all.some(visible)) continue;
    const hidden = all.length === 0 ? "" : all.length === 1 ? " (the one photo in it is hidden)" : ` (all ${all.length} in it are hidden)`;
    notes.push(`public/images/${folder} has no photos to show${hidden}, so its section stays empty until photos are added.`);
  }

  const summary = {
    pictures: analysis.records.size,
    references: refs.size,
    folders: Object.keys(analysis.collections).length,
    undescribed: undescribedTotal,
    large: large.length,
  };
  return { errors, notes, summary, exitCode: errors.length > 0 ? 1 : 0 };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const { flags, root } = parseArgs(process.argv.slice(2));
  const gate = flags.has("gate");
  checkImages({ root, gate, useCache: !flags.has("no-cache") })
    .then(({ errors, notes, summary, exitCode }) => {
      const label = gate ? "image check (deploy gate)" : "image check";
      console.log(`${label}: ${plural(summary.pictures, "picture")} in public/images, ${plural(summary.references, "picture path")} named in src/.`);
      if (errors.length > 0) {
        console.error(`\nFix before publishing (${errors.length}):`);
        for (const line of errors) console.error(`  x ${line}`);
      }
      if (notes.length > 0) {
        console.log(`\nWorth a look, the site still publishes (${notes.length}):`);
        for (const line of notes) console.log(`  - ${line}`);
      }
      console.log(
        errors.length > 0
          ? `\n${label}: ${plural(errors.length, "thing")} to fix before publishing.`
          : `\n${label}: nothing stops publishing.`,
      );
      process.exitCode = exitCode;
    })
    .catch((err) => {
      console.error(`image check: stopped by an unexpected error: ${err?.stack ?? err}`);
      process.exitCode = 1;
    });
}
