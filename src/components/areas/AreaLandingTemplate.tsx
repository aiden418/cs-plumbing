import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { ArrowRight, Calendar, MapPin, Phone } from "@/components/ui/icons";
import CityProofBlock from "@/components/areas/CityProofBlock";
import NeighborhoodList from "@/components/areas/NeighborhoodList";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import AreaServiceJsonLd from "@/components/seo/AreaServiceJsonLd";
import { AREA_COPY, countyLabel } from "@/content/areas";
import { BUSINESS, SERVICES, SERVICE_AREAS_BY_COUNTY, TRUST_PROOF_POINTS } from "@/lib/constants";
import { picture } from "@/lib/media";
import type { AreaLanding, ProjectCardData } from "@/lib/types";

const copy = AREA_COPY;

/**
 * An /areas/<city> page (pages.md, "Area pages"): hero, services in the city,
 * local context with its neighborhoods, local proof, why C&S, FAQ. The
 * service-city links and the closing band follow in the page file.
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
        description={landing.description}
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
        {county && <p className="label-tech mt-8 text-accent">{county}</p>}
      </PageHero>

      {/* Services in this city */}
      <Section tone="white" labelledBy="area-services-heading">
        <Container>
          <Reveal className="mb-10 max-w-2xl sm:mb-14">
            <Eyebrow className="mb-4">{copy.services.eyebrow}</Eyebrow>
            <h2 id="area-services-heading" className="text-display-md text-fg">
              {copy.services.heading(landing.city)}
            </h2>
            <p className="mt-5 max-w-[56ch] text-lead text-body">{copy.services.lead(landing.city)}</p>
          </Reveal>

          {/* Editorial rows: title, line, three features; the whole row is one link. */}
          <ul className="border-b border-rule">
            {displayServices.map((service) => (
              <li key={service.id} className="border-t border-rule">
                <Link
                  href={service.href}
                  className="group grid grid-cols-1 gap-y-2 py-6 underline-offset-4 md:grid-cols-12 md:gap-x-8 lg:py-7"
                >
                  <h3 className="flex items-start justify-between gap-4 text-lg leading-snug font-semibold text-fg md:col-span-4 lg:col-span-3">
                    <span className="group-hover:underline">{service.title}</span>
                    <ArrowRight className="mt-0.5 size-5 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5 lg:hidden" />
                  </h3>
                  <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-body md:col-span-8 lg:col-span-5">
                    {service.description}
                  </p>
                  {service.features && (
                    <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 md:col-span-8 md:col-start-5 lg:col-span-3 lg:col-start-auto lg:mt-0 lg:block lg:space-y-1.5">
                      {service.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-baseline gap-2.5 text-sm text-muted">
                          <span className="joint size-1.5 translate-y-[-0.1em] text-accent" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="hidden justify-end lg:col-span-1 lg:flex" aria-hidden="true">
                    <ArrowRight className="size-5 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Local context and neighborhoods */}
      <Section tone="shell" labelledBy="area-local-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className={hasNeighborhoods ? "lg:col-span-7" : "lg:col-span-8"}>
              <Eyebrow className="mb-4">{copy.local.eyebrow}</Eyebrow>
              <h2 id="area-local-heading" className="text-display-md text-fg">
                {copy.local.heading(landing.city)}
              </h2>
              <div className="mt-8 max-w-[68ch] space-y-5 text-body">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            {hasNeighborhoods && (
              <Reveal className="lg:col-span-4 lg:col-start-9 lg:pt-2">
                <NeighborhoodList
                  heading={copy.local.neighborhoodsHeading(landing.city)}
                  names={landing.neighborhoods ?? []}
                />
              </Reveal>
            )}
          </div>
        </Container>
      </Section>

      {/* Major-project proof for this city */}
      <CityProofBlock cityName={landing.city} projects={proofProjects} />

      {/* Service+city pages, builder page and city guides are rendered by the
          server component AreaServiceLinks in each /areas/<slug>/page.tsx. */}

      {/* Why choose C&S */}
      <Section tone="navy" labelledBy="area-trust-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-4">
              <Eyebrow className="mb-4">{copy.trust.eyebrow}</Eyebrow>
              <h2 id="area-trust-heading" className="text-display-md text-fg">
                {copy.trust.heading(landing.city)}
              </h2>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <li key={point} className="-mt-px flex items-baseline gap-3 border-y border-rule py-3.5 text-fg">
                    <span className="joint translate-y-[-0.05em] text-accent" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* City FAQ */}
      {landing.faqs && landing.faqs.length > 0 && (
        <Section tone="shell" labelledBy="area-faq-heading">
          <Container>
            <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
              <Reveal className="lg:col-span-4">
                <Eyebrow className="mb-4">{copy.faq.eyebrow}</Eyebrow>
                <h2 id="area-faq-heading" className="text-display-md text-fg">
                  {copy.faq.heading(landing.city)}
                </h2>
              </Reveal>
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
