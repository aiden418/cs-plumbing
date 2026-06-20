"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { GraduationCap } from "lucide-react";

export default function TrainingTrade() {
  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <Container size="narrow">
        <ScrollReveal>
          <div className="rounded-3xl border border-gray-200 bg-surface p-8 sm:p-12 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold">
              <GraduationCap className="h-7 w-7" />
            </div>
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Training the Next Generation
            </span>
            <h2 className="mx-auto mt-3 max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-gray-900">
              Keeping the Trade Strong
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-500">
              We train every apprentice through a structured 4-year program covering Florida
              Building Code, drainage and venting design, gas, and code-compliant install
              practices. The trade only stays strong if we keep teaching it — the same way it
              was taught to us.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
