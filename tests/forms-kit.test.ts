import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  applyBlurFormat,
  describedBy,
  fieldIds,
  formatFileSize,
  formatPhoneDisplay,
  INPUT_PRESETS,
  normalizeZip,
  PRESET_BLUR_FORMAT,
  trimFields,
  trimValue,
} from "../src/components/forms/format";
import { Field } from "../src/components/forms/Field";
import { FieldError } from "../src/components/forms/FieldError";
import { Input } from "../src/components/forms/Input";
import { FormattedInput } from "../src/components/forms/FormattedInput";
import { Textarea } from "../src/components/forms/Textarea";
import { Select } from "../src/components/forms/Select";
import { Checkbox } from "../src/components/forms/Checkbox";
import { OptionCard } from "../src/components/forms/OptionCard";
import { OptionGroup } from "../src/components/forms/OptionGroup";
import { FormStatus } from "../src/components/forms/FormStatus";
import { FileUpload } from "../src/components/forms/FileUpload";
import { Honeypot } from "../src/components/forms/Honeypot";
import { SubmitRow } from "../src/components/forms/SubmitRow";

const ROOT = path.resolve(import.meta.dirname, "..");
const noop = () => {};
/** createElement with children as trailing arguments and loose props, for markup assertions. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const h = (type: any, props?: Record<string, unknown> | null, ...children: ReactNode[]) => createElement(type, props, ...children);
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

/* ---------------------------------------------------------------- format */

test("phone: ten digits in any arrangement are formatted on blur", () => {
  for (const raw of ["2395550134", "239-555-0134", "(239) 555 0134", " 239.555.0134 ", "+1 239 555 0134", "1-239-555-0134"]) {
    assert.equal(formatPhoneDisplay(raw), "(239) 555-0134", raw);
  }
});

test("phone: an extension is kept", () => {
  assert.equal(formatPhoneDisplay("239 555 0134 x12"), "(239) 555-0134 ext. 12");
  assert.equal(formatPhoneDisplay("2395550134 ext. 7"), "(239) 555-0134 ext. 7");
});

test("phone: anything else is never rejected, only trimmed", () => {
  for (const raw of ["555-0134", "833-PLUMB-IT", "+44 20 7946 0958", "23955501345678", "call me", ""]) {
    assert.equal(formatPhoneDisplay(raw), raw.trim(), raw);
  }
  assert.equal(formatPhoneDisplay("  555 0134  "), "555 0134");
});

test("zip: five or nine digits are normalised, anything else trimmed", () => {
  assert.equal(normalizeZip(" 33903 "), "33903");
  assert.equal(normalizeZip("339031234"), "33903-1234");
  assert.equal(normalizeZip("33903 1234"), "33903-1234");
  assert.equal(normalizeZip("33903-1234"), "33903-1234");
  assert.equal(normalizeZip("3390"), "3390");
  assert.equal(normalizeZip("Cape Coral"), "Cape Coral");
  assert.equal(normalizeZip(""), "");
});

test("trimming and blur formats", () => {
  assert.equal(trimValue("  Jane  Doe \n"), "Jane  Doe");
  assert.deepEqual(trimFields({ name: " Jane ", units: 4, note: undefined }), { name: "Jane", units: 4, note: undefined });
  assert.equal(applyBlurFormat("phone", "2395550134"), "(239) 555-0134");
  assert.equal(applyBlurFormat("zip", "339031234"), "33903-1234");
  assert.equal(applyBlurFormat("trim", "  a "), "a");
  assert.equal(applyBlurFormat("none", "  a "), "  a ");
});

test("presets set keyboard, autofill and correction attributes", () => {
  assert.deepEqual(INPUT_PRESETS.tel, {
    type: "tel", autoComplete: "tel", inputMode: "tel", enterKeyHint: "next", autoCapitalize: "off", spellCheck: false,
  });
  assert.equal(INPUT_PRESETS.email.type, "email");
  assert.equal(INPUT_PRESETS.email.inputMode, "email");
  assert.equal(INPUT_PRESETS.email.autoCapitalize, "off");
  assert.equal(INPUT_PRESETS.name.autoComplete, "name");
  assert.equal(INPUT_PRESETS.name.autoCapitalize, "words");
  assert.equal(INPUT_PRESETS["postal-code"].autoComplete, "postal-code");
  assert.equal(INPUT_PRESETS["postal-code"].inputMode, "numeric");
  assert.equal(INPUT_PRESETS["street-address"].autoComplete, "street-address");
  for (const preset of Object.values(INPUT_PRESETS)) assert.equal(preset.spellCheck, false);
  assert.equal(PRESET_BLUR_FORMAT.tel, "phone");
  assert.equal(PRESET_BLUR_FORMAT["postal-code"], "zip");
});

test("id helpers", () => {
  assert.deepEqual(fieldIds("phone"), { hintId: "phone-hint", errorId: "phone-error" });
  assert.equal(describedBy("a", false, undefined, "b", "a"), "a b");
  assert.equal(describedBy(false, null), undefined);
  assert.equal(formatFileSize(512), "512 B");
  assert.equal(formatFileSize(820 * 1024), "820 KB");
  assert.equal(formatFileSize(1.4 * 1024 * 1024), "1.4 MB");
});

/* ---------------------------------------------------------------- markup */

test("Input renders the preset attributes, explicit props win", () => {
  const html = renderToStaticMarkup(h(Input, { preset: "tel", name: "phone", id: "p" }));
  assert.match(html, /type="tel"/);
  assert.match(html, /autoComplete="tel"|autocomplete="tel"/i);
  assert.match(html, /inputMode="tel"|inputmode="tel"/i);
  assert.match(html, /enterKeyHint="next"|enterkeyhint="next"/i);
  assert.match(html, /spellCheck="false"|spellcheck="false"/i);
  assert.match(html, /name="phone"/);
  const override = renderToStaticMarkup(h(Input, { preset: "name", autoComplete: "given-name" }));
  assert.match(override, /autocomplete="given-name"/i);
  assert.match(renderToStaticMarkup(h(Input, {})), /type="text"/);
});

test("Field wires label, hint, error, aria-invalid and the required text", () => {
  const html = renderToStaticMarkup(
    h(Field, { id: "zip", label: "ZIP code", hint: "Five digits", error: "Enter a ZIP code", required: true }, h(Input, { name: "zip" })),
  );
  assert.match(html, /<label for="zip"/);
  assert.match(html, /\(required\)/);
  const input = html.match(/<input\b[^>]*>/)![0];
  assert.equal(attr(input, "id"), "zip");
  assert.equal(attr(input, "aria-describedby"), "zip-error zip-hint");
  assert.equal(attr(input, "aria-invalid"), "true");
  assert.match(input, /\brequired=""/);
  assert.match(html, /<p id="zip-hint"/);
  assert.match(html, /<p id="zip-error"[^>]*>.*<svg[^>]*aria-hidden="true".*Enter a ZIP code/);
});

test("Field without an error has no aria-invalid and no dangling describedby", () => {
  const html = renderToStaticMarkup(h(Field, { id: "email", label: "Email", optional: true }, h(Input, { preset: "email" })));
  const input = html.match(/<input\b[^>]*>/)![0];
  assert.equal(attr(input, "aria-invalid"), undefined);
  assert.equal(attr(input, "aria-describedby"), undefined);
  assert.doesNotMatch(input, /\brequired/);
  assert.match(html, />Optional</);
  assert.doesNotMatch(html, /email-error/);
});

test("Field accepts a render function and keeps the control's own describedby", () => {
  const fn = renderToStaticMarkup(
    h(Field, { id: "t", label: "T", hint: "h", children: (p: Record<string, unknown>) => h(Textarea, p) }),
  );
  assert.match(fn, /<textarea[^>]*id="t"[^>]*aria-describedby="t-hint"/);
  const merged = renderToStaticMarkup(h(Field, { id: "m", label: "M", hint: "h" }, h(Input, { "aria-describedby": "extra" })));
  assert.match(merged, /aria-describedby="m-hint extra"/);
});

test("FormattedInput server-renders as a plain input (works without JavaScript)", () => {
  const html = renderToStaticMarkup(h(FormattedInput, { preset: "tel", name: "phone", defaultValue: "2395550134" }));
  assert.match(html, /<input[^>]*type="tel"[^>]*name="phone"[^>]*value="2395550134"/);
});

test("Select is native with a placeholder option and an aria-hidden chevron", () => {
  const html = renderToStaticMarkup(
    h(Select, { id: "s", name: "service", placeholder: "Choose one" }, h("option", { value: "leak" }, "Leak")),
  );
  assert.match(html, /<select[^>]*name="service"/);
  assert.match(html, /<option value="" disabled="" selected="">Choose one<\/option>/);
  assert.match(html, /<svg[^>]*aria-hidden="true"/);
  assert.match(html, /appearance-none/);
});

test("controls use 16 px text (no iOS zoom) and 48 px height", () => {
  for (const html of [
    renderToStaticMarkup(h(Input, {})),
    renderToStaticMarkup(h(Select, {})),
    renderToStaticMarkup(h(Textarea, {})),
  ]) {
    const cls = html.match(/<(?:input|select|textarea)\b[^>]*class="([^"]*)"/)![1];
    assert.match(cls, /(^|\s)text-base(\s|$)/);
    assert.doesNotMatch(cls, /(^|\s)text-(xs|sm|\[(?:1[0-5]|[0-9])px\]|\[0\.\d+rem\])(\s|$)/);
  }
  assert.match(renderToStaticMarkup(h(Input, {})), /\bh-12\b/);
  assert.match(renderToStaticMarkup(h(Textarea, {})), /\bmin-h-28\b/);
});

test("Checkbox: native input, 44 px tall label row, error wired", () => {
  const html = renderToStaticMarkup(h(Checkbox, { id: "c", name: "consent", label: "Text me updates", error: "Tick to continue" }));
  assert.match(html, /<label for="c"[^>]*min-h-11/);
  const input = html.match(/<input\b[^>]*>/)![0];
  assert.equal(attr(input, "type"), "checkbox");
  assert.equal(attr(input, "name"), "consent");
  assert.equal(attr(input, "aria-describedby"), "c-error");
  assert.equal(attr(input, "aria-invalid"), "true");
  assert.match(input, /\bsize-6\b/);
});

test("OptionCard: a real radio, labelled by its title, described by its description", () => {
  const html = renderToStaticMarkup(
    h(OptionGroup, { id: "g", legend: "When do you need us?", required: true },
      h(OptionCard, { id: "u1", name: "urgency", value: "today", title: "Today", description: "Same-day visit", defaultChecked: true }),
      h(OptionCard, { id: "u2", name: "urgency", value: "week", title: "This week" }),
    ),
  );
  assert.match(html, /<fieldset[^>]*id="g"/);
  assert.match(html, /<legend[^>]*>When do you need us\?<span class="sr-only"> \(required\)<\/span><\/legend>/);
  const radios = html.match(/<input\b[^>]*>/g)!;
  assert.equal(radios.length, 2);
  for (const r of radios) {
    assert.equal(attr(r, "type"), "radio");
    assert.equal(attr(r, "name"), "urgency");
    assert.doesNotMatch(r, /tabindex/i);
  }
  assert.equal(attr(radios[0], "aria-labelledby"), "u1-title");
  assert.equal(attr(radios[0], "aria-describedby"), "u1-desc");
  assert.match(radios[0], /checked=""/);
});

test("FormStatus: success is a status, error is an alert", () => {
  assert.match(renderToStaticMarkup(h(FormStatus, { status: "success", title: "Sent" })), /role="status"/);
  assert.match(renderToStaticMarkup(h(FormStatus, { status: "error", title: "Not sent" }, "Call us")), /role="alert"[\s\S]*Not sent[\s\S]*Call us/);
});

test("FileUpload: the file input has NO name, is labelled, and lists files with remove buttons", () => {
  const html = renderToStaticMarkup(
    h(FileUpload<{ name: string; size: number; type: string }>, {
      id: "photos",
      label: "Photos",
      hint: "Up to 5 photos",
      files: [{ name: "leak.jpg", size: 800_000, type: "image/jpeg" }],
      onFilesAdded: noop,
      onFileRemove: noop,
    }),
  );
  const input = html.match(/<input\b[^>]*type="file"[^>]*>/)![0];
  assert.equal(attr(input, "name"), undefined);
  assert.equal(attr(input, "id"), "photos");
  assert.equal(attr(input, "aria-describedby"), "photos-hint photos-list");
  assert.match(html, /<label id="photos-button" for="photos"/);
  assert.match(html, /<button type="button"[^>]*aria-label="Remove leak.jpg"/);
  assert.match(html, /781 KB/);
});

test("Honeypot is exactly the markup ServiceRequestForm renders today", () => {
  const source = readFileSync(path.join(ROOT, "src/components/services/ServiceRequestForm.tsx"), "utf8");
  const original = source.match(/<input type="text" name="website"[^>]*\/>/)?.[0];
  assert.ok(original, "honeypot found in ServiceRequestForm.tsx");
  // Same attributes and values (React decides the order it prints them in).
  const fromJsx = Object.fromEntries(
    [...original!.matchAll(/([\w-]+)=(?:"([^"]*)"|\{(-?\d+)\})/g)].map((m) => [m[1].toLowerCase().replace("classname", "class"), m[2] ?? m[3]]),
  );
  const rendered = renderToStaticMarkup(h(Honeypot));
  const fromHtml = Object.fromEntries([...rendered.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1].toLowerCase(), m[2]]));
  assert.deepEqual(fromHtml, fromJsx);
  assert.equal(Object.keys(fromHtml).length, 6);
});

test("SubmitRow: a real submit; loading keeps the label, adds aria-busy and stops presses", () => {
  const idle = renderToStaticMarkup(h(SubmitRow, { label: "Send request", secondaryHref: "/contact", secondaryLabel: "Other ways to reach us" }));
  assert.match(idle, /<button type="submit"/);
  assert.doesNotMatch(idle, /aria-busy|disabled=""/);
  assert.match(idle, /<a[^>]*href="\/contact"/);
  const busy = renderToStaticMarkup(h(SubmitRow, { label: "Send request", loading: true }));
  assert.match(busy, /aria-busy="true"/);
  assert.match(busy, /disabled=""/);
  assert.match(busy, /Send request/);
});

test("FieldError renders nothing without a message", () => {
  assert.equal(renderToStaticMarkup(h(FieldError, { id: "x" })), "");
  assert.equal(renderToStaticMarkup(h(FieldError, { id: "x" }, "")), "");
});
