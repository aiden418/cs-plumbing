import { test } from "node:test";
import assert from "node:assert/strict";
import { BUILDER_UPLOAD, collectAttachments, safeFilename } from "../src/lib/api/attachments";
import { PHOTO_UPLOAD } from "../src/lib/photo-upload";

function form(field: string, files: File[]) {
  const fd = new FormData();
  fd.append("name", "Test Homeowner");
  for (const f of files) fd.append(field, f);
  return fd;
}
const png = (name = "photo.png", bytes = 1024) => new File([new Uint8Array(bytes)], name, { type: "image/png" });

test("accepts JPG/PNG/PDF and returns base64 attachments with safe names", async () => {
  const fd = form(PHOTO_UPLOAD.field, [
    png("kitchen leak.png"),
    new File([new Uint8Array(10)], "plan.pdf", { type: "application/pdf" }),
  ]);
  const out = await collectAttachments(fd);
  assert.ok("attachments" in out);
  assert.equal(out.attachments.length, 2);
  assert.equal(out.attachments[0].filename, "kitchen leak.png");
  assert.match(out.attachments[0].content, /^[A-Za-z0-9+/=]+$/);
});

test("rejects a file type the forms do not accept", async () => {
  const fd = form(PHOTO_UPLOAD.field, [new File(["hello"], "notes.txt", { type: "text/plain" })]);
  const out = await collectAttachments(fd);
  assert.ok("error" in out);
  assert.match(out.error, /only JPG, PNG and PDF/);
});

test("rejects an executable disguised with an image extension but a non-image type", async () => {
  const fd = form(BUILDER_UPLOAD.field, [new File(["MZ"], "plans.jpg.exe", { type: "application/x-msdownload" })]);
  const out = await collectAttachments(fd, BUILDER_UPLOAD);
  assert.ok("error" in out);
});

test("rejects an HTML file on the builder portal (type was previously unchecked there)", async () => {
  const fd = form(BUILDER_UPLOAD.field, [new File(["<script>"], "plans.html", { type: "text/html" })]);
  const out = await collectAttachments(fd, BUILDER_UPLOAD);
  assert.ok("error" in out);
  assert.match(out.error, /only JPG, PNG and PDF/);
});

test("enforces the per-form file count", async () => {
  const six = Array.from({ length: PHOTO_UPLOAD.maxFiles + 1 }, (_, i) => png(`p${i}.png`));
  const out = await collectAttachments(form(PHOTO_UPLOAD.field, six));
  assert.ok("error" in out);
  assert.match(out.error, new RegExp(`at most ${PHOTO_UPLOAD.maxFiles} files`));

  const eleven = Array.from({ length: BUILDER_UPLOAD.maxFiles + 1 }, (_, i) => png(`p${i}.png`));
  const out2 = await collectAttachments(form(BUILDER_UPLOAD.field, eleven), BUILDER_UPLOAD);
  assert.ok("error" in out2);
  assert.match(out2.error, new RegExp(`at most ${BUILDER_UPLOAD.maxFiles} files`));
});

test("enforces per-file and total size limits", async () => {
  const big = png("big.png", PHOTO_UPLOAD.maxBytesEach + 1);
  const out = await collectAttachments(form(PHOTO_UPLOAD.field, [big]));
  assert.ok("error" in out);
  assert.match(out.error, /larger than/);

  const three = [png("a.png", 2 * 1024 * 1024), png("b.png", 2 * 1024 * 1024), png("c.png", 1024)];
  const out2 = await collectAttachments(form(PHOTO_UPLOAD.field, three));
  assert.ok("error" in out2);
  assert.match(out2.error, /add up to more than/);
});

test("ignores files posted under a different field name", async () => {
  const fd = form("files", [png()]);
  const out = await collectAttachments(fd); // homeowner limits look at "photos"
  assert.ok("attachments" in out);
  assert.equal(out.attachments.length, 0);
});

test("safeFilename strips path separators, control characters and leading dots", () => {
  assert.doesNotMatch(safeFilename("../../etc/passwd"), /[/\\]/);
  assert.doesNotMatch(safeFilename("../../etc/passwd"), /^\./);
  assert.doesNotMatch(safeFilename("plans.pdf\r\nX-Injected: 1"), /[\r\n:]/);
  assert.equal(safeFilename(""), "attachment");
  assert.equal(safeFilename("Site Plan (rev-2).pdf"), "Site Plan (rev-2).pdf");
  assert.ok(safeFilename("x".repeat(500)).length <= 120);
});
