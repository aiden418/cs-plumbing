import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { proxy } from "../src/proxy";
import { ATTRIBUTION_COOKIE, attributionLabel, captureAttribution, decodeAttribution, encodeAttribution, attributionFromRequest } from "../src/lib/lead-attribution";
import { leadAttributionHtml } from "../src/lib/api/lead-attribution-email";

const now = new Date("2026-11-16T12:00:00Z");
const visit = (query: string, referrer: string | null = null) => captureAttribution(new URL(`https://www.csplumbinglee.com/contact${query}`), referrer, now);
const cookie = (query: string) => `${ATTRIBUTION_COOKIE}=${encodeAttribution(visit(query)!)}`;

test("Google Search paid tags, generic click IDs and paid social stay distinct", () => {
  assert.equal(attributionLabel(visit("?utm_source=google&utm_medium=paid_search&utm_id=123")), "Paid - Google Search");
  for (const id of ["gclid", "gbraid", "wbraid"]) assert.equal(attributionLabel(visit(`?${id}=test-click`)), "Paid - Google Ads (unspecified)");
  assert.equal(attributionLabel(visit("?utm_source=fb&utm_medium=paid_social")), "Paid - Facebook");
  assert.equal(attributionLabel(visit("?utm_source=ig&utm_medium=paid_social")), "Paid - Instagram");
  assert.equal(attributionLabel(visit("?utm_source=an&utm_medium=paid_social")), "Paid - Meta (unspecified)");
});

test("unpaid Facebook clicks and untagged Google referrals are never labeled paid", () => {
  assert.equal(attributionLabel(visit("?fbclid=organic-share", "https://www.facebook.com/")), "Unverified / non-paid source");
  assert.equal(attributionLabel(visit("", "https://www.google.com/")), "Unverified / non-paid source");
  assert.equal(attributionLabel(visit("?utm_source=google&utm_medium=organic")), "Unverified / non-paid source");
  assert.equal(attributionLabel(visit("?utm_source={{site_source_name}}&utm_medium=paid_social")), "Unverified / non-paid source");
});

test("direct and internal navigation do not replace an earlier source", () => {
  assert.equal(visit(""), null);
  assert.equal(visit("", "https://csplumbinglee.com/services"), null);
  assert.equal(visit("", "https://www.csplumbinglee.com/services"), null);
});

test("capture excludes arbitrary query data, fragments and full referring URLs", () => {
  const a = visit("?email=private%40example.com&utm_source=google#private", "https://www.google.com/search?q=private");
  assert.equal(a?.landingPath, "/contact");
  assert.equal(a?.referrerHost, "www.google.com");
  assert.deepEqual(a?.tags, { utm_source: "google" });
  assert.ok(!JSON.stringify(a).includes("private"));
});

test("cookie expiry, malformed data and GPC cannot produce paid attribution", () => {
  const value = encodeAttribution(visit("?gclid=test")!);
  assert.equal(decodeAttribution(value, new Date("2026-12-17")), null);
  assert.equal(decodeAttribution(value, new Date("2026-11-15")), null);
  for (const invalid of ["%xx", "[]", "null", "x".repeat(4000)]) assert.equal(decodeAttribution(invalid, now), null);
  const r = new Request("https://www.csplumbinglee.com/api/contact", { headers: { cookie: cookie("?gclid=test"), "sec-gpc": "1" } });
  assert.equal(attributionFromRequest(r, now), null);
});

test("office receipt has escaped source evidence and a stable lead ID", () => {
  const a = captureAttribution(new URL("https://www.csplumbinglee.com/?utm_source=fb&utm_medium=paid_social&utm_campaign=%3Cscript%3E"), null)!;
  const r = new Request("https://www.csplumbinglee.com/api/contact", { headers: { cookie: `${ATTRIBUTION_COOKIE}=${encodeAttribution(a)}` } });
  const html = leadAttributionHtml(r, "lead-123");
  assert.match(html, /lead-123/);
  assert.match(html, /Paid - Facebook/);
  assert.match(html, /&lt;script&gt;/);
  assert.ok(!html.includes("<script>"));
});

test("proxy persists real landing source securely, skips prefetch, honors opt-out and preserves direct returns", () => {
  const previous = process.env.NEXT_PUBLIC_ANALYTICS;
  process.env.NEXT_PUBLIC_ANALYTICS = "on";
  try {
    const req = (url: string, headers = {}) => new NextRequest(url, { headers: { accept: "text/html", ...headers } });
    const tagged = "https://www.csplumbinglee.com/?utm_source=google&utm_medium=paid_search";
    const result = proxy(req(tagged));
    const saved = result.cookies.get(ATTRIBUTION_COOKIE);
    const sentCookie = result.headers.get("set-cookie")!.split(";")[0];
    const returnedRequest = new Request("https://www.csplumbinglee.com/api/contact", { headers: { cookie: sentCookie } });
    assert.equal(attributionLabel(attributionFromRequest(returnedRequest)), "Paid - Google Search");
    assert.equal(saved?.httpOnly, true);
    assert.equal(saved?.secure, true);
    assert.equal(saved?.sameSite, "lax");
    assert.equal(saved?.maxAge, 2592000);
    assert.equal(proxy(req(tagged, { "next-router-prefetch": "1" })).cookies.getAll().length, 0);
    assert.equal(proxy(req("https://www.csplumbinglee.com/booking", { cookie: cookie("?gclid=test") })).cookies.getAll().length, 0);
    const cleared = proxy(req(tagged, { "sec-gpc": "1", cookie: cookie("?gclid=test") }));
    assert.equal(cleared.cookies.get(ATTRIBUTION_COOKIE)?.value, "");
    process.env.NEXT_PUBLIC_ANALYTICS = "off";
    assert.equal(proxy(req(tagged)).cookies.getAll().length, 0);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_ANALYTICS;
    else process.env.NEXT_PUBLIC_ANALYTICS = previous;
  }
});
