import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button, { buttonClasses } from "@/components/ui/Button";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { ArrowRight, Download, Phone } from "@/components/ui/icons";
import LinkBlock from "@/components/links/LinkBlock";
import { LinkGrid } from "@/components/links/LinkGrid";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import {
  BidSplit,
  BuilderDesk,
  DocumentRow,
  BuilderProofStory,
  ConstructionPhases,
  PrequalDocs,
  Qualifications,
  SchedulingPanel,
  SwflExpertise,
} from "@/components/builders/BuilderSections";
import { BUILDERS_HUB as COPY } from "@/content/builders";
import { BUILDER_STATS, BUILDER_GALLERY, BUILDER_CASE_STUDIES } from "@/lib/builders-data";
import {
  BUILDER_DESK,
  BUILDER_PROOF,
  CAPABILITY_STATEMENT_PDF,
  NEW_CONSTRUCTION_CITIES,
  PREQUAL_PACKET_PDF,
} from "@/lib/builder-program";
import { CLAIMS } from "@/lib/claims";
import { COMPLETED_PROJECTS } from "@/lib/projects-data";
import ProjectCard from "@/components/explorer/ProjectCard";
import Eyebrow from "@/components/ui/Eyebrow";
import { image, picture } from "@/lib/media";
import BuilderGallery, { type BuilderGalleryItem } from "./BuilderGallery";
import BuilderLogoWall from "./BuilderLogoWall";
import { BUILDER_FAQS } from "./builder-faqs";

/**
 * The builders hub (/builders), version 2: the job-site photograph behind the
 * headline, then short light sections alternating white and shell. Server
 * component; the gallery filter is the only client island.
 */
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
  const startProject = COMPLETED_PROJECTS.find((project) => project.slug === COPY.start.projectSlug);

  return (
    <>
      {/* The hero keeps the first sentence of the lead; the rest
          (BUILDER_PROOF.subline) opens the first section, word for word. */}
      <PageHero
        layout="cinema"
        frame={picture("builders.hero")}
        overline={COPY.hero.overline}
        title={BUILDER_PROOF.headline.replace(/ since \d{4}$/, "")}
        accent={COPY.hero.accent}
        description={COPY.hero.leadPrefix}
        actions={
          <>
            <Button href="#bid" size="lg" iconRight={<ArrowRight className="size-5" />}>
              {COPY.hero.bidAction}
            </Button>
            <Button href={BUILDER_DESK.phoneHref} variant="onPhoto" size="lg" icon={<Phone className="size-5" />}>
              <span className="max-[359px]:sr-only">{COPY.hero.call} </span>
              <span className="whitespace-nowrap">{BUILDER_DESK.phone}</span>
            </Button>
            {/* Plain <a>: a PDF isn't a route, so next/link would try a client navigation first. */}
            <a
              href={CAPABILITY_STATEMENT_PDF}
              download
              className={buttonClasses({ variant: "ghost", size: "md", className: "self-start sm:self-auto sm:px-2" })}
            >
              <Download className="size-5" aria-hidden="true" />
              <span>{COPY.hero.capabilityAction}</span>
            </a>
          </>
        }
      />

      {/* The three things a builder comes for, beside one documented job. */}
      <Section tone="white" spacing="sm" labelledBy="builder-start-heading" className="border-b border-rule">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-12">
            <div className="min-w-0 lg:col-span-7">
              <h2 id="builder-start-heading" className="text-display-md text-fg">
                {COPY.start.heading}
              </h2>
              <p className="mt-4 max-w-[58ch] text-lead text-body">{CLAIMS.bidAcknowledgement}</p>
              <div className="mt-6">
                <Button href="#bid" size="lg" iconRight={<ArrowRight className="size-5" />} className="w-full sm:w-auto">
                  {COPY.start.bidAction}
                </Button>
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DocumentRow href={PREQUAL_PACKET_PDF} label={COPY.start.prequalPdf} />
                <DocumentRow href={CAPABILITY_STATEMENT_PDF} label={COPY.start.capabilityPdf} />
              </ul>
              <p className="mt-5 max-w-[60ch] text-body">
                <span className="font-semibold text-fg">{COPY.start.contactLabel}:</span> {BUILDER_DESK.contactName},{" "}
                {BUILDER_DESK.contactRole}.
              </p>
              <p className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                <a
                  href={BUILDER_DESK.phoneHref}
                  className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-link underline underline-offset-[0.2em]"
                >
                  {BUILDER_DESK.phone}
                </a>
                <a
                  href={`mailto:${BUILDER_DESK.email}`}
                  className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-link underline underline-offset-[0.2em]"
                >
                  {BUILDER_DESK.email}
                </a>
              </p>
            </div>
            {startProject && (
              <div className="min-w-0 lg:col-span-5">
                <Eyebrow className="mb-3">{COPY.start.projectOverline}</Eyebrow>
                <ProjectCard
                  project={startProject}
                  aspect="4/3"
                  details
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 80vw, 92vw"
                />
              </div>
            )}
          </div>
        </Container>
      </Section>

      <BuilderProofStory tone="white" spacing="sm">
        <ul className="mt-8 grid grid-cols-3 gap-x-4 border-y border-rule py-5 sm:gap-x-8">
          {BUILDER_STATS.map((stat) => (
            <li key={stat.label}>
              <p className="font-display text-display-sm font-bold text-navy tabular-nums [font-stretch:108%]">
                {stat.value.toLocaleString("en-US")}
                {stat.suffix}
              </p>
              <p className="mt-1 text-[0.9375rem] leading-snug text-body">{stat.label}</p>
            </li>
          ))}
        </ul>
      </BuilderProofStory>

      <ConstructionPhases tone="shell" />
      <SwflExpertise tone="white" spacing="sm" />

      <Section tone="shell" spacing="sm" labelledBy="builder-logos-heading">
        <Container>
          <SectionHeading
            id="builder-logos-heading"
            overline={COPY.logoWall.overline}
            title={COPY.logoWall.title}
            subtitle={COPY.logoWall.subtitle}
            align="left"
            className="mb-8"
          />
          <BuilderLogoWall showNames />
        </Container>
      </Section>

      <Qualifications tone="white" spacing="sm" />
      <PrequalDocs tone="shell" spacing="sm" />
      <BuilderDesk tone="white" spacing="sm" />
      <SchedulingPanel tone="shell" />
      <NewConstructionBenefits tone="white" overline="What your buyers get" />

      <Section tone="shell" spacing="sm" labelledBy="builder-gallery-heading">
        <Container>
          <SectionHeading
            id="builder-gallery-heading"
            overline={COPY.gallery.overline}
            title={COPY.gallery.title}
            subtitle={COPY.gallery.subtitle}
            align="left"
            className="mb-8"
          />
          <BuilderGallery
            items={galleryItems}
            categories={COPY.gallery.categories.map(({ id, label }) => ({ id, label }))}
            filterLabel={COPY.gallery.filterLabel}
            empty={COPY.gallery.empty}
          />
          <div className="mt-8">
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
                <li key={study.id} className="grid gap-y-4 border-t border-rule py-7 lg:grid-cols-12 lg:gap-x-8">
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
                        <dt className="font-semibold text-accent">{term}</dt>
                        <dd className="mt-1 text-body">{body}</dd>
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

      <Section tone="shell" spacing="sm" labelledBy="builder-faq-heading">
        <Container>
          <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-12">
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
          className="grid-cols-2 gap-x-5"
        />
        <div className="mt-6">
          <Button href="/builder-portal" variant="ghost">
            {COPY.cities.portal}
          </Button>
        </div>
      </LinkBlock>
    </>
  );
}
