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
      <p className="label-tech mb-3 text-accent" aria-live="polite">
        {stepOfLabel(current, steps.length)}
      </p>
      <Stepper items={items} current={current} label={label} />
    </div>
  );
}
