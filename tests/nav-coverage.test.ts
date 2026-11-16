/**
 * The new header must keep every link the old one had
 * (.redesign/spec/chrome-and-opening.md section 0).
 *
 * tests/fixtures/header-links.before.json was frozen from the pre-redesign
 * snapshot (.redesign/baseline/snapshot-before.json, route "/", the same on
 * four other routes) before the header was rewritten. Every frozen href must
 * be in the navigation data or among the header's fixed actions (the logo and
 * the call link). The old dropdowns and drawer were not in that snapshot
 * (they rendered only when open), so every NAV_LINKS href is checked too.
 */
import { before, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { installMediaStubs } from "./fixtures/media-stubs";
import { BUSINESS } from "../src/lib/business";
import { NAV_LINKS } from "../src/lib/constants";
import type { NavLink } from "../src/lib/types";

installMediaStubs();

type Navigation = typeof import("../src/content/navigation");
type Header = typeof import("../src/components/layout/SiteHeader");
let nav: Navigation;
let header: Header;
let available: Set<string>;
let html = "";

before(async () => {
  nav = await import("../src/content/navigation");
  header = await import("../src/components/layout/SiteHeader");
  available = new Set([...nav.navigationHrefs(), ...FIXED].map(normalize));
  html = renderToStaticMarkup(createElement(header.default));
});

const frozen: { hrefs: string[] } = JSON.parse(
  readFileSync(new URL("./fixtures/header-links.before.json", import.meta.url), "utf8"),
);

/** The company line when the links were frozen. The owner may change the number in src/lib/business.ts. */
const FROZEN_COMPANY_DIGITS = "8337586248";

/**
 * tel: links compare by their digits, ignoring a leading country code 1. The
 * company line is compared as "the company line", so changing the phone
 * number in business.ts does not break this test.
 */
function normalize(href: string): string {
  if (/^tel:/i.test(href)) {
    const all = href.replace(/\D/g, "");
    const digits = all.length === 11 && all.startsWith("1") ? all.slice(1) : all;
    return digits === FROZEN_COMPANY_DIGITS || digits === BUSINESS.phoneRaw ? "tel:company" : `tel:${digits}`;
  }
  return href;
}

/** The header's fixed actions: the logo (home) and the call link. */
const FIXED = ["/", BUSINESS.phoneHref];


function flatten(links: NavLink[]): NavLink[] {
  return links.flatMap((l) => [l, ...(l.children ? flatten(l.children) : [])]);
}

test("the frozen header link set is the one recorded before the redesign", () => {
  assert.ok(frozen.hrefs.length >= 10, "fixture looks empty");
  assert.ok(frozen.hrefs.includes("tel:8337586248"), "the old markup's call link is part of the frozen set");
});

test("every href of the old header is in the new navigation or its fixed actions", () => {
  const missing = frozen.hrefs.filter((href) => !available.has(normalize(href)));
  assert.deepEqual(missing, []);
});

test("every NAV_LINKS href (old dropdowns and drawer) is still reachable", () => {
  const missing = flatten(NAV_LINKS)
    .map((l) => l.href)
    .filter((href) => !available.has(normalize(href)));
  assert.deepEqual(missing, []);
});

test("labels and hrefs that NAV_LINKS has are taken from it, not retyped", () => {
  const byHref = new Map(flatten(NAV_LINKS).filter((l) => !l.children).map((l) => [l.href, l.label]));
  for (const group of Object.values(nav.NAV_GROUPS)) {
    for (const column of group.columns) {
      for (const link of column.links) {
        const label = byHref.get(link.href);
        // "Our story" is the spec's name for /about inside the About group.
        if (label !== undefined && link.href !== "/about") assert.equal(link.label, label, `${link.href} label`);
      }
    }
  }
});

test("groups match section 1 of the spec", () => {
  assert.deepEqual(
    nav.NAV_ORDER.map((i) => (i.kind === "group" ? i.group.label : i.link.label)),
    ["Services", "Builders", "Projects", "About", "Service Areas", "Contact"],
  );
  const [home, build] = nav.NAV_GROUPS.services.columns;
  assert.equal(home.title, "For your home");
  assert.deepEqual(
    home.links.map((l) => l.label),
    ["Residential", "Repiping", "Water Heaters", "Tankless Water Heaters", "Drain Cleaning", "Leak Repair", "Water Softeners", "Plumbing Remodels"],
  );
  assert.equal(build.title, "For builders & business");
  assert.deepEqual(build.links.map((l) => l.label), ["New Construction", "Commercial", "UEP Utilities"]);
  assert.deepEqual(
    nav.NAV_GROUPS.services.footer?.map((l) => l.label),
    ["Coastal Comeback Plan", "Emergency", "Instant Quote", "All services"],
  );
  assert.deepEqual(nav.NAV_GROUPS.services.photos.map((p) => p.id), ["home.door.home", "home.door.build"]);
  assert.deepEqual(
    nav.NAV_GROUPS.builders.columns.flatMap((c) => c.links.map((l) => l.href)),
    [
      "/builders",
      "/builders#bid",
      "/builders#prequal",
      "/builder-portal",
      "/new-construction-plumbing/cape-coral",
      "/new-construction-plumbing/fort-myers",
      "/new-construction-plumbing/lehigh-acres",
    ],
  );
  assert.deepEqual(nav.NAV_GROUPS.builders.photos.map((p) => p.id), ["builders.phase.underground"]);
  assert.deepEqual(
    nav.NAV_GROUPS.about.columns.flatMap((c) => c.links.map((l) => `${l.label} ${l.href}`)),
    ["Our story /about", "Reviews /reviews", "Awards /awards", "Gallery /gallery", "Blog /blog", "Recommended /partners", "FAQ /faq"],
  );
  assert.equal(nav.NAV_GROUPS.areas.columns.length, 3);
  assert.equal(nav.NAV_GROUPS.areas.columns.flatMap((c) => c.links).length, 11);
  assert.deepEqual(nav.NAV_GROUPS.areas.footer?.map((l) => l.href), ["/service-map"]);
  assert.deepEqual(
    [nav.NAV_GROUPS.services.href, nav.NAV_GROUPS.builders.href, nav.NAV_GROUPS.about.href, nav.NAV_GROUPS.areas.href],
    ["/services", "/builders", "/about", "/service-map"],
  );
  assert.deepEqual(nav.MOBILE_GROUPS.map((g) => g.id), ["services", "builders", "about", "areas"]);
  assert.deepEqual(nav.MOBILE_LINKS.map((l) => l.label), ["Projects", "Contact"]);
});

const hrefsIn = (markup: string) =>
  new Set([...markup.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&")));

test("the server HTML holds every link: header, all four panels and the mobile menu", () => {
  const inHtml = new Set([...hrefsIn(html)].map(normalize));
  const missing = [...available].filter((href) => !inHtml.has(href));
  assert.deepEqual(missing, []);
  assert.ok(hrefsIn(html).has(BUSINESS.smsHref), "Text us link");
  assert.ok(hrefsIn(html).has("#footer-nav"), "menu button falls back to the footer navigation");
});

test("panels are in the HTML, hidden, each wired to its disclosure button", () => {
  for (const id of ["services", "builders", "about", "areas"]) {
    assert.match(html, new RegExp(`<div id="nav-panel-${id}"[^>]*\\shidden=""`), `${id} panel hidden`);
    assert.match(
      html,
      new RegExp(`<button[^>]*id="nav-button-${id}"[^>]*aria-expanded="false"[^>]*aria-controls="nav-panel-${id}"`),
    );
  }
  assert.match(html, /<span class="sr-only">Show Services menu<\/span>/);
});

test("the mobile menu is a dialog with four details groups sharing one name", () => {
  assert.match(html, /<dialog[^>]*id="mobile-nav"/);
  assert.equal([...html.matchAll(/<details name="mnav"/g)].length, 4);
  assert.match(html, /Close menu/);
});

test("Opening contract: data-intro-in on the nav list, quote, book and menu button only", () => {
  const tagged = [...html.matchAll(/<(\w+)\b([^>]*\sdata-intro-in=""[^>]*)>/g)].map((m) => m[0]);
  assert.equal(tagged.length, 4, tagged.join("\n"));
  assert.ok(tagged.some((t) => t.startsWith("<ul") && t.includes("header-nav-list")));
  assert.ok(tagged.some((t) => t.includes('href="/quote-builder"')));
  assert.ok(tagged.some((t) => t.includes('href="/booking"')));
  assert.ok(tagged.some((t) => t.includes('href="#footer-nav"')));
  assert.ok(!tagged.some((t) => t.includes("tel:") || t.includes('aria-label="C&amp;S Plumbing of Lee, home"')));
});

test("no click handler markup on tel: links and the call label comes from BUSINESS", () => {
  assert.ok(html.includes(BUSINESS.phone));
  assert.doesNotMatch(html, /<a[^>]*href="tel:[^"]*"[^>]*onclick/i);
});

test("a panel without a picture renders with no photo; with one it shows the frame", () => {
  const empty = renderToStaticMarkup(createElement(header.Panel, { group: nav.NAV_GROUPS.services, lookup: () => null }));
  assert.doesNotMatch(empty, /<img/);
  assert.match(empty, /href="\/services\/repiping"/);
  const stub = { src: "/x.jpg", width: 800, height: 1000, alt: "x", path: "/x.jpg" };
  const full = renderToStaticMarkup(createElement(header.Panel, { group: nav.NAV_GROUPS.services, lookup: () => stub }));
  assert.equal([...full.matchAll(/<img/g)].length, 2);
  assert.match(full, /<figcaption[^>]*>For your home<\/figcaption>/);
});
