import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { ArrowUpRight, Phone } from "@/components/ui/icons";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import { BUSINESS } from "@/lib/business";
import { CONTACT } from "@/content/conversion";
import NextSteps from "./_parts/NextSteps";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-[0.2em] decoration-1 hover:underline";

/** One way to reach the office: a short label over (phones) or beside (wider) its value. */
function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-0.5 border-t border-rule py-4 sm:grid-cols-[6rem_1fr] sm:gap-5">
      <dt className="text-[0.9375rem] font-semibold text-muted sm:pt-2.5">{label}</dt>
      <dd className="min-w-0 text-body">{children}</dd>
    </div>
  );
}

/**
 * /contact: the request form on a white card beside the ways to reach the
 * office. Server component.
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        layout="plain"
        size="sm"
        overline={CONTACT.hero.overline}
        title={CONTACT.hero.title}
        accent={CONTACT.hero.accent}
        description={CONTACT.hero.description}
        actions={
          <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
            {`Call ${BUSINESS.phone}`}
          </Button>
        }
      />

      <Section tone="shell" spacing="none" className="py-8 sm:py-12 lg:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
            <div className="min-w-0 lg:col-span-7">
              <ServiceRequestForm />
            </div>

            <div className="min-w-0 lg:col-span-5">
              <h2 className="text-display-sm text-fg">{CONTACT.detailsHeading}</h2>
              <dl className="mt-5 border-b border-rule">
                <DetailRow label={CONTACT.phoneLabel}>
                  <a href={BUSINESS.phoneHref} className={`${linkClass} text-xl tabular-nums`}>
                    {BUSINESS.phone}
                  </a>
                  <p className="text-body">{CONTACT.phoneNote}</p>
                </DetailRow>
                <DetailRow label={CONTACT.textLabel}>
                  <a href={BUSINESS.smsHref} className={linkClass}>
                    {CONTACT.textAction}
                  </a>
                </DetailRow>
                <DetailRow label={CONTACT.emailLabel}>
                  <a href={`mailto:${BUSINESS.email}`} className={`${linkClass} break-all`}>
                    {BUSINESS.email}
                  </a>
                </DetailRow>
                <DetailRow label={CONTACT.officeLabel}>
                  <p className="font-semibold text-fg sm:pt-2">
                    {BUSINESS.address}
                    <br />
                    {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                  </p>
                  {/* Visible copy of the identity statement in JSON-LD and
                      llms.txt: stale directories still list a Cape Coral
                      address, one of them as "permanently closed". */}
                  <p className="mt-2 max-w-[44ch] text-body">{CONTACT.officeNote}</p>
                  <a
                    href={BUSINESS.googleProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} mt-1`}
                  >
                    {CONTACT.mapAction}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </DetailRow>
                <DetailRow label={CONTACT.hoursLabel}>
                  <p className="sm:pt-2">
                    <span className="font-semibold text-fg">{BUSINESS.hours.open}</span>
                    <br />
                    <span>{BUSINESS.hours.emergency}</span>
                  </p>
                </DetailRow>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      <NextSteps id="contact-next" heading={CONTACT.nextHeading} steps={CONTACT.nextSteps} tone="white" />
    </>
  );
}
