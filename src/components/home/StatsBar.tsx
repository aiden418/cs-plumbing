"use client";

import Image from "next/image";
import CountUp from "@/components/animations/CountUp";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Container from "@/components/ui/Container";
import { STATS } from "@/lib/constants";

export default function StatsBar() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 border-y border-gray-200 bg-[#F5F5F7] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/gallery/dji_fly_20241003_120708_83_1727971638528_photo.jpg"
          alt="Drone view of a C&S Plumbing new construction jobsite in Lee County"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      </div>
      <Container className="relative z-10">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-1 sm:mb-2">
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
