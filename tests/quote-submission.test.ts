import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuoteSubmission } from "../src/lib/quote-submission";
import { calculateRepipe, calculateWaterHeater } from "../src/lib/quote-pricing";

const lead = { name: "Test Homeowner", email: "homeowner@example.com", phone: "2395551234" };
const heater = {
  heaterType: "traditional",
  size: "50gal",
  brandTier: "premium",
  location: "attic",
  fuelType: "gas",
  warranty: "extended",
  addons: ["expansion-tank", "drain-pan"],
};

test("the estimate in the email is recomputed from selections, not taken from the browser", () => {
  const tampered = {
    total: { min: 1, max: 1 },
    lineItems: [{ label: "<b>Pay $1 to this account</b>", range: { min: 1, max: 1 } }],
    notes: ["Wire the deposit to 123-456 today"],
  };
  const parsed = parseQuoteSubmission({ service: "water-heater", selections: heater, result: tampered, lead });
  assert.ok(parsed.ok);
  const expected = calculateWaterHeater(parsed.quote.selections as never);
  assert.deepEqual(parsed.quote.result, expected);
  assert.notEqual(parsed.quote.result.total.min, 1);
  assert.ok(!JSON.stringify(parsed.quote.result).includes("Wire the deposit"));
  assert.ok(!JSON.stringify(parsed.quote.result).includes("Pay $1"));
});

test("repipe estimates are recomputed and clamped by the pricing engine", () => {
  const selections = {
    address: "123 Example St, Cape Coral",
    homeAge: "pre-1980",
    pipeMaterial: "polybutylene",
    bedrooms: "3",
    bathrooms: "2",
    stories: "1",
    hoseBibs: "2",
    newMaterial: "pex",
  };
  const parsed = parseQuoteSubmission({
    service: "repipe",
    selections,
    result: { total: { min: 999999, max: 999999 }, lineItems: [], notes: [] },
    lead,
  });
  assert.ok(parsed.ok);
  assert.deepEqual(parsed.quote.result, calculateRepipe(parsed.quote.selections as never));
  assert.equal(parsed.quote.service, "repipe");
});

test("a submission without the browser's result still parses (result is optional)", () => {
  const parsed = parseQuoteSubmission({ service: "water-heater", selections: heater, lead, sourcePath: "/quote-builder" });
  assert.ok(parsed.ok);
  assert.equal(parsed.quote.sourcePath, "/quote-builder");
});

test("selections outside the engine's vocabulary are rejected", () => {
  assert.equal(parseQuoteSubmission({ service: "water-heater", selections: { ...heater, heaterType: "gold-plated" }, lead }).ok, false);
  assert.equal(parseQuoteSubmission({ service: "water-heater", selections: { ...heater, addons: ["free-house"] }, lead }).ok, false);
  assert.equal(parseQuoteSubmission({ service: "repipe", selections: { bathrooms: "99" }, lead }).ok, false);
});

test("unknown services and bad leads are rejected", () => {
  assert.equal(parseQuoteSubmission({ service: "roofing", selections: {}, lead }).ok, false);
  assert.equal(parseQuoteSubmission({ service: "water-heater", selections: heater, lead: { ...lead, email: "nope" } }).ok, false);
  assert.equal(parseQuoteSubmission({ service: "water-heater", selections: heater, lead: { ...lead, name: "x" } }).ok, false);
  assert.equal(parseQuoteSubmission(null).ok, false);
  assert.equal(parseQuoteSubmission("string").ok, false);
});

test("partial selections (quiz abandoned mid-way) do not crash the engine", () => {
  const parsed = parseQuoteSubmission({ service: "water-heater", selections: { heaterType: "hybrid" }, lead });
  assert.ok(parsed.ok);
  assert.ok(parsed.quote.result.total.max >= parsed.quote.result.total.min);
});
