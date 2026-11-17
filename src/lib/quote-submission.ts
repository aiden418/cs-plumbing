/**
 * Server-side parsing of a quote-builder submission (/api/quote).
 *
 * The browser sends the shopper's selections, the lead's contact details and
 * the estimate it displayed. Only the selections are trusted: the server
 * recomputes the estimate with the same pricing engine the page used
 * (src/lib/quote-pricing.ts), so the branded estimate email can never carry
 * a number or a line of text the engine would not produce. Whatever `result`
 * the client sent is accepted for compatibility and ignored.
 *
 * Plain imports only (zod, the pricing engine): unit-tested without Next.js.
 */
import { z } from "zod";
import { calculateRepipe, calculateWaterHeater } from "./quote-pricing";
import type {
  LeadCaptureData,
  QuoteResult,
  RepipeSelections,
  WaterHeaterSelections,
} from "./quote-types";

// `const` keeps the literal members, so the parsed object satisfies the
// WaterHeaterSelections / RepipeSelections types the pricing engine expects.
const nullable = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).nullable().default(null);

export const WaterHeaterSelectionsSchema = z.object({
  heaterType: nullable(["traditional", "tankless", "hybrid"]),
  size: nullable(["40gal", "50gal", "75gal", "single-point", "whole-home"]),
  brandTier: nullable(["standard", "premium"]),
  location: nullable(["garage", "closet", "outdoor", "attic"]),
  fuelType: nullable(["electric", "gas", "propane"]),
  warranty: nullable(["standard", "extended", "premium"]),
  addons: z
    .array(z.enum(["expansion-tank", "drain-pan", "shutoff-valve", "recirc-pump"]))
    .max(4)
    .default([]),
});

export const RepipeSelectionsSchema = z.object({
  address: z.string().trim().max(300).default(""),
  homeAge: nullable(["pre-1980", "1980-1995", "1996-2010", "2011+"]),
  pipeMaterial: nullable(["polybutylene", "copper", "galvanized", "pvc", "not-sure"]),
  bedrooms: nullable(["1", "2", "3", "4", "5+"]),
  bathrooms: nullable(["1", "1.5", "2", "2.5", "3", "3.5", "4+"]),
  stories: nullable(["1", "2"]),
  hoseBibs: nullable(["1", "2", "3+"]),
  newMaterial: nullable(["pex", "copper", "not-sure"]),
});

const LeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(7).max(30),
});

const common = {
  lead: LeadSchema,
  sourcePath: z.string().max(200).optional(),
  website: z.string().optional(),
  /** The estimate the browser displayed. Ignored: the server recomputes it. */
  result: z.unknown().optional(),
};

export const QuoteSubmissionSchema = z.discriminatedUnion("service", [
  z.object({ service: z.literal("water-heater"), selections: WaterHeaterSelectionsSchema, ...common }),
  z.object({ service: z.literal("repipe"), selections: RepipeSelectionsSchema, ...common }),
]);

export interface ParsedQuote {
  service: "water-heater" | "repipe";
  selections: WaterHeaterSelections | RepipeSelections;
  /** Recomputed on the server from `selections`; never the client's figure. */
  result: QuoteResult;
  lead: LeadCaptureData;
  sourcePath?: string;
  website?: string;
}

export function parseQuoteSubmission(
  input: unknown,
): { ok: true; quote: ParsedQuote } | { ok: false } {
  const parsed = QuoteSubmissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const { service, lead, sourcePath, website } = parsed.data;

  const quote: ParsedQuote =
    service === "water-heater"
      ? {
          service,
          selections: parsed.data.selections,
          result: calculateWaterHeater(parsed.data.selections),
          lead,
          sourcePath,
          website,
        }
      : {
          service,
          selections: parsed.data.selections,
          result: calculateRepipe(parsed.data.selections),
          lead,
          sourcePath,
          website,
        };
  return { ok: true, quote };
}
