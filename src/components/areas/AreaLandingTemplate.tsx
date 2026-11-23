import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { ArrowRight, Calendar, Check, MapPin, Phone } from "@/components/ui/icons";
import CityProofBlock from "@/components/areas/CityProofBlock";
import LocalJobs from "@/components/services/LocalJobs";
import { LOCAL_JOB_SECTIONS, localJobsForArea } from "@/content/local-jobs";
import MoreOnPhones, { splitLead } from "@/components/areas/MoreOnPhones";
import NeighborhoodList from "@/components/areas/NeighborhoodList";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import AreaServiceJsonLd from "@/components/seo/AreaServiceJsonLd";
import { AREA_COPY, countyLabel } from "@/content/areas";
import { BUSINESS, SERVICES, SERVICE_AREAS_BY_COUNTY, TRUST_PROOF_POINTS } from "@/lib/constants";
import { picture } from "@/lib/media";
import { cn } from "@/lib/utils";
import type { AreaLanding, ProjectCardData } from "@/lib/types";

const copy = AREA_COPY;

/**
 * An /areas/<city> page, version 2 (v2-bright.md): the city's job photo
 * behind the headline (or a plain white hero), then short light sections
 * alternating white and shell: services in the city, local context with
 * its neighborhoods, local proof, why C&S, FAQ. The service-city links and
 * the closing band follow in the page file.
 *
 * Server component: every word and link is in the HTML and nothing here
 * ships to the browser.
 */
export default function AreaLandingTemplate({
  landing,
  proofProjects,
}: {
  landing: AreaLanding;
  proofProjects: ProjectCardData[];
}) {
  const displayServices = SERVICES.filter(
    (s) => s.id !== "commercial" && s.id !== "new-construction"
  );
  const frame = picture(`area.header.${landing.slug}`);
  const county = countyLabel(landing.city, SERVICE_AREAS_BY_COUNTY);
  const trustPoints = [...TRUST_PROOF_POINTS, copy.trust.localPoint(landing.city)];
  const paragraphs = landing.localContext.split("\n\n");
  const hasNeighborhoods = Boolean(landing.neighborhoods && landing.neighborhoods.length > 0);
  const [heroLead, leadRest] = splitLead(landing.description);
  // A job done in this city, with the service page that offers the same work.
  const localJobs = localJobsForArea(landing.slug);
  const localJobSection = LOCAL_JOB_SECTIONS[landing.slug];

  return (
    <>
      <AreaServiceJsonLd landing={landing} />
      {landing.faqs && landing.faqs.length > 0 && (
        <FaqJsonLd faqs={landing.faqs} />
      )}

      <PageHero
        layout={frame ? "split" : "type-led"}
        frame={frame}
        breadcrumb={[
          { name: "Home", href: "/" },
          { name: landing.city, href: `/areas/${landing.slug}` },
        ]}
        overline={`${landing.city}, ${landing.state}`}
        overlineIcon={<MapPin />}
        title={landing.heroText}
        description={heroLead}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              {copy.hero.call} {BUSINESS.phone}
            </Button>
            <Button href="/booking" variant="secondary" size="lg" icon={<Calendar className="size-5" />}>
              {copy.hero.book}
            </Button>
          </>
        }
      >
        {county && <p className={cn("text-[0.9375rem] font-semibold text-fg", !frame && "mt-5")}>{county}</p>}
      </PageHero>

      {/* Services in this city: compact rows, two columns from md. */}
      <Section tone="white" spacing="sm" labelledBy="area-services-heading">
        <Container>
          <div className="mb-8 max-w-3xl sm:mb-10">
            {leadRest && <p className="mb-8 max-w-[60ch] text-lead text-body sm:mb-10">{leadRest}</p>}
            <h2 id="area-services-heading" className="text-display-md text-fg">
              {copy.services.heading(landing.city)}
            </h2>
            <p className="mt-4 max-w-[56ch] text-lead text-body">{copy.services.lead(landing.city)}</p>
          </div>

          <ul className="grid grid-cols-1 border-b border-rule md:grid-cols-2 md:gap-x-10">
            {displayServices.map((service) => (
              <li key={service.id} className="-mb-px border-y border-rule">
                <Link href={service.href} className="group block py-4 underline-offset-4 lg:py-5">
                  <h3 className="flex items-start justify-between gap-4 text-xl leading-snug font-semibold text-fg">
                    <span className="group-hover:underline">{service.title}</span>
                    <ArrowRight className="mt-1 size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-2 max-w-[60ch] text-body">{service.description}</p>
                  {service.features && (
                    <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem] font-medium text-fg">
                      {service.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="inline-flex items-center gap-1.5">
                          <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {localJobSection && (
        <LocalJobs
          jobs={localJobs}
          heading={localJobSection.heading}
          lead={localJobSection.lead}
          page="city"
          ctaHref={(job) => `/services/${job.primaryService.slug}#request-service`}
          tone="white"
          divider
        />
      )}

      {/* Local context and neighborhoods */}
      <Section tone="shell" spacing="sm" labelledBy="area-local-heading">
        <Container>
          {/* Phones: heading, story, neighborhoods. From 64rem the heading and
              the neighborhoods share the left column and the story runs
              beside them from the top, so the section is only as tall as
              the story. */}
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-8">
            <h2 id="area-local-heading" className="text-display-md text-fg lg:col-span-5">
              {copy.local.heading(landing.city)}
            </h2>
            <div className="max-w-[68ch] space-y-5 text-body lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
              <p>{paragraphs[0]}</p>
              {paragraphs.length > 1 && (
                <MoreOnPhones summary={copy.local.more}>
                  <div className="space-y-5 pt-3 lg:pt-0">
                    {paragraphs.slice(1).map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </MoreOnPhones>
              )}
            </div>
            {hasNeighborhoods && (
              <NeighborhoodList
                className="mt-4 lg:col-span-5 lg:row-start-2 lg:mt-0"
                heading={copy.local.neighborhoodsHeading(landing.city)}
                names={landing.neighborhoods ?? []}
              />
            )}
          </div>
        </Container>
      </Section>

      {/* Major-project proof for this city */}
      <CityProofBlock cityName={landing.city} projects={proofProjects} />

      {/* Service+city pages, builder page and city guides are rendered by the
          server component AreaServiceLinks in each /areas/<slug>/page.tsx. */}

      {/* Why choose C&S: short rows, two or three columns. */}
      <Section tone="shell" spacing="sm" labelledBy="area-trust-heading">
        <Container>
          <h2 id="area-trust-heading" className="mb-8 max-w-3xl text-display-md text-fg">
            {copy.trust.heading(landing.city)}
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-10">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-start gap-2 text-[0.9375rem] leading-snug font-semibold text-fg sm:gap-3 sm:text-base">
                <Check className="mt-0.5 size-4 shrink-0 text-primary sm:size-5" strokeWidth={2.5} aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* City FAQ: closed accordion, answers in the HTML. */}
      {landing.faqs && landing.faqs.length > 0 && (
        <Section tone="white" spacing="sm" labelledBy="area-faq-heading">
          <Container>
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
              <div className="lg:col-span-4">
                <Eyebrow className="mb-3">{copy.faq.eyebrow}</Eyebrow>
                <h2 id="area-faq-heading" className="text-display-md text-fg">
                  {copy.faq.heading(landing.city)}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faqs={landing.faqs} name={`faq-${landing.slug}`} />
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
