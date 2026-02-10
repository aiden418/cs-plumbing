"use client";

import CountUp from "@/components/animations/CountUp";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Container from "@/components/ui/Container";
import { STATS } from "@/lib/constants";

export default function StatsBar() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 border-y border-white/5 bg-surface">
      <Container>
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-1 sm:mb-2">
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2 + i * 0.2}
                  />
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
