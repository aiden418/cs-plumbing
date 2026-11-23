import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { Calendar, Check, MapPin, Phone } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import MoreOnPhones, { splitLead } from "@/components/areas/MoreOnPhones";
import NeighborhoodList from "@/components/areas/NeighborhoodList";
import { SERVICE_CITY_COPY, countyLabel } from "@/content/areas";
import { BUSINESS } from "@/lib/business";
import { SERVICE_AREAS_BY_COUNTY } from "@/lib/constants";
import { areaForCity } from "@/lib/internal-links";
import { picture } from "@/lib/media";
import type { ReactNode } from "react";
import type { ServiceCityLanding } from "@/lib/types";

const copy = SERVICE_CITY_COPY;

/**
 * A /<service>-<city> landing, version 2 (v2-bright.md): the city's job
 * photo behind the headline (or a plain white hero) with the price line,
 * a one-line trust strip, the service description, what we offer, the
 * service area with its neighborhoods and related services, FAQ. The city
 * links, local projects, reviews and closing band follow in the page file.
 *
 * Server component: every sentence and link is in the HTML.
 */
export default function ServiceCityLandingTemplate({
  landing,
  areaHubHref,
  secondAction,
  afterTrust,
}: {
  landing: ServiceCityLanding;
  /** /areas/<slug> for this landing's city, when a hub exists. */
  areaHubHref?: string;
  /** The button beside the call button. Default: the request-service page. */
  secondAction?: { label: string; href: string };
  /** Sections of this page's own, placed right under the trust strip. */
  afterTrust?: ReactNode;
}) {
  // The city's header photograph (a real C&S job there), else the plain hero.
  const area = areaForCity(landing.city);
  const frame = area ? picture(`area.header.${area.slug}`) : null;
  const county = countyLabel(landing.city, SERVICE_AREAS_BY_COUNTY);
  const paragraphs = landing.serviceDescription.split("\n\n");
  const [heroLead, leadRest] = splitLead(landing.heroSubtext);

  return (
    <>
      <PageHero
        layout={frame ? "split" : "type-led"}
        frame={frame}
        overline={`${landing.city}, ${landing.state}`}
        overlineIcon={<MapPin />}
        title={landing.h1}
        description={heroLead}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              {copy.hero.call} <span className="whitespace-nowrap">{BUSINESS.phone}</span>
            </Button>
            <Button href={secondAction?.href ?? "/booking"} variant="secondary" size="lg" icon={<Calendar className="size-5" />}>
              {secondAction?.label ?? copy.hero.book}
            </Button>
          </>
        }
      >
        <div className="mt-6 space-y-1">
          {landing.priceRange && (
            <p className="text-lg text-body">
              {copy.hero.priceLabel}{" "}
              <span className="font-semibold text-fg tabular-nums">{landing.priceRange}</span>
            </p>
          )}
          <p className="text-[0.9375rem] text-body">
            {copy.hero.servingPrefix} {landing.city}
            {`${copy.hero.since}${BUSINESS.license}`}
            {county && (
              <>
                <span aria-hidden="true"> · </span>
                <span className="font-semibold text-fg">{county}</span>
              </>
            )}
          </p>
        </div>
      </PageHero>

      {/* Trust strip: two columns on phones, one row from lg. */}
      <Section tone="white" spacing="none" className="border-b border-rule">
        <Container>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 py-5 lg:flex lg:justify-between lg:gap-8">
            {landing.trustBadges.map((badge) => (
              <li key={badge} className="flex items-start gap-2 text-[0.9375rem] leading-snug font-semibold text-fg">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />
                <span>{badge}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {afterTrust}

      {/* Service description: the main content block */}
      <Section tone="white" spacing="sm" labelledBy="service-city-description-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              {/* The heading stays in view beside the long description. */}
              <div className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)]">
                <h2 id="service-city-description-heading" className="text-display-md text-fg">
                  {landing.sectionHeading ??
                    copy.description.fallbackHeading(landing.city, landing.state)}
                </h2>
              </div>
            </div>
            <div className="lg:col-span-8">
              {leadRest && <p className="mb-6 max-w-[62ch] text-lead font-medium text-fg">{leadRest}</p>}
              <div className="max-w-[68ch] space-y-5 text-body">
                {paragraphs.slice(0, 2).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                {paragraphs.length > 2 && (
                  <MoreOnPhones summary={copy.description.more}>
                    <div className="space-y-5 pt-3 lg:pt-0">
                      {paragraphs.slice(2).map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </MoreOnPhones>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What we offer: short rows, two columns from md. */}
      <Section tone="shell" spacing="sm" labelledBy="service-city-features-heading">
        <Container>
          <h2 id="service-city-features-heading" className="mb-8 max-w-3xl text-display-md text-fg">
            {copy.features.heading(landing.city)}
          </h2>
          <ul className="grid grid-cols-1 gap-x-10 border-b border-rule md:grid-cols-2">
            {landing.features.map((feature) => (
              <li key={feature.title} className="-mb-px border-y border-rule py-5">
                <h3 className="text-xl leading-snug font-semibold text-fg">{feature.title}</h3>
                <p className="mt-1.5 max-w-[60ch] text-body">{feature.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Service area, neighborhoods and related services */}
      <Section tone="white" spacing="sm" labelledBy="service-city-area-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-7">
              <h2 id="service-city-area-heading" className="text-display-md text-fg">
                {copy.area.heading(landing.city, landing.state)}
              </h2>
              {/* One sentence instead of the same two-line boilerplate on all
                  54 landings, plus a real link up to the city hub. */}
              <p className="mt-4 max-w-[56ch] text-lead text-body">
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
              {landing.neighborhoods.length > 0 && (
                <NeighborhoodList
                  className="mt-8"
                  heading={copy.area.neighborhoodsHeading(landing.city)}
                  names={landing.neighborhoods}
                  columns={3}
                />
              )}
            </div>

            {landing.relatedPages.length > 0 && (
              <div className="lg:col-span-4 lg:col-start-9">
                <h2 id="service-city-related-heading" className="mb-4 text-display-sm text-fg">
                  {copy.related.heading}
                </h2>
                <LinkGrid
                  columns={2}
                  className="lg:grid-cols-1"
                  links={landing.relatedPages.map((page) => ({ href: page.href, label: page.label }))}
                />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* FAQ: closed accordion, answers in the HTML. */}
      <Section tone="shell" spacing="sm" labelledBy="service-city-faq-heading">
        <Container>
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-4">
              <h2 id="service-city-faq-heading" className="text-display-md text-fg">
                {copy.faq.heading}
              </h2>
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion faqs={landing.faqs} name={`faq-${landing.slug}`} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
