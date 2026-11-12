/**
 * The approved price sheet — the only place a published price is written.
 *
 * Every service page, FAQ, city landing, blog post, llms.txt, OG image and
 * the quote calculator reads from here through the formatters below, so the
 * site cannot quote two numbers for the same job. `scripts/check-content-
 * claims.mjs` fails the build on a dollar figure typed anywhere else.
 *
 * Values are the hub-page tables the owner approved on 2026-11-12 (the
 * `checked` date). Change a number here, deploy, and every surface follows.
 *
 * No imports: service-city-landings.ts pulls this in and next.config.ts
 * loads that chain, so this file must stay dependency-free.
 */

export type PriceUnit = "flat" | "perFoot" | "perYear";

export type PriceEntry = {
  min: number;
  max: number;
  unit?: PriceUnit;
  /** Open-ended ceiling: rendered "$2,000 – $8,000+". */
  plus?: boolean;
  note?: string;
  /** ISO date the owner last confirmed the figure. */
  checked: string;
};

const CHECKED = "2026-11-12";

export const PRICES = {
  // Water heaters
  "waterHeater.repair": { min: 195, max: 475, checked: CHECKED, note: "Thermostat, element, T&P, valve; same-day in most cases" },
  "waterHeater.tank40": { min: 1650, max: 2200, checked: CHECKED, note: "Installed; haul-away, pan, T&P, permit and Lee County final included" },
  "waterHeater.tank50": { min: 1850, max: 2500, checked: CHECKED, note: "Installed; same inclusions as 40-gal" },
  "waterHeater.tank75": { min: 1800, max: 2600, checked: CHECKED, note: "Calculator only; carried over from the quote builder — confirm" },
  "waterHeater.tankless": { min: 3500, max: 5200, checked: CHECKED, note: "Gas whole-home (Rinnai / Navien / Noritz); gas line, venting and permit included" },
  "waterHeater.tanklessPointOfUse": { min: 1500, max: 2200, checked: CHECKED, note: "Calculator only; carried over from the quote builder — confirm" },
  "waterHeater.hybrid": { min: 3200, max: 4800, checked: CHECKED, note: "Heat-pump hybrid, 50–80 gal" },
  "waterHeater.hybridRebate": { min: 2000, max: 2000, checked: CHECKED, note: "Ceiling of typical FL utility rebates; confirm with FPL / LCEC each year" },

  // Whole-home repipe
  "repipe.overall": { min: 4000, max: 15000, checked: CHECKED },
  "repipe.pex2x2": { min: 4200, max: 6500, checked: CHECKED, note: "PEX, 2BR/2BA, ≤1,500 sq ft" },
  "repipe.pex3x2": { min: 6800, max: 9500, checked: CHECKED, note: "PEX, 3BR/2BA, 1,800–2,400 sq ft" },
  "repipe.pex4plus": { min: 9500, max: 13000, checked: CHECKED, note: "PEX, 4BR+ or two-story, ≥2,500 sq ft" },
  "repipe.copperUpcharge": { min: 2000, max: 4000, checked: CHECKED, note: "Type-L copper over PEX" },
  "repipe.polyRemoval": { min: 500, max: 1200, checked: CHECKED, note: "Polybutylene removal, 1978–1995 homes" },

  // Leaks and fixtures
  "leak.overall": { min: 150, max: 5500, checked: CHECKED },
  "leak.visible": { min: 150, max: 400, checked: CHECKED, note: "Visible, accessible leak repair" },
  "leak.detection": { min: 400, max: 800, checked: CHECKED, note: "Electronic locate for hidden, slab or underground leaks" },
  "leak.slabSpot": { min: 1200, max: 2800, checked: CHECKED, note: "Slab leak detection + single spot repair" },
  "leak.reroute": { min: 2800, max: 5500, checked: CHECKED, note: "Full under-slab reroute (bypass)" },
  "leak.prv": { min: 425, max: 725, checked: CHECKED, note: "Whole-house pressure regulator" },
  "fixture.faucet": { min: 125, max: 325, checked: CHECKED },
  "fixture.toilet": { min: 165, max: 385, checked: CHECKED },
  "fixture.underSink": { min: 185, max: 475, checked: CHECKED },

  // Drains
  "drain.overall": { min: 150, max: 1100, checked: CHECKED },
  "drain.fixture": { min: 150, max: 250, checked: CHECKED, note: "Single-fixture clog" },
  "drain.mainLine": { min: 295, max: 475, checked: CHECKED, note: "Main-line cabling" },
  "drain.hydroJet": { min: 450, max: 800, checked: CHECKED, note: "Hydro-jetting, main line" },
  "drain.camera": { min: 245, max: 395, checked: CHECKED, note: "Sewer camera inspection; free with hydro-jetting on the same trip" },
  "drain.rootsJetCamera": { min: 650, max: 1100, checked: CHECKED, note: "Root removal + jetting + camera" },

  // Water quality
  "softener.system": { min: 1500, max: 4000, checked: CHECKED, note: "Whole-home softener, installed" },
  "softener.premium": { min: 3000, max: 4000, checked: CHECKED, note: "Softener + reverse osmosis" },
  "softener.carbon": { min: 800, max: 2000, checked: CHECKED, note: "Whole-home carbon filter" },
  "softener.ro": { min: 300, max: 800, checked: CHECKED, note: "Under-sink reverse osmosis" },
  "softener.combo": { min: 2000, max: 4000, checked: CHECKED, note: "Softener + filtration combo" },

  // Remodel
  "remodel.overall": { min: 2000, max: 8000, plus: true, checked: CHECKED, note: "Kitchen & bath plumbing; quoted from the plans" },

  // Cape Coral UEP and septic-to-sewer
  "uep.waterPerFt": { min: 13, max: 15, unit: "perFoot", checked: CHECKED },
  "uep.irrigationPerFt": { min: 9, max: 10, unit: "perFoot", checked: CHECKED },
  "uep.sewerPerFt": { min: 25, max: 33, unit: "perFoot", checked: CHECKED },
  "uep.septicAbandon": { min: 2500, max: 2500, checked: CHECKED, note: "Pump-out, crush/fill, DOH permit and inspection; standard tank" },
  "uep.typicalLot": { min: 5000, max: 10000, checked: CHECKED, note: "Typical Cape Coral lot, all three connections + abandonment" },
  "septicToSewer.nfm": { min: 3500, max: 8000, checked: CHECKED, note: "North Fort Myers / Lee County Utilities conversion; county fees separate" },

  // Emergency, plans, promotions
  "emergency.afterHoursSurcharge": { min: 95, max: 150, checked: CHECKED, note: "Nights, weekends, holidays; in the written price" },
  "plan.comfort": { min: 349, max: 349, unit: "perYear", checked: CHECKED },
  "plan.shield": { min: 549, max: 549, unit: "perYear", checked: CHECKED },
  "coupon.welcome": { min: 50, max: 50, checked: CHECKED, note: "WELCOME50, new customers" },
} satisfies Record<string, PriceEntry>;

export type PriceId = keyof typeof PRICES;

/** A string produced by one of the formatters below (branded so a typed literal fails type-checking in price fields). */
export type PriceString = string & { readonly __price: true };

/** The exact shape ServiceJsonLd parses into Offer schema; `range()` always satisfies it. */
export const PRICE_RANGE_RE = /^\$([\d,]+)\s*[–-]\s*\$?([\d,]+)\+?$/;

const brand = (s: string) => s as PriceString;

/** "$1,650" — hand-rolled so Node and browsers render identically. */
export function money(n: number): string {
  return "$" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function price(id: PriceId): PriceEntry {
  return PRICES[id];
}

function pair(min: number, max: number, sep: string, plus = false): string {
  if (min === max) return money(min);
  return `${money(min)}${sep}${money(max)}${plus ? "+" : ""}`;
}

/** "$6,800 – $9,500" (spaced en dash) — for tables, priceRange and schema. */
export function range(id: PriceId): PriceString {
  const p = price(id);
  return brand(pair(p.min, p.max, " – ", p.plus));
}

/** "$6,800–$9,500" (tight en dash) — for prose. */
export function rangeInline(id: PriceId): PriceString {
  const p = price(id);
  return brand(pair(p.min, p.max, "–", p.plus));
}

/** Low of one entry to high of another: span("waterHeater.tank40", "waterHeater.tank50") → "$1,650 – $2,500". */
export function span(lowId: PriceId, highId: PriceId): PriceString {
  return brand(pair(PRICES[lowId].min, PRICES[highId].max, " – "));
}

export function spanInline(lowId: PriceId, highId: PriceId): PriceString {
  return brand(pair(PRICES[lowId].min, PRICES[highId].max, "–"));
}

/** "from $1,650" */
export function from(id: PriceId): PriceString {
  return brand(`from ${money(PRICES[id].min)}`);
}

/** "Starting at $1,650" */
export function startingAt(id: PriceId): PriceString {
  return brand(`Starting at ${money(PRICES[id].min)}`);
}

/** "$13–$15/ft" */
export function perFoot(id: PriceId): PriceString {
  const p = price(id);
  return brand(`${pair(p.min, p.max, "–")}/ft`);
}

/** "$349/yr" */
export function perYear(id: PriceId): PriceString {
  return brand(`${money(PRICES[id].min)}/yr`);
}

/** "+$2,000 – $4,000" — prose/table add-on; deliberately not Offer-schema shaped. */
export function upcharge(id: PriceId): PriceString {
  const p = price(id);
  return brand(`+${pair(p.min, p.max, " – ")}`);
}

/** "+$2,000–$4,000" */
export function upchargeInline(id: PriceId): PriceString {
  const p = price(id);
  return brand(`+${pair(p.min, p.max, "–")}`);
}

/**
 * Wraps text assembled ONLY from the formatters above (e.g. the UEP
 * priceRange that lists several per-foot rates). Never pass a literal.
 */
export function composed(text: string): PriceString {
  return brand(text);
}
