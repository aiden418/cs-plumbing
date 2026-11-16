import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button, { buttonClasses } from "@/components/ui/Button";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight, Download } from "@/components/ui/icons";
import LinkBlock from "@/components/links/LinkBlock";
import { LinkGrid } from "@/components/links/LinkGrid";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import {
  BidSplit,
  BuilderDesk,
  BuilderProofStory,
  ConstructionPhases,
  PrequalDocs,
  Qualifications,
  SchedulingPanel,
  SwflExpertise,
} from "@/components/builders/BuilderSections";
import { BUILDERS_HUB as COPY } from "@/content/builders";
import { BUILDER_STATS, BUILDER_GALLERY, BUILDER_CASE_STUDIES } from "@/lib/builders-data";
import { BUILDER_PROOF, CAPABILITY_STATEMENT_PDF, NEW_CONSTRUCTION_CITIES } from "@/lib/builder-program";
import { image, picture } from "@/lib/media";
import BuilderGallery, { type BuilderGalleryItem } from "./BuilderGallery";
import BuilderLogoWall from "./BuilderLogoWall";
import { BUILDER_FAQS } from "./builder-faqs";

/** The builders hub (/builders). Server component; the gallery filter is the only client island. */
export default function BuildersPage() {
  const galleryItems: BuilderGalleryItem[] = [];
  for (const item of BUILDER_GALLERY) {
    const media = image(item.src, { alt: item.alt });
    if (!media) continue;
    galleryItems.push({
      id: item.id,
      media,
      category: item.category,
      categoryLabel: COPY.gallery.categories.find((c) => c.id === item.category)?.label ?? item.category,
      caption: item.caption,
    });
  }
  const caseStudies = BUILDER_CASE_STUDIES.filter((study) => !study.placeholder);

  return (
    <>
      <PageHero
        layout="cinema"
        frame={picture("builders.hero")}
        overline={COPY.hero.overline}
        title={BUILDER_PROOF.headline.replace(/ since \d{4}$/, "")}
        accent={COPY.hero.accent}
        description={`${COPY.hero.leadPrefix} ${BUILDER_PROOF.subline}`}
        actions={
          <>
            <Button href="#bid" size="lg" iconRight={<ArrowRight className="size-5" />}>
              {COPY.hero.bidAction}
            </Button>
            {/* Plain <a>: a PDF isn't a route, so next/link would try a client navigation first. */}
            <a href={CAPABILITY_STATEMENT_PDF} download className={buttonClasses({ variant: "secondary", size: "lg" })}>
              <Download className="size-5" aria-hidden="true" />
              <span>{COPY.hero.capabilityAction}</span>
            </a>
          </>
        }
      />

      {/* The proof points, still on ink: numerals and plan-drawing captions. */}
      <Section as="div" tone="ink" spacing="none" className="pb-section-sm">
        <Container>
          <ul className="grid grid-cols-1 border-y border-rule sm:grid-cols-3">
            {BUILDER_STATS.map((stat, i) => (
              <li
                key={stat.label}
                className={
                  i > 0 ? "border-t border-rule py-7 sm:border-t-0 sm:border-l sm:py-9 sm:pl-8" : "py-7 sm:py-9 sm:pr-8"
                }
              >
                <p className="font-display text-display-md font-bold text-fg tabular-nums [font-stretch:108%]">
                  {stat.value.toLocaleString("en-US")}
                  {stat.suffix}
                </p>
                <p className="label-tech mt-3 text-muted">{stat.label}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <ConstructionPhases tone="white" />
      <SwflExpertise tone="shell" />

      <Section tone="white" labelledBy="builder-logos-heading">
        <Container>
          <SectionHeading
            id="builder-logos-heading"
            overline={COPY.logoWall.overline}
            title={COPY.logoWall.title}
            subtitle={COPY.logoWall.subtitle}
            align="left"
          />
          <Reveal>
            <BuilderLogoWall showNames />
          </Reveal>
        </Container>
      </Section>

      <BuilderProofStory tone="shell" />
      <Qualifications tone="navy" />
      <PrequalDocs tone="white" />
      <BuilderDesk tone="shell" />
      <SchedulingPanel tone="white" />
      <NewConstructionBenefits tone="white" overline="What your buyers get" />

      <Section tone="shell" labelledBy="builder-gallery-heading">
        <Container>
          <SectionHeading
            id="builder-gallery-heading"
            overline={COPY.gallery.overline}
            title={COPY.gallery.title}
            subtitle={COPY.gallery.subtitle}
            align="left"
          />
          <BuilderGallery
            items={galleryItems}
            categories={COPY.gallery.categories.map(({ id, label }) => ({ id, label }))}
            filterLabel={COPY.gallery.filterLabel}
            empty={COPY.gallery.empty}
          />
          <div className="mt-12">
            <Button href="/projects" variant="secondary" iconRight={<ArrowRight className="size-5" />}>
              {COPY.gallery.allProjects}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Case studies — entries flagged placeholder: true are unverified and must not render */}
      {caseStudies.length > 0 && (
        <Section tone="white" labelledBy="builder-results-heading">
          <Container>
            <SectionHeading
              id="builder-results-heading"
              overline={COPY.caseStudies.overline}
              title={COPY.caseStudies.title}
              subtitle={COPY.caseStudies.subtitle}
              align="left"
            />
            <ul className="border-b border-rule">
              {caseStudies.map((study) => (
                <li key={study.id} className="grid gap-y-5 border-t border-rule py-8 lg:grid-cols-12 lg:gap-x-8">
                  <h3 className="text-xl leading-snug font-semibold text-fg lg:col-span-4">{study.title}</h3>
                  <dl className="grid gap-y-4 sm:grid-cols-3 sm:gap-x-8 lg:col-span-8">
                    {(
                      [
                        [COPY.caseStudies.challenge, study.challenge],
                        [COPY.caseStudies.action, study.action],
                        [COPY.caseStudies.outcome, study.outcome],
                      ] as const
                    ).map(([term, body]) => (
                      <div key={term}>
                        <dt className="label-tech text-accent">{term}</dt>
                        <dd className="mt-2 text-[0.9375rem] text-body">{body}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <BidSplit source="builders-hub" tone="white" />

      <Section tone="shell" labelledBy="builder-faq-heading">
        <Container>
          <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <SectionHeading
              id="builder-faq-heading"
              overline={COPY.faq.overline}
              title={COPY.faq.title}
              align="left"
              className="mb-0 lg:col-span-4"
            />
            <FaqAccordion faqs={BUILDER_FAQS} className="lg:col-span-8" />
          </div>
        </Container>
      </Section>

      <LinkBlock
        overline={COPY.cities.overline}
        heading={COPY.cities.title}
        description={COPY.cities.subtitle}
        tone="white"
        headingId="builder-cities-heading"
      >
        <LinkGrid
          links={NEW_CONSTRUCTION_CITIES.map((c) => ({
            href: `/new-construction-plumbing/${c.slug}`,
            label: c.city,
            meta: `${c.county} County`,
          }))}
          columns={4}
        />
        <div className="mt-8">
          <Button href="/builder-portal" variant="ghost">
            {COPY.cities.portal}
          </Button>
        </div>
      </LinkBlock>
    </>
  );
}
