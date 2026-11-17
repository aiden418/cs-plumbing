import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import CtaBand from "@/components/ui/CtaBand";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { Calendar, Check, Phone, ShieldCheck } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { COASTAL_COMEBACK_FAQS } from "@/lib/constants";
import { SEASON_COPY, type Season } from "@/lib/claims";
import { cn } from "@/lib/utils";
import { COASTAL } from "@/content/conversion";
import { StepList } from "../contact/_parts/NextSteps";

/**
 * /coastal-comeback-plan. Server component; the season decides the hero
 * words (page.tsx revalidates daily so the copy flips without a deploy).
 * Version 2: plain white hero, the risk in three short columns, the plans as
 * three white cards with their prices, four real steps, the FAQ closed.
 */
export default function CoastalComebackPlanPage({ season = "departure" }: { season?: Season }) {
  const copy = SEASON_COPY[season];

  return (
    <>
      <PageHero
        layout="plain"
        overline={copy.overline}
        title={copy.title}
        accent={copy.accent}
        accentPosition="block"
        description={copy.description}
        actions={
          <>
            <Button href="#plans" size="lg" icon={<ShieldCheck className="size-5" />}>
              {COASTAL.hero.seePlans}
            </Button>
            <Button href={BUSINESS.phoneHref} variant="secondary" size="lg" icon={<Phone className="size-5" />}>
              {`Call ${BUSINESS.phone}`}
            </Button>
          </>
        }
      >
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem] font-medium text-body">
          {COASTAL.hero.trust.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Check aria-hidden="true" className="size-4 shrink-0 text-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* The risk */}
      <Section tone="white" spacing="sm" labelledBy="coastal-risk">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{COASTAL.risk.overline}</Eyebrow>
            <h2 id="coastal-risk" className="mt-3 text-display-md text-fg">
              {COASTAL.risk.title}
            </h2>
            <p className="mt-4 max-w-[56ch] text-lead text-body">{COASTAL.risk.subtitle}</p>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 border-t border-rule lg:mt-10 lg:grid-cols-3 lg:border-t-0">
            {COASTAL.risk.items.map((item) => (
              <li key={item.title} className="border-b border-rule py-5 lg:border-t lg:border-b-0 lg:pt-6 lg:pb-0">
                <h3 className="text-xl leading-snug font-semibold text-fg">{item.title}</h3>
                <p className="mt-2 max-w-[48ch] text-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Plans */}
      <Section tone="shell" spacing="sm" id="plans" labelledBy="coastal-plans">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{COASTAL.plans.overline}</Eyebrow>
            <h2 id="coastal-plans" className="mt-3 text-display-md text-fg">
              {COASTAL.plans.title}
            </h2>
            <p className="mt-4 max-w-[56ch] text-lead text-body">{COASTAL.plans.subtitle}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-4 lg:mt-10 lg:gap-6">
            {COASTAL.plans.tiers.map((tier) => (
              <article
                key={tier.name}
                className={cn(
                  "relative flex flex-col rounded-frame border bg-white p-6 lg:p-7",
                  tier.highlight ? "border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]" : "border-steel-200"
                )}
              >
                {tier.highlight && (
                  <p className="absolute -top-3.5 left-6 rounded-chip bg-primary px-3 py-1 text-[0.875rem] leading-snug font-semibold text-white lg:left-7">
                    {COASTAL.plans.highlightLabel}
                  </p>
                )}
                <h3 className="text-2xl leading-tight font-semibold text-fg">{tier.name}</h3>
                <p className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-display text-display-lg font-bold text-fg tabular-nums md:text-display-md">{tier.price}</span>
                  <span className="font-medium text-muted">{tier.period}</span>
                </p>
                <p className="mt-2 text-body md:min-h-[3.3em]">{tier.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2.5 border-t border-rule pt-5">
                  {tier.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 leading-snug text-body">
                      <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.href}
                  variant={tier.highlight ? "primary" : "secondary"}
                  className="mt-6 w-full"
                >
                  {tier.cta}
                </Button>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section tone="white" spacing="sm" labelledBy="coastal-steps">
        <Container>
          <Eyebrow>{COASTAL.steps.overline}</Eyebrow>
          <h2 id="coastal-steps" className="mt-3 max-w-3xl text-display-md text-fg">
            {COASTAL.steps.title}
          </h2>
          <StepList
            steps={COASTAL.steps.items.map((s) => ({ title: s.title, description: s.body }))}
            className="mt-6 lg:mt-8"
          />
        </Container>
      </Section>

      {/* Trust row */}
      <Section tone="shell" spacing="none" className="py-6 sm:py-8">
        <Container>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium text-body sm:justify-center">
            {COASTAL.trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="white" spacing="sm" labelledBy="coastal-faq">
        <Container>
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-5">
              <Eyebrow>{COASTAL.faq.overline}</Eyebrow>
              <h2 id="coastal-faq" className="mt-3 text-display-md text-fg">
                {COASTAL.faq.title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <FaqAccordion faqs={COASTAL_COMEBACK_FAQS} />
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title={COASTAL.closing.title}
        body={COASTAL.closing.body}
        secondary={{
          label: COASTAL.closing.enroll,
          href: COASTAL.closing.enrollHref,
          icon: <Calendar className="size-5" />,
        }}
      />
    </>
  );
}
