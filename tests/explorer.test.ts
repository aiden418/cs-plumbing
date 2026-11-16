import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  aspectOf,
  clamp,
  fileHref,
  formatCounter,
  gallerySizes,
  isNearSlide,
  justifiedItemStyle,
  keyToIndex,
  phaseAnchor,
  photoAnnouncement,
  photoCountLabel,
  railSizes,
} from "../src/components/explorer/explorer-utils";
import type { MediaRef } from "../src/lib/media-types";

const ROOT = path.resolve(__dirname, "..");

const photo = (n: number, width = 900, height = 1200): MediaRef => ({
  src: { src: `/_next/static/media/photo-${n}.abc.jpg`, width, height },
  width,
  height,
  alt: `Photo number ${n}`,
  color: "#808080",
  path: `/images/projects/demo/phase/photo-${n}.jpg`,
});

// Pure helpers ---------------------------------------------------------------

test("formatCounter pads to two digits and clamps", () => {
  assert.equal(formatCounter(2, 28), "03 / 28");
  assert.equal(formatCounter(0, 5), "01 / 05");
  assert.equal(formatCounter(99, 5), "05 / 05");
  assert.equal(formatCounter(-3, 5), "01 / 05");
  assert.equal(formatCounter(0, 0), "00 / 00");
  assert.equal(formatCounter(4, 120), "005 / 120");
});

test("photoAnnouncement reads 'Photo n of total: alt'", () => {
  assert.equal(photoAnnouncement(2, 28, "Drain line in trench"), "Photo 3 of 28: Drain line in trench");
  assert.equal(photoAnnouncement(0, 1, "  "), "Photo 1 of 1");
});

test("keyToIndex moves, jumps and clamps on the right axis", () => {
  assert.equal(keyToIndex("ArrowRight", 0, 5), 1);
  assert.equal(keyToIndex("ArrowLeft", 0, 5), 0);
  assert.equal(keyToIndex("ArrowRight", 4, 5), 4);
  assert.equal(keyToIndex("Home", 3, 5), 0);
  assert.equal(keyToIndex("End", 0, 5), 4);
  assert.equal(keyToIndex("ArrowDown", 0, 5), null);
  assert.equal(keyToIndex("Enter", 0, 5), null);
  assert.equal(keyToIndex("ArrowDown", 0, 5, { axis: "vertical" }), 1);
  assert.equal(keyToIndex("ArrowRight", 0, 5, { axis: "vertical" }), null);
  assert.equal(keyToIndex("ArrowUp", 0, 3, { axis: "both", wrap: true }), 2);
  assert.equal(keyToIndex("ArrowRight", 2, 3, { axis: "both", wrap: true }), 0);
  assert.equal(keyToIndex("ArrowRight", 0, 0), null);
});

test("isNearSlide keeps the current slide and two on each side", () => {
  const near = [0, 1, 2, 3, 4, 5, 6].filter((i) => isNearSlide(i, 3));
  assert.deepEqual(near, [1, 2, 3, 4, 5]);
});

test("sizes follow the rail height and the aspect ratio", () => {
  assert.equal(aspectOf(0, 10), 1);
  assert.equal(aspectOf(1200, 900), 4 / 3);
  // Portrait 3:4: 440 * 0.75 / 390 = 85vw on a phone, 408px on desktop.
  assert.equal(railSizes(900, 1200), "(max-width: 767px) 85vw, 408px");
  // Landscape is capped at 86vw on a phone.
  assert.equal(railSizes(1600, 900), "(max-width: 767px) 86vw, 968px");
  assert.match(gallerySizes(1200, 900), /^\(max-width: 767px\) min\(100vw, \d+px\), \d+px$/);
});

test("justified grid items grow by their aspect ratio", () => {
  assert.deepEqual(justifiedItemStyle(1600, 900), { "--ar": "1.7778", "--grow": "177.78" });
  assert.deepEqual(justifiedItemStyle(0, 0), { "--ar": "1.0000", "--grow": "100.00" });
});

test("small helpers", () => {
  assert.equal(clamp(5, 0, 3), 3);
  assert.equal(clamp(5, 0, -1), 0);
  assert.equal(phaseAnchor("2nd-rough"), "phase-2nd-rough");
  assert.equal(photoCountLabel(1), "1 photo");
  assert.equal(photoCountLabel(28), "28 photos");
  assert.equal(fileHref("/images/a.jpg"), "/images/a.jpg");
  assert.equal(fileHref({ src: "/_next/static/media/a.jpg" }), "/_next/static/media/a.jpg");
});

// Server HTML (what a visitor without JavaScript gets) ----------------------

test("a filmstrip without JavaScript: every photo is a link to its file, the counter starts at 01", async () => {
  const { default: FilmstripRail } = await import("../src/components/explorer/FilmstripRail");
  const items = [photo(1), photo(2, 1600, 900), photo(3)];
  const html = renderToStaticMarkup(
    createElement(FilmstripRail, { id: "demo:phase", title: "Demo: Phase", items, eager: 2 }),
  );
  assert.equal((html.match(/<a data-photo="true"/g) ?? []).length, 3);
  assert.ok(!html.includes('<button type="button" data-photo'));
  assert.ok(html.includes('href="/_next/static/media/photo-1.abc.jpg"'));
  assert.ok(html.includes('aria-label="Photo number 2, open photo"'));
  assert.ok(html.includes("01 / 03"));
  assert.equal((html.match(/loading="eager"/g) ?? []).length, 2);
  assert.equal((html.match(/loading="lazy"/g) ?? []).length, 1);
  assert.ok(html.includes('alt="Photo number 3"'));
  // Explicit size for every frame (no layout shift): the aspect ratio is on the frame.
  assert.equal((html.match(/--ar:/g) ?? []).length, 3);
});

test("an empty filmstrip renders nothing", async () => {
  const { default: FilmstripRail } = await import("../src/components/explorer/FilmstripRail");
  assert.equal(renderToStaticMarkup(createElement(FilmstripRail, { id: "x", title: "x", items: [] })), "");
});

test("the phase line links to today's anchors and marks nothing current on the server", async () => {
  const { default: PhaseNav } = await import("../src/components/explorer/PhaseNav");
  const html = renderToStaticMarkup(
    createElement(PhaseNav, {
      phases: [
        { slug: "underground", name: "Underground", count: 9 },
        { slug: "2nd-rough", name: "2nd Rough", count: 28 },
      ],
    }),
  );
  assert.ok(html.startsWith('<nav aria-label="Project phases"'));
  assert.ok(html.includes('href="#phase-underground"'));
  assert.ok(html.includes('href="#phase-2nd-rough"'));
  assert.ok(html.includes("28 photos"));
  assert.ok(!html.includes("aria-current"));
});

test("featured projects without JavaScript: first phase shown, steps link to the project page", async () => {
  const { default: FeaturedProjects } = await import("../src/components/explorer/FeaturedProjects");
  const rail = (name: string) => createElement("p", null, `rail ${name}`);
  const html = renderToStaticMarkup(
    createElement(FeaturedProjects, {
      projects: [
        {
          slug: "a",
          name: "Project A",
          city: "Cape Coral",
          category: "Remodel",
          href: "/projects/a",
          phases: [
            { slug: "one", name: "One", count: 3, rail: rail("a1"), collectionId: "f:a:one" },
            { slug: "two", name: "Two", count: 4, rail: rail("a2"), collectionId: "f:a:two" },
          ],
        },
        {
          slug: "b",
          name: "Project B",
          category: "Commercial",
          href: "/projects/b",
          phases: [{ slug: "one", name: "One", count: 1, rail: rail("b1"), collectionId: "f:b:one" }],
        },
      ],
    }),
  );
  // Every rail is in the HTML; only the first is visible.
  for (const name of ["a1", "a2", "b1"]) assert.ok(html.includes(`rail ${name}`));
  assert.equal((html.match(/hidden=""/g) ?? []).length, 2);
  assert.ok(/<div[^>]*class="featured-panel"[^>]*><p>rail a1/.test(html));
  assert.ok(!/hidden=""[^>]*><p>rail a1/.test(html));
  assert.ok(html.includes('href="/projects/a#phase-one"'));
  assert.ok(html.includes('href="/projects/a#phase-two"'));
  assert.ok(html.includes('href="/projects/b"'));
  // Tab roles arrive with JavaScript, not before.
  assert.ok(!html.includes('role="tab"'));
});

test("the gallery without JavaScript shows every photo as a link, 'All' pressed", async () => {
  const { default: GalleryGrid } = await import("../src/components/gallery/GalleryGrid");
  const items = [
    { media: { ...photo(1), caption: "Kitchen" }, category: "residential" },
    { media: photo(2, 1600, 900), category: "commercial" },
  ];
  const html = renderToStaticMarkup(
    createElement(GalleryGrid, {
      items,
      categories: [
        { id: "all", label: "All Projects" },
        { id: "residential", label: "Residential" },
        { id: "commercial", label: "Commercial" },
        { id: "remodel", label: "Remodel" },
      ],
    }),
  );
  assert.ok(!html.includes('hidden=""'));
  assert.equal((html.match(/<a data-photo=/g) ?? []).length, 2);
  assert.ok(html.includes('aria-label="Kitchen, open photo"'));
  assert.ok(/aria-pressed="true"[^>]*>All Projects/.test(html));
  // A category with no photos gets no chip.
  assert.ok(!html.includes(">Remodel<"));
});

// Never touch browser history -------------------------------------------------

test("explorer, lightbox and gallery code never writes browser history", () => {
  const dirs = ["src/components/explorer", "src/components/lightbox", "src/components/gallery"];
  const files: string[] = [];
  for (const dir of dirs) {
    for (const name of readdirSync(path.join(ROOT, dir))) {
      const file = path.join(ROOT, dir, name);
      if (statSync(file).isFile()) files.push(file);
    }
  }
  assert.ok(files.length >= 10);
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.ok(
      !/pushState|replaceState|router\.(push|replace)/.test(source),
      `${path.relative(ROOT, file)} writes history`,
    );
    assert.ok(!/stopPropagation/.test(source), `${path.relative(ROOT, file)} stops propagation`);
    assert.ok(
      !/addEventListener\(\s*["'](wheel|touchmove|touchstart)/.test(source),
      `${path.relative(ROOT, file)} listens to wheel/touch`,
    );
  }
});
