/**
 * Water heater giveaway: one place for the dates, the prize wording, the
 * official rules and the entry schema. The page, the entry form and
 * /api/giveaway all read from here, so the rules a customer agrees to and
 * the checks the server runs cannot drift apart.
 *
 * To run it again later: change `endsAt`, `drawOn` and (if needed) the prize.
 * Once `endsAt` passes, the page shows a "closed" state and the API rejects
 * entries on its own; no deploy is needed to close it.
 */
import { z } from "zod";
import { BUSINESS, countiesSentence } from "./constants";
import { spanInline } from "./pricing";

export const GIVEAWAY = {
  path: "/water-heater-giveaway",
  name: "Water Heater Giveaway",
  /** Last moment an entry is accepted (Eastern time). */
  endsAt: "2026-12-31T23:59:59-05:00",
  endsLabel: "December 31, 2026",
  endsLabelLong: "11:59 PM ET on December 31, 2026",
  /** Random drawing date ("on or about"). */
  drawOn: "January 5, 2027",
  prizeShort: "a new tank water heater, installed",
  prize:
    "One new standard tank-type water heater (40 or 50 gallon, sized to the winner's home) with standard replacement installation by C&S Plumbing of Lee, including haul-away of the old unit and the permit.",
  /** Approximate retail value, from the published installed prices. */
  arv: spanInline("waterHeater.tank40", "waterHeater.tank50"),
  /** Photos of the current heater: at least one, at most this many. */
  maxPhotos: 3,
  /** Oldest year offered in the dropdown; anything older is one option. */
  oldestYear: 1990,
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
  options.push([HEATER_YEAR_UNSURE, "Not sure (we'll read it from your photo)"]);
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
  city: z.string().trim().min(2, "Please enter the city.").max(80),
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
  /** Required: 18+, owns the home, accepts the official rules. */
  agree: checkbox.refine((v) => v, "Please confirm you agree to the official rules."),
  /** Optional: OK to be contacted about replacing the heater. */
  contactOk: checkbox,
  website: z.string().optional(),
});

export type GiveawayEntry = z.infer<typeof giveawayEntrySchema>;

/** Official rules, rendered on the page under #rules. */
export function giveawayRules(): { title: string; body: string }[] {
  const counties = countiesSentence();
  return [
    {
      title: "No purchase necessary",
      body: "No purchase or payment of any kind is necessary to enter or win. A purchase does not improve your chances of winning. Void where prohibited.",
    },
    {
      title: "Sponsor",
      body: `${BUSINESS.legalName}, d/b/a ${BUSINESS.fullName}, ${BUSINESS.address}, ${BUSINESS.city}, ${BUSINESS.state} ${BUSINESS.zip}.`,
    },
    {
      title: "Who can enter",
      body: `Legal residents of Florida, 18 or older, who own a single-family home, condo or townhome in ${counties} and enter for that home. Employees of the Sponsor and members of their households are not eligible. Limit one entry per household; duplicate entries are removed.`,
    },
    {
      title: "Entry period",
      body: `Entries are accepted until ${GIVEAWAY.endsLabelLong}. Entries received after that time are not eligible.`,
    },
    {
      title: "How to enter",
      body: `Complete the entry form on this page with your name, phone number, email, the address of the home, the year your current water heater was made and at least one photo of it. Incomplete entries, and entries with a photo that is not of the water heater at the address entered, may be disqualified.`,
    },
    {
      title: "Prize",
      body: `${GIVEAWAY.prize} Approximate retail value: ${GIVEAWAY.arv}, depending on size. Work beyond a standard replacement (relocating the heater, converting fuel type, or upgrades to gas, electrical, venting or structure required by code) is not included and would be quoted in writing before any work begins. The prize is installed at the address on the winning entry, is not transferable and has no cash alternative.`,
    },
    {
      title: "Winner selection",
      body: `One winner is selected in a random drawing from all eligible entries on or about ${GIVEAWAY.drawOn}. The odds of winning depend on the number of eligible entries received. The age or condition of your water heater does not affect your chances.`,
    },
    {
      title: "Notification",
      body: `The winner is contacted by phone and email using the details on the entry. If the winner cannot be reached within 7 days, or is found ineligible, an alternate winner is drawn. Installation is scheduled at a mutually agreed time within 60 days of the drawing.`,
    },
    {
      title: "Taxes and publicity",
      body: "Any taxes on the prize are the winner's responsibility. With the winner's permission, the Sponsor may share the winner's first name, city and photos of the installation.",
    },
    {
      title: "Your information",
      body: "We use the information and photos you submit to run this giveaway and to contact you about your entry. We contact you about replacing your water heater only if you tick that box on the form. We do not sell your information. See our privacy policy for details.",
    },
    {
      title: "Social media",
      body: "This giveaway is not sponsored, endorsed or administered by, or associated with, Facebook, Instagram, Google or any other platform where it is shared.",
    },
  ];
}
