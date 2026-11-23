import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, isHoneypotTripped, officeRecipient, rateLimit } from "../src/lib/api/secure";
import { BUSINESS } from "../src/lib/business";

test("escapeHtml neutralizes markup and attribute breakouts", () => {
  assert.equal(escapeHtml(`<img src=x onerror="alert(1)">`), "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  assert.equal(escapeHtml(`O'Brien & Sons </a>`), "O&#39;Brien &amp; Sons &lt;&#x2F;a&gt;");
  assert.equal(escapeHtml(null), "");
  assert.equal(escapeHtml(undefined), "");
  assert.equal(escapeHtml(42), "42");
});

test("honeypot trips only on a non-empty value", () => {
  assert.equal(isHoneypotTripped(""), false);
  assert.equal(isHoneypotTripped("   "), false);
  assert.equal(isHoneypotTripped(undefined), false);
  assert.equal(isHoneypotTripped("http://spam.example"), true);
});

test("rateLimit allows the limit and refuses the next request from the same ip", () => {
  const ip = `test-${Math.random()}`;
  for (let i = 0; i < 5; i++) assert.equal(rateLimit(ip).ok, true);
  const refused = rateLimit(ip);
  assert.equal(refused.ok, false);
  assert.ok(!refused.ok && refused.retryAfter > 0 && refused.retryAfter <= 60);
  assert.equal(rateLimit(`other-${Math.random()}`).ok, true);
});

// Form notifications on the live site go to the shared office inbox and
// nowhere else. A saved ADMIN_EMAIL in the Production environment (its value
// cannot be read back from Vercel) must not be able to send a customer's
// request to one person's mailbox.
test("the live site sends office copies to the shared inbox, whatever ADMIN_EMAIL holds", () => {
  assert.equal(officeRecipient({ VERCEL_ENV: "production", ADMIN_EMAIL: "someone@example.com" }), BUSINESS.email);
  assert.equal(officeRecipient({ VERCEL_ENV: "production" }), BUSINESS.email);
});

test("preview and local builds may redirect test mail, and default to the shared inbox", () => {
  assert.equal(officeRecipient({ VERCEL_ENV: "preview", ADMIN_EMAIL: "tests@example.com" }), "tests@example.com");
  assert.equal(officeRecipient({ ADMIN_EMAIL: "tests@example.com" }), "tests@example.com");
  assert.equal(officeRecipient({ ADMIN_EMAIL: "" }), BUSINESS.email);
  assert.equal(officeRecipient({}), BUSINESS.email);
});
