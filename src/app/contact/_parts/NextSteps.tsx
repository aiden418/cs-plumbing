import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section, { type Tone } from "@/components/ui/Section";
import type { NextStep } from "@/content/conversion";

/**
 * "What happens next" for the conversion pages: the connection line drawn
 * across four numbered steps (a vertical line on phones). Replaces the old
 * WhatHappensNext card grid with the same words. Server component.
 */
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
    <Section tone={tone} spacing="sm" labelledBy={id}>
      <Container>
        <Reveal>
          <h2 id={id} className="max-w-[24ch] text-display-sm text-fg">
            {heading}
          </h2>
        </Reveal>
        <ol className="cv-steps mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 lg:mt-12 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.title} index={i} className="cv-step relative pl-11 sm:pl-0 sm:pt-11">
              <span aria-hidden="true" className="cv-step-joint" />
              <p className="label-tech text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1.5 text-lg leading-snug font-semibold text-fg">{step.title}</h3>
              <p className="mt-2 max-w-[38ch] text-[0.9375rem] leading-relaxed text-body">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
