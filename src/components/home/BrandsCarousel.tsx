"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";

const BRANDS = [
  { name: "Moen", logo: "/images/brands/moen.png" },
  { name: "Delta", logo: "/images/brands/delta.svg" },
  { name: "Kohler", logo: "/images/brands/kohler.png" },
  { name: "A.O. Smith", logo: "/images/brands/ao-smith.svg" },
  { name: "Rinnai", logo: "/images/brands/rinnai.svg" },
  { name: "Uponor", logo: "/images/brands/uponor.png" },
  { name: "Navien", logo: "/images/brands/navien.png" },
  { name: "InSinkErator", logo: "/images/brands/insinkerator.png" },
];

function BrandLogo({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full flex items-center justify-center group hover:border-primary/30 card-lift card-lift-hover-subtle">
      <div className="relative h-6 sm:h-8 w-[100px] sm:w-[120px]">
        <Image
          src={logo}
          alt={`${name} logo`}
          fill
          sizes="120px"
          className="object-contain transition-all duration-300"
          loading="lazy"
        />
      </div>
    </div>
  );
}

// Per-pill wrapper class — dims when the marquee parent is hovered,
// brightens + scales on individual hover. The bang on `!opacity-100`
// overrides the group-hover dim for the actually-hovered item.
const PILL_INTERACT =
  "transition-all duration-400 ease-[var(--ease-out-expo)] group-hover/marquee:opacity-50 hover:!opacity-100 hover:scale-[1.06]";

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

      {/* Marquee — hovering the strip pauses the animation; the hovered
          pill stays bright while siblings dim to 50% (spotlight effect). */}
      <div className="relative overflow-hidden mt-8 sm:mt-12 group/marquee marquee-pausable">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F5F5F7] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F5F5F7] to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          <ul className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6">
            {BRANDS.map((brand) => (
              <li key={brand.name} className={PILL_INTERACT}>
                <BrandLogo name={brand.name} logo={brand.logo} />
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
            {BRANDS.map((brand) => (
              <li key={`dup-${brand.name}`} className={PILL_INTERACT}>
                <BrandLogo name={brand.name} logo={brand.logo} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
