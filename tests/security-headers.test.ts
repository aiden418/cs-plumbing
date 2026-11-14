import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import nextConfig from "../next.config";

type Header = { key: string; value: string };
const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")) as {
  headers: { source: string; headers: Header[] }[];
};
const siteWide = vercel.headers.find((h) => h.source === "/(.*)");
const header = (key: string) => siteWide?.headers.find((h) => h.key.toLowerCase() === key.toLowerCase())?.value;

test("every response carries the clickjacking protections (CSP frame-ancestors + X-Frame-Options)", () => {
  assert.ok(siteWide, "site-wide header rule exists");
  assert.match(header("Content-Security-Policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(header("X-Frame-Options"), "DENY");
});

test("transport and content-type hardening headers are present", () => {
  assert.match(header("Strict-Transport-Security") ?? "", /max-age=\d{7,}/);
  assert.match(header("Strict-Transport-Security") ?? "", /includeSubDomains/);
  assert.equal(header("X-Content-Type-Options"), "nosniff");
  assert.ok(header("Referrer-Policy"));
  assert.ok(header("Permissions-Policy"));
});

test("Next.js config does not advertise the framework or allow SVG through the image optimizer", () => {
  assert.equal(nextConfig.poweredByHeader, false);
  assert.notEqual(nextConfig.images?.dangerouslyAllowSVG, true);
  assert.equal(nextConfig.productionBrowserSourceMaps ?? false, false);
});
