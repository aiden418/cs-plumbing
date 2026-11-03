// Revision and location of the Terms & Conditions page (/terms).
//
// This file deliberately has no imports so the quote API route and the edge
// OG image can read it without pulling in the 300 KB constants module. The
// clause text lives in ./terms.ts.
//
// Every quote, proposal and invoice cites the revision that was live on its
// date, so: bump TERMS_VERSION and TERMS_EFFECTIVE_DATE together with every
// published change, add a TERMS_REVISIONS entry in ./terms.ts, and update the
// document templates (see docs/terms-on-documents.md). Nothing else in the
// codebase may hard-code the revision string.

export const TERMS_VERSION = "2026-11-03";
export const TERMS_EFFECTIVE_DATE = "2026-11-03";
export const TERMS_PATH = "/terms";
export const TERMS_URL = `https://www.csplumbinglee.com${TERMS_PATH}`;
export const TERMS_SHORT_URL = "csplumbinglee.com/terms";
export const TERMS_CITATION = `Terms & Conditions rev. ${TERMS_VERSION}`;

export type TermsDocKind = "estimate" | "proposal" | "invoice";

/** The one-line incorporation sentence printed on every document. */
export function termsSubjectLine(kind: TermsDocKind = "estimate"): string {
  return `This ${kind} is subject to C&S Plumbing of Lee's ${TERMS_CITATION}, available at ${TERMS_URL} and incorporated by reference. Signing, paying, scheduling, or authorizing the work constitutes acceptance.`;
}

/**
 * "November 2, 2026". Splits the ISO string instead of parsing it, because
 * new Date("YYYY-MM-DD") is UTC midnight and prints the previous day in US
 * time zones.
 */
export function formatTermsDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
