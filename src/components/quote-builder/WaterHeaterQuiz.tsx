"use client";

import { useState } from "react";
import { Warehouse, DoorOpen, Sun, TreePine, Flame, Plug, Fuel, Shield, ShieldCheck, ShieldPlus } from "lucide-react";
import type {
  WaterHeaterSelections,
  HeaterType,
  TankSize,
  TanklessSize,
  BrandTier,
  HeaterLocation,
  FuelType,
  WarrantyTier,
  HeaterAddon,
  QuoteResult,
} from "@/lib/quote-types";
import { calculateWaterHeater } from "@/lib/quote-pricing";
import WizardShell from "./WizardShell";
import ProductCard from "./ProductCard";
import type { ProductOption } from "./ProductCard";
import CheckboxGrid from "./CheckboxGrid";

interface WaterHeaterQuizProps {
  onComplete: (selections: WaterHeaterSelections, result: QuoteResult) => void;
}

const HEATER_TYPES: ProductOption[] = [
  {
    id: "traditional",
    label: "Traditional Tank",
    description: "Reliable storage tank that keeps hot water ready. Great value for most homes.",
    priceHint: "Starting at $1,200",
    image: "/images/quote-builder/tank-heater.png",
  },
  {
    id: "tankless",
    label: "Tankless",
    description: "Heats water on demand — never run out. Compact wall-mounted unit.",
    priceHint: "Starting at $1,500",
    image: "/images/quote-builder/tankless-heater.png",
    badge: "Popular",
  },
  {
    id: "hybrid",
    label: "Hybrid Heat Pump",
    description: "Most energy efficient. Uses heat from the air to warm water. Saves up to 60% on energy.",
    priceHint: "Starting at $2,800",
    image: "/images/quote-builder/hybrid-heater.png",
    badge: "Eco-Friendly",
  },
];

const TANK_SIZES: ProductOption[] = [
  {
    id: "40gal",
    label: "40 Gallon",
    description: "Perfect for 1–2 people or small households",
    priceHint: "$1,200 – $1,800",
    image: "/images/quote-builder/rheem-standard-tank.webp",
  },
  {
    id: "50gal",
    label: "50 Gallon",
    description: "Ideal for 2–4 people — our most popular size",
    priceHint: "$1,400 – $2,100",
    image: "/images/quote-builder/rheem-standard-tank.webp",
    badge: "Most Popular",
  },
  {
    id: "75gal",
    label: "75 Gallon",
    description: "Best for large families with 4+ people",
    priceHint: "$1,800 – $2,600",
    image: "/images/quote-builder/rheem-standard-tank.webp",
  },
];

const TANKLESS_SIZES: ProductOption[] = [
  {
    id: "single-point",
    label: "Single-Point",
    description: "Serves one fixture like a bathroom or kitchen sink",
    priceHint: "$1,500 – $2,200",
    image: "/images/quote-builder/rheem-tankless-product.webp",
  },
  {
    id: "whole-home",
    label: "Whole-Home",
    description: "Powers your entire house with endless hot water",
    priceHint: "$3,000 – $4,500",
    image: "/images/quote-builder/rheem-tankless-product.webp",
    badge: "Recommended",
  },
];

const BRAND_TIERS: ProductOption[] = [
  {
    id: "standard",
    label: "Standard Brands",
    description: "Rheem, A.O. Smith — proven reliability at a great price. Industry-standard quality with solid warranties.",
    priceHint: "No extra cost",
    image: "/images/quote-builder/rheem-standard-tank.webp",
  },
  {
    id: "premium",
    label: "Premium Brands",
    description: "Rinnai, Navien — top-tier performance and advanced features. Best-in-class efficiency and longevity.",
    priceHint: "+$400 – $800",
    image: "/images/quote-builder/rinnai-tankless.png",
    badge: "Upgrade",
  },
];

const LOCATIONS = [
  { id: "garage", label: "Garage", icon: <Warehouse className="w-8 h-8 sm:w-10 sm:h-10" /> },
  { id: "closet", label: "Indoor Closet", icon: <DoorOpen className="w-8 h-8 sm:w-10 sm:h-10" /> },
  { id: "outdoor", label: "Outdoor", icon: <Sun className="w-8 h-8 sm:w-10 sm:h-10" /> },
  { id: "attic", label: "Attic", icon: <TreePine className="w-8 h-8 sm:w-10 sm:h-10" /> },
];

const FUEL_TYPES = [
  { id: "electric", label: "Electric", icon: <Plug className="w-8 h-8 sm:w-10 sm:h-10" /> },
  { id: "gas", label: "Natural Gas", icon: <Flame className="w-8 h-8 sm:w-10 sm:h-10" /> },
  { id: "propane", label: "Propane", icon: <Fuel className="w-8 h-8 sm:w-10 sm:h-10" /> },
];

const WARRANTIES: ProductOption[] = [
  {
    id: "standard",
    label: "Standard 6-Year",
    description: "Included with every installation",
    priceHint: "Included",
    icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    id: "extended",
    label: "Extended 10-Year",
    description: "Extra peace of mind for your investment",
    priceHint: "+$150 – $200",
    icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />,
    badge: "Best Value",
  },
  {
    id: "premium",
    label: "Premium 12-Year",
    description: "Maximum coverage — full parts & labor",
    priceHint: "+$300 – $400",
    icon: <ShieldPlus className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
];

const ADDONS = [
  { id: "expansion-tank", label: "Expansion Tank", price: 150 },
  { id: "drain-pan", label: "Drain Pan", price: 75 },
  { id: "shutoff-valve", label: "Shutoff Valve", price: 100 },
  { id: "recirc-pump", label: "Recirculation Pump", price: 350 },
];

const STEP_HEADINGS = [
  "What type of water heater are you looking for?",
  "What size do you need?",
  "Do you have a brand preference?",
  "Where is your water heater located?",
  "What fuel type does your home use?",
  "Choose your warranty coverage",
  "Any add-ons? (optional)",
];

const STEP_SUBTITLES = [
  "Each type has unique benefits — pick what fits your home best.",
  "The right size depends on your household and hot water usage.",
  "Both options come fully installed with our quality guarantee.",
  "This helps us estimate any additional installation requirements.",
  "Select what's currently connected in your home.",
  "Protect your investment with extended coverage.",
  "Common upgrades that many homeowners add to their install.",
];

const STEPS = [
  { label: "Type" },
  { label: "Size" },
  { label: "Brand" },
  { label: "Location" },
  { label: "Fuel" },
  { label: "Warranty" },
  { label: "Add-ons" },
];

export default function WaterHeaterQuiz({ onComplete }: WaterHeaterQuizProps) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<WaterHeaterSelections>({
    heaterType: null,
    size: null,
    brandTier: null,
    location: null,
    fuelType: null,
    warranty: null,
    addons: [],
  });

  const update = <K extends keyof WaterHeaterSelections>(
    key: K,
    value: WaterHeaterSelections[K]
  ) => {
    setSel((prev) => ({ ...prev, [key]: value }));
  };

  // Skip size step for hybrid
  const totalSteps = sel.heaterType === "hybrid" ? 6 : 7;
  const quizStep = sel.heaterType === "hybrid" && step >= 1 ? step + 1 : step;

  const canProceed = () => {
    switch (quizStep) {
      case 0: return sel.heaterType !== null;
      case 1: return sel.size !== null;
      case 2: return sel.brandTier !== null;
      case 3: return sel.location !== null;
      case 4: return sel.fuelType !== null;
      case 5: return sel.warranty !== null;
      case 6: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === totalSteps - 1) {
      const result = calculateWaterHeater(sel);
      onComplete(sel, result);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const toggleAddon = (id: string) => {
    setSel((prev) => ({
      ...prev,
      addons: prev.addons.includes(id as HeaterAddon)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id as HeaterAddon],
    }));
  };

  const renderStep = () => {
    switch (quizStep) {
      case 0:
        return (
          <ProductCard
            options={HEATER_TYPES}
            selected={sel.heaterType}
            onSelect={(id) => update("heaterType", id as HeaterType)}
          />
        );
      case 1:
        return (
          <ProductCard
            options={sel.heaterType === "tankless" ? TANKLESS_SIZES : TANK_SIZES}
            selected={sel.size}
            onSelect={(id) => update("size", id as TankSize | TanklessSize)}
          />
        );
      case 2:
        return (
          <ProductCard
            options={BRAND_TIERS}
            selected={sel.brandTier}
            onSelect={(id) => update("brandTier", id as BrandTier)}
            layout="row"
          />
        );
      case 3:
        return (
          <ProductCard
            options={LOCATIONS}
            selected={sel.location}
            onSelect={(id) => update("location", id as HeaterLocation)}
          />
        );
      case 4:
        return (
          <ProductCard
            options={FUEL_TYPES}
            selected={sel.fuelType}
            onSelect={(id) => update("fuelType", id as FuelType)}
          />
        );
      case 5:
        return (
          <ProductCard
            options={WARRANTIES}
            selected={sel.warranty}
            onSelect={(id) => update("warranty", id as WarrantyTier)}
          />
        );
      case 6:
        return (
          <CheckboxGrid
            options={ADDONS}
            selected={sel.addons}
            onToggle={toggleAddon}
          />
        );
      default:
        return null;
    }
  };

  const visibleSteps = sel.heaterType === "hybrid"
    ? STEPS.filter((_, i) => i !== 1)
    : STEPS;

  return (
    <WizardShell
      steps={visibleSteps}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      nextLabel={step === totalSteps - 1 ? "See My Estimate" : undefined}
    >
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          {STEP_HEADINGS[quizStep]}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {STEP_SUBTITLES[quizStep]}
        </p>
      </div>
      {renderStep()}
    </WizardShell>
  );
}
