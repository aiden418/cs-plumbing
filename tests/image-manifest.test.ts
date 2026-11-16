/**
 * The image system: scripts/build-image-manifest.mjs, src/lib/media.ts,
 * scripts/check-images.mjs, the two ingest scripts and
 * scripts/qa/dump-page-images.mjs.
 *
 * Every fixture is generated into a temp directory and removed afterwards;
 * no test photo ever lands in the repository.
 */
import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
import {
  compareFileNames,
  comparePaths,
  deriveAlt,
  exifHasGps,
  findClaims,
  locateJsonError,
  mobileCropBox,
  naturalCompare,
  needsStaging,
  parseAspect,
  run as runManifest,
  stagedName,
} from "../scripts/build-image-manifest.mjs";
import { checkImages } from "../scripts/check-images.mjs";
import { highestGalleryId } from "../scripts/ingest-gallery-photos.mjs";
import { compareDumps, dumpPageImages, extractImageUrls, srcsetUrls } from "../scripts/qa/dump-page-images.mjs";
import { installMediaStubs } from "./fixtures/media-stubs";
import type { MediaRef, MediaSlot, ImageManifest, ImageMeta } from "../src/lib/media-types";

const REPO = fileURLToPath(new URL("..", import.meta.url));
const SCRIPT = (name: string) => path.join(REPO, "scripts", name);

/* ----------------------------------------------------------------- helpers */

const roots: string[] = [];
function tempRoot(label: string): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), `cs-images-${label}-`));
  roots.push(dir);
  return dir;
}
after(() => {
  for (const dir of roots) rmSync(dir, { recursive: true, force: true });
});

const write = (root: string, rel: string, content: string | Buffer) => {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
  return file;
};
const writeJson = (root: string, rel: string, data: unknown) => write(root, rel, `${JSON.stringify(data, null, 2)}\n`);
const readJson = <T = unknown>(root: string, rel: string) => JSON.parse(readFileSync(path.join(root, rel), "utf8")) as T;
const sha = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const target = (root: string, rel: string) => {
  const file = path.join(root, rel);
  mkdirSync(path.dirname(file), { recursive: true });
  return file;
};

type Rgb = { r: number; g: number; b: number };
const flat = (width: number, height: number, background: Rgb) => sharp({ create: { width, height, channels: 3, background } });

/** A photo whose red channel grows left to right and green top to bottom, so a crop can be located by its colours. */
function gradient(width: number, height: number) {
  const data = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = (y * width + x) * 3;
      data[p] = Math.round((x * 255) / (width - 1));
      data[p + 1] = Math.round((y * 255) / (height - 1));
      data[p + 2] = 128;
    }
  }
  return sharp(data, { raw: { width, height, channels: 3 } });
}

/** A see-through logo: left half fully transparent, right half solid red. */
function halfTransparent(width: number, height: number) {
  const data = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = (y * width + x) * 4;
      const solid = x >= width / 2;
      data[p] = 220;
      data[p + 1] = 20;
      data[p + 2] = 20;
      data[p + 3] = solid ? 255 : 0;
    }
  }
  return sharp(data, { raw: { width, height, channels: 4 } });
}

const GPS_EXIF = {
  IFD0: { Make: "Apple" },
  IFD3: { GPSLatitudeRef: "N", GPSLatitude: "26/1 38/1 0/1", GPSLongitudeRef: "W", GPSLongitude: "81/1 52/1 0/1" },
};

function cli(script: string, root: string, ...args: string[]) {
  const result = spawnSync(process.execPath, [SCRIPT(script), "--root", root, ...args], { encoding: "utf8" });
  const lines = (text: string) => text.split("\n").filter((line) => line.trim() !== "");
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, out: lines(result.stdout), err: lines(result.stderr) };
}

async function manifest(root: string, options: { useCache?: boolean; check?: boolean } = {}) {
  const warnings: string[] = [];
  const outcome = await runManifest({ root, quiet: true, log: () => {}, warn: (line: string) => warnings.push(line), ...options });
  return { ...outcome, warnings };
}

const metaOf = (root: string) => readJson<ImageManifest>(root, "src/generated/images-meta.json");
const registryOf = (root: string) => readFileSync(path.join(root, "src/generated/images.ts"), "utf8");

type Media = {
  image: (path: string, overrides?: Partial<MediaRef> & { blur?: boolean }) => MediaRef | null;
  collection: (folder: string, options?: { deep?: boolean; blur?: boolean }) => MediaRef[];
  slot: (id: string, options?: { blur?: boolean }) => MediaSlot | null;
  imageMeta: (path: string) => ImageMeta | null;
  folders: (parent?: string) => string[];
  altFromFileName: (file: string) => string;
};
/** Load the real src/lib/media.ts against a fixture's generated data. */
async function mediaFor(root: string): Promise<Media> {
  installMediaStubs();
  for (const file of ["media.ts", "media-types.ts"]) {
    copyFileSync(path.join(REPO, "src/lib", file), target(root, `src/lib/${file}`));
  }
  return (await import(pathToFileURL(path.join(root, "src/lib/media.ts")).href)) as Media;
}
const srcOf = (ref: MediaRef | null | undefined) => (ref ? (typeof ref.src === "string" ? ref.src : ref.src.src) : null);

/* ------------------------------------------------------ pure building blocks */

test("natural order: photo-2 before photo-10, the same on every machine", () => {
  const names = ["photo-10.jpg", "photo-2.jpg", "Photo-1.jpg", "photo-02.jpg", "a-2.jpg", "a.jpg", "IMG_0652.jpeg", "IMG_0646.jpeg", "10-last.jpg", "9-first.jpg"];
  assert.deepEqual([...names].sort(compareFileNames), [
    "9-first.jpg",
    "10-last.jpg",
    "a.jpg",
    "a-2.jpg",
    "IMG_0646.jpeg",
    "IMG_0652.jpeg",
    "Photo-1.jpg",
    "photo-02.jpg", // same number as photo-2: the spelling decides, the same way every time
    "photo-2.jpg",
    "photo-10.jpg",
  ]);
  assert.ok(naturalCompare("photo-2", "photo-10") < 0);
  assert.ok(naturalCompare("x99999999999999999999998", "x99999999999999999999999") < 0, "long numbers do not lose precision");
  assert.notEqual(naturalCompare("Photo", "photo"), 0, "two different names never tie");
  assert.deepEqual(
    ["gallery/remodel/a.jpg", "gallery/z.jpg", "projects/10-b/x.jpg", "projects/2-a/x.jpg", "gallery/a.jpg"].sort(comparePaths),
    ["gallery/a.jpg", "gallery/z.jpg", "gallery/remodel/a.jpg", "projects/2-a/x.jpg", "projects/10-b/x.jpg"],
    "a folder's own photos come before its sub-folders",
  );
});

test("derived alt text: file name without a leading number, dashes as spaces", () => {
  assert.equal(deriveAlt("01-front-of-house.webp"), "front of house");
  assert.equal(deriveAlt("photo-12.jpg"), "photo 12");
  assert.equal(deriveAlt("2nd-rough-3.jpg"), "2nd rough 3", "a number that is part of a word stays");
  assert.equal(deriveAlt("IMG_3435.jpeg"), "IMG 3435");
  assert.equal(deriveAlt("123.jpg"), "Photo");
  assert.equal(deriveAlt("C&S Logo.png"), "C&S Logo");
});

test("photo text is held to the same two rules as the page copy", () => {
  const price = ["$", "49"].join("");
  const minutes = `${30} minutes`;
  assert.deepEqual(findClaims(`Water heater special ${price}`).map((h) => h.kind), ["price"]);
  assert.deepEqual(findClaims(`We arrive within ${minutes}`).map((h) => h.kind), ["response time"]);
  assert.deepEqual(findClaims(`A responsive crew, ${15} min away`).map((h) => h.kind), ["response time"], '"responsive" counts, as in the site check');
  assert.deepEqual(findClaims(`Dispatch in ${30}–${60} minutes`).map((h) => h.text), [`${30}–${60} minutes`]);
  assert.deepEqual(findClaims(`Let the glue cure for ${minutes}`), [], "minutes without a response word are fine");
  assert.deepEqual(findClaims("Costs $ave you money, model $X"), [], "a dollar sign without a digit is fine");
  assert.deepEqual(findClaims("Copper water service, 2 inch"), []);
});

test("mobile crop box maths", () => {
  // The seeded home hero: 2400x1800, 4/5, focal point 44% from the left.
  assert.deepEqual(mobileCropBox({ width: 2400, height: 1800, aspect: 4 / 5, focal: [0.44, 0.5] }), { left: 336, top: 0, width: 1440, height: 1800 });
  // Focal point at an edge: the box is pushed back inside the picture.
  assert.deepEqual(mobileCropBox({ width: 2400, height: 1800, aspect: 4 / 5, focal: [0, 0.5] }), { left: 0, top: 0, width: 1440, height: 1800 });
  assert.deepEqual(mobileCropBox({ width: 2400, height: 1800, aspect: 4 / 5, focal: [1, 1] }), { left: 960, top: 0, width: 1440, height: 1800 });
  // A portrait source cut to a landscape shape keeps the full width.
  assert.deepEqual(mobileCropBox({ width: 1000, height: 2000, aspect: 16 / 9, focal: [0.5, 0.25] }), { left: 0, top: 219, width: 1000, height: 563 });
  // Already the right shape: the whole picture.
  assert.deepEqual(mobileCropBox({ width: 800, height: 1000, aspect: 4 / 5 }), { left: 0, top: 0, width: 800, height: 1000 });
  // The box always fits, whatever the numbers.
  for (const [w, h, a, fx, fy] of [[1, 1, 0.8, 0.5, 0.5], [3, 1000, 5, 0.9, 0.9], [1001, 7, 0.01, 0.3, 0.7]] as const) {
    const box = mobileCropBox({ width: w, height: h, aspect: a, focal: [fx, fy] });
    assert.ok(box.left >= 0 && box.top >= 0 && box.width >= 1 && box.height >= 1);
    assert.ok(box.left + box.width <= w && box.top + box.height <= h, JSON.stringify(box));
  }
  assert.equal(parseAspect("4/5"), 0.8);
  assert.equal(parseAspect("4:5"), 0.8);
  assert.equal(parseAspect(0.8), 0.8);
  assert.equal(parseAspect("16 / 9"), 16 / 9);
  assert.ok(Number.isNaN(parseAspect("tall")));
  assert.ok(Number.isNaN(parseAspect("0/5")));
});

test("a JSON typo is located by line and column, in plain words", () => {
  assert.equal(locateJsonError('{ "a.jpg": { "alt": "ok" } }'), null);
  const missingComma = locateJsonError('{\n  "a.jpg": { "alt": "x" }\n  "b.jpg": { "alt": "y" }\n}');
  assert.equal(missingComma?.line, 3);
  assert.equal(missingComma?.column, 3);
  assert.match(missingComma?.message ?? "", /comma/);
  assert.match(locateJsonError('{\n  "a.jpg": { "alt": "x" },\n}')?.message ?? "", /remove the comma/);
  assert.match(locateJsonError("{ 'a.jpg': {} }")?.message ?? "", /double quotes/);
  assert.match(locateJsonError('{ \u201ca.jpg\u201d: {} }')?.message ?? "", /curly quotes/);
  assert.match(locateJsonError('{\n  // my note\n  "a.jpg": {}\n}')?.message ?? "", /_note/);
  assert.equal(locateJsonError('{ "a.jpg": { "alt": "x" }')?.line, 1);
  assert.match(locateJsonError("")?.message ?? "", /ends early/);
});

test("which file names are imported directly and which through a web-safe copy", () => {
  assert.equal(needsStaging("gallery/photo-1.jpg", "jpeg"), false);
  assert.equal(needsStaging("projects/306-seminal-way/2nd-rough/IMG_0945.jpeg", "jpeg"), false);
  assert.equal(needsStaging("logos/C&S Logo.png", "png"), true, "space and ampersand");
  assert.equal(needsStaging("gallery/IMG_4001.JPG", "jpeg"), true, "upper-case ending: the bundler refuses it");
  assert.equal(needsStaging("gallery/bath #2.jpg", "jpeg"), true);
  assert.equal(needsStaging("gallery/caf\u00e9.jpg", "jpeg"), true);
  assert.equal(needsStaging("gallery/really-a-png.jpg", "png"), true, "the ending does not match the contents");
  for (const [rel, format] of [["logos/C&S Logo.png", "png"], ["a/IMG_4001.JPG", "jpeg"], ["a/50% off? #1.jpg", "jpeg"], ["a/\u00e9\u00e9.webp", "webp"]] as const) {
    assert.match(stagedName(rel, format), /^[A-Za-z0-9._-]+\.(?:jpg|png|webp)$/, rel);
  }
  assert.notEqual(stagedName("a/x y.jpg", "jpeg"), stagedName("b/x y.jpg", "jpeg"), "the same name in two folders gets two copies");
});

test("GPS coordinates inside EXIF are recognised", async () => {
  const withGps = await flat(40, 30, { r: 1, g: 2, b: 3 }).withExif(GPS_EXIF).jpeg().toBuffer();
  const withoutGps = await flat(40, 30, { r: 1, g: 2, b: 3 }).withExif({ IFD0: { Make: "Apple" } }).jpeg().toBuffer();
  const a = await sharp(withGps).metadata();
  const b = await sharp(withoutGps).metadata();
  assert.ok(a.exif && b.exif);
  assert.equal(exifHasGps(a.exif), true);
  assert.equal(exifHasGps(b.exif), false);
  assert.equal(exifHasGps(Buffer.from("not exif at all")), false);
});

/* ------------------------------------------------------------ the manifest */

describe("manifest on a small site", () => {
  let root = "";
  let warnings: string[] = [];
  let originals: Record<string, string> = {};

  before(async () => {
    root = tempRoot("site");
    const img = (rel: string) => target(root, `public/images/${rel}`);
    write(root, "public/images/.DS_Store", "finder");
    write(root, "public/images/notes.txt", "not a picture");
    await flat(64, 48, { r: 9, g: 9, b: 9 }).jpeg().toFile(img("_incoming/raw.jpg"));
    await gradient(1200, 900).jpeg({ quality: 95, chromaSubsampling: "4:4:4" }).toFile(img("hero/wide.jpg"));
    await halfTransparent(200, 200).png().toFile(img("logos/C&S Logo.png"));
    await flat(80, 60, { r: 200, g: 180, b: 20 }).jpeg().toFile(img("logos/IMG_77.JPG"));
    write(root, "public/images/brands/mark.svg", '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" fill="#123456"/></svg>');
    for (const [name, colour] of Object.entries({
      "photo-1.jpg": { r: 200, g: 40, b: 40 },
      "photo-2.jpg": { r: 40, g: 200, b: 40 },
      "photo-10.jpg": { r: 40, g: 40, b: 200 },
      "old.jpg": { r: 90, g: 90, b: 90 },
      "01-front-of-house.jpg": { r: 240, g: 240, b: 10 },
    })) {
      await flat(160, 120, colour).jpeg().toFile(img(`gallery/${name}`));
    }
    await flat(160, 120, { r: 250, g: 250, b: 250 }).png().toFile(img("gallery/zebra.png"));
    await flat(160, 120, { r: 10, g: 120, b: 130 }).webp().toFile(img("gallery/remodel/tub.webp"));
    writeJson(root, "public/images/gallery/images.json", {
      _note: "anything starting with an underscore is a note",
      "zebra.png": { order: 1, alt: "Zebra first", caption: "Shown first", title: "Zebra", category: "remodel", id: 7, position: "50% 30%", featured: true },
      "old.jpg": { hidden: true },
      "photo-2.jpg": { cover: true },
      "gone.jpg": { alt: "deleted last week" },
    });
    for (const rel of ["projects/demo/underground/photo-1.jpg", "projects/demo/underground/photo-2.jpg", "projects/demo/final/photo-1.jpg"]) {
      await flat(120, 160, { r: 120, g: 100, b: 80 }).jpeg().toFile(img(rel));
    }
    writeJson(root, "public/images/projects/demo/underground/images.json", { "photo-1.jpg": { cover: true, alt: "Underground rough-in" }, "photo-2.jpg": { alt: "Drain lines" } });
    writeJson(root, "public/images/projects/demo/final/images.json", { "photo-1.jpg": { cover: true } });
    await gradient(400, 200).withMetadata({ orientation: 6 }).jpeg({ quality: 95 }).toFile(img("turned/sideways.jpg"));
    writeJson(root, "src/content/media.json", {
      slots: {
        "home.hero": { image: "/images/hero/wide.jpg", alt: "Hero alt", position: "50% 50%", mobile: { aspect: "4/5", focal: [0.44, 0.5] } },
        "side.shrunk": { image: "/images/hero/wide.jpg", mobile: { aspect: "1/1", focal: [0, 0], maxWidth: 300 } },
        lost: { image: "/images/hero/nope.jpg" },
      },
      crops: {
        "logo.emblem": { image: "/images/logos/C&S Logo.png", box: { left: 50, top: 20, width: 100, height: 60 } },
        "turned.top": { image: "/images/turned/sideways.jpg", box: { left: 0, top: 0, width: 200, height: 100 } },
        later: { image: "/images/hero/wide.jpg", box: { left: 0, top: 0, width: 0, height: 0 } },
      },
    });
    originals = Object.fromEntries(["hero/wide.jpg", "logos/C&S Logo.png", "logos/IMG_77.JPG"].map((rel) => [rel, sha(path.join(root, "public/images", rel))]));
    const first = await manifest(root);
    assert.equal(first.exitCode, 0);
    warnings = first.warnings;
  });

  test("ordering: explicit order first, then natural file-name order; hidden photos drop out", () => {
    const meta = metaOf(root);
    assert.deepEqual(meta.collections.gallery, [
      "/images/gallery/zebra.png",
      "/images/gallery/01-front-of-house.jpg",
      "/images/gallery/photo-1.jpg",
      "/images/gallery/photo-2.jpg",
      "/images/gallery/photo-10.jpg",
    ]);
    assert.deepEqual(meta.trees.gallery, [...meta.collections.gallery, "/images/gallery/remodel/tub.webp"]);
    assert.deepEqual(meta.collections["gallery/remodel"], ["/images/gallery/remodel/tub.webp"]);
    assert.deepEqual(meta.trees["projects/demo"], [
      "/images/projects/demo/final/photo-1.jpg",
      "/images/projects/demo/underground/photo-1.jpg",
      "/images/projects/demo/underground/photo-2.jpg",
    ]);
  });

  test("hidden: kept in the data, never imported, never listed", () => {
    const meta = metaOf(root);
    assert.equal(meta.images["/images/gallery/old.jpg"].hidden, true);
    assert.ok(!meta.collections.gallery.includes("/images/gallery/old.jpg"));
    assert.ok(!registryOf(root).includes("old.jpg"), "a hidden photo gets no import, so no second copy is published");
  });

  test("every setting of an images.json entry reaches the data file", () => {
    const zebra = metaOf(root).images["/images/gallery/zebra.png"];
    assert.deepEqual(
      { alt: zebra.alt, caption: zebra.caption, title: zebra.title, category: zebra.category, id: zebra.id, order: zebra.order, position: zebra.position, featured: zebra.featured },
      { alt: "Zebra first", caption: "Shown first", title: "Zebra", category: "remodel", id: "7", order: 1, position: "50% 30%", featured: true },
    );
    assert.equal(metaOf(root).images["/images/gallery/photo-2.jpg"].cover, true);
    assert.equal(metaOf(root).images["/images/gallery/photo-1.jpg"].alt, undefined, "no entry: no alt in the data, the page derives one");
  });

  test("measurements: size, bytes, fingerprint, colour, transparency, rotation flag applied", () => {
    const meta = metaOf(root);
    const hero = meta.images["/images/hero/wide.jpg"];
    assert.deepEqual([hero.width, hero.height], [1200, 900]);
    assert.equal(hero.bytes, statSync(path.join(root, "public/images/hero/wide.jpg")).size);
    assert.equal(hero.sha256, originals["hero/wide.jpg"].slice(0, 16));
    assert.match(hero.color ?? "", /^#[0-9a-f]{6}$/);
    const solid = meta.images["/images/gallery/photo-1.jpg"];
    const [r, g, b] = [1, 3, 5].map((i) => parseInt((solid.color ?? "").slice(i, i + 2), 16));
    assert.ok(Math.abs(r - 200) < 12 && Math.abs(g - 40) < 12 && Math.abs(b - 40) < 12, `dominant colour of a red photo: ${solid.color}`);
    assert.equal(meta.images["/images/logos/C&S Logo.png"].alpha, true);
    assert.equal(solid.alpha, undefined);
    const turned = meta.images["/images/turned/sideways.jpg"];
    assert.deepEqual([turned.width, turned.height], [200, 400], "a 400x200 file flagged as rotated is 200x400 on screen");
    const vector = meta.images["/images/brands/mark.svg"];
    assert.deepEqual([vector.width, vector.height, vector.vector], [120, 40, true]);
  });

  test("awkward file names are imported through a byte-identical copy with a safe name", () => {
    const registry = registryOf(root);
    const meta = metaOf(root);
    for (const [key, original] of [["/images/logos/C&S Logo.png", "logos/C&S Logo.png"], ["/images/logos/IMG_77.JPG", "logos/IMG_77.JPG"]] as const) {
      const line = registry.split("\n").find((l) => l.includes(`${JSON.stringify(key)}: `));
      assert.ok(line, `${key} is a key of the registry`);
      const id = /: (i\d+),/.exec(line ?? "")?.[1];
      const from = new RegExp(`import ${id} from "(\\./staged/[A-Za-z0-9._-]+)";`).exec(registry)?.[1];
      assert.ok(from, `${key} is imported from src/generated/staged`);
      assert.equal(sha(path.join(root, "src/generated", from ?? "")), originals[original], "the copy has the same bytes");
      assert.equal(sha(path.join(root, "public/images", original)), originals[original], "the original is untouched");
      assert.equal(meta.images[key].file, path.basename(original), "the data keeps the real file name");
    }
    assert.match(registry, /from "\.\/staged\/IMG_77-[0-9a-f]{6}\.jpg"/, "an upper-case ending becomes lower-case in the copy");
    assert.match(registry, /import i\d+ from "\.\.\/\.\.\/public\/images\/gallery\/photo-1\.jpg";/, "a plain name is imported straight from public/");
  });

  test("only pictures are published: no dot files, no text files, no _incoming, no SVG import", () => {
    const meta = metaOf(root);
    const registry = registryOf(root);
    const paths = Object.keys(meta.images);
    assert.ok(!paths.some((p) => p.includes("_incoming") || p.includes(".DS_Store") || p.endsWith(".txt")));
    assert.ok(!registry.includes("_incoming"));
    assert.ok(!registry.includes("mark.svg"));
    assert.ok(paths.includes("/images/brands/mark.svg"), "an SVG is listed in the data");
    assert.ok(!meta.folders.includes("_incoming"));
  });

  test("the phone crop of a slot is a crop and nothing else", async () => {
    const meta = metaOf(root);
    const expected = mobileCropBox({ width: 1200, height: 900, aspect: 4 / 5, focal: [0.44, 0.5] });
    assert.deepEqual(expected, { left: 168, top: 0, width: 720, height: 900 });
    assert.equal(meta.slots["home.hero"].mobile, "derived:home.hero.mobile");
    const entry = meta.images["derived:home.hero.mobile"];
    assert.deepEqual(entry.box, expected);
    assert.deepEqual([entry.width, entry.height, entry.source], [720, 900, "/images/hero/wide.jpg"]);

    const file = path.join(root, "src/generated/derived/home.hero.mobile.jpg");
    const info = await sharp(file).metadata();
    assert.deepEqual([info.format, info.width, info.height, info.chromaSubsampling], ["jpeg", 720, 900, "4:4:4"], "same size as the box, same chroma sampling as the source");
    assert.equal(Boolean(info.exif), false);
    // Pixel for pixel the same region as the original (JPEG quality 90 re-encode only).
    const original = await sharp(path.join(root, "public/images/hero/wide.jpg")).extract(expected).raw().toBuffer();
    const cropped = await sharp(file).raw().toBuffer();
    let worst = 0;
    for (let i = 0; i < original.length; i += 1) worst = Math.max(worst, Math.abs(original[i] - cropped[i]));
    assert.ok(worst <= 8, `largest channel difference ${worst}`);
    assert.match(registryOf(root), /import i\d+ from "\.\/derived\/home\.hero\.mobile\.jpg";/);
  });

  test("maxWidth shrinks a crop and never enlarges it", async () => {
    const meta = metaOf(root);
    // 1/1 from 1200x900 is 900x900; maxWidth 300 brings it to 300x300.
    const shrunk = meta.images["derived:side.shrunk.mobile"];
    assert.deepEqual([shrunk.width, shrunk.height], [300, 300]);
    assert.deepEqual(shrunk.box, { left: 0, top: 0, width: 900, height: 900 });
    // The hero crop is 720 wide with no maxWidth: it stays 720, it is not blown up.
    assert.equal(meta.images["derived:home.hero.mobile"].width, 720);
  });

  test("a PNG crop keeps its transparency", async () => {
    const meta = metaOf(root);
    const entry = meta.images["derived:logo.emblem"];
    assert.deepEqual([entry.width, entry.height, entry.alpha], [100, 60, true]);
    const file = path.join(root, "src/generated/derived/logo.emblem.png");
    const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.channels, 4);
    const pixel = (x: number, y: number) => [...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4)];
    assert.equal(pixel(10, 10)[3], 0, "source x=60 is in the see-through half");
    assert.deepEqual(pixel(90, 10), [220, 20, 20, 255], "source x=140 is solid red, unchanged");
  });

  test("a crop box is measured on the upright picture", async () => {
    const info = await sharp(path.join(root, "src/generated/derived/turned.top.jpg")).metadata();
    assert.deepEqual([info.width, info.height], [200, 100]);
    assert.equal(info.orientation, undefined, "the crop carries no rotation flag");
  });

  test("an empty crop box makes nothing, a missing slot picture leaves the slot out", () => {
    const meta = metaOf(root);
    assert.equal(meta.images["derived:later"], undefined);
    assert.equal(meta.slots.lost, undefined);
    assert.ok(warnings.some((w) => w.includes('"lost"') && w.includes("/images/hero/nope.jpg")));
  });

  test("warnings, one line each: entry for a missing file, two covers in one project", () => {
    const missing = warnings.filter((w) => w.includes('"gone.jpg"'));
    assert.equal(missing.length, 1);
    assert.match(missing[0], /public\/images\/gallery\/images\.json mentions "gone\.jpg", but that file is not in the folder/);
    const covers = warnings.filter((w) => w.includes('marked "cover"'));
    assert.equal(covers.length, 1, "the gallery has one cover; the project has two");
    assert.match(covers[0], /public\/images\/projects\/demo has 2 photos marked "cover"/);
    for (const line of warnings) assert.ok(!line.includes("\n"), "one line per message");
  });

  test("deterministic: a second run and a run without the cache write the same bytes", async () => {
    const files = ["src/generated/images.ts", "src/generated/images-meta.json", "src/generated/image-types.d.ts", "src/generated/derived/home.hero.mobile.jpg", "src/generated/derived/logo.emblem.png"];
    const snapshot = () => Object.fromEntries(files.map((f) => [f, sha(path.join(root, f))]));
    const first = snapshot();
    const warm = await manifest(root);
    assert.deepEqual(warm.changed, [], "nothing is rewritten when nothing changed");
    assert.equal(warm.measured, 0, "a warm run opens no picture");
    assert.deepEqual(snapshot(), first);
    rmSync(path.join(root, "src/generated"), { recursive: true });
    rmSync(path.join(root, "node_modules"), { recursive: true });
    const cold = await manifest(root, { useCache: false });
    assert.ok(cold.measured > 0);
    assert.deepEqual(snapshot(), first, "rebuilt from nothing, byte for byte the same");
    const text = readFileSync(path.join(root, "src/generated/images-meta.json"), "utf8");
    assert.ok(!/\d{4}-\d{2}-\d{2}T/.test(text) && !text.includes(root), "no timestamps, no machine paths");
  });

  test("--check: exit 0 when fresh, exit 1 and no writes when stale", async () => {
    assert.equal(cli("build-image-manifest.mjs", root, "--check", "--quiet").status, 0);
    const before = sha(path.join(root, "src/generated/images-meta.json"));
    await flat(50, 50, { r: 1, g: 1, b: 1 }).jpeg().toFile(path.join(root, "public/images/gallery/photo-3.jpg"));
    const stale = cli("build-image-manifest.mjs", root, "--check", "--quiet");
    assert.equal(stale.status, 1);
    assert.match(stale.stderr, /out of date/);
    assert.equal(sha(path.join(root, "src/generated/images-meta.json")), before, "check mode writes nothing");
    assert.equal(cli("build-image-manifest.mjs", root, "--quiet").status, 0);
    assert.equal(cli("build-image-manifest.mjs", root, "--check", "--quiet").status, 0);
    assert.deepEqual(metaOf(root).collections.gallery.slice(-3), ["/images/gallery/photo-2.jpg", "/images/gallery/photo-3.jpg", "/images/gallery/photo-10.jpg"], "a new file lands in natural order");
  });

  test("replacing a file under the same name changes its fingerprint; deleting it is only a warning", async () => {
    const file = path.join(root, "public/images/gallery/photo-1.jpg");
    const before = metaOf(root).images["/images/gallery/photo-1.jpg"].sha256;
    await flat(160, 120, { r: 5, g: 5, b: 5 }).jpeg().toFile(file);
    await manifest(root);
    const afterReplace = metaOf(root).images["/images/gallery/photo-1.jpg"];
    assert.notEqual(afterReplace.sha256, before);
    assert.equal(afterReplace.sha256, sha(file).slice(0, 16));

    rmSync(path.join(root, "public/images/gallery/zebra.png"));
    const result = cli("build-image-manifest.mjs", root, "--quiet");
    assert.equal(result.status, 0);
    assert.ok(result.err.some((l) => l.includes('"zebra.png"') && l.includes("not in the folder")));
    assert.equal(metaOf(root).images["/images/gallery/zebra.png"], undefined);
    assert.ok(!metaOf(root).collections.gallery.includes("/images/gallery/zebra.png"));
  });

  test("src/lib/media.ts: image, collection, slot, imageMeta", async () => {
    const media = await mediaFor(root);
    const meta = metaOf(root);

    const second = media.image("/images/gallery/photo-2.jpg");
    assert.ok(second);
    assert.equal(srcOf(second), "/_next/static/media/photo-2.jpg", "a statically imported picture");
    assert.deepEqual([second.width, second.height, second.path], [160, 120, "/images/gallery/photo-2.jpg"]);
    assert.equal(second.alt, "photo 2", "no description yet: derived from the file name");
    assert.equal(second.color, meta.images["/images/gallery/photo-2.jpg"].color);
    assert.deepEqual(second.src, { src: "/_next/static/media/photo-2.jpg", width: 160, height: 120 }, "lean by default: no blur placeholder travels to the browser");
    assert.equal(second.blurDataURL, undefined);
    const blurred = media.image("/images/gallery/photo-2.jpg", { blur: true });
    assert.ok(blurred?.blurDataURL, "the blur placeholder is there when asked for");
    assert.ok(typeof blurred.src !== "string" && blurred.src.blurDataURL === blurred.blurDataURL);
    assert.ok(media.collection("gallery", { blur: true }).every((r) => r.blurDataURL));
    assert.ok(media.collection("gallery").every((r) => r.blurDataURL === undefined));
    assert.ok(media.slot("home.hero", { blur: true })?.mobile?.blurDataURL);
    const turned = media.image("/images/turned/sideways.jpg");
    assert.deepEqual([turned?.width, turned?.height, typeof turned?.src !== "string" && turned?.src.width], [200, 400, 200], "the displayed size, also inside src");
    assert.equal(media.image("images/gallery/photo-2.jpg")?.path, second.path, "the leading slash is optional");

    assert.equal(media.image("/images/gallery/old.jpg"), null, "hidden");
    assert.equal(media.image("/images/gallery/never-existed.jpg"), null, "absent");
    assert.equal(media.image("__proto__"), null);
    assert.equal(media.imageMeta("/images/gallery/old.jpg")?.hidden, true, "imageMeta still describes a hidden photo");
    assert.equal(media.imageMeta("/images/nope.jpg"), null);

    const override = media.image("/images/gallery/photo-2.jpg", { alt: "", position: "10% 20%", caption: "Custom" });
    assert.deepEqual([override?.alt, override?.position, override?.caption], ["", "10% 20%", "Custom"], "an empty alt marks a decorative repeat");

    const logo = media.image("/images/logos/C&S Logo.png");
    assert.match(srcOf(logo) ?? "", /^\/_next\/static\/media\/C-S-Logo-[0-9a-f]{6}\.png$/);
    assert.equal(logo?.color, undefined, "no placeholder colour behind a see-through picture");
    assert.equal(logo?.alt, "C&S Logo");

    const vector = media.image("/images/brands/mark.svg");
    assert.deepEqual([vector?.src, vector?.width, vector?.height, vector?.blurDataURL], ["/images/brands/mark.svg", 120, 40, undefined]);

    assert.deepEqual(media.collection("gallery").map((r) => r.path), meta.collections.gallery);
    assert.deepEqual(media.collection("/images/gallery/").map((r) => r.path), meta.collections.gallery, "folder spelling is forgiving");
    assert.deepEqual(media.collection("gallery", { deep: true }).map((r) => r.path), meta.trees.gallery);
    assert.deepEqual(media.collection("no-such-folder"), []);
    assert.deepEqual(media.collection("projects/demo"), [], "a project folder has no photos of its own");
    assert.equal(media.collection("projects/demo", { deep: true }).length, 3);
    assert.deepEqual(media.folders("projects/demo"), ["projects/demo/final", "projects/demo/underground"]);
    assert.equal(media.collection("projects/demo/underground")[0].alt, "Underground rough-in");

    const hero = media.slot("home.hero");
    assert.ok(hero?.mobile);
    assert.deepEqual([hero.alt, hero.desktop.alt, hero.desktop.position, hero.desktop.path], ["Hero alt", "Hero alt", "50% 50%", "/images/hero/wide.jpg"]);
    assert.deepEqual([hero.mobile.width, hero.mobile.height, hero.mobile.alt, hero.mobile.path], [720, 900, "Hero alt", "derived:home.hero.mobile"]);
    assert.equal(srcOf(hero.mobile), "/_next/static/media/home.hero.mobile.jpg");
    assert.equal(media.slot("lost"), null, "its picture is missing");
    assert.equal(media.slot("never-declared"), null);

    const emblem = media.image("derived:logo.emblem");
    assert.deepEqual([emblem?.width, emblem?.height, emblem?.alt, emblem?.color], [100, 60, "C&S Logo", undefined], "a crop is described like its source");

    for (const name of ["01-front-of-house.webp", "photo-12.jpg", "2nd-rough-3.jpg", "IMG_3435.jpeg", "123.jpg", "C&S Logo.png", "a_b-c.png", "  .jpg"]) {
      assert.equal(media.altFromFileName(name), deriveAlt(name), `${name}: page and script agree`);
    }
  });
});

describe("an owner's own phone cut beside a slot picture", () => {
  test('"<name>-mobile.<ext>" is used for phones, no crop is generated, and it stays out of the folder list', async () => {
    const root = tempRoot("sibling");
    await gradient(800, 600).jpeg().toFile(target(root, "public/images/home/hero.jpg"));
    await flat(400, 500, { r: 3, g: 3, b: 3 }).png().toFile(target(root, "public/images/home/hero-mobile.png"));
    await flat(100, 100, { r: 9, g: 9, b: 9 }).jpeg().toFile(target(root, "public/images/home/other-mobile.jpg"));
    writeJson(root, "src/content/media.json", { slots: { hero: { image: "/images/home/hero.jpg", mobile: { aspect: "4/5", focal: [0.5, 0.5], position: "50% 20%" } } }, crops: {} });
    assert.equal((await manifest(root)).exitCode, 0);
    const meta = metaOf(root);
    assert.deepEqual(meta.slots.hero, { image: "/images/home/hero.jpg", mobile: "/images/home/hero-mobile.png", mobilePosition: "50% 20%" });
    assert.equal(meta.images["/images/home/hero-mobile.png"].mobileOf, "/images/home/hero.jpg");
    assert.deepEqual(meta.collections.home, ["/images/home/hero.jpg", "/images/home/other-mobile.jpg"], "only the slot's own phone cut is left out");
    assert.equal(existsSync(path.join(root, "src/generated/derived/hero.mobile.jpg")), false);
    const media = await mediaFor(root);
    const hero = media.slot("hero");
    assert.deepEqual([hero?.mobile?.path, hero?.mobile?.width, hero?.mobile?.height, hero?.mobile?.position], ["/images/home/hero-mobile.png", 400, 500, "50% 20%"]);

    // Take the owner's cut away again: the generated crop comes back.
    rmSync(path.join(root, "public/images/home/hero-mobile.png"));
    await manifest(root);
    assert.equal(metaOf(root).slots.hero.mobile, "derived:hero.mobile");
    const crop = path.join(root, "src/generated/derived/hero.mobile.jpg");
    assert.ok(existsSync(crop));
    assert.deepEqual(metaOf(root).images["derived:hero.mobile"].box, { left: 160, top: 0, width: 480, height: 600 });

    // Move the focal point in media.json: the crop is cut again from the new place.
    const first = sha(crop);
    writeJson(root, "src/content/media.json", { slots: { hero: { image: "/images/home/hero.jpg", mobile: { aspect: "4/5", focal: [0.9, 0.5] } } }, crops: {} });
    await manifest(root);
    assert.deepEqual(metaOf(root).images["derived:hero.mobile"].box, { left: 320, top: 0, width: 480, height: 600 });
    const second = sha(crop);
    assert.notEqual(second, first);

    // Replace the picture under the same name: the crop follows it.
    await gradient(1000, 1000).jpeg().toFile(path.join(root, "public/images/home/hero.jpg"));
    await manifest(root);
    const entry = metaOf(root).images["derived:hero.mobile"];
    assert.deepEqual([entry.width, entry.height], [800, 1000]);
    assert.notEqual(sha(crop), second);

    // Remove the slot: its crop is cleaned up.
    writeJson(root, "src/content/media.json", { slots: {}, crops: {} });
    await manifest(root);
    assert.equal(existsSync(crop), false);
    assert.equal(metaOf(root).images["derived:hero.mobile"], undefined);
  });
});

describe("mistakes in images.json fail softly", () => {
  test("invalid JSON: one line naming the file and the position, exit 0, photos still listed", async () => {
    const root = tempRoot("badjson");
    for (const name of ["photo-10.jpg", "photo-2.jpg", "photo-1.jpg"]) await flat(40, 30, { r: 7, g: 7, b: 7 }).jpeg().toFile(target(root, `public/images/gallery/${name}`));
    write(root, "public/images/gallery/images.json", '{\n  "photo-1.jpg": { "alt": "First", "hidden": true }\n  "photo-2.jpg": { "alt": "Second" }\n}\n');
    const result = cli("build-image-manifest.mjs", root, "--quiet");
    assert.equal(result.status, 0, "a typo must never take the site down");
    assert.equal(result.out.length, 0);
    assert.equal(result.err.length, 1, `exactly one line, got:\n${result.stderr}`);
    assert.match(result.err[0], /public\/images\/gallery\/images\.json has a typo \(line 3, column 3: /);
    const meta = metaOf(root);
    assert.deepEqual(meta.collections.gallery, ["/images/gallery/photo-1.jpg", "/images/gallery/photo-2.jpg", "/images/gallery/photo-10.jpg"], "all photos publish, in file-name order");
    assert.equal(meta.images["/images/gallery/photo-1.jpg"].alt, undefined, "that folder's settings are skipped");
  });

  test("wrong shapes lose only the one setting; unknown settings are named", async () => {
    const root = tempRoot("shapes");
    for (const name of ["a.jpg", "b.jpg", "c.jpg"]) await flat(40, 30, { r: 7, g: 7, b: 7 }).jpeg().toFile(target(root, `public/images/gallery/${name}`));
    writeJson(root, "public/images/gallery/images.json", {
      "a.jpg": { alt: "Kept", order: "two", hidden: "yes", captoin: "typo" },
      "b.jpg": "just text",
      "c.jpg": { order: "2", hidden: "false", cover: "true", alt: "   " },
      "A.JPG": { alt: "wrong capitals" },
    });
    const { exitCode, warnings } = await manifest(root);
    assert.equal(exitCode, 0);
    const meta = metaOf(root);
    assert.equal(meta.images["/images/gallery/a.jpg"].alt, "Kept");
    assert.equal(meta.images["/images/gallery/a.jpg"].order, undefined);
    assert.equal(meta.images["/images/gallery/a.jpg"].hidden, undefined);
    assert.deepEqual([meta.images["/images/gallery/c.jpg"].order, meta.images["/images/gallery/c.jpg"].cover, meta.images["/images/gallery/c.jpg"].hidden], [2, true, undefined], '"2" and "true" written as text are understood');
    assert.equal(meta.images["/images/gallery/c.jpg"].alt, undefined, "blank text counts as not set");
    assert.ok(warnings.some((w) => w.includes('"order" for "a.jpg" must be a number')));
    assert.ok(warnings.some((w) => w.includes('"hidden" for "a.jpg" must be true or false')));
    assert.ok(warnings.some((w) => w.includes('"captoin"') && w.includes("not a setting")));
    assert.ok(warnings.some((w) => w.includes('the entry for "b.jpg" must be a { } block')));
    assert.ok(warnings.some((w) => w.includes('"A.JPG"') && w.includes('"a.jpg"') && w.includes("capital letters matter")));
  });

  test("a price or a response time in photo text fails the step and is never published", async () => {
    const root = tempRoot("claims");
    await flat(40, 30, { r: 7, g: 7, b: 7 }).jpeg().toFile(target(root, "public/images/gallery/a.jpg"));
    const price = ["$", "49"].join("");
    writeJson(root, "public/images/gallery/images.json", { "a.jpg": { alt: "Water heater", caption: `Tune-up for ${price} this month` } });
    const priced = cli("build-image-manifest.mjs", root, "--quiet");
    assert.equal(priced.status, 1);
    assert.equal(priced.err.length, 1);
    assert.ok(priced.err[0].includes("public/images/gallery/images.json"), "names the file");
    assert.ok(priced.err[0].includes('"caption" for "a.jpg"'), "names the key");
    assert.ok(priced.err[0].includes(price));
    const meta = metaOf(root);
    assert.equal(meta.images["/images/gallery/a.jpg"].caption, undefined, "the offending text is left out of the generated data");
    assert.equal(meta.images["/images/gallery/a.jpg"].alt, "Water heater");

    writeJson(root, "public/images/gallery/images.json", { "a.jpg": { title: `We arrive within ${30} minutes` } });
    const timed = cli("build-image-manifest.mjs", root, "--quiet");
    assert.equal(timed.status, 1);
    assert.ok(timed.err[0].includes('"title" for "a.jpg"') && timed.err[0].includes("response time"));

    writeJson(root, "src/content/media.json", { slots: { hero: { image: "/images/gallery/a.jpg", alt: `From ${price}` } }, crops: {} });
    writeJson(root, "public/images/gallery/images.json", { "a.jpg": { alt: `Let the primer dry ${15} minutes` } });
    const slotted = cli("build-image-manifest.mjs", root, "--quiet");
    assert.equal(slotted.status, 1, "slot alt text in media.json is checked too");
    assert.ok(slotted.err[0].includes("src/content/media.json") && slotted.err[0].includes('"hero"'));

    writeJson(root, "src/content/media.json", { slots: { hero: { image: "/images/gallery/a.jpg", alt: "A water heater" } }, crops: {} });
    assert.equal(cli("build-image-manifest.mjs", root, "--quiet").status, 0, "minutes without a response word are allowed");
  });

  test("a media.json typo prints one line, leaves the slots empty and still exits 0", async () => {
    const root = tempRoot("badmedia");
    await flat(40, 30, { r: 7, g: 7, b: 7 }).jpeg().toFile(target(root, "public/images/hero/a.jpg"));
    write(root, "src/content/media.json", '{ "slots": { "hero": { "image": "/images/hero/a.jpg", } } }');
    const result = cli("build-image-manifest.mjs", root, "--quiet");
    assert.equal(result.status, 0);
    assert.equal(result.err.length, 1);
    assert.match(result.err[0], /src\/content\/media\.json has a typo \(line 1, column \d+: remove the comma/);
    assert.deepEqual(metaOf(root).slots, {});
    assert.deepEqual(metaOf(root).collections.hero, ["/images/hero/a.jpg"], "the photos themselves still publish");
  });

  test("a file that is not really a picture is left off the site instead of breaking the build", async () => {
    const root = tempRoot("unreadable");
    await flat(40, 30, { r: 7, g: 7, b: 7 }).jpeg().toFile(target(root, "public/images/gallery/good.jpg"));
    write(root, "public/images/gallery/broken.jpg", "this is not a jpeg");
    write(root, "public/images/gallery/empty.png", "");
    await flat(40, 30, { r: 7, g: 7, b: 7 }).png().toFile(target(root, "public/images/gallery/really-png.jpg"));
    const { exitCode, warnings } = await manifest(root);
    assert.equal(exitCode, 0);
    assert.deepEqual(metaOf(root).collections.gallery, ["/images/gallery/good.jpg", "/images/gallery/really-png.jpg"]);
    assert.equal(warnings.filter((w) => w.includes("cannot be opened as a picture")).length, 2);
    assert.match(registryOf(root), /from "\.\/staged\/really-png-[0-9a-f]{6}\.png"/, "a PNG named .jpg is imported under its real type");
  });

  test("edge cases: no pictures at all, no media.json, a picture at the top level, an accented name", async () => {
    const empty = tempRoot("empty");
    assert.equal((await manifest(empty)).exitCode, 0);
    assert.deepEqual(metaOf(empty).images, {});
    assert.deepEqual(metaOf(empty).slots, {});
    assert.match(registryOf(empty), /export const IMAGES: Record<string, StaticImageData> = \{\n\};/);
    assert.equal(cli("check-images.mjs", empty, "--gate").status, 0);

    const root = tempRoot("edge");
    await flat(40, 30, { r: 7, g: 7, b: 7 }).jpeg().toFile(target(root, "public/images/top.jpg"));
    // "café" stored with a separate accent character, described in images.json with the single-character spelling.
    await flat(40, 30, { r: 8, g: 7, b: 7 }).jpeg().toFile(target(root, "public/images/menu/café.jpg"));
    writeJson(root, "public/images/menu/images.json", { "café.jpg": { alt: "Coffee menu" } });
    const { exitCode, warnings } = await manifest(root);
    assert.equal(exitCode, 0);
    assert.deepEqual(warnings, []);
    const meta = metaOf(root);
    assert.deepEqual(meta.collections[""], ["/images/top.jpg"]);
    assert.equal(meta.collections.menu.length, 1);
    assert.equal(meta.images[meta.collections.menu[0]].alt, "Coffee menu", "either spelling of an accented name matches");
    assert.match(registryOf(root), /from "\.\/staged\/cafe?-[0-9a-f]{6}\.jpg"/, "and it is imported under a plain name");
    const media = await mediaFor(root);
    assert.deepEqual(media.collection("").map((r) => r.path), ["/images/top.jpg"]);
    assert.deepEqual(media.folders(), ["", "menu"]);
  });
});

/* --------------------------------------------------------------- the check */

describe("check-images", () => {
  let root = "";

  before(async () => {
    root = tempRoot("check");
    const img = (rel: string) => target(root, `public/images/${rel}`);
    await flat(60, 40, { r: 1, g: 2, b: 3 }).jpeg().toFile(img("hero/wide.jpg"));
    await flat(60, 40, { r: 1, g: 2, b: 3 }).jpeg().toFile(img("team/Sam.jpg"));
    await flat(60, 40, { r: 9, g: 2, b: 3 }).jpeg().toFile(img("gallery/kept.jpg"));
    await flat(60, 40, { r: 9, g: 9, b: 3 }).jpeg().toFile(img("gallery/undescribed.jpg"));
    await flat(60, 40, { r: 9, g: 9, b: 9 }).jpeg().toFile(img("projects/demo/final/photo-1.jpg"));
    writeJson(root, "public/images/gallery/images.json", { "kept.jpg": { alt: "Described" }, "gone.jpg": { alt: "Deleted" } });
    writeJson(root, "src/content/media.json", { slots: { "home.hero": { image: "/images/hero/wide.jpg", alt: "Hero" } }, crops: {} });
    write(
      root,
      "src/app/page.tsx",
      [
        'export const HERO = "/images/hero/wide.jpg";',
        "export const area = (slug: string) => `/images/areas/${slug}.jpg`;",
        'export const SPACED = "/images/gallery/kept.jpg?v=1#top";',
        'export const GALLERY_PICK = "/images/gallery/gone.jpg";',
        "",
      ].join("\n"),
    );
    write(root, "src/app/styles.css", ".hero { background-image: url(/images/hero/wide.jpg); }\n");
    writeJson(root, "src/content/links.json", { card: "https://www.csplumbinglee.com/images/hero/wide.jpg", partner: "https://example.com/images/their-own.png" });
    write(root, "src/generated/images.ts", 'export const X = "/images/never/checked.jpg";\n');
  });

  const run = async (gate = false) => checkImages({ root, gate, useCache: false });

  test("a clean project passes; notes never fail it", async () => {
    const result = await run(true);
    assert.deepEqual(result.errors, []);
    assert.equal(result.exitCode, 0);
    assert.ok(result.notes.some((n) => n.includes("/images/gallery/gone.jpg is no longer in its folder") && n.includes("src/app/page.tsx (line 4)")), "a deleted collection photo that code still names is a note");
    assert.ok(result.notes.some((n) => n.includes('mentions "gone.jpg"')), "images.json entry for a missing file");
    assert.ok(result.notes.some((n) => /2 photos in 2 folders have no description/.test(n)), result.notes.join("\n"));
    const full = await run(false);
    assert.ok(full.notes.some((n) => n.includes("public/images/gallery") && n.includes('"undescribed.jpg"')), "the full report names each photo");
    assert.ok(full.notes.some((n) => n.includes("public/images/projects/demo/final") && n.includes('"photo-1.jpg"')), "project photos need descriptions even before the folder has an images.json");
    assert.ok(!full.notes.some((n) => n.includes("public/images/team") || n.includes("public/images/hero")), "fixed pictures are not asked for alt text here");
  });

  test("gate 1: a path written in src/ for a file that is not on disk", async () => {
    write(root, "src/lib/data.ts", 'export const A = "/images/team/sam.jpg";\nexport const B = "/images/team/missing photo.png";\n');
    const result = await run(true);
    assert.equal(result.exitCode, 1);
    assert.equal(result.errors.length, 2);
    assert.ok(result.errors.some((e) => e.includes("src/lib/data.ts (line 1)") && e.includes("/images/team/sam.jpg") && e.includes("/images/team/Sam.jpg") && e.includes("capital letters")));
    assert.ok(result.errors.some((e) => e.includes("src/lib/data.ts (line 2)") && e.includes("/images/team/missing photo.png")), "a path with a space is still checked");
    rmSync(path.join(root, "src/lib/data.ts"));
  });

  test("gate 2: a slot or crop whose picture is missing, or a media.json that cannot be read", async () => {
    const good = readFileSync(path.join(root, "src/content/media.json"), "utf8");
    writeJson(root, "src/content/media.json", { slots: { "home.hero": { image: "/images/hero/moved.jpg" } }, crops: { emblem: { image: "/images/logos/none.png", box: { left: 0, top: 0, width: 10, height: 10 } } } });
    const missing = await run(true);
    assert.equal(missing.exitCode, 1);
    assert.equal(missing.errors.length, 2, "one message per problem, not one per place it could be noticed");
    assert.ok(missing.errors.some((e) => e.includes('"home.hero"') && e.includes("/images/hero/moved.jpg")));
    assert.ok(missing.errors.some((e) => e.includes('"emblem"') && e.includes("/images/logos/none.png")));
    write(root, "src/content/media.json", '{ "slots": { ');
    const broken = await run(true);
    assert.equal(broken.exitCode, 1);
    assert.ok(broken.errors.some((e) => e.includes("src/content/media.json has a typo")));
    write(root, "src/content/media.json", good);
  });

  test("gate 3: a published picture that still carries EXIF or GPS data", async () => {
    await flat(60, 40, { r: 5, g: 5, b: 5 }).withExif(GPS_EXIF).jpeg().toFile(target(root, "public/images/gallery/from-phone.jpg"));
    await flat(60, 40, { r: 5, g: 6, b: 5 }).withExif({ IFD0: { Make: "Canon" } }).jpeg().toFile(target(root, "public/images/team/camera.jpg"));
    await flat(60, 40, { r: 5, g: 7, b: 5 }).withExif(GPS_EXIF).jpeg().toFile(target(root, "public/images/_incoming/raw.jpg"));
    const result = await run(true);
    assert.equal(result.exitCode, 1);
    assert.equal(result.errors.length, 3);
    const phone = result.errors.find((e) => e.includes("public/images/gallery/from-phone.jpg"));
    assert.ok(phone?.includes("GPS location") && phone.includes("`npm run photos:strip`"));
    const camera = result.errors.find((e) => e.includes("public/images/team/camera.jpg"));
    assert.ok(camera?.includes("(EXIF)") && camera.includes("`npm run photos:strip`") && !camera.includes("GPS"));
    assert.ok(result.errors.some((e) => e.includes("public/images/_incoming/raw.jpg") && e.includes("everything inside public/ is published")));
    for (const rel of ["gallery/from-phone.jpg", "team/camera.jpg", "_incoming/raw.jpg"]) rmSync(path.join(root, "public/images", rel));
  });

  test("gate 4: HEIC, HEIF, TIFF and PSD files inside public/images", async () => {
    write(root, "public/images/gallery/IMG_1.HEIC", "heic bytes");
    write(root, "public/images/gallery/scan.tiff", "tiff bytes");
    write(root, "public/images/logos/logo.psd", "psd bytes");
    await flat(20, 20, { r: 1, g: 1, b: 1 }).tiff().toFile(target(root, "public/images/gallery/renamed-tiff.jpg"));
    const result = await run(true);
    assert.equal(result.exitCode, 1);
    assert.equal(result.errors.length, 4);
    assert.ok(result.errors.some((e) => e.includes("gallery/IMG_1.HEIC") && e.includes("iPhone HEIC") && e.includes("photo-inbox/")));
    assert.ok(result.errors.some((e) => e.includes("gallery/scan.tiff") && e.includes("TIFF")));
    assert.ok(result.errors.some((e) => e.includes("logos/logo.psd") && e.includes("Photoshop")));
    assert.ok(result.errors.some((e) => e.includes("gallery/renamed-tiff.jpg") && e.includes("really a TIFF")), "judged by contents, not by the ending");
    for (const rel of ["gallery/IMG_1.HEIC", "gallery/scan.tiff", "logos/logo.psd", "gallery/renamed-tiff.jpg"]) rmSync(path.join(root, "public/images", rel));
  });

  test("notes only: heavy files in one line, two covers, an empty photo folder", async () => {
    for (const name of ["big-1.png", "big-2.png"]) {
      await sharp(randomBytes(800 * 800 * 3), { raw: { width: 800, height: 800, channels: 3 } }).png().toFile(target(root, `public/images/team/${name}`));
    }
    await flat(60, 40, { r: 4, g: 4, b: 4 }).jpeg().toFile(target(root, "public/images/projects/demo/final/photo-2.jpg"));
    writeJson(root, "public/images/projects/demo/final/images.json", { "photo-1.jpg": { alt: "One", cover: true }, "photo-2.jpg": { alt: "Two", cover: true } });
    mkdirSync(path.join(root, "public/images/projects/demo/rough-in"), { recursive: true });
    await flat(60, 40, { r: 4, g: 4, b: 9 }).jpeg().toFile(target(root, "public/images/projects/other/demo/photo-1.jpg"));
    writeJson(root, "public/images/projects/other/demo/images.json", { "photo-1.jpg": { alt: "Hidden one", hidden: true } });
    const result = await run(true);
    assert.equal(result.exitCode, 0, result.errors.join("\n"));
    const heavy = result.notes.filter((n) => n.includes("larger than 1.5 MB"));
    assert.equal(heavy.length, 1, "one summary line, however many files");
    assert.match(heavy[0], /^2 pictures are larger than 1\.5 MB \(the largest is public\/images\/team\/big-\d\.png at \d\.\d MB\)/);
    assert.ok(result.notes.some((n) => n.includes("public/images/projects/demo has 2 photos marked \"cover\"")));
    assert.ok(result.notes.some((n) => n.startsWith("public/images/projects/demo/rough-in has no photos to show,")));
    assert.ok(result.notes.some((n) => n.startsWith("public/images/projects/other/demo has no photos to show (the one photo in it is hidden)")));
    for (const line of [...result.errors, ...result.notes]) {
      assert.ok(!line.includes("\n") && /[.]$/.test(line), `one sentence: ${line}`);
    }
  });

  test("command line: --gate exits 1 for a gate condition and 0 otherwise; the old script forwards", () => {
    assert.equal(cli("check-images.mjs", root, "--gate").status, 0);
    write(root, "public/images/gallery/IMG_9.heic", "heic bytes");
    const failing = cli("check-images.mjs", root, "--gate");
    assert.equal(failing.status, 1);
    assert.match(failing.stderr, /Fix before publishing \(1\):\n {2}x public\/images\/gallery\/IMG_9\.heic is an iPhone HEIC photo/);
    assert.equal(cli("check-project-images.mjs", root, "--gate").status, 1, "check-project-images.mjs delegates to the new check");
    rmSync(path.join(root, "public/images/gallery/IMG_9.heic"));
    assert.equal(cli("check-project-images.mjs", root).status, 0);
  });
});

/* -------------------------------------------------------------- the ingest */

describe("photo ingest", () => {
  let root = "";
  const onMac = process.platform === "darwin" && existsSync("/usr/bin/sips");

  before(async () => {
    root = tempRoot("ingest");
    // What is already published.
    await flat(80, 60, { r: 1, g: 1, b: 1 }).jpeg().toFile(target(root, "public/images/projects/demo-house/final/photo-1.jpg"));
    writeJson(root, "public/images/projects/demo-house/final/images.json", { "photo-1.jpg": { alt: "Existing photo", cover: true } });
    await flat(80, 60, { r: 2, g: 2, b: 2 }).jpeg().toFile(target(root, "public/images/gallery/a.jpg"));
    writeJson(root, "public/images/gallery/images.json", { "a.jpg": { id: "70", alt: "A", title: "A", category: "remodel" } });
    await flat(80, 60, { r: 3, g: 3, b: 3 }).webp().toFile(target(root, "public/images/gallery/remodel-1.webp"));
    write(root, "src/lib/gallery-data.ts", 'export const GALLERY_ITEMS = [{ id: "64", src: "/images/gallery/a.jpg" }];\n');
    // The inbox.
    const phone = target(root, "photo-inbox/demo-house/final/IMG_10.JPG");
    await flat(4000, 3000, { r: 120, g: 110, b: 90 }).withExif(GPS_EXIF).withMetadata({ orientation: 6 }).jpeg().toFile(phone);
    await flat(900, 600, { r: 20, g: 110, b: 90 }).png().toFile(target(root, "photo-inbox/demo-house/final/IMG_9.png"));
    write(root, "photo-inbox/demo-house/final/broken.jpg", "not a jpeg");
    write(root, "photo-inbox/demo-house/final/.gitkeep", "");
    if (onMac) {
      const jpeg = target(root, "tmp-source.jpg");
      await gradient(640, 480).jpeg().toFile(jpeg);
      const made = spawnSync("/usr/bin/sips", ["-s", "format", "heic", jpeg, "--out", target(root, "photo-inbox/demo-house/final/IMG_2.HEIC")], { encoding: "utf8" });
      assert.equal(made.status, 0, made.stderr);
      rmSync(jpeg);
    }
    await flat(3000, 2000, { r: 5, g: 5, b: 200 }).jpeg().toFile(target(root, "photo-inbox/gallery/remodel/tub.jpg"));
    await flat(1000, 1500, { r: 90, g: 5, b: 200 }).jpeg().toFile(target(root, "photo-inbox/gallery/commercial/sink.jpeg"));
    await flat(900, 900, { r: 90, g: 150, b: 20 }).jpeg().toFile(target(root, "photo-inbox/_gallery/remodel/older-inbox.jpg"));
    await flat(900, 900, { r: 1, g: 2, b: 3 }).jpeg().toFile(target(root, "photo-inbox/gallery/kitchens/x.jpg"));
  });

  test("--dry-run reports and writes nothing", () => {
    const result = cli("ingest-project-photos.mjs", root, "--dry-run");
    assert.equal(result.status, 0);
    assert.match(result.stdout, /DRY RUN/);
    assert.ok(existsSync(path.join(root, "photo-inbox/demo-house/final/IMG_10.JPG")));
    assert.deepEqual(readdirSync(path.join(root, "public/images/projects/demo-house/final")).sort(), ["images.json", "photo-1.jpg"]);
    assert.equal(existsSync(path.join(root, "src/generated")), false);
  });

  test("project photos: converted, numbered after what exists, described in images.json, originals moved", async () => {
    const result = cli("ingest-project-photos.mjs", root);
    assert.equal(result.status, 0, result.stderr);
    const outDir = path.join(root, "public/images/projects/demo-house/final");
    // Natural order of the originals: IMG_2.HEIC, IMG_9.png, IMG_10.JPG.
    const expected = onMac ? ["photo-2.webp", "photo-3.webp", "photo-4.webp"] : ["photo-2.webp", "photo-3.webp"];
    assert.deepEqual(readdirSync(outDir).filter((f) => f.endsWith(".webp")).sort(compareFileNames), expected);
    assert.ok(existsSync(path.join(outDir, "photo-1.jpg")), "nothing is overwritten");

    const phone = await sharp(path.join(outDir, expected.at(-1) ?? "")).metadata();
    assert.deepEqual([phone.format, phone.width, phone.height], ["webp", 2400, 3200], "upright (was 4000x3000 flagged as rotated) and no wider than 2400");
    assert.equal(Boolean(phone.exif), false, "location data is gone");
    assert.equal(phone.orientation, undefined);
    if (onMac) {
      const heic = await sharp(path.join(outDir, "photo-2.webp")).metadata();
      assert.deepEqual([heic.format, heic.width, heic.height], ["webp", 640, 480], "an iPhone HEIC is converted through sips");
    }

    const settings = readJson<Record<string, Record<string, unknown>>>(root, "public/images/projects/demo-house/final/images.json");
    assert.deepEqual(Object.keys(settings), ["photo-1.jpg", ...expected], "existing entries stay first and untouched");
    assert.deepEqual(settings["photo-1.jpg"], { alt: "Existing photo", cover: true });
    for (const name of expected) assert.deepEqual(settings[name], { alt: "" }, "alt is left empty so the check lists it");
    assert.match(readFileSync(path.join(outDir, "images.json"), "utf8"), /^\{\n {2}"photo-1\.jpg": \{\n {4}"alt": "Existing photo",/, "2-space JSON");

    const done = path.join(root, "photo-inbox/_done/demo-house/final");
    assert.deepEqual(readdirSync(done).sort(), onMac ? ["IMG_10.JPG", "IMG_2.HEIC", "IMG_9.png"] : ["IMG_10.JPG", "IMG_9.png"]);
    const left = readdirSync(path.join(root, "photo-inbox/demo-house/final")).sort();
    assert.deepEqual(left, [".gitkeep", "broken.jpg"], "an unreadable file stays in the inbox");
    assert.match(result.stdout, /broken\.jpg could not be read as a picture/);
    assert.ok(!result.stdout.includes("Paste"), "no more code to paste");

    // The run ended by rebuilding the manifest, and the photos are on the list.
    const meta = metaOf(root);
    assert.deepEqual(meta.collections["projects/demo-house/final"], ["/images/projects/demo-house/final/photo-1.jpg", ...expected.map((f) => `/images/projects/demo-house/final/${f}`)]);
    const check = await checkImages({ root, useCache: false });
    assert.ok(check.notes.some((n) => n.includes("public/images/projects/demo-house/final") && n.includes(`"${expected[0]}"`)), "the check lists the new photos as needing a description");
    assert.deepEqual(check.errors, [], "nothing ingested carries metadata");
  });

  test("the gallery inbox is not mistaken for a project", () => {
    assert.equal(existsSync(path.join(root, "public/images/projects/gallery")), false);
    assert.ok(existsSync(path.join(root, "photo-inbox/gallery/remodel/tub.jpg")), "the project ingest left gallery photos alone");
  });

  test("gallery photos: category from the folder, ids continue after the highest id anywhere", async () => {
    assert.equal(await highestGalleryId(root), 70, "the highest id across images.json (70) and the older TypeScript list (64)");
    const result = cli("ingest-gallery-photos.mjs", root);
    assert.equal(result.status, 1, "an unknown category folder is reported");
    assert.match(result.stderr, /"kitchens" is not a gallery category/);
    assert.ok(existsSync(path.join(root, "photo-inbox/gallery/kitchens/x.jpg")), "and its photos are left alone");

    assert.deepEqual(readdirSync(path.join(root, "public/images/gallery/commercial")).sort(), ["commercial-1.webp", "images.json"]);
    assert.deepEqual(readdirSync(path.join(root, "public/images/gallery/remodel")).sort(), ["images.json", "remodel-2.webp", "remodel-3.webp"], "numbering continues after remodel-1 in the flat folder");
    const commercial = readJson<Record<string, Record<string, unknown>>>(root, "public/images/gallery/commercial/images.json");
    const remodel = readJson<Record<string, Record<string, unknown>>>(root, "public/images/gallery/remodel/images.json");
    assert.deepEqual(commercial, { "commercial-1.webp": { id: "71", alt: "", title: "", category: "commercial" } });
    assert.deepEqual(remodel, {
      "remodel-2.webp": { id: "72", alt: "", title: "", category: "remodel" },
      "remodel-3.webp": { id: "73", alt: "", title: "", category: "remodel" },
    });
    assert.deepEqual(readJson(root, "public/images/gallery/images.json"), { "a.jpg": { id: "70", alt: "A", title: "A", category: "remodel" } }, "the existing gallery list is untouched");
    assert.ok(existsSync(path.join(root, "photo-inbox/_done/gallery/remodel/tub.jpg")));
    assert.ok(existsSync(path.join(root, "photo-inbox/_done/gallery/commercial/sink.jpeg")));
    assert.ok(existsSync(path.join(root, "photo-inbox/_done/_gallery/remodel/older-inbox.jpg")), "the older inbox location is still read");
    assert.equal(await highestGalleryId(root), 73);

    const meta = metaOf(root);
    assert.deepEqual(meta.trees.gallery, [
      "/images/gallery/a.jpg",
      "/images/gallery/remodel-1.webp",
      "/images/gallery/commercial/commercial-1.webp",
      "/images/gallery/remodel/remodel-2.webp",
      "/images/gallery/remodel/remodel-3.webp",
    ]);
    assert.equal(meta.images["/images/gallery/remodel/remodel-2.webp"].category, "remodel");
    assert.equal(meta.images["/images/gallery/remodel/remodel-2.webp"].id, "72");
  });

  test("a second batch appends: new numbers, new ids, no duplicate entries, no overwritten originals", async () => {
    await flat(700, 500, { r: 77, g: 5, b: 5 }).jpeg().toFile(target(root, "photo-inbox/gallery/remodel/tub.jpg"));
    await flat(700, 500, { r: 5, g: 77, b: 5 }).jpeg().toFile(target(root, "photo-inbox/demo-house/final/IMG_10.JPG"));
    rmSync(path.join(root, "photo-inbox/gallery/kitchens"), { recursive: true });
    const firstOriginal = sha(path.join(root, "photo-inbox/_done/gallery/remodel/tub.jpg"));
    assert.equal(cli("ingest-project-photos.mjs", root).status, 0);
    const gallery = cli("ingest-gallery-photos.mjs", root);
    assert.equal(gallery.status, 0, gallery.stderr);

    const remodel = readJson<Record<string, Record<string, unknown>>>(root, "public/images/gallery/remodel/images.json");
    assert.deepEqual(Object.keys(remodel), ["remodel-2.webp", "remodel-3.webp", "remodel-4.webp"]);
    assert.equal(remodel["remodel-4.webp"].id, "74");
    assert.equal(sha(path.join(root, "photo-inbox/_done/gallery/remodel/tub.jpg")), firstOriginal, "the earlier original of the same name is kept");
    assert.ok(existsSync(path.join(root, "photo-inbox/_done/gallery/remodel/tub-2.jpg")));
    const project = readJson<Record<string, unknown>>(root, "public/images/projects/demo-house/final/images.json");
    const count = Object.keys(project).length;
    assert.equal(new Set(Object.keys(project)).size, count);
    assert.ok(Object.keys(project).at(-1)?.startsWith("photo-"), "appended at the end");
    assert.ok(existsSync(path.join(root, "photo-inbox/_done/demo-house/final/IMG_10-2.JPG")));
  });

  test("an images.json with a typo is never rewritten by the ingest", async () => {
    const file = path.join(root, "public/images/gallery/commercial/images.json");
    const typo = '{ "commercial-1.webp": { "id": "90", "alt": "Sink" }, }\n';
    writeFileSync(file, typo);
    assert.equal(await highestGalleryId(root), 90, "an id in a file with a typo still counts, so nothing can collide later");
    await flat(500, 500, { r: 5, g: 5, b: 77 }).jpeg().toFile(target(root, "photo-inbox/gallery/commercial/another.jpg"));
    const result = cli("ingest-gallery-photos.mjs", root);
    assert.equal(readFileSync(file, "utf8"), typo, "the owner's file is left exactly as it was");
    assert.match(result.stdout, /images\.json has a typo/);
    assert.ok(existsSync(path.join(root, "public/images/gallery/commercial/commercial-2.webp")), "the photo is still added");
  });
});

/* ------------------------------------------------------- page image dumps */

describe("dump-page-images", () => {
  test("image URLs are read out of markup, srcset, preloads, styles and page data", () => {
    assert.deepEqual(srcsetUrls("/_next/image?url=%2Fa.jpg&w=640&q=75 640w, /_next/image?url=%2Fa.jpg&w=750&q=75 750w"), ["/_next/image?url=%2Fa.jpg&w=640&q=75", "/_next/image?url=%2Fa.jpg&w=750&q=75"]);
    const html = [
      '<link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Fimages%2Fhero.jpg&amp;w=640&amp;q=75 640w" href="/x"/>',
      '<link rel="stylesheet" href="/_next/static/chunks/app.css"/>',
      '<img alt="a &gt; b" src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fphoto.abc123.jpg&amp;w=3840&amp;q=75" srcSet="/images/plain.png 1x"/>',
      '<picture><source media="(max-width: 600px)" srcset="/images/phone.webp"/></picture>',
      '<video poster="/images/poster.jpg"></video>',
      '<div style="background-image:url(&quot;/images/bg.jpg&quot;)"></div>',
      '<meta property="og:image" content="https://www.csplumbinglee.com/images/card.png"/>',
      '<script>self.__next_f.push([1,"{\\"src\\":\\"/images/in-data.jpg\\",\\"big\\":\\"/_next/image?url=%2Fimages%2Flightbox.jpg\\u0026w=1920\\u0026q=75\\"} <img src=\\"/images/not-a-tag.jpg\\">"])</script>',
    ].join("\n");
    const { found, stylesheets } = extractImageUrls(html);
    const via = (v: string) => found.filter((f) => f.via === v).map((f) => f.url);
    assert.deepEqual(via("preload"), ["/x", "/_next/image?url=%2Fimages%2Fhero.jpg&w=640&q=75"]);
    assert.deepEqual(via("img"), ["/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fphoto.abc123.jpg&w=3840&q=75", "/images/plain.png"]);
    assert.deepEqual(via("source"), ["/images/phone.webp"]);
    assert.deepEqual(via("poster"), ["/images/poster.jpg"]);
    assert.deepEqual(via("style"), ["/images/bg.jpg"]);
    assert.deepEqual(via("meta"), ["https://www.csplumbinglee.com/images/card.png"]);
    assert.deepEqual(stylesheets, ["/_next/static/chunks/app.css"]);
    const data = via("data");
    assert.ok(data.includes("/images/in-data.jpg"));
    assert.ok(data.some((u) => u.startsWith("/_next/image?url=%2Fimages%2Flightbox.jpg")));
    assert.ok(data.includes("/images/not-a-tag.jpg") && !via("img").includes("/images/not-a-tag.jpg"), "text inside a script is data, not markup");
  });

  test("the same picture is recognised behind a plain URL, an optimizer URL and a hashed import", async () => {
    const root = tempRoot("dump");
    const a = target(root, "public/images/gallery/a.jpg");
    const b = target(root, "public/images/gallery/b c.jpg");
    await flat(50, 40, { r: 200, g: 1, b: 1 }).jpeg().toFile(a);
    await flat(50, 40, { r: 1, g: 200, b: 1 }).jpeg().toFile(b);
    await flat(50, 40, { r: 1, g: 1, b: 200 }).jpeg().toFile(target(root, "public/images/gallery/only-before.jpg"));
    const page = (body: string) => `<!DOCTYPE html><html><head></head><body>${body}</body></html>`;

    // Build 1: plain /images URLs through the optimizer.
    const dist1 = path.join(root, "build-1");
    write(dist1, "server/app/index.html", page('<img src="/_next/image?url=%2Fimages%2Fgallery%2Fa.jpg&amp;w=640&amp;q=75" srcSet="/_next/image?url=%2Fimages%2Fgallery%2Fb%20c.jpg&amp;w=640&amp;q=75 640w"/><img src="/images/gallery/only-before.jpg"/><img src="/images/gallery/typo.jpg"/><img src="https://cdn.example.com/x.png"/>'));
    write(dist1, "server/app/gallery.html", page('<img src="/images/gallery/a.jpg"/>'));
    // Build 2: hashed static imports (b through a web-safe copy), a.jpg only in the page data on /gallery.
    const dist2 = path.join(root, "build-2");
    copyFileSync(a, target(dist2, "static/media/a.0abc.jpg"));
    copyFileSync(b, target(dist2, "static/media/b-c-123456.0def.jpg"));
    write(dist2, "server/app/index.html", page('<img src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fa.0abc.jpg&amp;w=640&amp;q=75"/><img src="/_next/static/media/b-c-123456.0def.jpg"/>'));
    write(dist2, "server/app/gallery.html", page('<script>var d = {"src":"/_next/static/media/a.0abc.jpg"}</script>'));
    write(dist2, "server/app/new/page.html", page(""));

    const before = await dumpPageImages({ root, dist: dist1 });
    const after = await dumpPageImages({ root, dist: dist2 });
    assert.deepEqual(Object.keys(before.routes), ["/", "/gallery"]);
    assert.deepEqual(Object.keys(after.routes), ["/", "/gallery", "/new/page"]);
    assert.deepEqual(before.routes["/"].rendered.map((e) => e.file), ["public/images/gallery/a.jpg", "public/images/gallery/b c.jpg", "public/images/gallery/only-before.jpg"]);
    assert.deepEqual(before.routes["/"].missing, ["/images/gallery/typo.jpg"], "a URL with no file behind it is a broken image");
    assert.deepEqual(before.routes["/"].external, ["https://cdn.example.com/x.png"]);
    assert.deepEqual(after.routes["/"].rendered.map((e) => [e.file, e.sha256]), [["public/images/gallery/a.jpg", sha(a)], ["public/images/gallery/b c.jpg", sha(b)]], "hashed copies are named after the public file they came from");
    assert.deepEqual(after.routes["/gallery"].rendered, []);
    assert.deepEqual(after.routes["/gallery"].referenced.map((e) => e.file), ["public/images/gallery/a.jpg"]);

    const report = compareDumps(before, after);
    assert.deepEqual(report.changed["/"].removed.map((e) => e.file), ["public/images/gallery/only-before.jpg"], "a and b are the same pictures in both builds; only this one is gone");
    assert.deepEqual(report.changed["/"].added, []);
    assert.deepEqual(report.changed["/gallery"].noLongerRendered.map((e) => e.file), ["public/images/gallery/a.jpg"], "still in the page data, no longer in markup");
    assert.deepEqual(report.changed["/gallery"].removed, []);
    assert.deepEqual([report.lost, report.routesAdded, report.routesRemoved], [1, ["/new/page"], []]);
    assert.deepEqual(compareDumps(before, before).changed, {});

    // Command line: --out, then --compare exits 1 because a picture was lost.
    const out1 = path.join(root, "before.json");
    const out2 = path.join(root, "after.json");
    const script = path.join(REPO, "scripts/qa/dump-page-images.mjs");
    for (const [dist, out] of [[dist1, out1], [dist2, out2]]) {
      const made = spawnSync(process.execPath, [script, "--root", root, "--dir", dist, "--out", out], { encoding: "utf8" });
      assert.equal(made.status, 0, made.stderr);
    }
    const compared = spawnSync(process.execPath, [script, "--compare", out1, out2], { encoding: "utf8" });
    assert.equal(compared.status, 1);
    assert.match(compared.stdout, /- removed {10}public\/images\/gallery\/only-before\.jpg/);
    assert.match(compared.stdout, /1 picture\(s\) lost/);
    assert.equal(spawnSync(process.execPath, [script, "--compare", out1, out1], { encoding: "utf8" }).status, 0);
  });
});

/* ------------------------------------------------------- the real project */

describe("this repository", () => {
  test("src/generated is up to date (the manifest ran before the tests)", () => {
    const result = spawnSync(process.execPath, [SCRIPT("build-image-manifest.mjs"), "--check", "--quiet"], { encoding: "utf8" });
    assert.equal(result.status, 0, `run \`npm run images:manifest\` (npm test does it for you)\n${result.stderr}`);
  });

  test("every listed picture and every slot resolves through src/lib/media.ts", async () => {
    installMediaStubs();
    const media = (await import("../src/lib/media")) as unknown as Media;
    const meta = readJson<ImageManifest>(REPO, "src/generated/images-meta.json");
    let count = 0;
    for (const [folder, paths] of Object.entries(meta.collections)) {
      const refs = media.collection(folder);
      assert.equal(refs.length, paths.length, folder);
      for (const ref of refs) {
        assert.ok(ref.width > 0 && ref.height > 0 && ref.alt.length > 0, ref.path);
        count += 1;
      }
    }
    assert.ok(count > 0);
    const settings = readJson<{ slots: Record<string, { image: string }> }>(REPO, "src/content/media.json");
    for (const [id, def] of Object.entries(settings.slots)) {
      if (!existsSync(path.join(REPO, "public", def.image))) continue; // the check, not this test, reports a missing slot picture
      assert.ok(media.slot(id), `slot ${id}`);
    }
  });

  test("the registry only imports names that are safe in a URL", () => {
    const registry = readFileSync(path.join(REPO, "src/generated/images.ts"), "utf8");
    const imports = [...registry.matchAll(/^import i\d+ from "([^"]+)";$/gm)].map((m) => m[1]);
    assert.ok(imports.length > 0);
    for (const from of imports) {
      assert.match(from, /^(?:\.\.\/\.\.\/public\/images|\.\/staged|\.\/derived)\/[A-Za-z0-9._\/-]+\.(?:jpg|jpeg|png|webp|avif|gif)$/, from);
      assert.ok(existsSync(path.join(REPO, "src/generated", from)), `${from} exists`);
    }
  });

  test('no "use client" file imports the picture registry', () => {
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "generated" && entry.name !== "node_modules") walk(full);
        } else if (/\.tsx?$/.test(entry.name)) {
          const text = readFileSync(full, "utf8");
          if (!/^\s*["']use client["']/m.test(text.slice(0, 400))) continue;
          const imported = [...text.matchAll(/(?:from|import)\s+["']([^"']+)["']/g)].map((m) => m[1]);
          // media-types is fine anywhere: it holds types only.
          if (imported.some((spec) => /(?:^|\/)media$/.test(spec) || /(?:^|\/)generated\//.test(spec))) offenders.push(path.relative(REPO, full));
        }
      }
    };
    walk(path.join(REPO, "src"));
    assert.deepEqual(offenders, [], "client components receive MediaRef props; they never import src/lib/media.ts or src/generated/*");
  });
});
