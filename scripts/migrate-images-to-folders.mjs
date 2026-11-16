#!/usr/bin/env node
/**
 * One-off: move the gallery and project photo lists out of source code and
 * next to the photos themselves.
 *
 * Before this ran, every gallery photo was an entry in src/lib/gallery-data.ts
 * and every project-phase photo an entry in `phases[].images` in
 * src/lib/constants.ts. After it, the pages discover the photos from their
 * folders (through the image manifest), and an images.json beside them keeps
 * what used to be typed in code:
 *
 *   public/images/gallery/images.json
 *     { "<file>": { "id", "alt", "title", "category", "order" } }   order = position in the old list
 *   public/images/projects/<slug>/<phase>/images.json
 *     { "<file>": { "alt", "order", "cover"? } }                      cover = the project's coverImage
 *
 * Then it removes the literal lists from the two source files by splicing
 * the exact character ranges the TypeScript parser reports (each phase's
 * `images: [...]`, each project's `coverImage`, and the GALLERY_ITEMS
 * statement); nothing else in those files is re-printed or reformatted.
 *
 *   node scripts/migrate-images-to-folders.mjs              # write images.json files, then splice
 *   node scripts/migrate-images-to-folders.mjs --json-only  # only the images.json files
 *   node scripts/migrate-images-to-folders.mjs --dry-run    # report, write nothing
 *   node scripts/migrate-images-to-folders.mjs --force      # overwrite an images.json that differs
 *
 * Idempotent: an images.json that already holds exactly this content is left
 * alone, one with different content is refused (exit 1) unless --force, and a
 * second run after the splice finds no lists left and changes nothing.
 * Image files are never touched.
 */

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { tsImport } from "tsx/esm/api";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** The exact text an images.json file gets: two-space JSON, keys in a fixed order, newline at the end. */
export function formatImagesJson(entries) {
  return `${JSON.stringify(entries, null, 2)}\n`;
}

/**
 * The images.json contents for the gallery and every project phase, computed
 * from the old lists. Pure: returns { files: Map<relPath, entries>, problems: string[] }.
 */
export function planImagesJson({ projects, gallery }) {
  const files = new Map();
  const problems = [];

  if (gallery) {
    const entries = {};
    gallery.forEach((item, index) => {
      const prefix = "/images/gallery/";
      if (!item.src.startsWith(prefix) || item.src.slice(prefix.length).includes("/")) {
        problems.push(`gallery item ${item.id} (${item.src}) is not directly inside public/images/gallery, so it was not migrated.`);
        return;
      }
      const file = item.src.slice(prefix.length);
      if (Object.hasOwn(entries, file)) {
        problems.push(`gallery lists ${file} twice; only the first entry was kept.`);
        return;
      }
      entries[file] = { id: item.id, alt: item.alt, title: item.title, category: item.category, order: index + 1 };
    });
    files.set("public/images/gallery/images.json", entries);
  }

  for (const project of projects ?? []) {
    const projectDir = `/images/projects/${project.slug}/`;
    let coverPlaced = false;
    for (const phase of project.phases) {
      if (!Array.isArray(phase.images)) continue;
      const folder = `${projectDir}${phase.slug}/`;
      const entries = {};
      phase.images.forEach((img, index) => {
        if (!img.src.startsWith(folder) || img.src.slice(folder.length).includes("/")) {
          problems.push(`${project.slug} / ${phase.slug}: ${img.src} is not inside ${folder}, so it was not migrated.`);
          return;
        }
        const file = img.src.slice(folder.length);
        const entry = { alt: img.alt, order: index + 1 };
        if (img.src === project.coverImage) {
          entry.cover = true;
          coverPlaced = true;
        }
        entries[file] = entry;
      });
      files.set(`public${folder}images.json`, entries);
    }
    if (project.coverImage && !coverPlaced) {
      if (project.coverImage.startsWith(projectDir) && !project.coverImage.slice(projectDir.length).includes("/")) {
        // A cover kept in the project folder itself, outside every phase: it
        // gets its own images.json there and is shown only as the cover.
        const rel = `public${projectDir}images.json`;
        const entries = files.get(rel) ?? {};
        entries[project.coverImage.slice(projectDir.length)] = { alt: project.name, cover: true };
        files.set(rel, entries);
        problems.push(`NOTE ${project.slug}: the cover ${project.coverImage} is outside every phase folder; it was recorded in ${rel} as the cover only.`);
      } else {
        problems.push(`${project.slug}: the cover ${project.coverImage} is outside public/images/projects/${project.slug}/, so no folder can carry it; move the photo into a phase folder and mark it "cover".`);
      }
    }
  }
  return { files, problems };
}

/* ------------------------------------------------------------------ splice */

function lineStart(text, pos) {
  return text.lastIndexOf("\n", pos - 1) + 1;
}

/**
 * Whole lines from the start of `node` through its trailing comma. Refuses
 * (returns null) when anything other than whitespace shares those lines.
 */
function wholeLineRange(text, node, sf) {
  const start = node.getStart(sf);
  let end = node.getEnd();
  const after = text.slice(end).match(/^[ \t]*,?[ \t]*(?:\r?\n|$)/);
  if (!after) return null;
  const from = lineStart(text, start);
  if (text.slice(from, start).trim() !== "") return null;
  end += after[0].length;
  return { start: from, end };
}

const propName = (p) => (p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : undefined);

function findVariable(sf, name) {
  for (const statement of sf.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const decl of statement.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.name.text === name) return { statement, decl };
    }
  }
  return null;
}

/**
 * Edits for src/lib/constants.ts: every `images: [...]` inside a phase and
 * every `coverImage` of COMPLETED_PROJECTS, plus the two type tokens
 * (CompletedProject -> CompletedProjectText, COMPLETED_PROJECTS ->
 * COMPLETED_PROJECT_TEXT). Returns { edits, problems }.
 */
export function constantsEdits(text) {
  const sf = ts.createSourceFile("constants.ts", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits = [];
  const problems = [];
  const found = findVariable(sf, "COMPLETED_PROJECTS");
  if (!found) return { edits, problems, done: Boolean(findVariable(sf, "COMPLETED_PROJECT_TEXT")) };
  const { decl } = found;
  if (!decl.initializer || !ts.isArrayLiteralExpression(decl.initializer)) {
    problems.push("COMPLETED_PROJECTS is not a plain [ ... ] list; nothing was spliced.");
    return { edits, problems };
  }
  const remove = (node, what) => {
    const range = wholeLineRange(text, node, sf);
    if (!range) problems.push(`${what} shares a line with other code; nothing was spliced.`);
    else edits.push({ ...range, insert: "", what });
  };
  for (const project of decl.initializer.elements) {
    if (!ts.isObjectLiteralExpression(project)) continue;
    const slugProp = project.properties.find((p) => propName(p) === "slug");
    const slug = slugProp && ts.isPropertyAssignment(slugProp) && ts.isStringLiteral(slugProp.initializer) ? slugProp.initializer.text : "?";
    for (const prop of project.properties) {
      const name = propName(prop);
      if (name === "coverImage") remove(prop, `${slug} coverImage`);
      if (name !== "phases" || !ts.isPropertyAssignment(prop) || !ts.isArrayLiteralExpression(prop.initializer)) continue;
      for (const phase of prop.initializer.elements) {
        if (!ts.isObjectLiteralExpression(phase)) continue;
        for (const field of phase.properties) {
          if (propName(field) === "images") remove(field, `${slug} phase images`);
        }
      }
    }
  }
  // The type annotation and the export name (tiny token replacements).
  const typeRef = decl.type && ts.isArrayTypeNode(decl.type) ? decl.type.elementType : undefined;
  if (typeRef && ts.isTypeReferenceNode(typeRef) && typeRef.typeName.getText(sf) === "CompletedProject") {
    edits.push({ start: typeRef.getStart(sf), end: typeRef.getEnd(), insert: "CompletedProjectText", what: "type annotation" });
  }
  edits.push({ start: decl.name.getStart(sf), end: decl.name.getEnd(), insert: "COMPLETED_PROJECT_TEXT", what: "export name" });
  for (const statement of sf.statements) {
    if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== "./types") continue;
    const named = statement.importClause?.namedBindings;
    if (!named || !ts.isNamedImports(named)) continue;
    const el = named.elements.find((e) => e.name.text === "CompletedProject");
    if (el) edits.push({ start: el.getStart(sf), end: el.getEnd(), insert: "CompletedProjectText", what: "type import" });
  }
  return { edits, problems };
}

/** Edits for src/lib/gallery-data.ts: the whole GALLERY_ITEMS statement (its comment above stays). */
export function galleryEdits(text) {
  const sf = ts.createSourceFile("gallery-data.ts", text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const found = findVariable(sf, "GALLERY_ITEMS");
  if (!found || !found.decl.initializer || !ts.isArrayLiteralExpression(found.decl.initializer)) return { edits: [], problems: [] };
  const range = wholeLineRange(text, found.statement, sf);
  if (!range) return { edits: [], problems: ["GALLERY_ITEMS shares a line with other code; nothing was spliced."] };
  return { edits: [{ ...range, insert: "", what: "GALLERY_ITEMS list" }], problems: [] };
}

/** Apply non-overlapping edits back to front. */
export function applyEdits(text, edits) {
  const sorted = [...edits].sort((a, b) => b.start - a.start);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].end > sorted[i - 1].start) throw new Error(`overlapping edits: ${sorted[i].what} / ${sorted[i - 1].what}`);
  }
  let out = text;
  for (const e of sorted) out = out.slice(0, e.start) + e.insert + out.slice(e.end);
  return out;
}

/* --------------------------------------------------------------------- run */

async function loadOldData(root) {
  const constantsFile = path.join(root, "src/lib/constants.ts");
  const galleryFile = path.join(root, "src/lib/gallery-data.ts");
  const constantsText = await readFile(constantsFile, "utf8");
  const galleryText = await readFile(galleryFile, "utf8");
  const hasProjectLists = findVariable(ts.createSourceFile("c.ts", constantsText, ts.ScriptTarget.Latest, true), "COMPLETED_PROJECTS") !== null;
  const hasGalleryList = galleryEdits(galleryText).edits.length > 0;
  const projects = hasProjectLists ? (await tsImport(pathToFileURL(constantsFile).href, import.meta.url)).COMPLETED_PROJECTS : null;
  const gallery = hasGalleryList ? (await tsImport(pathToFileURL(galleryFile).href, import.meta.url)).GALLERY_ITEMS : null;
  return { constantsFile, galleryFile, constantsText, galleryText, projects, gallery };
}

export async function migrate({ root = REPO_ROOT, dryRun = false, force = false, jsonOnly = false, log = console.log } = {}) {
  const old = await loadOldData(root);
  const { files, problems } = planImagesJson({ projects: old.projects, gallery: old.gallery });
  const errors = problems.filter((p) => !p.startsWith("NOTE "));
  for (const p of problems) log(p.startsWith("NOTE ") ? `  note: ${p.slice(5)}` : `  x ${p}`);
  if (errors.length > 0) return { exitCode: 1, written: [], spliced: [] };

  // Every listed photo must be on disk; the migration never invents a file.
  for (const [rel, entries] of files) {
    for (const file of Object.keys(entries)) {
      if (!existsSync(path.join(root, path.dirname(rel), file))) {
        log(`  x ${path.dirname(rel)}/${file} is listed in the old data but is not on disk; nothing was written.`);
        return { exitCode: 1, written: [], spliced: [] };
      }
    }
  }

  const written = [];
  const refused = [];
  const plans = [];
  for (const [rel, entries] of [...files].sort((a, b) => a[0].localeCompare(b[0]))) {
    const abs = path.join(root, rel);
    const content = formatImagesJson(entries);
    const current = existsSync(abs) ? await readFile(abs, "utf8") : null;
    if (current === content) continue;
    if (current !== null && !force) {
      refused.push(rel);
      continue;
    }
    plans.push({ abs, rel, content });
  }
  if (refused.length > 0) {
    for (const rel of refused) log(`  x ${rel} already exists with different content; pass --force to overwrite it.`);
    return { exitCode: 1, written: [], spliced: [] };
  }
  for (const { abs, rel, content } of plans) {
    if (!dryRun) await writeFile(abs, content);
    written.push(rel);
  }

  const spliced = [];
  if (!jsonOnly) {
    for (const [file, text, editsOf] of [
      [old.constantsFile, old.constantsText, constantsEdits],
      [old.galleryFile, old.galleryText, galleryEdits],
    ]) {
      const { edits, problems: spliceProblems } = editsOf(text);
      if (spliceProblems.length > 0) {
        for (const p of spliceProblems) log(`  x ${path.relative(root, file)}: ${p}`);
        return { exitCode: 1, written, spliced };
      }
      if (edits.length === 0) continue;
      const removed = edits.filter((e) => e.insert === "").map((e) => text.slice(e.start, e.end));
      if (removed.some((chunk) => chunk.includes("claim-ok"))) {
        log(`  x ${path.relative(root, file)}: a range to remove holds a claim-ok comment; nothing was spliced.`);
        return { exitCode: 1, written, spliced };
      }
      if (!dryRun) await writeFile(file, applyEdits(text, edits));
      spliced.push({ file: path.relative(root, file), edits: edits.length });
    }
  }
  return { exitCode: 0, written, spliced };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const args = new Set(process.argv.slice(2));
  const rootIndex = process.argv.indexOf("--root");
  const root = rootIndex > -1 ? path.resolve(process.argv[rootIndex + 1]) : REPO_ROOT;
  const dryRun = args.has("--dry-run");
  migrate({ root, dryRun, force: args.has("--force"), jsonOnly: args.has("--json-only") })
    .then(({ exitCode, written, spliced }) => {
      const verb = dryRun ? "would write" : "wrote";
      console.log(`migrate-images-to-folders: ${verb} ${written.length} images.json file(s)${written.length ? `:\n    ${written.join("\n    ")}` : ""}`);
      for (const s of spliced) console.log(`migrate-images-to-folders: ${dryRun ? "would splice" : "spliced"} ${s.edits} range(s) in ${s.file}`);
      if (written.length === 0 && spliced.length === 0 && exitCode === 0) console.log("migrate-images-to-folders: nothing to do; the photo lists already live beside the photos.");
      process.exitCode = exitCode;
    })
    .catch((err) => {
      console.error(`migrate-images-to-folders: stopped by an unexpected error: ${err?.stack ?? err}`);
      process.exitCode = 1;
    });
}
