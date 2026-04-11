"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";

const BUILDERS = [
  { name: "Draft Construction LLC", logo: "/images/builders/draft-construction.png" },
  { name: "Poseidon Homes", logo: "/images/builders/poseidon-homes.webp" },
  { name: "Alair Homes", logo: "/images/builders/alair-homes.svg" },
  { name: "Red Key Builders", logo: "/images/builders/red-key-builders.png" },
  { name: "Heather Wood Construction", logo: "/images/builders/heather-wood.webp" },
  { name: "Stellar Development", logo: "/images/builders/stellar-development.jpg" },
  { name: "Engelke Construction Solutions", logo: "/images/builders/engelke.png" },
  { name: "Itasca Construction Associates", logo: "/images/builders/itasca.png" },
  { name: "McDowell Construction", logo: "/images/builders/mcdowell.png" },
];

function BuilderLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full flex items-center justify-center group hover:border-primary/30 transition-all duration-300">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={name}
        className="h-6 sm:h-8 w-auto max-w-[100px] sm:max-w-[120px] object-contain transition-all duration-300"
      />
    </div>
  );
}

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

      {/* Marquee — reverse direction for visual variety */}
      <div className="relative overflow-hidden mt-8 sm:mt-12">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee-reverse gap-4 sm:gap-6">
          {/* Duplicate for seamless loop */}
          {[...BUILDERS, ...BUILDERS].map((builder, i) => (
            <BuilderLogo key={`${builder.name}-${i}`} name={builder.name} logo={builder.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
