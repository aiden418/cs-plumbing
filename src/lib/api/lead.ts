/**
 * Server side of "one inquiry, one Lead ID" (see src/lib/lead.ts).
 *
 * - leadIdFor(key): the ID an inquiry carries everywhere. The same submission
 *   key always gives the same ID, on any server instance, so a retry that
 *   reaches a different instance still prints the ID the office already has.
 * - acceptOnce(key, run): the office email for one submission is sent once.
 *   A second request with the same key (a double tap, or a retry after the
 *   answer was lost on the way back) gets the first answer again and sends
 *   nothing. The memory is per warm instance; the shared ID above is what
 *   covers the rare retry that lands somewhere else.
 *
 * Server only.
 */
import { createHash, randomBytes } from "node:crypto";
import { isSubmissionKey, LEAD_TYPE_LABEL, type AcceptedLead, type LeadForm, type LeadType } from "../lead";
import { escapeHtml } from "./secure";

/** Crockford base 32: no I, L, O or U, so an ID read over the phone is not misheard. */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ID_LENGTH = 8;

function encode(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < ID_LENGTH; i += 1) out += ALPHABET[bytes[i] % 32];
  return out;
}

/** "CS-7K3M9Q2X". Stable for a submission key, random without one. */
export function leadIdFor(submissionKey?: unknown): string {
  const bytes = isSubmissionKey(submissionKey)
    ? createHash("sha256").update(`cs-lead:${submissionKey.toLowerCase()}`).digest()
    : randomBytes(ID_LENGTH);
  return `CS-${encode(bytes)}`;
}

export const LEAD_ID_SHAPE = /^CS-[0-9A-HJKMNP-TV-Z]{8}$/;

/** How long an accepted submission is remembered on one instance. */
const REMEMBER_MS = 30 * 60 * 1000;
const MAX_REMEMBERED = 500;

const accepted = new Map<string, { at: number; lead: AcceptedLead }>();
const inFlight = new Map<string, Promise<AcceptedLead>>();

function forget(now: number) {
  for (const [key, entry] of accepted) {
    if (now - entry.at > REMEMBER_MS) accepted.delete(key);
  }
  while (accepted.size > MAX_REMEMBERED) {
    const oldest = accepted.keys().next().value;
    if (oldest === undefined) break;
    accepted.delete(oldest);
  }
}

/**
 * Run `run` (send the office email and build the answer) at most once per
 * submission key. A failure is not remembered, so the visitor can try again.
 */
export async function acceptOnce(
  submissionKey: unknown,
  run: () => Promise<AcceptedLead>,
  now: () => number = Date.now,
): Promise<AcceptedLead> {
  if (!isSubmissionKey(submissionKey)) return run();
  const key = submissionKey.toLowerCase();
  forget(now());
  const done = accepted.get(key);
  if (done) return { ...done.lead, duplicate: true };
  const running = inFlight.get(key);
  if (running) return { ...(await running), duplicate: true };
  const attempt = run();
  inFlight.set(key, attempt);
  try {
    const lead = await attempt;
    accepted.set(key, { at: now(), lead });
    return lead;
  } finally {
    inFlight.delete(key);
  }
}

/** For tests. */
export function resetAcceptedLeads() {
  accepted.clear();
  inFlight.clear();
}

/** The answer every lead route gives for an accepted inquiry. */
export function acceptedLead(leadId: string, leadType: LeadType, test: boolean): AcceptedLead {
  return { success: true, leadId, eventId: leadId, leadType, ...(test ? { test: true } : {}) };
}

/** Form fields arrive as JSON booleans or as multipart strings. */
export function isTestFlag(value: unknown): boolean {
  return value === true || value === "true" || value === "1";
}

/** "[TEST] " in front of an office subject line when the visit was a marked test. */
export function subjectFor(subject: string, leadId: string, test: boolean): string {
  return `${test ? "[TEST] " : ""}${subject} [${leadId}]`;
}

/** First block of every office email: what kind of request this is, and whether it is a test. */
export function leadHeaderHtml(lead: { leadId: string; leadType: LeadType; form: LeadForm; test: boolean }): string {
  const testBanner = lead.test
    ? `<p style="background:#fff3cd;border:1px solid #d39e00;padding:12px;margin:0 0 12px;font-weight:bold;">TEST REQUEST. Sent from a marked test visit (cs_test). Do not schedule and do not count it as a lead.</p>`
    : "";
  return `${testBanner}<p style="margin:0 0 12px;"><strong>Request type:</strong> ${escapeHtml(LEAD_TYPE_LABEL[lead.leadType])} &nbsp;·&nbsp; <strong>Lead ID:</strong> ${escapeHtml(lead.leadId)}</p>`;
}

/** One log line per accepted inquiry. No name, phone, email or address. */
export function logAccepted(lead: { leadId: string; leadType: LeadType; form: LeadForm; test: boolean }, resendId: string) {
  console.log(
    `lead accepted id=${lead.leadId} type=${lead.leadType} form=${lead.form}${lead.test ? " test=1" : ""} office_email=${resendId}`,
  );
}
