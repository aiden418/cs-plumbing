import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/home/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { Calendar, Phone } from "@/components/ui/icons";
import { SERVICE_MAP } from "@/content/reading";
import { BUSINESS } from "@/lib/business";
import { SERVICE_AREAS_BY_COUNTY } from "@/lib/constants";
import { areaForCity } from "@/lib/internal-links";
import { cn } from "@/lib/utils";

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
        layout="plain"
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

      {/* The map (a third-party Google My Maps frame, lazy-loaded exactly as
          before) and, beside it from lg, the area pages by county. */}
      <Section tone="white" spacing="none" className="pt-6 pb-12 sm:pt-10 sm:pb-20">
        <Container>
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-7 xl:col-span-8">
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
            </div>

            <section aria-labelledby="service-map-areas-heading" className="lg:col-span-5 xl:col-span-4">
              <h2 id="service-map-areas-heading" className="text-display-sm text-fg">
                {SERVICE_MAP.areas.heading}
              </h2>
              {/* A county with more than two towns spans both columns and lists
                  them in two; the small counties sit side by side. */}
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5">
                {COUNTIES.map((group) => (
                  <div key={group.county} className={group.links.length > 2 ? "col-span-2" : undefined}>
                    <h3 className="border-b border-rule pb-2 text-lg text-fg">
                      {group.county}
                      {SERVICE_MAP.areas.countySuffix}
                    </h3>
                    <ul className={cn("mt-1 grid gap-x-6", group.links.length > 2 && "grid-cols-2")}>
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="flex min-h-11 items-center font-medium text-link underline-offset-4 hover:underline"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
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
