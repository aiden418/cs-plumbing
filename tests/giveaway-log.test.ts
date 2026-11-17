import { test } from "node:test";
import assert from "node:assert/strict";
import { ENTRY_COLUMNS, entriesCsv, exportKeyMatches, type EntryRow } from "../src/lib/giveaway-log";

const row = (over: Partial<EntryRow>): EntryRow =>
  ({ ...Object.fromEntries(ENTRY_COLUMNS.map((c) => [c, ""])), ...over }) as EntryRow;

test("entries CSV lists the oldest water heater first, unknown years last", () => {
  const csv = entriesCsv([
    row({ heaterYear: "2009", firstName: "C", receivedAt: "2026-11-18T10:00:00.000Z" }),
    row({ heaterYear: "Not sure", firstName: "E", receivedAt: "2026-11-18T09:00:00.000Z" }),
    row({ heaterYear: "1987", firstName: "B2", receivedAt: "2026-11-19T09:00:00.000Z" }),
    row({ heaterYear: "1987", firstName: "B1", receivedAt: "2026-11-18T09:00:00.000Z" }),
    row({ heaterYear: "Before 1960", firstName: "A", receivedAt: "2026-11-20T09:00:00.000Z" }),
  ]);
  const lines = csv.trim().split("\n");
  assert.equal(lines[0], ENTRY_COLUMNS.join(","));
  const names = lines.slice(1).map((line) => line.split(",")[ENTRY_COLUMNS.indexOf("firstName")]);
  assert.deepEqual(names, ["A", "B1", "B2", "C", "E"]);
});

test("entries CSV quotes commas and neutralizes cells a spreadsheet would run", () => {
  const csv = entriesCsv([
    row({ heaterYear: "1990", address: '12 Main St, Unit "B"', firstName: "=HYPERLINK(1)", phone: "+1 239 555 0100" }),
  ]);
  const line = csv.trim().split("\n")[1];
  assert.ok(line.includes('"12 Main St, Unit ""B"""'));
  assert.ok(line.includes("'=HYPERLINK(1)"));
  assert.ok(line.includes("'+1 239 555 0100"));
});

test("export key must be present, long enough and exact", () => {
  const key = "k".repeat(40);
  assert.equal(exportKeyMatches(key, key), true);
  assert.equal(exportKeyMatches(key.slice(1), key), false);
  assert.equal(exportKeyMatches(null, key), false);
  assert.equal(exportKeyMatches("", key), false);
  assert.equal(exportKeyMatches(key, undefined), false);
  assert.equal(exportKeyMatches("short", "short"), false);
});
