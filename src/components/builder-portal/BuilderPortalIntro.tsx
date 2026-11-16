import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Stepper from "@/components/ui/Stepper";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { ArrowRight, Phone } from "@/components/ui/icons";
import BuilderLogoWall from "@/app/builders/BuilderLogoWall";
import { BUILDER_PORTAL as COPY } from "@/content/builders";
import { BUSINESS } from "@/lib/business";

/**
 * Everything above the plan-upload wizard on /builder-portal. Rendered by the
 * client wizard page, so it reads no picture registry: the compact hero is
 * type only and the builder logos come through next/image.
 */
export default function BuilderPortalIntro() {
  const hero = COPY.hero;
  return (
    <>
      <PageHero
        layout="compact"
        overline={hero.overline}
        title={hero.title}
        accent={hero.accent}
        description={
          <>
            <p>
              {hero.leadStart}
              <strong className="font-semibold text-fg">{hero.leadStrong}</strong>
              {hero.leadEnd}
            </p>
            <p className="mt-3">{hero.lead2}</p>
          </>
        }
        actions={
          <>
            <Button href="#upload-plans" size="lg" iconRight={<ArrowRight className="size-5" />}>
              {hero.submitPlans}
            </Button>
            <Button href={BUSINESS.phoneHref} variant="secondary" size="lg" icon={<Phone className="size-5" />}>
              Call {BUSINESS.phone}
            </Button>
          </>
        }
      >
        <div className="mt-8 flex flex-col gap-y-1 border-t border-rule pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <Link
            href="/builders"
            className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-[0.2em] hover:underline"
          >
            {hero.builderStory}
            <ArrowRight className="size-4 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
          </Link>
          <p className="label-tech text-muted">{hero.licenseLine}</p>
        </div>
      </PageHero>

      {/* Why C&S */}
      <Section tone="white" labelledBy="portal-why-heading">
        <Container>
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <SectionHeading
              id="portal-why-heading"
              overline={COPY.why.overline}
              title={COPY.why.title}
              subtitle={COPY.why.subtitle}
              align="left"
              className="mb-0 lg:col-span-5"
            />
            <ul className="grid border-b border-rule sm:grid-cols-2 sm:gap-x-10 lg:col-span-7">
              {COPY.why.items.map((item, i) => (
                <Reveal
                  as="li"
                  index={i}
                  key={item.title}
                  className="border-t border-rule py-7"
                >
                  <div>
                    <h3 className="text-lg leading-snug font-semibold text-fg">{item.title}</h3>
                    <p className="mt-2 text-[0.9375rem] text-body">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section tone="shell" labelledBy="portal-process-heading">
        <Container>
          <SectionHeading
            id="portal-process-heading"
            overline={COPY.process.overline}
            title={COPY.process.title}
            subtitle={COPY.process.subtitle}
            align="left"
          />
          <Stepper
            label={COPY.process.title}
            className="[&_li]:min-w-[15rem] lg:[&_li]:min-w-0"
            items={COPY.process.steps.map((step) => ({ label: step.title, description: step.description }))}
          />
        </Container>
      </Section>

      {/* Builders we work with */}
      <Section tone="white" labelledBy="portal-logos-heading">
        <Container>
          <SectionHeading
            id="portal-logos-heading"
            overline={COPY.logos.overline}
            title={COPY.logos.title}
            subtitle={COPY.logos.subtitle}
            align="left"
          />
          <Reveal>
            <BuilderLogoWall altSuffix={COPY.logos.altSuffix} />
          </Reveal>
        </Container>
      </Section>

      {/* What we need from you */}
      <Section tone="shell" labelledBy="portal-need-heading">
        <Container>
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              <SectionHeading
                id="portal-need-heading"
                overline={COPY.need.overline}
                title={COPY.need.title}
                align="left"
                className="mb-0"
              />
              <div className="mt-8 hidden lg:block">
                <Button href="#upload-plans" size="lg" iconRight={<ArrowRight className="size-5" />}>
                  {COPY.need.submitPlans}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ul className="border-b border-rule">
                {COPY.need.items.map((item) => (
                  <li key={item} className="flex gap-3 border-t border-rule py-5 text-lg text-fg">
                    <span className="joint mt-[0.6em] text-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 lg:hidden">
                <Button href="#upload-plans" size="lg" fullWidth iconRight={<ArrowRight className="size-5" />}>
                  {COPY.need.submitPlans}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
