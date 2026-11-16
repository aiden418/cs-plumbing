"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import WizardProgress from "@/components/ui/WizardProgress";
import { FieldError } from "@/components/forms";
import { QUOTE } from "@/content/conversion";

interface WizardStep {
  label: string;
}

export interface SummaryRow {
  term: string;
  value: string;
}

interface WizardShellProps {
  steps: WizardStep[];
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  /** Jump back to a completed step from the progress line. */
  onStepClick?: (index: number) => void;
  canProceed: boolean;
  /** The step question (an h2 inside the legend). */
  heading: string;
  subtitle?: string;
  /** Shown under the options when Continue is pressed too early. */
  errorMessage?: string;
  /** What has been chosen so far (the live summary beside the wizard). */
  summary: SummaryRow[];
  children: ReactNode;
  nextLabel?: string;
}

/**
 * The quiz frame: progress line, the step question as a fieldset, Back and
 * Continue, and a live summary that sticks beside the wizard from 1024 px.
 * Continue is never disabled: pressed too early it explains what is missing
 * and moves focus to the options.
 */
export default function WizardShell({
  steps,
  currentStep,
  onNext,
  onPrev,
  onStepClick,
  canProceed,
  heading,
  subtitle,
  errorMessage = QUOTE.chooseOne,
  summary,
  children,
  nextLabel,
}: WizardShellProps) {
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const showError = errorStep === currentStep && !canProceed;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const errorId = `quote-step-${currentStep}-error`;
  const hintId = `quote-step-${currentStep}-hint`;

  const move = (fn: () => void) => {
    setErrorStep(null);
    fn();
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canProceed) {
      setErrorStep(currentStep);
      const first =
        optionsRef.current?.querySelector<HTMLElement>("input:not([type=hidden]):not([tabindex='-1'])") ?? null;
      first?.focus();
      return;
    }
    move(onNext);
  };

  return (
    <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
      <form
        noValidate
        onSubmit={submit}
        data-tone="white"
        className="min-w-0 rounded-frame border border-rule bg-white p-5 text-body sm:p-8 lg:col-span-8"
      >
        <WizardProgress
          steps={steps.map((s) => s.label)}
          current={currentStep}
          label={QUOTE.hero.overline}
          onStepClick={onStepClick ? (i) => move(() => onStepClick(i)) : undefined}
          className="border-b border-rule pb-6"
        />
        <p className="mt-5 text-[0.9375rem] text-body">{QUOTE.reassurance}</p>

        <fieldset
          key={currentStep}
          className="m-0 mt-6 min-h-[16rem] min-w-0 border-0 p-0"
          aria-describedby={[showError ? errorId : "", subtitle ? hintId : ""].filter(Boolean).join(" ") || undefined}
        >
          <legend className="p-0">
            <h2 ref={headingRef} tabIndex={-1} className="text-display-sm text-fg focus:outline-none">
              {heading}
            </h2>
          </legend>
          {subtitle && (
            <p id={hintId} className="mt-2 text-body">
              {subtitle}
            </p>
          )}
          <div ref={optionsRef} className="mt-6">
            {children}
          </div>
          <FieldError id={errorId} className="mt-3">
            {showError ? errorMessage : null}
          </FieldError>
        </fieldset>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => move(onPrev)}
            disabled={currentStep === 0}
            icon={<ChevronLeft aria-hidden="true" className="size-5" />}
            className="w-full sm:w-auto"
          >
            {QUOTE.back}
          </Button>
          <Button
            type="submit"
            iconRight={<ChevronRight aria-hidden="true" className="size-5" />}
            className="w-full sm:w-auto"
          >
            {nextLabel ?? QUOTE.continue}
          </Button>
        </div>
      </form>

      <aside className="hidden lg:col-span-4 lg:block" aria-labelledby="quote-summary">
        <div className="sticky top-[calc(var(--nav-h)+1.5rem)] border-t border-rule pt-6">
          <h2 id="quote-summary" className="text-lg font-semibold text-fg">
            {QUOTE.summaryHeading}
          </h2>
          {summary.length > 0 ? (
            <dl className="mt-5 border-b border-rule">
              {summary.map((row) => (
                <div key={row.term} className="flex items-baseline justify-between gap-4 border-t border-rule py-3">
                  <dt className="text-[0.9375rem] text-muted">{row.term}</dt>
                  <dd className="text-right font-semibold text-fg">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-body">{QUOTE.summaryEmpty}</p>
          )}
        </div>
      </aside>
    </div>
  );
}
