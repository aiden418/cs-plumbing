/**
 * Customer-facing promises, written once. Response times, confirmation
 * windows, warranty wording, what a repipe includes, the service-call policy
 * and how the license is shown all come from here, so two pages cannot
 * promise two different things.
 *
 * Owner decisions recorded 2026-11-12 (Aiden): see docs/content-claims.md.
 * Imports only ./pricing — this file sits on the next.config.ts import chain.
 */
import { rangeInline } from "./pricing";

export const LICENSE = {
  /** The company's Florida Certified Plumbing Contractor license (current since the 2023 reorganization). */
  company: "CFC1432485",
  /** Co-founder Samuel Pellechio's original license, still active. Formal documents only. */
  founder: "CFC057076",
} as const;

const DBPR = "https://www.myfloridalicense.com/portalsearches/VerifyLicensee";

/**
 * What the Florida DBPR's own record showed for each license on the day it
 * was last read. Pages state it as a dated check ("the state lists it as
 * current and active through …, record checked …"), which stays true after
 * the renewal date; tests/license-record.test.ts starts failing once that
 * date has passed, so someone reads the two records again and updates this.
 *
 * To re-check: open each `recordUrl` (or `lookupUrl` → "Search by License
 * Number") and copy Status, Expires and Licensure Date. The 32-character ID
 * in a record address is the state's own id for the license; it survived the
 * state's 2026 move from wl11.asp / LicenseDetail.asp to this portal.
 */
export const LICENSE_RECORD = {
  /** The day both records were last read on myfloridalicense.com. */
  checkedOn: "2026-11-16",
  /** "Current, Active" on both records that day. */
  status: "current and active",
  /** The "Expires" date on both records (Florida renews these every two years). */
  activeThrough: "2028-08-31",
  /** The state's search page: choose "Search by License Number", type either number. */
  lookupUrl: DBPR,
  company: {
    number: LICENSE.company,
    /** DBA name on the record; the qualifier is Samuel Anthony Pellechio Jr. */
    holder: "Draft Plumbing Corp",
    licensedOn: "2023-11-07",
    recordUrl: `${DBPR}/LicenseDetail?ID=09FEC798BD5E37B9CA24456AC823D2CB`,
  },
  founder: {
    number: LICENSE.founder,
    /** DBA name on the record; the qualifier is Samuel Anthony Pellechio Jr. */
    holder: "C & S Plumbing of Lee Inc",
    licensedOn: "1997-12-08",
    recordUrl: `${DBPR}/LicenseDetail?ID=B19539BA5281E9409E5B9B7292C33574`,
  },
} as const;

/** "August 31, 2028" from "2028-08-31", without a time zone shifting the day. */
function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[month - 1]} ${day}, ${year}`;
}

/** The two dates as customers read them. */
export const LICENSE_RECORD_DATES = {
  checkedOn: longDate(LICENSE_RECORD.checkedOn),
  activeThrough: longDate(LICENSE_RECORD.activeThrough),
} as const;

/**
 * The dated check, ready to follow a license number in a sentence:
 * "The state lists it as current and active through August 31, 2028 (record
 * checked November 16, 2026)."
 */
export const LICENSE_STATUS_SENTENCE = `The state lists it as ${LICENSE_RECORD.status} through ${LICENSE_RECORD_DATES.activeThrough} (record checked ${LICENSE_RECORD_DATES.checkedOn}).`;

/**
 * Marketing surfaces (pages, footer, FAQs, city landings) show the company
 * license only. Formal documents (Terms, prequal packet, capability
 * statement, builder print docs) and the JSON-LD credential list show both.
 */
export function licenseLine(variant: "marketing" | "formal"): string {
  return variant === "marketing"
    ? `Licensed & insured (${LICENSE.company})`
    : `Licensed & insured — ${LICENSE.company}; co-founder Samuel Pellechio also holds ${LICENSE.founder}`;
}

const CORE_MINUTES = "30–60 minutes";
const CORE_CITIES = "Cape Coral, Fort Myers and North Fort Myers";

export const EMERGENCY_CLAIMS = {
  /** The minute window for the Lee County core, on its own ("… in 30–60 minutes"). */
  coreMinutes: CORE_MINUTES,
  coreCities: CORE_CITIES,
  /** Lower-case, mid-sentence: "Response time is typically …". */
  responseTime: `typically ${CORE_MINUTES} in ${CORE_CITIES}; same-day elsewhere`,
  /** Sentence form. */
  responseTimeSentence: `Typically ${CORE_MINUTES} in ${CORE_CITIES}; same-day elsewhere.`,
  afterHoursSurcharge: rangeInline("emergency.afterHoursSurcharge"),
  afterHoursPricing: `After-hours calls (nights, weekends, and holidays) carry a ${rangeInline("emergency.afterHoursSurcharge")} surcharge — always included in the written price you approve before any work begins.`,
} as const;

export const CLAIMS = {
  bookingConfirmation: "We confirm within 1 business day — usually the same day.",
  estimateTurnaround: "A written estimate within 1 business day of our visit.",
  /** Builder bids: acknowledgement only — no takeoff turnaround is promised (see docs/builder-door-checklist.md). */
  bidAcknowledgement:
    "We acknowledge every plan set within 1 business day and follow up with a scope and quote once the takeoff is complete.",
  serviceCallFee:
    "Free estimates on installations, repipes and water heaters. Repair visits carry a diagnostic fee quoted when you book.",
  warrantyInstall:
    "One-year warranty on our labor and on materials C&S supplies; manufacturer warranties on PEX, water heaters and fixtures pass to you.",
  warrantyInstallShort: "a one-year warranty on our labor and the materials we supply",
  warrantyBullet: "1-year labor & materials warranty; manufacturer warranties pass to you",
  repipeRestoration: "We patch and texture every access cut we make; painting is by others.",
  uepConditions:
    "Per-foot rates assume an open-trench run from the property line to the house with normal access. Depth, rock, paver or driveway crossings and surface restoration are quoted on site, and the City's assessment and meter fees are separate.",
  estimateDisclaimer:
    "This is a preliminary estimate based on typical Lee County installations. A licensed C&S plumber confirms your exact price during a free, no-obligation visit.",
} as const;

/** Snowbird season: November–April is arrival, May–October is departure. */
export type Season = "arrival" | "departure";

export function season(d: Date = new Date()): Season {
  const m = d.getMonth();
  return m >= 10 || m <= 3 ? "arrival" : "departure";
}

export const SEASON_COPY: Record<
  Season,
  {
    overline: string;
    title: string;
    accent: string;
    description: string;
    teaserEyebrow: string;
    teaserTitle: string;
    teaserBody: string;
  }
> = {
  arrival: {
    overline: "For SWFL Snowbirds",
    title: "Back for the Season?",
    accent: "Start With Dry Pipes.",
    description:
      "The Coastal Comeback Plan puts a licensed plumber in your home before you unpack — a start-up inspection, a water heater check and a walk of every valve and fixture — and shuts the house down properly when you head north again.",
    teaserEyebrow: "Welcome Back · For SWFL Snowbirds",
    teaserTitle: "Back in Town? Book the Start-Up Inspection Before the First Shower.",
    teaserBody:
      "The Coastal Comeback Plan is our annual snowbird program — a licensed plumber restarts and inspects your Florida home when you return, and shuts it down properly when you leave.",
  },
  departure: {
    overline: "For SWFL Snowbirds",
    title: "Leaving for the Summer?",
    accent: "Your Pipes Aren't.",
    description:
      "The Coastal Comeback Plan keeps your vacant Florida home dry, protected, and ready to live in the day you fly back. Licensed plumbers — not a home watch service — checking your pipes, valves, and water heater while you're gone.",
    teaserEyebrow: "New · For SWFL Snowbirds",
    teaserTitle: "Heading North for the Summer? Don't Leave Your Pipes Behind.",
    teaserBody:
      "The Coastal Comeback Plan is our annual snowbird program — a licensed plumber shuts down, inspects, and watches your vacant Florida home so you fly back to a dry house, not a flood.",
  },
};
