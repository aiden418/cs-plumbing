import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ServiceCard from "@/components/services/ServiceCard";
import CostEstimator from "@/components/estimator/CostEstimator";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { HeroActions, servicePhoto } from "@/components/services/ServiceLandingTemplate";
import { SERVICES, ESTIMATOR_SERVICES } from "@/lib/constants";
import { picture } from "@/lib/media";
import { SERVICES_INDEX as COPY, SERVICE_PAGE } from "@/content/services";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Plumbing Services",
  description:
    "Full-service plumbing in Cape Coral & Fort Myers — emergency repairs, drain cleaning, water heaters, repiping and new construction. Free estimates.",
  keywords: [
    "plumbing services Cape Coral",
    "plumbing services Fort Myers",
    "emergency plumbing Lee County",
    "drain cleaning Cape Coral",
    "water heater repair Fort Myers",
    "repiping Southwest Florida",
    "new construction plumbing SWFL",
    "commercial plumbing Cape Coral",
    "plumber near me",
  ],
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: "Plumbing Services | C&S Plumbing of Lee",
    description:
      "Every plumbing solution under one roof — emergency repairs, drain cleaning, water heaters, repiping, new construction & commercial plumbing across SWFL.",
    url: "https://www.csplumbinglee.com/services",
  },
};

/** The service page slug behind a tile ("/services/plumbing-remodel" → "plumbing-remodel"). */
const slugOf = (href: string) => href.split("/").filter(Boolean).pop() ?? "";

export default function ServicesPage() {
  const groups = COPY.groups.map((group) => ({
    ...group,
    services: group.serviceIds
      .map((id) => SERVICES.find((s) => s.id === id))
      .filter((s): s is (typeof SERVICES)[number] => Boolean(s)),
  }));
  // Every service in SERVICES is listed: one missing from the groups goes to the first group.
  const grouped = new Set<string>(COPY.groups.flatMap((g) => g.serviceIds));
  groups[0].services.push(...SERVICES.filter((s) => !grouped.has(s.id)));
  const frame = picture(COPY.heroPhoto);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
        ]}
      />
      <PageHero
        layout="photo"
        frame={frame}
        overline={COPY.hero.overline}
        title={COPY.hero.title}
        accent={COPY.hero.accent}
        accentPosition="block"
        description={COPY.hero.description}
        actions={<HeroActions second={{ label: SERVICE_PAGE.book, href: "/booking" }} />}
      />

      {/* Services, in two groups of photo cards */}
      <Section tone="shell" spacing="sm" labelledBy="services-grid-heading">
        <Container>
          {/* The hero <h1> carries this visually; the grid still needs a
              section heading so the outline doesn't jump h1 -> h3. */}
          <h2 id="services-grid-heading" className="sr-only">
            {COPY.gridHeading}
          </h2>
          {groups.map((group, gi) => {
            const wide = group.services.length <= 2;
            return (
              <section
                key={group.id}
                aria-labelledby={`${group.id}-heading`}
                className={gi > 0 ? "mt-12 sm:mt-16" : undefined}
              >
                <h3 id={`${group.id}-heading`} className="mb-5 text-display-sm text-fg sm:mb-6">
                  {group.title}
                </h3>
                <ul
                  className={
                    wide
                      ? "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:gap-6"
                      : "service-grid grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
                  }
                >
                  {group.services.map((service) => (
                    <li key={service.id}>
                      <ServiceCard
                        service={service}
                        media={servicePhoto(slugOf(service.href), "home.service")}
                        more={COPY.tileMore}
                        layout={wide ? "wide" : "tile"}
                        sizes={
                          wide
                            ? "(min-width: 1280px) 240px, (min-width: 640px) 20vw, 92vw"
                            : "(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw"
                        }
                      />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </Container>
      </Section>

      {/* Cost Estimator */}
      <Section tone="white" spacing="sm" labelledBy="estimator-heading">
        <Container>
          <div className="grid grid-cols-1 items-start gap-y-8 lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-5">
              <SectionHeading
                align="left"
                id="estimator-heading"
                overline={COPY.estimator.overline}
                title={COPY.estimator.title}
                subtitle={COPY.estimator.subtitle}
                className="mb-0"
              />
              <p className="mt-5 max-w-[56ch] text-[0.9375rem] text-body">{COPY.estimator.note}</p>
            </div>
            <div className="lg:col-span-7">
              <CostEstimator services={ESTIMATOR_SERVICES} />
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
