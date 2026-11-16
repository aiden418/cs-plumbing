import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FileUpload, { PlanSetTooLarge } from "../src/components/builder-portal/FileUpload";
import BuilderBidForm from "../src/components/builders/BuilderBidForm";
import { BUSINESS } from "../src/lib/constants";
import { PHOTO_UPLOAD } from "../src/lib/photo-upload";
import { PLAN_SET_MAX_BYTES } from "../src/lib/plan-upload";

/**
 * What the upload control tells a visitor about size, read from the HTML it
 * renders on the server. No browser is involved, so this covers what is on
 * screen before anyone clicks (the hint) and the wording of the
 * oversized-plan-set message. The pre-check firing when files are chosen is
 * left to the browser QA pass; its arithmetic is in plan-upload.test.ts.
 */

const MB = 1024 * 1024;
/** Production refuses a request body larger than this before any route code runs. */
const PLATFORM_BODY_LIMIT_MB = 4.5;
const PLAN_SET_MB = PLAN_SET_MAX_BYTES / MB;

const noop = () => {};
/** The line under "Drag & drop files here", found by its text so restyling does not matter. */
const hintOf = (html: string) => html.match(/PDF, JPG, PNG[^<]*/)?.[0] ?? "";

test("the upload hint on a builder form states the combined cap", () => {
  const html = renderToStaticMarkup(
    createElement(FileUpload, {
      files: [],
      onChange: noop,
      maxTotalBytes: PLAN_SET_MAX_BYTES,
      largePlanSetEmail: BUSINESS.email,
    }),
  );
  assert.equal(hintOf(html), `PDF, JPG, PNG · Up to 10 files · ${PLAN_SET_MB} MB total`);
});

test("the homeowner forms keep their per-file hint", () => {
  // The props ServiceRequestForm and BookingPage pass.
  const html = renderToStaticMarkup(
    createElement(FileUpload, {
      files: [],
      onChange: noop,
      maxFiles: PHOTO_UPLOAD.maxFiles,
      maxSizeMb: PHOTO_UPLOAD.maxBytesEach / MB,
      compact: true,
    }),
  );
  assert.equal(
    hintOf(html),
    `PDF, JPG, PNG · Up to ${PHOTO_UPLOAD.maxFiles} files · ${PHOTO_UPLOAD.maxBytesEach / MB}MB max each`,
  );
});

test("no upload hint promises more than production accepts, with or without props", () => {
  const variants = [
    createElement(FileUpload, { files: [], onChange: noop }),
    createElement(FileUpload, { files: [], onChange: noop, maxTotalBytes: PLAN_SET_MAX_BYTES }),
    createElement(BuilderBidForm, { source: "builders-hub" }),
  ];
  for (const variant of variants) {
    const hint = hintOf(renderToStaticMarkup(variant));
    const sizes = [...hint.matchAll(/(\d+(?:\.\d+)?)\s?MB/g)].map((m) => Number(m[1]));
    assert.ok(sizes.length > 0, `the hint states a size: "${hint}"`);
    for (const size of sizes) assert.ok(size <= PLATFORM_BODY_LIMIT_MB, `"${hint}"`);
  }
});

test("the short bid form shows the combined cap on its plan upload", () => {
  const html = renderToStaticMarkup(createElement(BuilderBidForm, { source: "builders-hub" }));
  assert.ok(hintOf(html).endsWith(` · ${PLAN_SET_MB} MB total`), hintOf(html));
});

test("an oversized plan set is answered with the cap and the office address as a mailto link", () => {
  const html = renderToStaticMarkup(
    createElement(PlanSetTooLarge, { maxBytes: PLAN_SET_MAX_BYTES, email: BUSINESS.email }),
  );
  assert.ok(html.includes(`over its ${PLAN_SET_MB} MB total limit`), html);
  assert.match(html, /email large plan sets to/);
  assert.ok(html.includes(`<a href="mailto:${BUSINESS.email}"`), html);
  assert.ok(html.includes(`>${BUSINESS.email}</a>`), html);

  // Without an address there is nothing to offer, and no dangling link.
  const bare = renderToStaticMarkup(createElement(PlanSetTooLarge, { maxBytes: PLAN_SET_MAX_BYTES }));
  assert.match(bare, /Choose fewer or\s+smaller files\.$/);
  assert.doesNotMatch(bare, /mailto:|<a /);
});
