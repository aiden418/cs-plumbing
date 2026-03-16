"use client";

import { useState } from "react";
import type {
  RepipeSelections,
  HomeAge,
  PipeMaterial,
  Bedrooms,
  Bathrooms,
  Stories,
  HoseBibs,
  NewMaterial,
  QuoteResult,
} from "@/lib/quote-types";
import { calculateRepipe } from "@/lib/quote-pricing";
import WizardShell from "./WizardShell";
import OptionGrid from "./OptionGrid";

interface RepipeQuizProps {
  onComplete: (selections: RepipeSelections, result: QuoteResult) => void;
}

const HOME_AGES = [
  { id: "pre-1980", label: "Before 1980" },
  { id: "1980-1995", label: "1980–1995" },
  { id: "1996-2010", label: "1996–2010" },
  { id: "2011+", label: "2011 or newer" },
];

const PIPE_MATERIALS = [
  { id: "polybutylene", label: "Polybutylene", description: "Gray flexible pipe" },
  { id: "copper", label: "Copper", description: "Orange/brown metal" },
  { id: "galvanized", label: "Galvanized", description: "Silver/gray metal" },
  { id: "pvc", label: "PVC / CPVC", description: "White or tan plastic" },
  { id: "not-sure", label: "Not Sure", description: "We'll identify it" },
];

const BEDROOM_OPTIONS = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5+", label: "5+" },
];

const BATHROOM_OPTIONS = [
  { id: "1", label: "1" },
  { id: "1.5", label: "1.5" },
  { id: "2", label: "2" },
  { id: "2.5", label: "2.5" },
  { id: "3", label: "3" },
  { id: "3.5", label: "3.5" },
  { id: "4+", label: "4+" },
];

const STORY_OPTIONS = [
  { id: "1", label: "1 Story" },
  { id: "2", label: "2 Story" },
];

const HOSE_BIB_OPTIONS = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3+", label: "3+" },
];

const NEW_MATERIAL_OPTIONS = [
  { id: "pex", label: "PEX", description: "Most popular, flexible" },
  { id: "copper", label: "Copper", description: "Premium, durable" },
  { id: "not-sure", label: "Not Sure", description: "We'll recommend" },
];

const STEPS = [
  { label: "Address" },
  { label: "Home" },
  { label: "Pipes" },
  { label: "Beds" },
  { label: "Baths" },
  { label: "Stories" },
  { label: "Outdoor" },
  { label: "Material" },
];

const STEP_HEADINGS = [
  "What's the service address?",
  "How old is the home?",
  "What type of pipes do you have now?",
  "How many bedrooms?",
  "How many bathrooms?",
  "How many stories?",
  "How many outdoor hose bibs?",
  "What material would you like for the new pipes?",
];

export default function RepipeQuiz({ onComplete }: RepipeQuizProps) {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<RepipeSelections>({
    address: "",
    homeAge: null,
    pipeMaterial: null,
    bedrooms: null,
    bathrooms: null,
    stories: null,
    hoseBibs: null,
    newMaterial: null,
  });

  const update = <K extends keyof RepipeSelections>(
    key: K,
    value: RepipeSelections[K]
  ) => {
    setSel((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 0: return sel.address.length >= 5;
      case 1: return sel.homeAge !== null;
      case 2: return sel.pipeMaterial !== null;
      case 3: return sel.bedrooms !== null;
      case 4: return sel.bathrooms !== null;
      case 5: return sel.stories !== null;
      case 6: return sel.hoseBibs !== null;
      case 7: return sel.newMaterial !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 7) {
      const result = calculateRepipe(sel);
      onComplete(sel, result);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <input
            value={sel.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 Main St, Fort Myers, FL 33901"
            className="w-full bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-gray-900 text-sm outline-none focus:border-primary transition-colors"
          />
        );
      case 1:
        return (
          <OptionGrid
            options={HOME_AGES}
            selected={sel.homeAge}
            onSelect={(id) => update("homeAge", id as HomeAge)}
            columns={4}
          />
        );
      case 2:
        return (
          <OptionGrid
            options={PIPE_MATERIALS}
            selected={sel.pipeMaterial}
            onSelect={(id) => update("pipeMaterial", id as PipeMaterial)}
            columns={3}
          />
        );
      case 3:
        return (
          <OptionGrid
            options={BEDROOM_OPTIONS}
            selected={sel.bedrooms}
            onSelect={(id) => update("bedrooms", id as Bedrooms)}
            columns={5}
          />
        );
      case 4:
        return (
          <OptionGrid
            options={BATHROOM_OPTIONS}
            selected={sel.bathrooms}
            onSelect={(id) => update("bathrooms", id as Bathrooms)}
            columns={4}
          />
        );
      case 5:
        return (
          <OptionGrid
            options={STORY_OPTIONS}
            selected={sel.stories}
            onSelect={(id) => update("stories", id as Stories)}
            columns={2}
          />
        );
      case 6:
        return (
          <OptionGrid
            options={HOSE_BIB_OPTIONS}
            selected={sel.hoseBibs}
            onSelect={(id) => update("hoseBibs", id as HoseBibs)}
            columns={3}
          />
        );
      case 7:
        return (
          <OptionGrid
            options={NEW_MATERIAL_OPTIONS}
            selected={sel.newMaterial}
            onSelect={(id) => update("newMaterial", id as NewMaterial)}
            columns={3}
          />
        );
      default:
        return null;
    }
  };

  return (
    <WizardShell
      steps={STEPS}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      nextLabel={step === 7 ? "See My Estimate" : undefined}
    >
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
        {STEP_HEADINGS[step]}
      </h2>
      {renderStep()}
    </WizardShell>
  );
}
