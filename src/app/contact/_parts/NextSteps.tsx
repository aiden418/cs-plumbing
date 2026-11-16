import Container from "@/components/ui/Container";
import Section, { type Tone } from "@/components/ui/Section";
import type { NextStep } from "@/content/conversion";
import { cn } from "@/lib/utils";

/**
 * A short numbered list of real steps: rows with a line between them on
 * phones, two columns on tablets, one row of four on desktop. Server component.
 */
export function StepList({ steps, className }: { steps: readonly NextStep[]; className?: string }) {
  return (
    <ol
      className={cn(
        "grid grid-cols-1 border-t border-rule sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:border-t-0",
        className
      )}
    >
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="grid grid-cols-[2rem_1fr] gap-x-3.5 border-b border-rule py-5 lg:border-t lg:border-b-0 lg:pt-5 lg:pb-0"
        >
          <span aria-hidden="true" className="cv-num-disc">
            {i + 1}
          </span>
          <div className="min-w-0">
            <h3 className="pt-0.5 text-lg leading-snug font-semibold text-fg">{step.title}</h3>
            <p className="mt-1.5 max-w-[38ch] text-body">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** "What happens next" on the conversion pages. Server component. */
export default function NextSteps({
  heading,
  steps,
  tone = "shell",
  id,
}: {
  heading: string;
  steps: readonly NextStep[];
  tone?: Tone;
  id: string;
}) {
  return (
    <Section tone={tone} spacing="none" labelledBy={id} className="py-12 lg:py-16">
      <Container>
        <h2 id={id} className="max-w-[24ch] text-display-sm text-fg">
          {heading}
        </h2>
        <StepList steps={steps} className="mt-6 lg:mt-8" />
      </Container>
    </Section>
  );
}
