import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { Clock, MessageSquareText, Phone } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import { BUSINESS } from "@/lib/business";
import { EMERGENCY_CLAIMS } from "@/lib/claims";
import { EMERGENCY } from "@/content/conversion";
import NextSteps from "../contact/_parts/NextSteps";
import { EMERGENCY_FAQS } from "./emergency-faqs";

/**
 * /emergency. A server component: the H1, the call and text buttons and the
 * response line are in the server HTML from the first paint, never faded in.
 * Version 2: a plain white hero with a very large red call button, then short
 * light sections (white and shell in turn).
 */
export default function EmergencyPage({
  emergencyCities,
}: {
  emergencyCities: { slug: string; city: string; state: string }[];
}) {
  return (
    <>
      <PageHero
        layout="urgent"
        accentTone="emergency"
        overline={EMERGENCY.hero.overline}
        title={EMERGENCY.hero.title}
        accent={EMERGENCY.hero.accent}
        description={EMERGENCY.hero.description}
        actions={
          <>
            <Button
              href={BUSINESS.phoneHref}
              variant="emergency"
              size="lg"
              icon={<Phone className="size-6" />}
              className="min-h-16 px-5 text-xl whitespace-nowrap tabular-nums sm:min-h-[4.5rem] sm:px-10 sm:text-2xl"
            >
              {`Call ${BUSINESS.phone}`}
            </Button>
            <Button
              href={BUSINESS.smsHref}
              variant="secondary"
              size="lg"
              icon={<MessageSquareText className="size-5" />}
              className="sm:min-h-[4.5rem]"
            >
              {EMERGENCY.hero.text}
            </Button>
          </>
        }
      >
        <p className="mt-5 flex items-start gap-2.5 text-body">
          <Clock aria-hidden="true" className="mt-1 size-5 shrink-0 text-emergency" />
          <span>
            {EMERGENCY_CLAIMS.arrival}
          </span>
        </p>
      </PageHero>

      {/* What to do now */}
      <Section tone="shell" spacing="sm" labelledBy="emergency-tips">
        <Container>
          {/* Phones: heading, the steps, the reminder. Desktop: heading and
              reminder on the left, the steps on the right. */}
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10">
            <div className="lg:col-span-5 lg:row-start-1">
              <h2 id="emergency-tips" className="text-display-md text-fg">
                {EMERGENCY.tipsHeading}
              </h2>
              <p className="mt-4 max-w-[44ch] text-lead text-body">{EMERGENCY.tipsLead}</p>
            </div>
            <ol className="border-b border-rule lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
              {EMERGENCY.tips.map((tip) => (
                <li key={tip} className="border-t border-rule py-4 text-lg leading-snug font-medium text-fg">
                  {tip}
                </li>
              ))}
            </ol>
            <div className="rounded-frame border border-rule bg-white p-5 sm:p-6 lg:col-span-5 lg:row-start-2 lg:self-start">
              <p className="font-semibold text-fg">{EMERGENCY.callFirst}</p>
              <Button
                href={BUSINESS.phoneHref}
                variant="emergency"
                size="lg"
                icon={<Phone className="size-5" />}
                className="mt-4 w-full tabular-nums sm:w-auto"
              >
                {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* What we handle */}
      <Section tone="white" spacing="sm" labelledBy="emergency-types">
        <Container>
          <h2 id="emergency-types" className="max-w-[20ch] text-display-md text-fg">
            {EMERGENCY.typesHeading}
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-x-10 border-t border-rule md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {EMERGENCY.types.map((type) => (
              <li key={type.title} className="border-b border-rule py-5">
                <h3 className="text-xl leading-snug font-semibold text-fg">{type.title}</h3>
                <p className="mt-1.5 max-w-[40ch] text-body">{type.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <NextSteps id="emergency-next" heading={EMERGENCY.nextHeading} steps={EMERGENCY.nextSteps} tone="shell" />

      {/* 24/7 coverage areas */}
      <Section tone="white" spacing="sm" labelledBy="emergency-areas">
        <Container>
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <h2 id="emergency-areas" className="text-display-md text-fg">
                {EMERGENCY.areasHeading}
              </h2>
              <p className="mt-4 max-w-[40ch] text-body">{EMERGENCY.areasLead}</p>
            </div>
            <div className="lg:col-span-8">
              <LinkGrid
                columns={3}
                className="grid-cols-2 gap-x-6"
                links={emergencyCities.map((c) => ({ href: `/${c.slug}`, label: c.city }))}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="shell" spacing="sm" labelledBy="emergency-faq">
        <Container>
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <h2 id="emergency-faq" className="text-display-md text-fg">
                {EMERGENCY.faqHeading}
              </h2>
              <p className="mt-4 max-w-[40ch] text-body">{EMERGENCY.faqLead}</p>
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion faqs={EMERGENCY_FAQS} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
