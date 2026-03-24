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

// ============================================
// WATER HEATER PRICING
// ============================================

const BASE_PRICES: Record<string, PriceRange> = {
  "traditional-40gal": { min: 995, max: 1500 },
  "traditional-50gal": { min: 1275, max: 1675 },
  "traditional-75gal": { min: 1800, max: 2600 },
  "tankless-single-point": { min: 1500, max: 2200 },
  "tankless-whole-home": { min: 3000, max: 4500 },
  hybrid: { min: 2800, max: 4200 },
};

const BRAND_ADDER: Record<string, PriceRange> = {
  standard: { min: 0, max: 0 },
  premium: { min: 400, max: 800 },
};

const LOCATION_ADDER: Record<string, PriceRange> = {
  garage: { min: 0, max: 0 },
  closet: { min: 100, max: 200 },
  outdoor: { min: 150, max: 250 },
  attic: { min: 300, max: 500 },
};

const FUEL_ADDER: Record<string, PriceRange> = {
  electric: { min: 0, max: 0 },
  gas: { min: 200, max: 400 },
  propane: { min: 300, max: 500 },
};

const WARRANTY_ADDER: Record<string, PriceRange> = {
  standard: { min: 0, max: 0 },
  extended: { min: 150, max: 200 },
  premium: { min: 300, max: 400 },
};

const ADDON_PRICES: Record<HeaterAddon, { label: string; price: number }> = {
  "expansion-tank": { label: "Expansion Tank", price: 150 },
  "drain-pan": { label: "Drain Pan", price: 75 },
  "shutoff-valve": { label: "Shutoff Valve", price: 100 },
  "recirc-pump": { label: "Recirculation Pump", price: 350 },
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
      label: `${sel.warranty === "extended" ? "Extended 10-Year" : "Premium 12-Year"} Warranty`,
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
  notes.push("Standard permit fees included");

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

export function calculateRepipe(sel: RepipeSelections): QuoteResult {
  const lineItems: QuoteLineItem[] = [];
  const notes: string[] = [];

  const drops = getDropCount(sel.bathrooms!, sel.hoseBibs!);

  // Base per-drop rate
  const basePricePerDrop: PriceRange = { min: 225, max: 500 };

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

  // Current pipe surcharge
  const pipeSurcharges: Record<string, PriceRange> = {
    polybutylene: { min: 0, max: 0 },
    galvanized: { min: 500, max: 800 },
    copper: { min: -200, max: -200 },
    pvc: { min: 0, max: 200 },
    "not-sure": { min: 0, max: 200 },
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
        label: `${sel.pipeMaterial === "galvanized" ? "Galvanized" : "Existing pipe"} removal surcharge`,
        range: surcharge,
      });
    }
  }

  // Permit
  lineItems.push({
    label: "Permit & inspections",
    range: { min: 500, max: 1000 },
  });

  // Total with floor
  const rawTotal: PriceRange = {
    min: lineItems.reduce((sum, item) => sum + item.range.min, 0),
    max: lineItems.reduce((sum, item) => sum + item.range.max, 0),
  };

  const total: PriceRange = {
    min: Math.max(4500, rawTotal.min),
    max: Math.max(4500, rawTotal.max),
  };

  // Add multiplier notes
  if (sel.stories === "2") {
    notes.push("Two-story homes require additional labor for vertical pipe runs");
  }
  if (sel.homeAge === "pre-1980" || sel.homeAge === "1980-1995") {
    notes.push("Older homes may require additional wall access and patching");
  }
  if (sel.newMaterial === "not-sure") {
    notes.push("Estimate based on PEX piping — copper upgrade available at higher cost");
  }
  notes.push("Includes all materials, labor, permit, inspections, and drywall patching");

  return { service: "repipe", total, lineItems, notes };
}
