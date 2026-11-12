import type {
  WaterHeaterSelections,
  RepipeSelections,
  QuoteResult,
  QuoteLineItem,
  PriceRange,
  HeaterAddon,
  Bathrooms,
  HoseBibs,
} from "./quote-types";
import { price } from "./pricing";
import { CLAIMS } from "./claims";

// ============================================
// WATER HEATER PRICING
// ============================================

// Base installed prices come from the approved sheet, so the calculator can
// never show a number the service pages don't. Everything below BASE_PRICES
// is a calculator modifier (brand, location, fuel, warranty tier, add-ons),
// not a published price, and stays local.
const sheet = (id: Parameters<typeof price>[0]): PriceRange => ({
  min: price(id).min,
  max: price(id).max,
});

const BASE_PRICES: Record<string, PriceRange> = {
  "traditional-40gal": sheet("waterHeater.tank40"),
  "traditional-50gal": sheet("waterHeater.tank50"),
  "traditional-75gal": sheet("waterHeater.tank75"),
  "tankless-single-point": sheet("waterHeater.tanklessPointOfUse"),
  "tankless-whole-home": sheet("waterHeater.tankless"),
  hybrid: sheet("waterHeater.hybrid"),
};

const BRAND_ADDER: Record<string, PriceRange> = {
  standard: { min: 0, max: 0 },
  premium: { min: 400, max: 800 }, // claim-ok: calculator modifier
};

const LOCATION_ADDER: Record<string, PriceRange> = {
  garage: { min: 0, max: 0 },
  closet: { min: 100, max: 200 }, // claim-ok: calculator modifier
  outdoor: { min: 150, max: 250 }, // claim-ok: calculator modifier
  attic: { min: 300, max: 500 }, // claim-ok: calculator modifier
};

const FUEL_ADDER: Record<string, PriceRange> = {
  electric: { min: 0, max: 0 },
  gas: { min: 200, max: 400 }, // claim-ok: calculator modifier
  propane: { min: 300, max: 500 }, // claim-ok: calculator modifier
};

const WARRANTY_ADDER: Record<string, PriceRange> = {
  standard: { min: 0, max: 0 },
  extended: { min: 150, max: 200 }, // claim-ok: calculator modifier
  premium: { min: 300, max: 400 }, // claim-ok: calculator modifier
};

const ADDON_PRICES: Record<HeaterAddon, { label: string; price: number }> = {
  "expansion-tank": { label: "Expansion Tank", price: 150 }, // claim-ok: calculator modifier
  "drain-pan": { label: "Drain Pan", price: 75 }, // claim-ok: calculator modifier
  "shutoff-valve": { label: "Shutoff Valve", price: 100 }, // claim-ok: calculator modifier
  "recirc-pump": { label: "Recirculation Pump", price: 350 }, // claim-ok: calculator modifier
};

export function calculateWaterHeater(sel: WaterHeaterSelections): QuoteResult {
  const lineItems: QuoteLineItem[] = [];
  const notes: string[] = [];

  // Base price
  const baseKey = sel.heaterType === "hybrid" ? "hybrid" : `${sel.heaterType}-${sel.size}`;
  const base = BASE_PRICES[baseKey] ?? { min: 0, max: 0 };

  const typeLabels: Record<string, string> = {
    traditional: "Traditional Tank",
    tankless: "Tankless",
    hybrid: "Hybrid Heat Pump",
  };
  const sizeLabels: Record<string, string> = {
    "40gal": "40 Gallon",
    "50gal": "50 Gallon",
    "75gal": "75 Gallon",
    "single-point": "Single-Point",
    "whole-home": "Whole-Home",
  };

  const sizeLabel = sel.heaterType === "hybrid" ? "" : ` — ${sizeLabels[sel.size!] ?? ""}`;
  lineItems.push({
    label: `${typeLabels[sel.heaterType!]}${sizeLabel} (installed)`,
    range: base,
  });

  // Brand
  const brand = BRAND_ADDER[sel.brandTier!] ?? { min: 0, max: 0 };
  if (brand.max > 0) {
    lineItems.push({
      label: `Premium Brand (Rinnai, Navien)`,
      range: brand,
    });
  }

  // Location
  const loc = LOCATION_ADDER[sel.location!] ?? { min: 0, max: 0 };
  if (loc.max > 0) {
    const locLabels: Record<string, string> = {
      closet: "Indoor Closet Install",
      outdoor: "Outdoor Install",
      attic: "Attic Install",
    };
    lineItems.push({
      label: locLabels[sel.location!] ?? "Location Adjustment",
      range: loc,
    });
  }

  // Fuel
  const fuel = FUEL_ADDER[sel.fuelType!] ?? { min: 0, max: 0 };
  if (fuel.max > 0) {
    lineItems.push({
      label: `${sel.fuelType === "gas" ? "Gas" : "Propane"} Hookup`,
      range: fuel,
    });
  }

  // Warranty
  const warranty = WARRANTY_ADDER[sel.warranty!] ?? { min: 0, max: 0 };
  if (warranty.max > 0) {
    lineItems.push({
      label: `${sel.warranty === "extended" ? "Extended 10-Year" : "Premium 12-Year"} Manufacturer Warranty`,
      range: warranty,
    });
  }

  // Add-ons
  for (const addon of sel.addons) {
    const info = ADDON_PRICES[addon];
    lineItems.push({
      label: info.label,
      range: { min: info.price, max: info.price },
    });
  }

  // Total
  const total: PriceRange = {
    min: lineItems.reduce((sum, item) => sum + item.range.min, 0),
    max: lineItems.reduce((sum, item) => sum + item.range.max, 0),
  };

  notes.push("Includes professional installation, old unit removal & disposal, and cleanup");
  notes.push("Permit and Lee County final inspection included");
  notes.push(CLAIMS.warrantyInstall);

  return { service: "water-heater", total, lineItems, notes };
}

// ============================================
// REPIPE PRICING
// ============================================

function getDropCount(bathrooms: Bathrooms, hoseBibs: HoseBibs): number {
  // Full bathroom: ~7 drops (toilet 1, shower hot+cold, sink hot+cold, + connections)
  // Half bathroom: ~3 drops (toilet 1, sink hot+cold)
  const bathroomDrops: Record<Bathrooms, number> = {
    "1": 7,
    "1.5": 10,
    "2": 14,
    "2.5": 17,
    "3": 21,
    "3.5": 24,
    "4+": 28,
  };

  const kitchen = 4; // sink h+c, dishwasher, ice maker
  const laundry = 2; // hot + cold
  const waterHeater = 2; // in + out

  const bibDrops: Record<HoseBibs, number> = {
    "1": 1,
    "2": 2,
    "3+": 3,
  };

  return (
    (bathroomDrops[bathrooms] ?? 14) +
    kitchen +
    laundry +
    waterHeater +
    (bibDrops[hoseBibs] ?? 2)
  );
}

/**
 * The published PEX band for a home of this size. The per-drop estimate
 * below is clamped into it (plus the copper upcharge when copper is chosen),
 * so the calculator never shows a 3/2 outside the figure on the repipe page.
 */
function publishedBand(bathrooms: Bathrooms, stories: RepipeSelections["stories"]): PriceRange {
  if (stories === "2" || bathrooms === "3.5" || bathrooms === "4+") return sheet("repipe.pex4plus");
  if (bathrooms === "2.5" || bathrooms === "3") return sheet("repipe.pex3x2");
  return sheet("repipe.pex2x2");
}

export function calculateRepipe(sel: RepipeSelections): QuoteResult {
  const lineItems: QuoteLineItem[] = [];
  const notes: string[] = [];

  const drops = getDropCount(sel.bathrooms!, sel.hoseBibs!);

  // Base per-drop rate (calculator modifier; the total is clamped to the sheet)
  const basePricePerDrop: PriceRange = { min: 225, max: 500 }; // claim-ok: calculator modifier

  // Story multiplier
  const storyMultiplier = sel.stories === "2" ? 1.25 : 1.0;

  // Home age multiplier
  const ageMultipliers: Record<string, number> = {
    "pre-1980": 1.15,
    "1980-1995": 1.1,
    "1996-2010": 1.0,
    "2011+": 0.95,
  };
  const ageMultiplier = ageMultipliers[sel.homeAge!] ?? 1.0;

  // Material multiplier
  const materialMultipliers: Record<string, number> = {
    pex: 1.0,
    copper: 1.6,
    "not-sure": 1.0,
  };
  const materialMultiplier = materialMultipliers[sel.newMaterial!] ?? 1.0;

  // Calculate per-drop with multipliers
  const adjustedMin = Math.round(basePricePerDrop.min * storyMultiplier * ageMultiplier * materialMultiplier);
  const adjustedMax = Math.round(basePricePerDrop.max * storyMultiplier * ageMultiplier * materialMultiplier);

  const pipeTotal: PriceRange = {
    min: drops * adjustedMin,
    max: drops * adjustedMax,
  };

  const materialLabel = sel.newMaterial === "copper" ? "Copper" : "PEX";
  lineItems.push({
    label: `${drops} water line connections (${materialLabel})`,
    range: pipeTotal,
  });

  // Current pipe surcharge — polybutylene removal is the published upcharge;
  // the rest are calculator modifiers.
  const pipeSurcharges: Record<string, PriceRange> = {
    polybutylene: sheet("repipe.polyRemoval"),
    galvanized: { min: 500, max: 800 }, // claim-ok: calculator modifier
    copper: { min: -200, max: -200 }, // claim-ok: calculator modifier
    pvc: { min: 0, max: 200 }, // claim-ok: calculator modifier
    "not-sure": { min: 0, max: 200 }, // claim-ok: calculator modifier
  };

  const surcharge = pipeSurcharges[sel.pipeMaterial!] ?? { min: 0, max: 0 };
  if (surcharge.min !== 0 || surcharge.max !== 0) {
    if (surcharge.min < 0) {
      lineItems.push({
        label: "Copper scrap credit",
        range: surcharge,
      });
    } else {
      lineItems.push({
        label: `${sel.pipeMaterial === "polybutylene" ? "Polybutylene" : sel.pipeMaterial === "galvanized" ? "Galvanized" : "Existing pipe"} removal surcharge`,
        range: surcharge,
      });
    }
  }

  // Raw total from the formula
  const rawTotal: PriceRange = {
    min: lineItems.reduce((sum, item) => sum + item.range.min, 0),
    max: lineItems.reduce((sum, item) => sum + item.range.max, 0),
  };

  // Clamp into the published band for this home size (copper sits above it)
  const band = publishedBand(sel.bathrooms!, sel.stories);
  const copper = sel.newMaterial === "copper" ? sheet("repipe.copperUpcharge") : { min: 0, max: 0 };
  const floor = band.min + copper.min;
  const ceiling = band.max + copper.max;
  const total: PriceRange = {
    min: Math.min(Math.max(rawTotal.min, floor), ceiling),
    max: Math.min(Math.max(rawTotal.max, floor), ceiling),
  };

  // Add multiplier notes
  if (sel.stories === "2") {
    notes.push("Two-story homes require additional labor for vertical pipe runs");
  }
  if (sel.homeAge === "pre-1980" || sel.homeAge === "1980-1995") {
    notes.push("Older homes may require additional wall access");
  }
  if (sel.newMaterial === "not-sure") {
    notes.push("Estimate based on PEX piping — copper upgrade available at higher cost");
  }
  notes.push("Includes all materials, labor, Lee County permit and final inspection");
  notes.push(CLAIMS.repipeRestoration);
  notes.push(CLAIMS.warrantyInstall);

  return { service: "repipe", total, lineItems, notes };
}
