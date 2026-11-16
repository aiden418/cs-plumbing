import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import { Phone } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { EMERGENCY_CLAIMS } from "@/lib/claims";
import { emergency } from "@/content/home";

/**
 * Chapter 2: the emergency band, an ink strip between the services and the
 * Coastal Comeback row. The words and the response time are the band's
 * existing wording (EMERGENCY_CLAIMS); the call is the emergency button.
 */
export default function EmergencyBand() {
  return (
    <section data-tone="ink" aria-label={emergency.ariaLabel} className="relative bg-canvas py-section-sm text-body">
      <Container>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-4">{emergency.overline}</Eyebrow>
            <h2 className="text-display-md text-fg">{emergency.title}</h2>
            <p className="mt-5 max-w-[56ch] text-lead text-body">
              {emergency.body(EMERGENCY_CLAIMS.responseTime)}
            </p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Button
              href={BUSINESS.phoneHref}
              variant="emergency"
              size="lg"
              icon={<Phone className="size-5" />}
              className="w-full tabular-nums sm:w-auto lg:w-full"
            >
              {BUSINESS.phone}
            </Button>
            <p className="mt-3 text-body">{emergency.callLine}</p>
            <p className="mt-1 text-sm text-muted">{`${emergency.licensePrefix} · ${BUSINESS.license}`}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
