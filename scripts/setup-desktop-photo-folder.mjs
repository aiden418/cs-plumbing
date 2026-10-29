#!/usr/bin/env node
/**
 * Desktop photo folder.
 *
 * Puts "CS Site Photos" on the Desktop as a link to photo-inbox/ in this repo.
 * Dropping a photo on the Desktop folder *is* dropping it in the inbox: one
 * copy of each file, the existing .gitignore keeps raws out of git, and
 * `npm run photos:ingest` picks them up with no extra step.
 *
 *   npm run photos:desktop                        # create or repair the link
 *   npm run photos:desktop -- --name "Job Photos" # a different folder name
 *
 * macOS/Linux get a symlink; Windows gets a directory junction (no admin
 * prompt). Re-running is safe — it fixes a link that was moved or deleted and
 * leaves a correct one alone.
 */

import { lstat, mkdir, readdir, readlink, realpath, rmdir, symlink, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INBOX = path.join(ROOT, "photo-inbox");

/** Phase folders a fresh project starts with. Delete the ones a job doesn't use. */
const TEMPLATE_PHASES = ["before", "underground", "rough-in", "trim-out", "final", "after"];
const GALLERY_CATEGORIES = ["residential", "commercial", "new-construction", "remodel"];

const args = process.argv.slice(2);
const nameIdx = args.indexOf("--name");
const folderName = nameIdx >= 0 && args[nameIdx + 1] ? args[nameIdx + 1] : "CS Site Photos";

const rel = (p) => path.relative(ROOT, p) || ".";

/** The committed scaffold, recreated if any of it was deleted locally. */
async function ensureScaffold() {
  const made = [];
  const keep = async (dir) => {
    const marker = path.join(dir, ".gitkeep");
    if (existsSync(marker)) return;
    await mkdir(dir, { recursive: true });
    await writeFile(marker, "", "utf8");
    made.push(rel(dir));
  };
  for (const phase of TEMPLATE_PHASES) await keep(path.join(INBOX, "_new-project-template", phase));
  for (const cat of GALLERY_CATEGORIES) await keep(path.join(INBOX, "_gallery", cat));
  return made;
}

async function main() {
  if (!existsSync(INBOX)) {
    console.error(`No inbox at ${rel(INBOX)}/ — this script expects to run from a checkout of cs-plumbing.`);
    process.exitCode = 1;
    return;
  }

  const desktop = path.join(os.homedir(), "Desktop");
  if (!existsSync(desktop)) {
    console.error(`No Desktop folder at ${desktop}.`);
    console.error(`Link the inbox by hand instead:  ln -s "${INBOX}" "<wherever>/${folderName}"`);
    process.exitCode = 1;
    return;
  }

  const made = await ensureScaffold();
  if (made.length > 0) console.log(`Recreated ${made.length} missing inbox folder(s): ${made.join(", ")}`);

  const link = path.join(desktop, folderName);
  const linkType = process.platform === "win32" ? "junction" : "dir";

  let existing = null;
  try {
    existing = await lstat(link);
  } catch {
    existing = null;
  }

  if (existing) {
    if (existing.isSymbolicLink()) {
      let target = null;
      try {
        target = await realpath(link);
      } catch {
        target = null; // dangling link
      }
      if (target && path.resolve(target) === path.resolve(await realpath(INBOX))) {
        console.log(`Already set up: ${link} -> ${rel(INBOX)}/`);
        return;
      }
      const was = target ?? (await readlink(link).catch(() => "?"));
      await unlink(link);
      console.log(`Replaced a link that pointed at ${was}`);
    } else if (existing.isDirectory()) {
      const contents = (await readdir(link)).filter((n) => n !== ".DS_Store");
      if (contents.length > 0) {
        console.error(`${link} already exists and has ${contents.length} item(s) in it.`);
        console.error(`Move those into ${rel(INBOX)}/<project-slug>/<phase>/ (or rename the folder) and re-run.`);
        process.exitCode = 1;
        return;
      }
      await rmdir(link);
      console.log(`Removed the empty folder at ${link}`);
    } else {
      console.error(`${link} exists and is not a folder. Rename it and re-run.`);
      process.exitCode = 1;
      return;
    }
  }

  await symlink(INBOX, link, linkType);
  console.log(`Desktop folder ready: ${link}`);
  console.log(`  -> ${INBOX}`);
  console.log(``);
  console.log(`Drop photos into  ${folderName}/<project-slug>/<phase>/  then run:  npm run photos:ingest`);
  console.log(`New project? Duplicate  ${folderName}/_new-project-template  and rename it to the slug.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
