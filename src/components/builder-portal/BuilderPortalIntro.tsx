import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Stepper from "@/components/ui/Stepper";
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
          <p>
            {hero.leadStart}
            <strong className="font-semibold text-fg">{hero.leadStrong}</strong>
            {hero.leadEnd}
          </p>
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
        <div className="mt-6 flex flex-col gap-y-1 border-t border-rule pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <Link
            href="/builders"
            className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-[0.2em] hover:underline"
          >
            {hero.builderStory}
            <ArrowRight className="size-4 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
          </Link>
          <p className="text-[0.9375rem] text-body">{hero.licenseLine}</p>
        </div>
      </PageHero>

      {/* Why C&S */}
      <Section tone="white" spacing="sm" labelledBy="portal-why-heading">
        <Container>
          {/* The hero's second lead paragraph, moved here word for word (version 2: short heroes). */}
          <p className="mb-8 max-w-[62ch] text-lead text-body sm:mb-10">{hero.lead2}</p>
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <SectionHeading
              id="portal-why-heading"
              overline={COPY.why.overline}
              title={COPY.why.title}
              subtitle={COPY.why.subtitle}
              align="left"
              className="mb-0 lg:col-span-5"
            />
            <ul className="grid border-b border-rule sm:grid-cols-2 sm:gap-x-10 lg:col-span-7">
              {COPY.why.items.map((item) => (
                <li key={item.title} className="border-t border-rule py-5">
                  <h3 className="text-lg leading-snug font-semibold text-fg">{item.title}</h3>
                  <p className="mt-1.5 text-body">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section tone="shell" spacing="sm" labelledBy="portal-process-heading">
        <Container>
          <SectionHeading
            id="portal-process-heading"
            overline={COPY.process.overline}
            title={COPY.process.title}
            subtitle={COPY.process.subtitle}
            align="left"
            className="mb-8"
          />
          <Stepper
            label={COPY.process.title}
            className="[&_li]:min-w-[15rem] lg:[&_li]:min-w-0"
            items={COPY.process.steps.map((step) => ({ label: step.title, description: step.description }))}
          />
        </Container>
      </Section>

      {/* Builders we work with */}
      <Section tone="white" spacing="sm" labelledBy="portal-logos-heading">
        <Container>
          <SectionHeading
            id="portal-logos-heading"
            overline={COPY.logos.overline}
            title={COPY.logos.title}
            subtitle={COPY.logos.subtitle}
            align="left"
            className="mb-8"
          />
          <BuilderLogoWall altSuffix={COPY.logos.altSuffix} />
        </Container>
      </Section>

      {/* What we need from you */}
      <Section tone="shell" spacing="sm" labelledBy="portal-need-heading">
        <Container>
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="portal-need-heading"
                overline={COPY.need.overline}
                title={COPY.need.title}
                align="left"
                className="mb-0"
              />
              <div className="mt-7 hidden lg:block">
                <Button href="#upload-plans" size="lg" iconRight={<ArrowRight className="size-5" />}>
                  {COPY.need.submitPlans}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ul className="border-b border-rule">
                {COPY.need.items.map((item) => (
                  <li key={item} className="border-t border-rule py-4 text-lg leading-snug text-fg">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 lg:hidden">
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
