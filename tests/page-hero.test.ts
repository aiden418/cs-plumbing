import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { installMediaStubs } from "./fixtures/media-stubs";
import { BUSINESS } from "../src/lib/business";
import {
  formatCoordinates,
  frameOrientation,
  headlineText,
  headlineWidth,
  isTypeLedHeroPath,
  resolveHeroLayout,
  resolveHeroLook,
  serviceHeroImage,
  areaHeroImage,
} from "../src/lib/hero-images";

installMediaStubs();

const base = { hasFrame: false, hasMedia: false, hasImage: false } as const;

test("layout defaults keep the old callers looking right", () => {
  assert.equal(resolveHeroLayout({ ...base, hasMedia: true, size: "sm", align: "center" }), "split");
  assert.equal(resolveHeroLayout({ ...base, hasFrame: true }), "split");
  assert.equal(resolveHeroLayout({ ...base, hasImage: true, size: "sm" }), "type-led");
  assert.equal(resolveHeroLayout({ ...base, size: "sm" }), "compact");
  assert.equal(resolveHeroLayout({ ...base, align: "center" }), "editorial");
  assert.equal(resolveHeroLayout({ ...base }), "type-led");
  assert.equal(resolveHeroLayout({ ...base, accentTone: "emergency" }), "urgent");
  assert.equal(resolveHeroLayout({ ...base, hasFrame: true, layout: "cinema" }), "cinema");
});

test("stock city scenery and the deny-listed cards never frame a header", () => {
  assert.equal(isTypeLedHeroPath("/images/areas/cape-coral.jpg"), true);
  assert.equal(isTypeLedHeroPath("images/areas/naples.jpg"), true);
  assert.equal(isTypeLedHeroPath("/images/services/cards/drain-cleaning.jpg"), true);
  assert.equal(isTypeLedHeroPath("/images/services/cards/emergency.jpg"), true);
  assert.equal(isTypeLedHeroPath("/images/services/cards/repiping.jpg"), false);
  assert.equal(isTypeLedHeroPath(areaHeroImage("cape-coral")!.src), true);
  assert.equal(isTypeLedHeroPath(serviceHeroImage("leak-repair")!.src), true);
  assert.equal(serviceHeroImage("water-heaters")!.src, "/images/services/cards/water-heaters.jpg");
});

test("headline width follows its length; the longest steps down", () => {
  assert.deepEqual(headlineWidth("Let's Talk Plumbing"), { width: "display-wide", stepDown: false });
  assert.equal(headlineWidth("x".repeat(24)).width, "display-wide");
  assert.equal(headlineWidth("x".repeat(25)).width, "default");
  assert.equal(headlineWidth("x".repeat(44)).width, "default");
  assert.equal(headlineWidth("x".repeat(64)).width, "display-normal");
  assert.deepEqual(headlineWidth("x".repeat(65)), { width: "display-tight", stepDown: true });
  assert.equal(headlineText("Where We", "Work"), "Where We Work");
  assert.equal(headlineText("Privacy Policy"), "Privacy Policy");
});

test("version 2 maps every layout name onto photo or plain", () => {
  for (const name of ["split", "cinema", "editorial", "photo", undefined] as const) {
    assert.equal(resolveHeroLook(name, true), "photo", `${name} with a photo`);
    assert.equal(resolveHeroLook(name, false), "plain", `${name} without a photo`);
  }
  for (const name of ["type-led", "compact", "urgent", "plain"] as const) {
    assert.equal(resolveHeroLook(name, true), "plain", `${name} stays plain`);
  }
});

test("coordinates are computed from BUSINESS.geo", () => {
  assert.equal(formatCoordinates({ latitude: 26.6663678, longitude: -81.9171809 }), "26.6664° N · 81.9172° W");
  assert.match(formatCoordinates(BUSINESS.geo), /^\d+\.\d{4}° [NS] · \d+\.\d{4}° [EW]$/);
  assert.equal(frameOrientation({ width: 1800, height: 2400 }), "portrait");
  assert.equal(frameOrientation({ width: 2048, height: 1536 }), "landscape");
});

test("heroFrame resolves a service photo and refuses scenery and the deny-list", async () => {
  const { heroFrame } = await import("../src/lib/hero-frame");
  assert.equal(heroFrame(areaHeroImage("cape-coral")), null);
  assert.equal(heroFrame(serviceHeroImage("drain-cleaning")), null);
  assert.equal(heroFrame(null), null);
  const ref = heroFrame(serviceHeroImage("repiping"));
  assert.ok(ref, "repiping card resolves");
  assert.equal(ref.path, "/images/services/cards/repiping.jpg");
  assert.equal(ref.position, "center");
  assert.equal(typeof ref.width, "number");
});

async function render(props: Record<string, unknown>): Promise<string> {
  const { default: PageHero } = await import("../src/components/ui/PageHero");
  return renderToStaticMarkup(createElement(PageHero, props as never));
}

test("the H1 is the title and accent as one run of text; no photo gives the plain white hero", async () => {
  const html = await render({ title: "Where We", accent: "Work", overline: "Service Area" });
  assert.match(html, /<section[^>]*data-tone="white"[^>]*data-hero-layout="plain"/);
  assert.doesNotMatch(html, /data-hero-photo/);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)!;
  assert.equal(h1[1], "Where We Work");
  assert.doesNotMatch(h1[0], /gradient|opacity-0/);
  assert.doesNotMatch(html, /<svg/, "no plan-drawing motif");
});

test("block accent breaks the line without wrapping the words", async () => {
  const html = await render({ title: "Every Plumbing Solution", accent: "Under One Roof", accentPosition: "block", align: "center", size: "lg" });
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)!;
  assert.equal(h1[1], "Every Plumbing Solution <br/>Under One Roof");
  assert.match(html, /data-hero-layout="plain"/);
});

test("breadcrumb is an ordered list with the current page marked", async () => {
  const html = await render({
    title: "Terms of Service",
    size: "sm",
    breadcrumb: [
      { name: "Home", href: "/" },
      { name: "Terms", href: "/terms" },
    ],
  });
  assert.match(html, /<nav aria-label="Breadcrumb"[^>]*><ol/);
  assert.match(html, /<span aria-current="page"[^>]*>Terms<\/span>/);
  assert.match(html, /href="\/"/);
  assert.doesNotMatch(html, /href="\/terms"/);
});

test("a resolved frame fills a photo hero; a bare path gives the plain hero", async () => {
  const { heroFrame } = await import("../src/lib/hero-frame");
  const frame = heroFrame(serviceHeroImage("repiping"));
  const photo = await render({ title: "Repiping in Cape Coral, FL", frame, layout: "split", size: "sm" });
  assert.match(photo, /<section[^>]*data-hero-photo=""[^>]*data-hero-layout="photo"/);
  assert.match(photo, /<img[^>]*sizes="100vw"/);
  assert.match(photo, /class="hero-scrim/);
  const h1 = photo.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)!;
  assert.equal(h1[1], "Repiping in Cape Coral, FL");
  const bare = await render({ title: "Repiping in Cape Coral, FL", image: serviceHeroImage("repiping"), size: "sm" });
  assert.match(bare, /data-hero-layout="plain"/);
  assert.doesNotMatch(bare, /<img/);
  const compact = await render({ title: "Contact", frame, layout: "compact" });
  assert.match(compact, /data-hero-layout="plain"/);
  assert.doesNotMatch(compact, /<img/);
});
