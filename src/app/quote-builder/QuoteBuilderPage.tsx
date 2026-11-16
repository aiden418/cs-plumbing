"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import WaterHeaterQuiz from "@/components/quote-builder/WaterHeaterQuiz";
import RepipeQuiz from "@/components/quote-builder/RepipeQuiz";
import QuoteResult from "@/components/quote-builder/QuoteResult";
import { cn } from "@/lib/utils";
import { QUOTE } from "@/content/conversion";
import type {
  ServiceType,
  WaterHeaterSelections,
  RepipeSelections,
  QuoteResult as QuoteResultType,
} from "@/lib/quote-types";

const SERVICES: ServiceType[] = ["water-heater", "repipe"];

export default function QuoteBuilderPage() {
  const searchParams = useSearchParams();
  const param = searchParams.get("service");
  const paramService: ServiceType | null =
    param === "water-heater" || param === "repipe" ? param : null;

  // Seeded straight from ?service= instead of via an effect. The parent wraps
  // this in <Suspense>, so it never renders during prerender and there's no
  // server HTML to mismatch.
  const [service, setService] = useState<ServiceType | null>(paramService);
  const [result, setResult] = useState<QuoteResultType | null>(null);
  const [selections, setSelections] = useState<WaterHeaterSelections | RepipeSelections | null>(null);

  // Re-sync when the URL changes under us (a client-side nav into the other
  // quiz). Like the effect it replaces, a missing param leaves the choice alone
  // rather than clearing it.
  const [lastParamService, setLastParamService] = useState(paramService);
  if (paramService !== lastParamService) {
    setLastParamService(paramService);
    if (paramService) setService(paramService);
  }

  const handleComplete = (
    sel: WaterHeaterSelections | RepipeSelections,
    res: QuoteResultType
  ) => {
    setSelections(sel);
    setResult(res);
  };

  const handleReset = () => {
    setService(null);
    setResult(null);
    setSelections(null);
  };

  const switchService = (s: ServiceType) => {
    setService(s);
    setResult(null);
    setSelections(null);
  };

  // The page hero is rendered by the server page (page.tsx) above this
  // Suspense boundary so the H1 and copy reach crawlers; this component is
  // only the interactive quiz.

  // Service selector
  if (!service && !result) {
    return (
      <div
        data-tone="white"
        className="rounded-frame border border-rule bg-white p-5 text-body sm:p-8"
      >
        <h2 className="text-display-sm text-fg">{QUOTE.selectorHeading}</h2>
        <p className="mt-2 text-lg text-body">{QUOTE.selectorLead}</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => switchService(s)}
              className={cn(
                "group flex min-h-24 items-center justify-between gap-4 rounded-control border border-steel-300 bg-white p-5 text-left sm:p-6",
                "transition-[border-color,background-color] duration-150 ease-enter hover:border-primary hover:bg-shell active:scale-[0.99]"
              )}
            >
              <span className="min-w-0">
                <span className="block text-xl leading-snug font-semibold text-ink">{QUOTE.services[s].title}</span>
                <span className="mt-1 block text-steel-700">{QUOTE.services[s].line}</span>
              </span>
              <ArrowRight
                aria-hidden="true"
                strokeWidth={1.75}
                className="size-6 shrink-0 text-primary-dark"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Result
  if (result && selections) {
    return <QuoteResult result={result} selections={selections} onReset={handleReset} />;
  }

  // Active quiz
  return (
    <div>
      <fieldset className="m-0 mb-5 min-w-0 border-0 p-0">
        <legend className="sr-only">{QUOTE.serviceToggleLabel}</legend>
        <div className="grid grid-cols-2 gap-1 rounded-control border border-rule bg-raised p-1 sm:inline-grid sm:min-w-[22rem]">
          {SERVICES.map((s) => (
            <label
              key={s}
              className={cn(
                "relative flex min-h-12 cursor-pointer items-center justify-center rounded-[0.5rem] px-3 text-center text-base leading-tight font-semibold text-body",
                "transition-colors duration-150 ease-enter hover:text-fg",
                "has-checked:bg-primary has-checked:text-white",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
              )}
            >
              <input
                type="radio"
                name="quote-service"
                value={s}
                checked={service === s}
                onChange={() => switchService(s)}
                className="sr-only"
              />
              {QUOTE.services[s].toggle}
            </label>
          ))}
        </div>
      </fieldset>

      {service === "water-heater" ? (
        <WaterHeaterQuiz key="water-heater" onComplete={handleComplete} />
      ) : (
        <RepipeQuiz key="repipe" onComplete={handleComplete} />
      )}
    </div>
  );
}
