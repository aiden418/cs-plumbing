import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { installMediaStubs } from "./fixtures/media-stubs";
import { BUSINESS } from "../src/lib/business";

installMediaStubs();

// The footer's hrefs before the redesign, taken from the baseline snapshot of
// the live site (route "/", the same on /about, /services/water-heaters,
// /areas/cape-coral and /contact). Every one must still be in the footer.
const fixture = JSON.parse(
  readFileSync(path.join(import.meta.dirname, "fixtures", "footer-links.before.json"), "utf8"),
) as { hrefs: string[] };

/** The company line when the links were frozen. */
const FROZEN_COMPANY_DIGITS = "8337586248";

/** tel: and sms: links compare by digits (the href gained its +1); URLs ignore a trailing slash. */
function normalize(href: string): string {
  const h = href.replace(/&amp;/g, "&").trim();
  // The company line is compared as "the company line" (tel and sms), so
  // changing the number in src/lib/business.ts does not break this test.
  if (h.startsWith("tel:") || h.startsWith("sms:")) {
    const scheme = h.slice(0, 4);
    const rest = scheme === "sms:" ? h.slice(4).split("?")[0] : h.slice(4);
    const digits = rest.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    const who = digits === FROZEN_COMPANY_DIGITS || digits === BUSINESS.phoneRaw ? "company" : digits;
    const query = scheme === "sms:" && h.includes("?") ? h.slice(h.indexOf("?")) : "";
    return `${scheme}${who}${query}`;
  }
  // The license link is compared as "the state's license site": the DBPR
  // retired the frozen wl11.asp address in 2026 (it no longer loads), so the
  // footer now opens the license's own record on the state's new portal.
  if (/^https:\/\/www\.myfloridalicense\.com\//.test(h)) return "https://www.myfloridalicense.com (license record)";
  if (/^https?:\/\//.test(h)) return h.replace(/\/$/, "");
  return h;
}

async function renderFooter(): Promise<string> {
  const { default: Footer } = await import("../src/components/layout/Footer");
  return renderToStaticMarkup(createElement(Footer));
}

function hrefsIn(html: string): Set<string> {
  return new Set([...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => normalize(m[1])));
}

test("the fixture holds the footer links of the site before the redesign", () => {
  assert.ok(fixture.hrefs.length >= 50, `expected the full footer set, got ${fixture.hrefs.length}`);
  assert.ok(fixture.hrefs.some((h) => h.startsWith("tel:")));
});

test("every footer link of the site before the redesign is still in the footer", async () => {
  const produced = hrefsIn(await renderFooter());
  const missing = fixture.hrefs.filter((href) => !produced.has(normalize(href)));
  assert.deepEqual(missing, [], `footer lost links: ${missing.join(", ")}`);
});

test("the footer's license link opens the state's record for the company license", async () => {
  const html = await renderFooter();
  const href = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)]
    .map((m) => m[1].replace(/&amp;/g, "&"))
    .find((h) => h.includes("myfloridalicense.com"));
  assert.equal(href, BUSINESS.licenseRecordUrl);
});

test("the footer is the no-JavaScript menu target and is not a client component", async () => {
  const html = await renderFooter();
  assert.match(html, /<nav[^>]*id="footer-nav"[^>]*aria-label="Footer"|<nav[^>]*aria-label="Footer"[^>]*id="footer-nav"/);
  const source = readFileSync(path.join(import.meta.dirname, "..", "src", "components", "layout", "Footer.tsx"), "utf8");
  assert.doesNotMatch(source, /^\s*["']use client["']/m);
});
