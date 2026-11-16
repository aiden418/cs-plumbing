/**
 * Folder discovery of gallery and project photos: src/lib/projects-data.ts,
 * src/lib/gallery-data.ts, scripts/migrate-images-to-folders.mjs and the
 * project-folder notes of scripts/check-images.mjs.
 */
import { after, describe, test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { assembleProject, assembleProjects, COMPLETED_PROJECTS, photoOrNull, cityProofProjects, projectCardData } from "../src/lib/projects-data";
import { buildGalleryItems, GALLERY_ITEMS } from "../src/lib/gallery-data";
import { COMPLETED_PROJECT_TEXT } from "../src/lib/constants";
import { projectStatusLabel } from "../src/lib/projects";
import { applyEdits, constantsEdits, migrate, planImagesJson } from "../scripts/migrate-images-to-folders.mjs";
import { checkImages } from "../scripts/check-images.mjs";
import type { ImageManifest, ImageMeta } from "../src/lib/media-types";
import type { CompletedProjectText } from "../src/lib/types";

const roots: string[] = [];
after(() => {
  for (const dir of roots) rmSync(dir, { recursive: true, force: true });
});
function tempRoot(label: string): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), `cs-folders-${label}-`));
  roots.push(dir);
  return dir;
}
const write = (root: string, rel: string, content: string | Buffer) => {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
};
const jpeg = (root: string, rel: string, shade: number) => {
  mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  return sharp({ create: { width: 30, height: 20, channels: 3, background: { r: shade, g: 10, b: 10 } } }).jpeg().toFile(path.join(root, rel));
};

/** A manifest with the given folders; each entry is [file, settings]. Order is taken as given (the manifest sorts). */
function manifest(folders: Record<string, [string, Partial<ImageMeta>?][]>): ImageManifest {
  const images: Record<string, ImageMeta> = {};
  const collections: Record<string, string[]> = {};
  for (const [folder, files] of Object.entries(folders)) {
    collections[folder] = [];
    for (const [file, settings = {}] of files) {
      const p = `/images/${folder}/${file}`;
      images[p] = { path: p, folder, file, width: 40, height: 30, bytes: 1, sha256: "0", ...settings };
      if (!settings.hidden) collections[folder].push(p);
    }
  }
  return { version: 1, images, folders: Object.keys(folders), collections, trees: {}, slots: {} };
}

const text = (slug: string, phases: string[]): CompletedProjectText => ({
  slug,
  name: slug,
  client: "Client",
  category: "New Construction",
  timeline: "In Progress",
  cost: "On Request",
  description: "Words.",
  phases: phases.map((p) => ({ name: p, slug: p })),
  metaTitle: "t",
  metaDescription: "d",
});

describe("projects-data", () => {
  test("phases read their own folder in manifest order, with alt text and size", () => {
    const m = manifest({ "projects/a/under": [["2.jpg", { alt: "Two" }], ["10.jpg"]] });
    const p = assembleProject(text("a", ["under"]), m);
    assert.deepEqual(p.phases[0].images, [
      { src: "/images/projects/a/under/2.jpg", alt: "Two", width: 40, height: 30 },
      { src: "/images/projects/a/under/10.jpg", alt: "Photo", width: 40, height: 30 },
    ]);
  });

  test("the cover is the photo marked cover, else the first photo of the first phase", () => {
    const marked = manifest({ "projects/a/one": [["1.jpg"]], "projects/a/two": [["5.jpg", { cover: true }]] });
    assert.equal(assembleProject(text("a", ["one", "two"]), marked).coverImage, "/images/projects/a/two/5.jpg");
    const unmarked = manifest({ "projects/a/one": [["1.jpg"]] });
    assert.equal(assembleProject(text("a", ["one"]), unmarked).coverImage, "/images/projects/a/one/1.jpg");
    const inProjectFolder = manifest({ "projects/a": [["cover.jpg", { cover: true }]], "projects/a/one": [["1.jpg"]] });
    const p = assembleProject(text("a", ["one"]), inProjectFolder);
    assert.equal(p.coverImage, "/images/projects/a/cover.jpg");
    assert.equal(p.phases[0].images.length, 1, "a cover outside the phases is the cover only");
  });

  test("an empty, all-hidden or missing phase folder is left off; the project keeps its text", () => {
    const m = manifest({ "projects/a/empty": [], "projects/a/hidden": [["1.jpg", { hidden: true }]], "projects/a/real": [["1.jpg"]] });
    const p = assembleProject(text("a", ["empty", "hidden", "missing", "real"]), m);
    assert.deepEqual(p.phases.map((x) => x.slug), ["real"]);
    const bare = assembleProject(text("b", ["under"]), m);
    assert.deepEqual(bare.phases, []);
    assert.equal(bare.coverImage, "");
    assert.equal(bare.description, "Words.");
    assert.equal(projectStatusLabel(bare), "In progress");
  });

  test("a hidden cover falls back; phases are never combined across projects", () => {
    const m = manifest({ "projects/a/under": [["1.jpg"], ["2.jpg", { cover: true, hidden: true }]], "projects/b/under": [["9.jpg"]] });
    const [a, b] = assembleProjects([text("a", ["under"]), text("b", ["under"])], m);
    assert.equal(a.coverImage, "/images/projects/a/under/1.jpg");
    assert.deepEqual(a.phases[0].images.map((i) => i.src), ["/images/projects/a/under/1.jpg"]);
    assert.deepEqual(b.phases[0].images.map((i) => i.src), ["/images/projects/b/under/9.jpg"]);
  });

  test("photoOrNull: the same path when the file is there and visible, null when absent or hidden", () => {
    const m = manifest({ gallery: [["a.jpg"], ["b.jpg", { hidden: true }]] });
    assert.equal(photoOrNull("/images/gallery/a.jpg", m), "/images/gallery/a.jpg");
    assert.equal(photoOrNull("images/gallery/a.jpg", m), "/images/gallery/a.jpg");
    assert.equal(photoOrNull("/images/gallery/b.jpg", m), null);
    assert.equal(photoOrNull("/images/gallery/gone.jpg", m), null);
  });

  test("the real data: every phase has photos, covers come from the cover flag, In progress is kept", () => {
    assert.equal(COMPLETED_PROJECTS.length, COMPLETED_PROJECT_TEXT.length);
    for (const p of COMPLETED_PROJECTS) {
      assert.ok(p.phases.length > 0 && p.phases.every((ph) => ph.images.length > 0), p.slug);
      assert.ok(p.phases.some((ph) => ph.images.some((i) => i.src === p.coverImage)), `${p.slug} cover is one of its photos`);
    }
    const hangar = COMPLETED_PROJECTS.find((p) => p.slug === "hangar-97-punta-gorda-airport");
    assert.equal(hangar?.coverImage, "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-10.jpg", "a cover that is not the first photo");
    const hansen = COMPLETED_PROJECTS.find((p) => p.slug === "hansen-homes-cape-coral");
    assert.ok(hansen && projectStatusLabel(hansen) === "In progress");
    const card = projectCardData(hansen);
    assert.ok(!JSON.stringify(card).includes("aerial-2.jpg"), "card data carries no phase photo list");
    assert.equal(card.phases[0].photoCount, hansen.phases[0].images.length);
    assert.ok(cityProofProjects("Cape Coral").length > 0);
  });
});

describe("gallery-data", () => {
  test("flat files take category from images.json, sub-folders from their name; id and title fall back", () => {
    const m = manifest({
      gallery: [["b.jpg", { id: "7", alt: "B", title: "Bee", category: "remodel" }], ["hidden.jpg", { hidden: true }]],
      "gallery/commercial": [["new-sink.jpg"]],
    });
    m.trees.gallery = [...m.collections.gallery, ...m.collections["gallery/commercial"]];
    assert.deepEqual(buildGalleryItems(m), [
      { id: "7", src: "/images/gallery/b.jpg", alt: "B", category: "remodel", title: "Bee", width: 40, height: 30 },
      { id: "file:commercial/new-sink", src: "/images/gallery/commercial/new-sink.jpg", alt: "new sink", category: "commercial", title: "new sink", width: 40, height: 30 },
    ]);
  });

  test("the real gallery keeps its 64 photos, unique ids and the old order", () => {
    assert.equal(GALLERY_ITEMS.length, 64);
    assert.equal(new Set(GALLERY_ITEMS.map((g) => g.id)).size, 64);
    const ids = GALLERY_ITEMS.map((g) => g.id);
    assert.equal(ids.indexOf("64"), ids.indexOf("36") + 1, "id 64 still sits after 36, as it did in the old list");
  });
});

const OLD_CONSTANTS = `import type { CompletedProject } from "./types";

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    slug: "demo",
    name: "Demo",
    cost: "$1K", // claim-ok: test
    coverImage: "/images/projects/demo/under/b.jpg",
    phases: [
      {
        name: "Under",
        slug: "under",
        images: [
          { src: "/images/projects/demo/under/a.jpg", alt: "A" },
          { src: "/images/projects/demo/under/b.jpg", alt: "B" },
        ],
      },
    ],
  },
];
`;

describe("migrate-images-to-folders", () => {
  test("splice removes only the photo lists and the cover line; claim-ok lines stay byte-identical", () => {
    const { edits, problems } = constantsEdits(OLD_CONSTANTS);
    assert.deepEqual(problems, []);
    const out = applyEdits(OLD_CONSTANTS, edits);
    assert.ok(!out.includes("images:") && !out.includes("coverImage"));
    assert.ok(out.includes('    cost: "$1K", // claim-ok: test\n'));
    assert.ok(out.includes("COMPLETED_PROJECT_TEXT: CompletedProjectText[]") && out.includes("import type { CompletedProjectText }"));
    const removed = OLD_CONSTANTS.split("\n").length - out.split("\n").length;
    assert.equal(removed, 5, "the four lines of the list and the cover line, nothing else");
  });

  test("plan: order is the old position, cover marks the cover even when it is not first", () => {
    const { files, problems } = planImagesJson({
      projects: [{ slug: "demo", name: "Demo", coverImage: "/images/projects/demo/under/b.jpg", phases: [{ slug: "under", images: [{ src: "/images/projects/demo/under/a.jpg", alt: "A" }, { src: "/images/projects/demo/under/b.jpg", alt: "B" }] }] }],
      gallery: null,
    });
    assert.deepEqual(problems, []);
    assert.deepEqual(files.get("public/images/projects/demo/under/images.json"), { "a.jpg": { alt: "A", order: 1 }, "b.jpg": { alt: "B", order: 2, cover: true } });
    const outside = planImagesJson({ projects: [{ slug: "x", name: "X", coverImage: "/images/gallery/z.jpg", phases: [] }], gallery: null });
    assert.ok(outside.problems.some((p) => p.includes("outside public/images/projects/x/")), "a cover outside the project is reported");
  });

  test("end to end: writes, is idempotent, refuses a differing images.json without --force", async () => {
    const root = tempRoot("migrate");
    write(root, "src/lib/constants.ts", OLD_CONSTANTS);
    write(root, "src/lib/gallery-data.ts", 'export const GALLERY_ITEMS = [\n  { id: "1", src: "/images/gallery/g.jpg", alt: "G", category: "remodel", title: "Gee" },\n];\n');
    await jpeg(root, "public/images/projects/demo/under/a.jpg", 1);
    await jpeg(root, "public/images/projects/demo/under/b.jpg", 2);
    await jpeg(root, "public/images/gallery/g.jpg", 3);
    const quiet = () => {};
    const first = await migrate({ root, jsonOnly: true, log: quiet });
    assert.equal(first.exitCode, 0);
    assert.equal(first.written.length, 2);
    assert.deepEqual(JSON.parse(readFileSync(path.join(root, "public/images/gallery/images.json"), "utf8")), { "g.jpg": { id: "1", alt: "G", title: "Gee", category: "remodel", order: 1 } });
    const again = await migrate({ root, jsonOnly: true, log: quiet });
    assert.equal(again.written.length, 0, "same content is left alone");
    write(root, "public/images/gallery/images.json", '{ "g.jpg": { "alt": "Owner edit" } }\n');
    assert.equal((await migrate({ root, jsonOnly: true, log: quiet })).exitCode, 1, "refused without --force");
    assert.equal((await migrate({ root, jsonOnly: true, force: true, log: quiet })).exitCode, 0);
    const spliced = await migrate({ root, log: quiet });
    assert.equal(spliced.spliced.length, 2);
    assert.ok(!readFileSync(path.join(root, "src/lib/gallery-data.ts"), "utf8").includes("GALLERY_ITEMS"));
    const done = await migrate({ root, log: quiet });
    assert.deepEqual([done.exitCode, done.written.length, done.spliced.length], [0, 0, 0], "a second run after the splice changes nothing");
  });
});

describe("photos:check and project folders", () => {
  test("names a folder with no phase entry, a missing phase folder and the page naming a deleted photo", async () => {
    const root = tempRoot("check");
    write(root, "src/lib/constants.ts", 'export const COMPLETED_PROJECT_TEXT = [{ slug: "demo", phases: [{ slug: "under" }, { slug: "trim" }] }];\n');
    await jpeg(root, "public/images/projects/demo/under/a.jpg", 1);
    await jpeg(root, "public/images/projects/demo/extra/a.jpg", 2);
    await jpeg(root, "public/images/gallery/kept.jpg", 3);
    write(root, "public/images/gallery/images.json", '{ "kept.jpg": { "alt": "Kept" } }\n');
    write(root, "src/components/JobPhotos.tsx", 'export const PHOTOS = ["/images/gallery/gone.jpg"];\n');
    write(root, "src/app/services/repiping/page.tsx", 'import { PHOTOS } from "@/components/JobPhotos";\nexport default PHOTOS;\n');
    const result = await checkImages({ root, useCache: false });
    assert.equal(result.exitCode, 0, result.errors.join("\n"));
    assert.ok(result.notes.some((n) => n.startsWith("public/images/projects/demo/extra is not published") && n.includes('"demo/extra"')), result.notes.join("\n"));
    assert.ok(result.notes.some((n) => n.includes('lists the phase "trim"')));
    assert.ok(result.notes.some((n) => n.includes("/images/gallery/gone.jpg") && n.includes("the /services/repiping page")));
    for (const line of result.notes) assert.ok(!line.includes("\n") && /[.]$/.test(line), `one sentence: ${line}`);
  });
});
