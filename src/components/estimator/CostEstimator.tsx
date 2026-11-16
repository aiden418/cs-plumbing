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

const row =
  "group flex min-h-12 w-full items-center justify-between gap-4 border-b border-rule py-3 text-left text-body transition-colors duration-150 hover:text-fg active:bg-steel-50";

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
    <div className="estimator rounded-frame border border-rule bg-canvas p-5 sm:p-8">
      <div className="border-b border-rule pb-5">
        <h3 className="text-lg leading-snug font-semibold text-fg">{COPY.title}</h3>
        <p className="text-sm text-muted">{COPY.tagline}</p>
      </div>

      <div key={step} className="estimator-step">
        {/* Step 1: Select Service */}
        {step === "services" && (
          <>
            <p ref={promptRef} tabIndex={-1} className="label-tech mt-6 mb-2 text-accent">
              {COPY.pickService}
            </p>
            <ul className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => pickService(s.id)} className={row}>
                    <span className="font-medium underline-offset-4 group-hover:underline">{s.label}</span>
                    <ArrowRight className="size-4 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Step 2: Select Factor */}
        {step === "factors" && service && (
          <>
            <p ref={promptRef} tabIndex={-1} className="label-tech mt-6 mb-2 text-accent">
              {COPY.pickFactorBefore}
              {service.label.toLowerCase()}
              {COPY.pickFactorAfter}
            </p>
            <ul>
              {service.factors.map((factor) => (
                <li key={factor}>
                  <button
                    type="button"
                    onClick={() => pickFactor(factor)}
                    aria-pressed={selectedFactor === factor}
                    className={row}
                  >
                    <span className="font-medium underline-offset-4 group-hover:underline">{factor}</span>
                    <ArrowRight className="size-4 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
            >
              <RotateCcw className="size-4" /> {COPY.startOver}
            </button>
          </>
        )}

        {/* Result */}
        {step === "result" && (
          <div className="mt-6">
            <p ref={promptRef} tabIndex={-1} className="label-tech text-accent">
              {service?.label} — {selectedFactor}
            </p>
            <div className="mt-4 font-display text-display-md font-bold text-fg tabular-nums [font-stretch:108%]">
              ${range.min.toLocaleString()} – ${range.max.toLocaleString()}
            </div>
            <p className="mt-4 text-sm text-muted">
              {COPY.disclaimer}
              <br />
              {COPY.disclaimerMore}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href={COPY.bookHref} size="md">
                {COPY.book}
              </Button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-rule px-5 text-base font-semibold text-fg transition-colors duration-150 hover:border-fg active:scale-[0.98]"
              >
                <RotateCcw className="size-4" /> {COPY.again}
              </button>
            </div>
            <Link
              href={COPY.detailedHref}
              className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-link underline-offset-4 hover:underline"
            >
              {COPY.detailed}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
