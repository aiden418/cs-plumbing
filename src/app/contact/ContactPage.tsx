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
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-fg underline-offset-[0.2em] decoration-1 transition-colors duration-150 hover:text-link hover:underline";

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-t border-rule py-5 sm:grid-cols-[7rem_1fr] sm:gap-6 lg:grid-cols-1 lg:gap-1 xl:grid-cols-[6.5rem_1fr] xl:gap-6">
      <dt className="label-tech pt-0.5 text-accent sm:pt-3.5 lg:pt-0.5 xl:pt-3.5">{label}</dt>
      <dd className="min-w-0 text-body">{children}</dd>
    </div>
  );
}

/** /contact: the request form beside the ways to reach the office. Server component. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        layout="compact"
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

      <Section tone="shell" spacing="sm">
        <Container>
          <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8">
            <div className="min-w-0 lg:col-span-7">
              <ServiceRequestForm />
            </div>

            <div className="min-w-0 lg:col-span-4 lg:col-start-9">
              <h2 className="text-display-sm text-fg">{CONTACT.detailsHeading}</h2>
              <dl className="mt-6 border-b border-rule">
                <DetailRow label={CONTACT.phoneLabel}>
                  <a href={BUSINESS.phoneHref} className={`${linkClass} text-lg tabular-nums`}>
                    {BUSINESS.phone}
                  </a>
                  <p className="text-sm text-muted">{CONTACT.phoneNote}</p>
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
                  <p className="pt-0 font-semibold text-fg sm:pt-2.5 lg:pt-0 xl:pt-2.5">
                    {BUSINESS.address}
                    <br />
                    {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                  </p>
                  {/* Visible copy of the identity statement in JSON-LD and
                      llms.txt: stale directories still list a Cape Coral
                      address, one of them as "permanently closed". */}
                  <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-muted">{CONTACT.officeNote}</p>
                  <a
                    href={BUSINESS.googleProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} mt-1 text-[0.9375rem] text-link`}
                  >
                    {CONTACT.mapAction}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </DetailRow>
                <DetailRow label={CONTACT.hoursLabel}>
                  <p className="pt-0 sm:pt-2.5 lg:pt-0 xl:pt-2.5">
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
