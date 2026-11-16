import { cn } from "@/lib/utils";
import Stepper, { type StepItem } from "@/components/ui/Stepper";

/** "Step 2 of 4" for a 0-based current step. */
export function stepOfLabel(current: number, total: number): string {
  const n = Math.min(Math.max(current + 1, 1), Math.max(total, 1));
  return `Step ${n} of ${total}`;
}

interface WizardProgressProps {
  /** Step names, in order. */
  steps: string[];
  /** 0-based index of the step on screen. */
  current: number;
  /** Names the navigation landmark (default "Progress"). */
  label?: string;
  /** Optional: makes completed steps buttons that go back to them (client callers only). */
  onStepClick?: (index: number) => void;
  className?: string;
}

/**
 * Progress for the booking and quote wizards: "Step 2 of 4" and the
 * connection line with the current step marked aria-current="step".
 */
export default function WizardProgress({ steps, current, label = "Progress", onStepClick, className }: WizardProgressProps) {
  const items: StepItem[] = steps.map((name, i) => ({
    label: name,
    onClick: onStepClick && i < current ? () => onStepClick(i) : undefined,
  }));
  return (
    <div className={cn("text-body", className)}>
      <p className="eyebrow mb-3 text-accent" aria-live="polite">
        {stepOfLabel(current, steps.length)}
      </p>
      {/* Phones: the name of the step on screen and a segmented line. The full
          connection line needs more width than a phone has, and a strip that
          scrolls sideways hides the later steps. */}
      <div className="sm:hidden">
        <p className="text-lg font-semibold text-fg">{steps[Math.min(Math.max(current, 0), steps.length - 1)]}</p>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {steps.map((name, i) => (
            <span key={name} className={cn("h-1 flex-1 rounded-full", i <= current ? "bg-primary" : "bg-rule")} />
          ))}
        </div>
      </div>
      <div className="max-sm:hidden">
        <Stepper items={items} current={current} label={label} />
      </div>
    </div>
  );
}
