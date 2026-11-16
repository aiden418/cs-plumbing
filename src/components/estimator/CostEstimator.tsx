"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { ArrowRight, RotateCcw } from "@/components/ui/icons";
import { ESTIMATOR_COPY as COPY } from "@/content/services";

/** One estimator service (ESTIMATOR_SERVICES in @/lib/constants, passed in by the server page). */
export interface EstimatorService {
  id: string;
  label: string;
  baseMin: number;
  baseMax: number;
  factors: readonly string[];
}

/** A choice: a white button with a border, large enough to tap. */
const row =
  "group flex min-h-14 w-full items-center justify-between gap-3 rounded-control border border-steel-300 bg-white px-4 py-3 text-left font-medium text-navy transition-colors duration-150 hover:border-primary hover:text-primary-dark aria-pressed:border-primary";

/** The prompt above each step's choices. */
const prompt = "text-lg leading-snug font-semibold text-fg outline-none";

/**
 * Three steps in one panel: pick a service, pick what kind, see the range.
 * The range is the same arithmetic as before (base range × a factor between
 * 0.5 and 1.5, rounded to 50). When a step changes, focus moves to the new
 * step's prompt so a keyboard or screen reader user lands on it.
 */
export default function CostEstimator({ services }: { services: readonly EstimatorService[] }) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const promptRef = useRef<HTMLParagraphElement>(null);
  const moveFocus = useRef(false);

  const service = services.find((s) => s.id === selectedService);

  const calculateRange = () => {
    if (!service || !selectedFactor) return { min: 0, max: 0 };
    const factorIndex = service.factors.indexOf(selectedFactor);
    const multiplier = 0.5 + (factorIndex / (service.factors.length - 1)) * 1;
    return {
      min: Math.round(service.baseMin * multiplier / 50) * 50,
      max: Math.round(service.baseMax * multiplier / 50) * 50,
    };
  };

  const reset = () => {
    moveFocus.current = true;
    setSelectedService(null);
    setSelectedFactor(null);
    setShowResult(false);
  };

  const pickService = (id: string) => {
    moveFocus.current = true;
    setSelectedService(id);
  };

  const pickFactor = (factor: string) => {
    moveFocus.current = true;
    setSelectedFactor(factor);
    setShowResult(true);
  };

  // After a step changes (never on first render), put focus on its prompt.
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    promptRef.current?.focus({ preventScroll: false });
  }, [selectedService, showResult]);

  const range = calculateRange();
  const step = showResult ? "result" : selectedService && service ? "factors" : "services";

  return (
    <div className="estimator rounded-2xl border border-steel-200 bg-white p-5 shadow-[0_8px_30px_-12px_rgb(10_23_48/0.18)] sm:p-7">
      <div className="border-b border-rule pb-4">
        <h3 className="text-xl leading-snug font-semibold text-fg">{COPY.title}</h3>
        <p className="mt-0.5 text-[0.9375rem] text-body">{COPY.tagline}</p>
      </div>

      <div key={step}>
        {/* Step 1: Select Service */}
        {step === "services" && (
          <>
            <p ref={promptRef} tabIndex={-1} className={`${prompt} mt-5 mb-3`}>
              {COPY.pickService}
            </p>
            <ul className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {services.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => pickService(s.id)} className={`${row} h-full`}>
                    <span>{s.label}</span>
                    <ArrowRight className="hidden size-4 shrink-0 text-accent sm:block" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Step 2: Select Factor */}
        {step === "factors" && service && (
          <>
            <p ref={promptRef} tabIndex={-1} className={`${prompt} mt-5 mb-3`}>
              {COPY.pickFactorBefore}
              {service.label.toLowerCase()}
              {COPY.pickFactorAfter}
            </p>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {service.factors.map((factor) => (
                <li key={factor}>
                  <button
                    type="button"
                    onClick={() => pickFactor(factor)}
                    aria-pressed={selectedFactor === factor}
                    className={`${row} h-full`}
                  >
                    <span>{factor}</span>
                    <ArrowRight className="size-4 shrink-0 text-accent" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={reset}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-base font-medium text-link underline-offset-4 hover:underline"
            >
              <RotateCcw className="size-4" /> {COPY.startOver}
            </button>
          </>
        )}

        {/* Result */}
        {step === "result" && (
          <div className="mt-5">
            <p ref={promptRef} tabIndex={-1} className={prompt}>
              {service?.label} — {selectedFactor}
            </p>
            <div className="mt-3 font-display text-display-md font-bold text-primary-dark tabular-nums [font-stretch:108%]">
              ${range.min.toLocaleString()} – ${range.max.toLocaleString()}
            </div>
            <p className="mt-3 text-[0.9375rem] text-body">
              {COPY.disclaimer}
              <br />
              {COPY.disclaimerMore}
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={COPY.bookHref} size="md">
                {COPY.book}
              </Button>
              <Button variant="secondary" size="md" onClick={reset} icon={<RotateCcw className="size-4" />}>
                {COPY.again}
              </Button>
            </div>
            <Link
              href={COPY.detailedHref}
              className="mt-4 inline-flex min-h-11 items-center text-base font-semibold text-link underline-offset-4 hover:underline"
            >
              {COPY.detailed}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
