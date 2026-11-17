/**
 * The giveaway entry log as a spreadsheet: column order, the judging sort
 * (oldest water heater first) and the CSV the entries sheet imports from
 * /api/giveaway/export. Dependency-free so it can be unit-tested without the
 * Next.js runtime or the blob store.
 */
import { timingSafeEqual } from "node:crypto";

export const ENTRY_COLUMNS = [
  "heaterYear",
  "heaterAge",
  "receivedAt",
  "firstName",
  "lastName",
  "phone",
  "email",
  "homeowner",
  "enteredForSomeoneElse",
  "address",
  "city",
  "zip",
  "callTextOk",
  "photos",
  "emailId",
] as const;

export type EntryRow = Record<(typeof ENTRY_COLUMNS)[number], string>;

/** Sort key: a real year sorts by itself, "Before 1960" ahead of every year, "Not sure" last. */
function yearRank(heaterYear: string): number {
  if (/^\d{4}$/.test(heaterYear)) return Number(heaterYear);
  return heaterYear.startsWith("Before") ? 0 : 9999;
}

/** Oldest heater first; within a year, earliest entry first (the tie order the office sees). */
export function sortForJudging(rows: EntryRow[]): EntryRow[] {
  return [...rows].sort(
    (a, b) => yearRank(a.heaterYear) - yearRank(b.heaterYear) || a.receivedAt.localeCompare(b.receivedAt),
  );
}

/**
 * One CSV cell. Entrants type these values, so a cell that a spreadsheet
 * would run as a formula (= + - @, or a leading tab or return) is prefixed
 * with an apostrophe and shown as text instead.
 */
function cell(value: string): string {
  const text = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function entriesCsv(rows: EntryRow[]): string {
  const lines = [ENTRY_COLUMNS.join(",")];
  for (const row of sortForJudging(rows)) {
    lines.push(ENTRY_COLUMNS.map((column) => cell(row[column] ?? "")).join(","));
  }
  return lines.join("\n") + "\n";
}

/** Constant-time comparison of the export key; an unset or short expected key never matches. */
export function exportKeyMatches(given: string | null, expected: string | undefined): boolean {
  if (!given || !expected || expected.length < 24) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
