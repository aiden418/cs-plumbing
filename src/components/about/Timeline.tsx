"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { TIMELINE_EVENTS } from "@/lib/constants";

export default function Timeline() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-surface">
      <Container size="narrow">
        <SectionHeading
          overline="Our Journey"
          title="27+ Years of Excellence"
          subtitle="From a single truck to Southwest Florida's most trusted plumbing team."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-8 lg:left-1/2 top-0 bottom-0 w-px bg-white/10 lg:-translate-x-px" />

          <div className="space-y-8 sm:space-y-12">
            {TIMELINE_EVENTS.map((event, i) => (
              <ScrollReveal
                key={event.year}
                direction={i % 2 === 0 ? "left" : "right"}
                delay={i * 0.1}
              >
                <div
                  className={`relative flex items-start gap-4 sm:gap-8 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ml-12 sm:ml-20 lg:ml-0 ${
                      i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:pl-16"
                    }`}
                  >
                    <span className="text-primary font-bold text-base sm:text-lg">
                      {event.year}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1 mb-1.5 sm:mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-5 sm:left-8 lg:left-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary border-[3px] sm:border-4 border-background z-10" />

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block flex-1" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
