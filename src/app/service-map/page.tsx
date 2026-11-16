import type { Metadata } from "next";
import CTASection from "@/components/home/CTASection";
import { LinkGrid } from "@/components/links/LinkGrid";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Calendar, Phone } from "@/components/ui/icons";
import { SERVICE_MAP } from "@/content/reading";
import { BUSINESS } from "@/lib/business";
import { SERVICE_AREAS_BY_COUNTY } from "@/lib/constants";
import { areaForCity } from "@/lib/internal-links";

/** The area pages that exist, grouped by county in the order of SERVICE_AREAS_BY_COUNTY. */
const COUNTIES = Object.entries(SERVICE_AREAS_BY_COUNTY)
  .map(([county, cities]) => ({
    county,
    links: cities.flatMap((city) => {
      const area = areaForCity(city);
      return area ? [{ href: `/areas/${area.slug}`, label: area.city }] : [];
    }),
  }))
  .filter((group) => group.links.length > 0);


export const metadata: Metadata = {
  alternates: { canonical: "/service-map" },
  title: "Service Map",
  description:
    "Explore C&S Plumbing's service area across Southwest Florida — past, present and upcoming job locations in Cape Coral, Fort Myers, Naples & beyond.",
  keywords: [
    "plumber service area Cape Coral",
    "plumber near me SWFL",
    "plumbing service area Fort Myers",
    "C&S Plumbing locations",
    "Southwest Florida plumber map",
  ],
  openGraph: {
    title: "Service Map | C&S Plumbing of Lee",
    description:
      "9,500+ jobs completed across Southwest Florida. See our service area and job locations.",
    url: "https://www.csplumbinglee.com/service-map",
  },
};

export default function ServiceMapPage() {
  return (
    <>
      <PageHero
        layout="type-led"
        overline={SERVICE_MAP.overline}
        title={SERVICE_MAP.title}
        accent={SERVICE_MAP.accent}
        description={`With over ${BUSINESS.homesCompleted.toLocaleString()} jobs completed, C&S Plumbing serves all of Southwest Florida — from Cape Coral and Fort Myers to Naples, Bonita Springs, and beyond.`}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              Call {BUSINESS.phone}
            </Button>
            <Button
              href={SERVICE_MAP.bookHref}
              variant="secondary"
              size="lg"
              icon={<Calendar className="size-5" />}
            >
              {SERVICE_MAP.book}
            </Button>
          </>
        }
      />

      {/* Map Embed: a third-party Google My Maps frame, lazy-loaded as before. */}
      <Section tone="white" spacing="sm">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-frame border border-rule bg-shell">
              <iframe
                src={SERVICE_MAP.map.src}
                width="100%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title={SERVICE_MAP.map.title}
                className="block w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="shell" spacing="sm" labelledBy="service-map-areas-heading">
        <Container>
          <h2 id="service-map-areas-heading" className="mb-10 text-display-md text-fg">
            {SERVICE_MAP.areas.heading}
          </h2>
          <div className="space-y-10">
            {COUNTIES.map((group) => (
              <div key={group.county} className="grid grid-cols-1 gap-y-4 lg:grid-cols-12 lg:gap-x-8">
                <h3 className="self-start text-lg text-fg lg:col-span-3 lg:flex lg:min-h-14 lg:items-center">
                  {group.county}
                  {SERVICE_MAP.areas.countySuffix}
                </h3>
                <LinkGrid links={group.links} columns={3} className="lg:col-span-9" />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Service Map", href: "/service-map" },
        ]}
      />
      <CTASection />
    </>
  );
}
