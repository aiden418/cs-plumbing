import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import CtaBand from "@/components/ui/CtaBand";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import Stepper from "@/components/ui/Stepper";
import { Calendar, Check, Phone, ShieldCheck } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { COASTAL_COMEBACK_FAQS } from "@/lib/constants";
import { SEASON_COPY, type Season } from "@/lib/claims";
import { cn } from "@/lib/utils";
import { COASTAL } from "@/content/conversion";

/**
 * /coastal-comeback-plan. Server component; the season decides the hero
 * words (page.tsx revalidates daily so the copy flips without a deploy).
 */
export default function CoastalComebackPlanPage({ season = "departure" }: { season?: Season }) {
  const copy = SEASON_COPY[season];

  return (
    <>
      <PageHero
        layout="type-led"
        overline={copy.overline}
        title={copy.title}
        accent={copy.accent}
        accentPosition="block"
        description={copy.description}
        actions={
          <>
            <Button href="#plans" variant="brass" size="lg" icon={<ShieldCheck className="size-5" />}>
              {COASTAL.hero.seePlans}
            </Button>
            <Button href={BUSINESS.phoneHref} variant="secondary" size="lg" icon={<Phone className="size-5" />}>
              {`Call ${BUSINESS.phone}`}
            </Button>
          </>
        }
      >
        <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
          {COASTAL.hero.trust.map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-px w-4 bg-rule" />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </PageHero>

      {/* The risk */}
      <Section tone="white" labelledBy="coastal-risk">
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>{COASTAL.risk.overline}</Eyebrow>
            <h2 id="coastal-risk" className="mt-5 text-display-md text-fg">
              {COASTAL.risk.title}
            </h2>
            <p className="mt-5 max-w-[56ch] text-lead text-body">{COASTAL.risk.subtitle}</p>
          </Reveal>
          <ol className="mt-12 grid grid-cols-1 gap-x-8 lg:mt-16 lg:grid-cols-3">
            {COASTAL.risk.items.map((item, i) => (
              <Reveal as="li" key={item.title} index={i} className="-mt-px border-y border-rule py-7 lg:py-8">
                <p className="cv-num label-tech text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-xl leading-snug font-semibold text-fg">{item.title}</h3>
                <p className="mt-3 max-w-[48ch] text-body">{item.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Plans */}
      <Section tone="shell" id="plans" labelledBy="coastal-plans">
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>{COASTAL.plans.overline}</Eyebrow>
            <h2 id="coastal-plans" className="mt-5 text-display-md text-fg">
              {COASTAL.plans.title}
            </h2>
            <p className="mt-5 max-w-[56ch] text-lead text-body">{COASTAL.plans.subtitle}</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 border-t border-rule md:grid-cols-3 lg:mt-16">
            {COASTAL.plans.tiers.map((tier, i) => (
              <Reveal
                as="article"
                key={tier.name}
                index={i}
                className={cn(
                  "relative flex flex-col border-b border-rule py-8 md:border-b-0 md:px-6 md:py-10 lg:px-8",
                  i > 0 && "md:border-l",
                  i === 0 && "md:pl-0",
                  i === COASTAL.plans.tiers.length - 1 && "md:pr-0",
                  tier.highlight && "md:bg-raised md:pl-6 md:pr-6 lg:pl-8 lg:pr-8"
                )}
              >
                {tier.highlight && (
                  <span aria-hidden="true" className="absolute inset-x-0 -top-px hidden h-0.5 bg-primary md:block" />
                )}
                <div className="flex min-h-7 items-center">
                  {tier.highlight ? (
                    <p className="label-tech flex items-center gap-2 text-link">
                      <span className="joint" aria-hidden="true" />
                      {COASTAL.plans.highlightLabel}
                    </p>
                  ) : null}
                </div>
                <h3 className="mt-3 text-2xl leading-tight font-semibold text-fg">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-display-sm font-bold text-fg tabular-nums">{tier.price}</span>
                  <span className="text-sm font-medium text-muted">{tier.period}</span>
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-body md:min-h-[3.25rem]">{tier.tagline}</p>
                <ul className="mt-6 flex-1 border-t border-rule">
                  {tier.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b border-rule py-3 text-[0.9375rem] leading-snug text-body">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.href}
                  variant={tier.highlight ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {tier.cta}
                </Button>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section tone="white" labelledBy="coastal-steps">
        <Container>
          <Reveal className="max-w-3xl">
            <Eyebrow>{COASTAL.steps.overline}</Eyebrow>
            <h2 id="coastal-steps" className="mt-5 text-display-md text-fg">
              {COASTAL.steps.title}
            </h2>
          </Reveal>
          <Reveal className="mt-12 lg:mt-16">
            <Stepper
              label={COASTAL.steps.overline}
              items={COASTAL.steps.items.map((s) => ({
                label: s.title,
                description: s.body,
              }))}
              className="[&_li]:min-w-[15rem] lg:[&_li]:min-w-0"
            />
          </Reveal>
        </Container>
      </Section>

      {/* Trust row */}
      <Section tone="shell" spacing="none" className="py-8 sm:py-10">
        <Container>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-3 text-sm font-medium text-body sm:justify-center">
            {COASTAL.trustItems.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="joint text-accent" />}
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="white" labelledBy="coastal-faq">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-4">
              <Eyebrow>{COASTAL.faq.overline}</Eyebrow>
              <h2 id="coastal-faq" className="mt-5 text-display-md text-fg">
                {COASTAL.faq.title}
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <FaqAccordion faqs={COASTAL_COMEBACK_FAQS} />
            </Reveal>
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
