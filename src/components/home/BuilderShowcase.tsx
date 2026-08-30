"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUILDERS } from "@/lib/builders-data";
import type { Builder } from "@/lib/types";

function BuilderLogo({ builder }: { builder: Builder }) {
  return (
    <div className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full flex items-center justify-center group hover:border-primary/30 card-lift card-lift-hover-subtle">
      <BuilderLogoImage
        builder={builder}
        sizes="(max-width: 640px) 100px, 120px"
        // The marquee translates pills outside their clipping ancestor, where
        // an IntersectionObserver never fires — lazy logos would pop in blank
        // mid-scroll. They're a few KB each once optimized, so load eagerly.
        loading="eager"
        className="h-6 sm:h-8 w-auto max-w-[100px] sm:max-w-[120px] object-contain transition-all duration-300"
      />
    </div>
  );
}

const PILL_INTERACT =
  "transition-all duration-400 ease-[var(--ease-out-expo)] group-hover/marquee:opacity-50 hover:!opacity-100 hover:scale-[1.06]";

export default function BuilderShowcase() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <ScrollReveal>
          <SectionHeading
            overline="Our Partners"
            title="Builders Who Trust C&S"
            subtitle="From custom homes to commercial developments, builders across Southwest Florida choose C&S Plumbing for reliability and quality."
          />
        </ScrollReveal>
      </Container>

      {/* Marquee — reverse direction for visual variety. Two-unit no-outer-gap
          structure to keep the loop seamless; pause + spotlight on hover. */}
      <div className="relative overflow-hidden mt-8 sm:mt-12 group/marquee marquee-pausable">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee-reverse">
          <ul className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6">
            {BUILDERS.map((builder) => (
              <li key={builder.name} className={PILL_INTERACT}>
                <BuilderLogo builder={builder} />
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
            {BUILDERS.map((builder) => (
              <li key={`dup-${builder.name}`} className={PILL_INTERACT}>
                <BuilderLogo builder={builder} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
