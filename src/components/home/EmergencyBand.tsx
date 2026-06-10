import { Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import { BUSINESS } from "@/lib/constants";
import RadarPulse from "./RadarPulse";

/**
 * Conversion climax of the homepage scroll story: the pipeline "bursts"
 * into a gold radar pulse around the 24/7 number. Server-rendered copy;
 * only the decorative pulse is a client component.
 */
export default function EmergencyBand() {
  return (
    <section
      className="relative overflow-hidden bg-navy section-py min-h-[480px]"
      aria-label="24/7 emergency plumbing"
    >
      {/* Subtle radial depth so the navy doesn't read flat */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(232,164,39,0.08) 0%, rgba(27,43,75,0) 70%)",
        }}
      />

      <Container className="relative z-10 text-center">
        <p className="text-gold font-bold text-sm sm:text-base uppercase tracking-[0.25em] mb-4">
          24/7 Emergency Response
        </p>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto">
          Burst pipe at 2 AM? We&apos;re already rolling.
        </h2>
        <p className="mt-5 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
          Average 60-minute response across Lee County. Upfront pricing
          before any work begins — nights, weekends, and holidays included.
        </p>

        <div className="relative mt-10 sm:mt-12 inline-flex flex-col items-center">
          <RadarPulse />
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="relative z-10 inline-flex items-center gap-3 sm:gap-4 text-3xl sm:text-5xl lg:text-6xl font-black text-gold hover:text-white transition-colors duration-300 tabular-nums tracking-tight"
          >
            <Phone className="w-7 h-7 sm:w-10 sm:h-10 shrink-0" />
            {BUSINESS.phone}
          </a>
          <p className="relative z-10 mt-3 text-white/50 text-sm">
            One call. A licensed plumber on the way.
          </p>
        </div>

        <p className="mt-10 text-white/40 text-xs tracking-wide">
          Florida Certified Plumbing Contractor · CFC1432485
        </p>
      </Container>
    </section>
  );
}
