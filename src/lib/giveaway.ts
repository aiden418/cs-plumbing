/**
 * Water heater giveaway: one place for the dates, the prize wording, the
 * official rules and the entry schema. The page, the entry form and
 * /api/giveaway all read from here, so the rules a customer agrees to and
 * the checks the server runs cannot drift apart. The official rules live in
 * ./giveaway-rules.ts (server only), so this file stays light enough for the
 * entry form to import.
 *
 * The contest (owner, 2026-11-17): the oldest working water heater entered
 * from Cape Coral, Fort Myers or North Fort Myers wins a new one, installed.
 * Anyone can enter their own heater or, with the owner's permission, someone
 * else's.
 *
 * To run it again later: change `endsAt`, `announceOn` and (if needed) the prize.
 * Once `endsAt` passes, the page shows a "closed" state and the API rejects
 * entries on its own; no deploy is needed to close it.
 */
import { z } from "zod";
import { spanInline } from "./pricing";

export const GIVEAWAY = {
  path: "/water-heater-giveaway",
  name: "Oldest Water Heater Giveaway",
  /**
   * Last moment an entry is accepted (Eastern time). December 8 is the
   * company's anniversary: the giveaway opens its 29th year in business
   * (owner, 2026-11-17).
   */
  endsAt: "2026-12-08T23:59:59-05:00",
  endsLabel: "December 8, 2026",
  endsLabelShort: "December 8",
  endsLabelLong: "11:59 PM ET on December 8, 2026",
  /** Winner announced ("on or about"): a week after closing, to verify the oldest entries on site. */
  announceOn: "December 15, 2026",
  announceOnShort: "December 15",
  /** Why now, in the owner's words. */
  occasion: "To kick off our 29th year in business",
  /** The contest in one line (owner, 2026-11-17). */
  hunt: "We're looking for the oldest working water heater in Southwest Florida",
  /** Homes that can be entered. Also the options of the form's city field. */
  cities: ["Cape Coral", "Fort Myers", "North Fort Myers"],
  citiesSentence: "Cape Coral, Fort Myers or North Fort Myers",
  prizeShort: "a new tank water heater, installed free",
  prize:
    "One new standard tank-type water heater (40 or 50 gallon, sized to the home) with standard replacement installation by C&S Plumbing of Lee, including haul-away of the old unit and the permit.",
  /** Approximate retail value, from the published installed prices. */
  arv: spanInline("waterHeater.tank40", "waterHeater.tank50"),
  /** Photos of the current heater: at least one, at most this many. */
  maxPhotos: 3,
  /** Oldest year offered in the dropdown; anything older is one option. */
  oldestYear: 1960,
  /** Shown on the page and in the receipt: fake "you won" messages follow every public giveaway. */
  scamWarning:
    "We contact the winner by phone and email from our office only. We never ask for a payment, a card number or a fee to claim the prize.",
  /** Shown beside the submit button; rule 10 says the same. */
  consent:
    "By entering, you agree we may email you about this giveaway and about water heater offers. You can opt out of those emails at any time. We call or text about offers only if you tick the box above.",
} as const;

export function isGiveawayOpen(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(GIVEAWAY.endsAt).getTime();
}

export const HEATER_YEAR_OLDER = "older";
export const HEATER_YEAR_UNSURE = "unsure";

/** Newest first, then "before 1990" and "not sure". */
export function heaterYearOptions(now: Date = new Date()): [value: string, label: string][] {
  const options: [string, string][] = [];
  for (let y = now.getFullYear(); y >= GIVEAWAY.oldestYear; y--) options.push([String(y), String(y)]);
  options.push([HEATER_YEAR_OLDER, `Before ${GIVEAWAY.oldestYear}`]);
  options.push([HEATER_YEAR_UNSURE, "Not sure (we'll read it from the label photo)"]);
  return options;
}

export function heaterYearLabel(value: string): string {
  if (value === HEATER_YEAR_OLDER) return `Before ${GIVEAWAY.oldestYear}`;
  if (value === HEATER_YEAR_UNSURE) return "Not sure";
  return value;
}

/** Age in years for a numeric year; null for "older" / "unsure". */
export function heaterAge(value: string, now: Date = new Date()): number | null {
  return /^\d{4}$/.test(value) ? now.getFullYear() - Number(value) : null;
}

const checkbox = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((v) => v === true || v === "true" || v === "on");

export const giveawayEntrySchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name.").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name.").max(60),
  phone: z.string().trim().max(30).refine((value) => {
    const digits = value.replace(/\D/g, "");
    return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
  }, "Please enter a 10-digit phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  address: z.string().trim().min(5, "Please enter the street address of the home.").max(200),
  city: z
    .string()
    .trim()
    .refine((v) => (GIVEAWAY.cities as readonly string[]).includes(v), "Please select the city the home is in."),
  zip: z.string().trim().regex(/^\d{5}$/, "Please enter a 5-digit ZIP code."),
  heaterYear: z
    .string()
    .trim()
    .refine(
      (v) =>
        v === HEATER_YEAR_OLDER ||
        v === HEATER_YEAR_UNSURE ||
        (/^\d{4}$/.test(v) && Number(v) >= GIVEAWAY.oldestYear && Number(v) <= new Date().getFullYear() + 1),
      "Please select the year your water heater was made.",
    ),
  /** Entering a relative's, friend's or neighbor's heater: the owner's name is then required. */
  forSomeoneElse: checkbox,
  ownerName: z.string().trim().max(120).optional().default(""),
  /** Required: 18+, owns the home or has the owner's permission, accepts the official rules. */
  agree: checkbox.refine((v) => v, "Please confirm you agree to the official rules."),
  /** Optional: OK to be called or texted about replacing the heater. */
  contactOk: checkbox,
  website: z.string().optional(),
}).refine((entry) => !entry.forSomeoneElse || entry.ownerName.length >= 2, {
  path: ["ownerName"],
  message: "Please enter the homeowner's name.",
});

export type GiveawayEntry = z.infer<typeof giveawayEntrySchema>;
