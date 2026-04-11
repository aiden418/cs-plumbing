"use client";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";

const BRANDS = [
  { name: "Rheem", logo: "/images/brands/rheem.svg" },
  { name: "Moen", logo: "/images/brands/moen.png" },
  { name: "Delta", logo: "/images/brands/delta.svg" },
  { name: "Kohler", logo: "/images/brands/kohler.png" },
  { name: "A.O. Smith", logo: "/images/brands/ao-smith.svg" },
  { name: "Rinnai", logo: "/images/brands/rinnai.svg" },
  { name: "Bradford White", logo: "/images/brands/bradford-white.svg" },
  { name: "SharkBite", logo: "/images/brands/sharkbite.svg" },
  { name: "Uponor", logo: "/images/brands/uponor.png" },
  { name: "Charlotte Pipe", logo: "/images/brands/charlotte-pipe.svg" },
  { name: "Navien", logo: "/images/brands/navien.png" },
  { name: "InSinkErator", logo: "/images/brands/insinkerator.png" },
];

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full flex items-center justify-center group hover:border-primary/30 transition-all duration-300">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={name}
        className="h-6 sm:h-8 w-auto max-w-[100px] sm:max-w-[120px] object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
      />
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
            <BrandLogo key={`${brand.name}-${i}`} name={brand.name} logo={brand.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
