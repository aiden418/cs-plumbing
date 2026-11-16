import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { ArrowRight, Phone } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { EMERGENCY_CLAIMS } from "@/lib/claims";
import { emergency, proof } from "@/content/home";

/**
 * The emergency band, the one navy section of the page (v2-bright.md): one
 * headline, the response-time line (EMERGENCY_CLAIMS) and one big white call
 * button, with the link to the emergency page.
 */
export default function EmergencyBand() {
  return (
    <section data-tone="navy" aria-label={emergency.ariaLabel} className="relative bg-canvas py-12 text-body lg:py-16">
      <Container>
        <div className="grid grid-cols-1 gap-y-7 lg:grid-cols-12 lg:items-center lg:gap-x-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-emergency-300 max-md:sr-only">{emergency.overline}</p>
            <h2 className="font-display md:mt-3 text-[clamp(1.75rem,1.3rem+1.9vw,2.75rem)] leading-[1.08] font-bold text-white">
              {emergency.title}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[1.0625rem] text-white/90 lg:text-lg">
              {emergency.body(EMERGENCY_CLAIMS.responseTime)}
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Button
              href={BUSINESS.phoneHref}
              variant="inverse"
              size="lg"
              icon={<Phone className="size-5 text-emergency" />}
              className="w-full text-lg tabular-nums"
            >
              {BUSINESS.phone}
            </Button>
            <p className="mt-3 text-white/90 max-md:sr-only">{emergency.callLine}</p>
            <p className="mt-1 text-sm text-white/80 max-md:sr-only">{`${emergency.licensePrefix} · ${BUSINESS.license}`}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-white/90">
              <span>{proof.emergencyLead}</span>
              <Link href={proof.emergencyLink.href} className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline underline-offset-[0.2em]">
                {proof.emergencyLink.label}
                <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
