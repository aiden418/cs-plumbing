"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";

const BRANDS = [
  "Rheem",
  "Moen",
  "Delta",
  "Kohler",
  "A.O. Smith",
  "Rinnai",
  "Bradford White",
  "SharkBite",
  "Uponor",
  "Charlotte Pipe",
  "Navien",
  "InSinkErator",
];

function BrandPill({ name }: { name: string }) {
  return (
    <div className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full text-sm sm:text-base font-semibold text-gray-700 hover:text-primary hover:border-primary/30 transition-colors duration-300 whitespace-nowrap">
      {name}
    </div>
  );
}

export default function BrandsCarousel() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
      <Container>
        <ScrollReveal>
          <SectionHeading
            overline="Our Brands"
            title="Trusted Brands We Install"
            subtitle="We work with the industry's best manufacturers to deliver quality, durability, and performance on every job."
          />
        </ScrollReveal>
      </Container>

      {/* Marquee */}
      <div className="relative overflow-hidden mt-8 sm:mt-12">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F5F5F7] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F5F5F7] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-4 sm:gap-6">
          {/* Duplicate for seamless loop */}
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <BrandPill key={`${brand}-${i}`} name={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
