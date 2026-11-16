import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
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
              className="min-h-16 px-8 text-xl sm:min-h-[4.5rem] sm:px-10 sm:text-2xl"
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
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Clock aria-hidden="true" className="size-4 shrink-0 text-accent" />
          <span>
            {EMERGENCY.hero.responsePrefix} {EMERGENCY_CLAIMS.responseTime}
          </span>
        </p>
      </PageHero>

      {/* What to do now */}
      <Section tone="white" labelledBy="emergency-tips">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-5 lg:row-start-1">
              <h2 id="emergency-tips" className="text-display-md text-fg">
                {EMERGENCY.tipsHeading}
              </h2>
              <p className="mt-5 max-w-[44ch] text-lead text-body">{EMERGENCY.tipsLead}</p>
            </Reveal>
            <Reveal as="ol" className="border-b border-rule lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
              {EMERGENCY.tips.map((tip, i) => (
                <li key={tip} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-3 border-t border-rule py-5">
                  <span className="cv-num label-tech text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg leading-snug font-medium text-fg">{tip}</p>
                </li>
              ))}
            </Reveal>
            <div className="border-l-2 border-emergency pl-5 lg:col-span-5 lg:row-start-2 lg:self-start">
              <p className="font-semibold text-fg">{EMERGENCY.callFirst}</p>
              <Button
                href={BUSINESS.phoneHref}
                variant="emergency"
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
      <Section tone="shell" labelledBy="emergency-types">
        <Container>
          <Reveal>
            <h2 id="emergency-types" className="max-w-[20ch] text-display-md text-fg">
              {EMERGENCY.typesHeading}
            </h2>
          </Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {EMERGENCY.types.map((type, i) => (
              <Reveal as="li" key={type.title} index={i} className="-mt-px border-y border-rule py-6">
                <h3 className="text-xl leading-snug font-semibold text-fg">
                  {type.title}
                </h3>
                <p className="mt-2 max-w-[40ch] text-body">{type.description}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <NextSteps id="emergency-next" heading={EMERGENCY.nextHeading} steps={EMERGENCY.nextSteps} tone="white" />

      {/* 24/7 coverage areas */}
      <Section tone="ink" labelledBy="emergency-areas">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-4">
              <h2 id="emergency-areas" className="text-display-md text-fg">
                {EMERGENCY.areasHeading}
              </h2>
              <p className="mt-5 max-w-[40ch] text-body">{EMERGENCY.areasLead}</p>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <LinkGrid
                columns={3}
                links={emergencyCities.map((c) => ({ href: `/${c.slug}`, label: c.city }))}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="white" labelledBy="emergency-faq">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-4">
              <h2 id="emergency-faq" className="text-display-md text-fg">
                {EMERGENCY.faqHeading}
              </h2>
              <p className="mt-5 max-w-[40ch] text-body">{EMERGENCY.faqLead}</p>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <FaqAccordion faqs={EMERGENCY_FAQS} />
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
