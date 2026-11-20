/**
 * The water heater price list, written once in the words customers read.
 *
 * The figures are PRICES entries (./pricing); this file only says which job
 * each figure belongs to. The header summary, the pricing section, the cost
 * FAQ on /services/water-heaters and /faq, the quick answer, the meta
 * description and llms.txt all read it, so a range is never shown without
 * its scope and two surfaces cannot disagree.
 *
 * Each row keeps the label and note the owner approved with its price on
 * 2026-11-12. Do not widen a scope here ("electric tank" to "any tank") or
 * add a "from" price taken from one job's quote.
 *
 * Imports only ./pricing (faq-data.ts and constants.ts both load this file).
 */
import { money, price, range, rangeInline, span, spanInline, type PriceString } from "./pricing";

export interface WaterHeaterPriceRow {
  label: string;
  range: PriceString;
  note: string;
}

export interface WaterHeaterPriceGroup {
  /** Short label for the header summary. */
  label: string;
  /** The group's whole range, low to high, as tables show it (spaced dash). */
  range: PriceString;
  /** The same range as a sentence shows it (tight dash). */
  inline: PriceString;
  /** The rows of the pricing section. */
  rows: WaterHeaterPriceRow[];
}

const hybridRebate = `~${money(price("waterHeater.hybridRebate").max)}`;

export const WATER_HEATER_PRICES = {
  repair: {
    label: "Repairs",
    range: range("waterHeater.repair"),
    inline: rangeInline("waterHeater.repair"),
    rows: [
      {
        label: "Same-day repair (thermostat / element / T&P)",
        range: range("waterHeater.repair"),
        note: "If it can be repaired vs replaced",
      },
    ],
  },
  tank: {
    label: "Standard electric tank replacement",
    range: span("waterHeater.tank40", "waterHeater.tank50"),
    inline: spanInline("waterHeater.tank40", "waterHeater.tank50"),
    rows: [
      {
        // The 40-gallon range is flagged for office confirmation (2026-11-20):
        // see docs/content-claims.md before changing or quoting it.
        label: "40-gallon electric tank — installed",
        range: range("waterHeater.tank40"),
        note: "Includes haul-away of old unit, code-compliant pan & T&P",
      },
      {
        label: "50-gallon electric tank — installed",
        range: range("waterHeater.tank50"),
        note: "Most common SWFL family-of-four size",
      },
    ],
  },
  tankless: {
    label: "Tankless replacement",
    range: range("waterHeater.tankless"),
    inline: rangeInline("waterHeater.tankless"),
    rows: [
      {
        label: "Tankless gas (Rinnai/Navien)",
        range: range("waterHeater.tankless"),
        note: "Gas line + venting included; whole-home flow",
      },
    ],
  },
  hybrid: {
    label: "Hybrid system",
    range: range("waterHeater.hybrid"),
    inline: rangeInline("waterHeater.hybrid"),
    rows: [
      {
        label: "Heat-pump hybrid (50–80 gal)",
        range: range("waterHeater.hybrid"),
        note: `Often qualifies for FL utility rebates of up to ${hybridRebate} (confirm with your utility)`,
      },
    ],
  },
} satisfies Record<string, WaterHeaterPriceGroup>;

/** The 40- and 50-gallon rows as a sentence uses them. */
export const WATER_HEATER_TANK_SIZES = {
  tank40: rangeInline("waterHeater.tank40"),
  tank50: rangeInline("waterHeater.tank50"),
} as const;

/** The ceiling of the typical Florida utility rebate on a hybrid, with its leading tilde. */
export const WATER_HEATER_HYBRID_REBATE = hybridRebate;

/**
 * Maintenance has no approved public price (2026-11-20), so every surface
 * shows this request line instead of a figure. When the office approves one,
 * add it to PRICES and give this entry a `range` like the groups above.
 */
export const WATER_HEATER_MAINTENANCE = {
  label: "Maintenance",
  request: "Request maintenance pricing",
  note: "Tank flushing, anode rod replacement and tankless descaling",
} as const;

/** The groups in the order every surface lists them. */
export const WATER_HEATER_PRICE_ORDER = ["repair", "tank", "tankless", "hybrid"] as const;

/**
 * The answer to "How much does a water heater cost?", shared by the service
 * page and the /faq bank.
 */
export const WATER_HEATER_COST_ANSWER =
  `Repairs run ${WATER_HEATER_PRICES.repair.inline}. ` +
  `Standard electric tank replacements (40 to 50 gallon) run ${WATER_HEATER_PRICES.tank.inline} installed with haul-away included, ` +
  `gas tankless replacements run ${WATER_HEATER_PRICES.tankless.inline} with gas line and venting included, ` +
  `and heat-pump hybrids run ${WATER_HEATER_PRICES.hybrid.inline}. ` +
  `Maintenance is priced on request. C&S Plumbing provides free estimates with upfront pricing.`;
