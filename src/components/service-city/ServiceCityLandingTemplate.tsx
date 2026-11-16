import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Calendar, MapPin, Phone } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import NeighborhoodList from "@/components/areas/NeighborhoodList";
import { SERVICE_CITY_COPY, countyLabel } from "@/content/areas";
import { BUSINESS } from "@/lib/business";
import { SERVICE_AREAS_BY_COUNTY } from "@/lib/constants";
import { areaForCity } from "@/lib/internal-links";
import { picture } from "@/lib/media";
import type { ServiceCityLanding } from "@/lib/types";

const copy = SERVICE_CITY_COPY;

/**
 * A /<service>-<city> landing (pages.md, "service-city pages"): hero with the
 * price line and trust row, the service description, what we offer, the
 * service area with its neighborhoods, FAQ and related services. The city
 * links, local projects, reviews and closing band follow in the page file.
 *
 * Server component: every sentence and link is in the HTML.
 */
export default function ServiceCityLandingTemplate({
  landing,
  areaHubHref,
}: {
  landing: ServiceCityLanding;
  /** /areas/<slug> for this landing's city, when a hub exists. */
  areaHubHref?: string;
}) {
  // The city's header photograph (a real C&S job there), else type-led.
  const area = areaForCity(landing.city);
  const frame = area ? picture(`area.header.${area.slug}`) : null;
  const county = countyLabel(landing.city, SERVICE_AREAS_BY_COUNTY);
  const paragraphs = landing.serviceDescription.split("\n\n");

  return (
    <>
      <PageHero
        layout={frame ? "split" : "type-led"}
        frame={frame}
        overline={`${landing.city}, ${landing.state}`}
        overlineIcon={<MapPin />}
        title={landing.h1}
        description={landing.heroSubtext}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              {copy.hero.call} <span className="whitespace-nowrap">{BUSINESS.phone}</span>
            </Button>
            <Button href="/booking" variant="secondary" size="lg" icon={<Calendar className="size-5" />}>
              {copy.hero.book}
            </Button>
          </>
        }
      >
        <div className="mt-8 border-t border-rule pt-5">
          {landing.priceRange && (
            <p className="text-body">
              {copy.hero.priceLabel}{" "}
              <span className="font-semibold text-fg tabular-nums">{landing.priceRange}</span>
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            {copy.hero.servingPrefix} {landing.city}
            {`${copy.hero.since}${BUSINESS.license}`}
          </p>
          {county && <p className="label-tech mt-5 text-accent">{county}</p>}
        </div>
      </PageHero>

      {/* Trust row */}
      <Section tone="white" spacing="none" className="border-b border-rule">
        <Container>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:flex">
            {landing.trustBadges.map((badge) => (
              <li
                key={badge}
                className="flex items-center border-rule py-4 text-[0.9375rem] font-medium text-fg max-sm:border-b max-sm:last:border-b-0 lg:flex-1 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
              >
                {badge}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Service description: the main content block */}
      <Section tone="white" labelledBy="service-city-description-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              {/* The heading stays in view beside the long description. */}
              <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
                <h2 id="service-city-description-heading" className="text-display-md text-fg">
                  {landing.sectionHeading ??
                    copy.description.fallbackHeading(landing.city, landing.state)}
                </h2>
              </div>
            </div>
            <Reveal className="lg:col-span-7 lg:pt-10">
              <div className="max-w-[68ch] space-y-5 text-body">
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* What we offer */}
      <Section tone="shell" labelledBy="service-city-features-heading">
        <Container>
          <Reveal className="mb-10 max-w-2xl sm:mb-12">
            <h2 id="service-city-features-heading" className="text-display-md text-fg">
              {copy.features.heading(landing.city)}
            </h2>
          </Reveal>
          <ol className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
            {landing.features.map((feature, i) => (
              <li
                key={feature.title}
                className="-mt-px grid grid-cols-[2.75rem_minmax(0,1fr)] border-y border-rule py-6 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
              >
                <span className="label-tech pt-1 text-accent tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg leading-snug font-semibold text-fg">{feature.title}</h3>
                  <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-relaxed text-body">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Service area and neighborhoods */}
      <Section tone="white" labelledBy="service-city-area-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-7">
              <h2 id="service-city-area-heading" className="text-display-md text-fg">
                {copy.area.heading(landing.city, landing.state)}
              </h2>
              {/* One sentence instead of the same two-line boilerplate on all
                  54 landings, plus a real link up to the city hub. */}
              <p className="mt-6 max-w-[56ch] text-lead text-body">
                {copy.area.sentence(landing.city, landing.state)}
                {areaHubHref && (
                  <>
                    {" "}
                    <Link
                      href={areaHubHref}
                      className="font-semibold text-link underline underline-offset-[0.2em] decoration-1 hover:decoration-2"
                    >
                      {copy.area.hubLink(landing.city)}
                    </Link>
                    .
                  </>
                )}
              </p>
            </Reveal>
            {landing.neighborhoods.length > 0 && (
              <Reveal className="lg:col-span-12">
                <NeighborhoodList
                  heading={copy.area.neighborhoodsHeading(landing.city)}
                  names={landing.neighborhoods}
                  columns={4}
                />
              </Reveal>
            )}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="shell" labelledBy="service-city-faq-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <Reveal className="lg:col-span-4">
              <h2 id="service-city-faq-heading" className="text-display-md text-fg">
                {copy.faq.heading}
              </h2>
            </Reveal>
            <div className="lg:col-span-8">
              <FaqAccordion faqs={landing.faqs} name={`faq-${landing.slug}`} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Related pages */}
      {landing.relatedPages.length > 0 && (
        <Section tone="white" spacing="sm" labelledBy="service-city-related-heading">
          <Container>
            <h2 id="service-city-related-heading" className="mb-8 text-display-sm text-fg">
              {copy.related.heading}
            </h2>
            <LinkGrid links={landing.relatedPages.map((page) => ({ href: page.href, label: page.label }))} />
          </Container>
        </Section>
      )}
    </>
  );
}
