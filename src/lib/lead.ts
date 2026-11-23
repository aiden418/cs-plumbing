/**
 * What an accepted website inquiry is, shared by the forms (browser) and the
 * API routes (server). No Node APIs and no page data: client components
 * import this file.
 *
 * One inquiry, one Lead ID. The form makes a submission key when the visitor
 * first sends it and repeats that key on every retry; the server turns the
 * key into the Lead ID (src/lib/api/lead.ts), so a retry or a double tap can
 * never become a second lead. The same ID is printed in the office email, on
 * the customer's confirmation and in every tracking event.
 */

/** Three funnels that are never added together. */
export type LeadType = "homeowner_request" | "builder_bid" | "utility_estimate";

export const LEAD_TYPE_LABEL: Record<LeadType, string> = {
  homeowner_request: "Homeowner service request",
  builder_bid: "Builder bid request",
  utility_estimate: "Utility connection estimate",
};

/** Which website form sent it. Reported with the lead so reports can split by form. */
export type LeadForm =
  | "contact"
  | "chat"
  | "preferred_time"
  | "estimate"
  | "quote_builder"
  | "utility_estimate"
  | "builder_bid"
  | "builder_portal";

/** Service values that mean a city utility (UEP) connection, on any form. */
const UTILITY_SERVICES = new Set(["uep", "uep-utilities", "uep-connection", "utility-connection"]);

export function isUtilityService(service: string | undefined | null): boolean {
  return UTILITY_SERVICES.has(String(service ?? "").trim().toLowerCase());
}

/** A homeowner form is a utility estimate when the service asked for is a UEP connection. */
export function homeownerLeadType(service: string | undefined | null): LeadType {
  return isUtilityService(service) ? "utility_estimate" : "homeowner_request";
}

const KEY_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True for a key this module made (a UUID); anything else from a client is ignored. */
export function isSubmissionKey(value: unknown): value is string {
  return typeof value === "string" && KEY_SHAPE.test(value);
}

/** A new submission key. One per filled-in form; reused for every retry of it. */
export function newSubmissionKey(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  // Older in-app browsers: the same shape from getRandomValues, or Math.random as a last resort.
  const bytes = new Uint8Array(16);
  if (c?.getRandomValues) c.getRandomValues(bytes);
  else for (let i = 0; i < 16; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/* ------------------------------------------------------------------ */
/* Test visits                                                         */
/* ------------------------------------------------------------------ */

/**
 * Opening any page with ?cs_test=1 marks the rest of that browser tab's visit
 * as a test. A request sent from it reaches the office like any other, with
 * TEST in the subject line, and is not reported to the ad platforms or
 * counted as a lead. Closing the tab ends it; ?cs_test=0 ends it sooner.
 */
export const TEST_PARAM = "cs_test";
const TEST_STORAGE_KEY = "cs_test_visit";

/** Read (and remember) whether this visit is a marked test. Browser only. */
export function isTestVisit(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const param = new URLSearchParams(window.location.search).get(TEST_PARAM);
    if (param === "1") window.sessionStorage.setItem(TEST_STORAGE_KEY, "1");
    if (param === "0") window.sessionStorage.removeItem(TEST_STORAGE_KEY);
    return window.sessionStorage.getItem(TEST_STORAGE_KEY) === "1";
  } catch {
    // Storage blocked: only the page that carries the parameter is a test.
    try {
      return new URLSearchParams(window.location.search).get(TEST_PARAM) === "1";
    } catch {
      return false;
    }
  }
}

/** What every lead route answers with when it has accepted an inquiry. */
export interface AcceptedLead {
  success: true;
  /** The Lead ID: office email, customer confirmation and tracking all carry it. */
  leadId: string;
  /** The same value, under the name the tracking helpers have always read. */
  eventId: string;
  leadType: LeadType;
  /** True when the office already had this submission and nothing new was sent. */
  duplicate?: boolean;
  /** True when the visit was a marked test: not a lead. */
  test?: boolean;
}
