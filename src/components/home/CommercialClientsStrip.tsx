"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { COMMERCIAL_CLIENTS } from "@/lib/commercial-clients-data";
import type { CommercialClient } from "@/lib/types";

const PILL =
  "flex-shrink-0 px-5 sm:px-6 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-full flex items-center justify-center group hover:border-primary/30 card-lift card-lift-hover-subtle";

function ClientPill({ client }: { client: CommercialClient }) {
  if (client.logo && client.logoWidth && client.logoHeight) {
    return (
      <div className={PILL}>
        <BuilderLogoImage
          builder={{
            name: client.name,
            logo: client.logo,
            logoWidth: client.logoWidth,
            logoHeight: client.logoHeight,
          }}
          sizes="(max-width: 640px) 100px, 120px"
          // Same reasoning as BuilderShowcase: the marquee carries pills
          // outside the clipping ancestor where lazy loading never fires.
          loading="eager"
          className="h-6 sm:h-8 w-auto max-w-[100px] sm:max-w-[120px] object-contain transition-all duration-300"
        />
      </div>
    );
  }

  // Wordmark fallback — same pill height as a logo so the strip stays level
  // when logos and names mix.
  return (
    <div className={PILL}>
      <span className="flex items-center h-6 sm:h-8 font-display font-bold text-sm sm:text-base tracking-tight text-gray-900 whitespace-nowrap">
        {client.name}
      </span>
    </div>
  );
}

const PILL_INTERACT =
  "transition-all duration-400 ease-[var(--ease-out-expo)] group-hover/marquee:opacity-50 hover:!opacity-100 hover:scale-[1.06]";

// Each half of the marquee must be at least a viewport wide or the loop shows
// a gap on large screens. A short client list gets repeated to cover it; the
// animation still translates exactly one half, so the loop stays seamless.
const MIN_PILLS_PER_HALF = 8;
const REPEAT = Math.max(1, Math.ceil(MIN_PILLS_PER_HALF / COMMERCIAL_CLIENTS.length));
const HALF: CommercialClient[] = Array.from({ length: REPEAT }, () => COMMERCIAL_CLIENTS).flat();

export default function CommercialClientsStrip() {
  if (COMMERCIAL_CLIENTS.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <Container>
        <ScrollReveal>
          <SectionHeading
            overline="Commercial Service"
            title="Businesses That Trust C&S"
            subtitle="Restaurants, schools, federal facilities and airport hangars across Southwest Florida count on C&S for commercial plumbing service, repairs and build-outs."
          />
        </ScrollReveal>
      </Container>

      {/* Marquee — reverse direction so it runs opposite the brands strip
          directly below it. Pause + spotlight on hover, same as the others. */}
      <div className="relative overflow-hidden mt-8 sm:mt-12 group/marquee marquee-pausable">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee-reverse">
          <ul className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6">
            {HALF.map((client, i) => (
              <li key={`${client.name}-${i}`} className={PILL_INTERACT}>
                <ClientPill client={client} />
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6" aria-hidden="true">
            {HALF.map((client, i) => (
              <li key={`dup-${client.name}-${i}`} className={PILL_INTERACT}>
                <ClientPill client={client} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Container>
        <ScrollReveal>
          <p className="mt-8 sm:mt-10 text-center">
            <Link
              href="/services/commercial"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              See our documented commercial work
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
