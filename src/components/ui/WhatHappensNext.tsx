import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";

export interface WhatHappensStep {
  title: string;
  description: string;
}

interface WhatHappensNextProps {
  title?: string;
  steps: WhatHappensStep[];
  /** Background tint. Default: surface (light gray) */
  variant?: "surface" | "white";
  className?: string;
}

/**
 * Reusable "what happens next" reassurance block for high-intent pages
 * (emergency, booking, contact, builder portal, quote builder).
 *
 * Reduces visitor anxiety before clicking the CTA by spelling out exactly
 * what the response looks like.
 */
export default function WhatHappensNext({
  title = "What happens next",
  steps,
  variant = "surface",
  className = "",
}: WhatHappensNextProps) {
  const bgClass = variant === "white" ? "bg-white" : "bg-[#F5F5F7]";

  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${bgClass} ${className}`}>
      <Container size="narrow">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
            {title}
          </h2>
        </ScrollReveal>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.08}>
              <li className="relative bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 h-full">
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-sm shadow-[0_0_30px_rgba(0,119,204,0.25)] mb-4"
                >
                  {i + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
