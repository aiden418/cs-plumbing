// ============================================
// WATER HEATER QUIZ TYPES
// ============================================

export type HeaterType = "traditional" | "tankless" | "hybrid";
export type TankSize = "40gal" | "50gal" | "75gal";
export type TanklessSize = "single-point" | "whole-home";
export type BrandTier = "standard" | "premium";
export type HeaterLocation = "garage" | "closet" | "outdoor" | "attic";
export type FuelType = "electric" | "gas" | "propane";
export type WarrantyTier = "standard" | "extended" | "premium";
export type HeaterAddon = "expansion-tank" | "drain-pan" | "shutoff-valve" | "recirc-pump";

export interface WaterHeaterSelections {
  heaterType: HeaterType | null;
  size: TankSize | TanklessSize | null;
  brandTier: BrandTier | null;
  location: HeaterLocation | null;
  fuelType: FuelType | null;
  warranty: WarrantyTier | null;
  addons: HeaterAddon[];
}

// ============================================
// REPIPE QUIZ TYPES
// ============================================

export type HomeAge = "pre-1980" | "1980-1995" | "1996-2010" | "2011+";
export type PipeMaterial = "polybutylene" | "copper" | "galvanized" | "pvc" | "not-sure";
export type Bedrooms = "1" | "2" | "3" | "4" | "5+";
export type Bathrooms = "1" | "1.5" | "2" | "2.5" | "3" | "3.5" | "4+";
export type Stories = "1" | "2";
export type HoseBibs = "1" | "2" | "3+";
export type NewMaterial = "pex" | "copper" | "not-sure";

export interface RepipeSelections {
  address: string;
  homeAge: HomeAge | null;
  pipeMaterial: PipeMaterial | null;
  bedrooms: Bedrooms | null;
  bathrooms: Bathrooms | null;
  stories: Stories | null;
  hoseBibs: HoseBibs | null;
  newMaterial: NewMaterial | null;
}

// ============================================
// SHARED TYPES
// ============================================

export type ServiceType = "water-heater" | "repipe";

export interface PriceRange {
  min: number;
  max: number;
}

export interface QuoteLineItem {
  label: string;
  range: PriceRange;
}

export interface QuoteResult {
  service: ServiceType;
  total: PriceRange;
  lineItems: QuoteLineItem[];
  notes: string[];
}

export interface LeadCaptureData {
  name: string;
  email: string;
  phone: string;
}

export interface QuoteSubmission {
  service: ServiceType;
  selections: WaterHeaterSelections | RepipeSelections;
  result: QuoteResult;
  lead: LeadCaptureData;
}
