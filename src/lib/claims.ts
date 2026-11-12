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

export const EMERGENCY_CLAIMS = {
  /** Lower-case, mid-sentence: "Response time is typically …". */
  responseTime:
    "typically 30–60 minutes in Cape Coral, Fort Myers and North Fort Myers; same-day elsewhere",
  /** Sentence form. */
  responseTimeSentence:
    "Typically 30–60 minutes in Cape Coral, Fort Myers and North Fort Myers; same-day elsewhere.",
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
