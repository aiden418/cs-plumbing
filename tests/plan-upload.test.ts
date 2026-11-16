import { test } from "node:test";
import assert from "node:assert/strict";
import { PLAN_SET_MAX_BYTES, planSetTooLarge } from "../src/lib/plan-upload";
import { BUILDER_UPLOAD } from "../src/lib/api/attachments";
import { PHOTO_UPLOAD } from "../src/lib/photo-upload";

const MB = 1024 * 1024;
/** Production refuses a request body larger than this before any route code runs. */
const PLATFORM_BODY_LIMIT = 4.5 * MB;

const pdf = (bytes: number, name = "plans.pdf") =>
  new File([new Uint8Array(bytes)], name, { type: "application/pdf" });

test("the plan-set cap leaves room under the platform's request-body limit", () => {
  // The same request carries a dozen text fields (the description alone may be
  // 5,000 characters) and the multipart framing for up to ten files.
  assert.ok(PLAN_SET_MAX_BYTES + 256 * 1024 <= PLATFORM_BODY_LIMIT);
});

test("the plan-set cap is the homeowner forms' total, not a second number", () => {
  assert.equal(PLAN_SET_MAX_BYTES, PHOTO_UPLOAD.maxBytesTotal);
});

test("the server accepts every selection the browser lets through", () => {
  assert.ok(PLAN_SET_MAX_BYTES <= BUILDER_UPLOAD.maxBytesEach);
  assert.ok(PLAN_SET_MAX_BYTES <= BUILDER_UPLOAD.maxBytesTotal);
});

test("a 6 MB plan set is stopped in the browser; one that fits is not", () => {
  assert.equal(planSetTooLarge([pdf(6 * MB)]), true);
  assert.equal(planSetTooLarge([pdf(3 * MB)]), false);
  assert.equal(planSetTooLarge([]), false);
});

test("the cap applies to the files together and is inclusive", () => {
  const half = PLAN_SET_MAX_BYTES / 2;
  // exactly the cap
  assert.equal(planSetTooLarge([pdf(half, "a.pdf"), pdf(half, "b.pdf")]), false);
  // one byte over, although no single file is anywhere near the cap
  assert.equal(planSetTooLarge([pdf(half, "a.pdf"), pdf(half, "b.pdf"), pdf(1, "c.pdf")]), true);
});

test("a different cap can be passed in", () => {
  assert.equal(planSetTooLarge([pdf(2 * MB)], 1 * MB), true);
  assert.equal(planSetTooLarge([pdf(2 * MB)], 2 * MB), false);
});
