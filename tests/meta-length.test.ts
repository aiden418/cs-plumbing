import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AREA_LANDINGS,
  BLOG_POSTS,
  COMPLETED_PROJECT_TEXT,
  SERVICE_LANDINGS,
} from "../src/lib/constants";
import { NEW_CONSTRUCTION_CITIES } from "../src/lib/builder-program";
import { PUBLISHED_LANDINGS } from "../src/lib/landing-indexing";

// Search results cut a description off at about 155 characters, and site
// audits report every page that goes over. In November 2026 an audit listed
// 62 pages for it. These are the data-driven pages (service hubs, city
// landings, area pages, blog posts, projects, builder city pages): about
// nine in ten of the site. A description typed straight into a page.tsx is
// not covered here.
//
// Lengths are measured on the finished string, so a phone number, license
// number or price that is filled in from BUSINESS or the price sheet counts
// at its real length.
const DESCRIPTION_MAX = 155;
// The same audits report a headline over 70 characters.
const HEADLINE_MAX = 70;

const described: Record<string, readonly { slug: string; metaDescription: string }[]> = {
  "service hub": SERVICE_LANDINGS,
  "area page": AREA_LANDINGS,
  "blog post": BLOG_POSTS,
  project: COMPLETED_PROJECT_TEXT,
  "city landing": PUBLISHED_LANDINGS,
  "builder city page": NEW_CONSTRUCTION_CITIES,
};

test(`every meta description is ${DESCRIPTION_MAX} characters or fewer`, () => {
  const over = Object.entries(described).flatMap(([kind, pages]) =>
    pages
      .filter((p) => p.metaDescription.length > DESCRIPTION_MAX)
      .map((p) => `${kind} "${p.slug}": ${p.metaDescription.length} characters`),
  );
  assert.deepEqual(over, [], `shorten these to ${DESCRIPTION_MAX} characters or fewer`);
});

test("no two pages share a meta description", () => {
  const seen = new Map<string, string>();
  const repeated: string[] = [];
  for (const [kind, pages] of Object.entries(described)) {
    for (const p of pages) {
      const first = seen.get(p.metaDescription);
      if (first) repeated.push(`${kind} "${p.slug}" repeats ${first}`);
      else seen.set(p.metaDescription, `${kind} "${p.slug}"`);
    }
  }
  assert.deepEqual(repeated, []);
});

test(`every blog and city-landing headline is ${HEADLINE_MAX} characters or fewer`, () => {
  const over = [
    ...BLOG_POSTS.filter((p) => p.title.length > HEADLINE_MAX).map((p) => `blog post "${p.slug}": ${p.title.length}`),
    ...PUBLISHED_LANDINGS.filter((l) => l.h1.length > HEADLINE_MAX).map((l) => `city landing "${l.slug}": ${l.h1.length}`),
  ];
  assert.deepEqual(over, [], `shorten these headlines to ${HEADLINE_MAX} characters or fewer`);
});
