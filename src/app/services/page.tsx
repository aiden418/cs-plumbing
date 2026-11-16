import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/services/ServiceCard";
import CostEstimator from "@/components/estimator/CostEstimator";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import { SERVICES, ESTIMATOR_SERVICES } from "@/lib/constants";
import { picture } from "@/lib/media";
import { SERVICES_INDEX as COPY } from "@/content/services";

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

  return (
    <>
      <PageHero
        layout="type-led"
        overline={COPY.hero.overline}
        title={COPY.hero.title}
        accent={COPY.hero.accent}
        accentPosition="block"
        description={COPY.hero.description}
      />

      {/* Services, in two groups */}
      <Section tone="shell" labelledBy="services-grid-heading">
        <Container>
          {/* The hero <h1> carries this visually; the grid still needs a
              section heading so the outline doesn't jump h1 -> h3. */}
          <h2 id="services-grid-heading" className="sr-only">
            {COPY.gridHeading}
          </h2>
          {groups.map((group, gi) => {
            const door = group.services.length <= 2;
            return (
              <section
                key={group.id}
                aria-labelledby={`${group.id}-heading`}
                className={gi > 0 ? "mt-section-sm" : undefined}
              >
                <div className="mb-8 flex items-center gap-4 sm:mb-10">
                  <span className="joint text-accent" aria-hidden="true" />
                  <h3 id={`${group.id}-heading`} className="shrink-0 text-display-sm text-fg">
                    {group.title}
                  </h3>
                  <span className="h-px flex-1 bg-rule" aria-hidden="true" />
                </div>
                {(() => {
                  const tiles = group.services.map((service) => ({
                    service,
                    media: picture(`home.service.${slugOf(service.href)}`),
                  }));
                  const framed = tiles.filter((t) => t.media);
                  const typeLed = tiles.filter((t) => !t.media);
                  return (
                    <>
                      {framed.length > 0 && (
                        <ul
                          className={
                            door
                              ? "grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2"
                              : "grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8"
                          }
                        >
                          {framed.map(({ service, media }, i) => (
                            <Reveal as="li" key={service.id} index={Math.min(i, 5)}>
                              <ServiceCard
                                service={service}
                                media={media}
                                more={COPY.tileMore}
                                layout={door ? "door" : "tile"}
                                sizes={
                                  door
                                    ? "(min-width: 1280px) 260px, (min-width: 768px) 20vw, 40vw"
                                    : "(min-width: 1280px) 290px, (min-width: 1024px) 22vw, 45vw"
                                }
                              />
                            </Reveal>
                          ))}
                        </ul>
                      )}
                      {/* Services without a photograph yet: type-led, words under a hairline. */}
                      {typeLed.length > 0 && (
                        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                          {typeLed.map(({ service }, i) => (
                            <Reveal as="li" key={service.id} index={Math.min(i, 5)}>
                              <ServiceCard service={service} media={null} more={COPY.tileMore} sizes="0px" />
                            </Reveal>
                          ))}
                        </ul>
                      )}
                    </>
                  );
                })()}
              </section>
            );
          })}
        </Container>
      </Section>

      {/* Cost Estimator */}
      <Section tone="white" labelledBy="estimator-heading">
        <Container>
          <div className="grid grid-cols-1 items-start gap-y-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5">
              <SectionHeading
                align="left"
                id="estimator-heading"
                overline={COPY.estimator.overline}
                title={COPY.estimator.title}
                subtitle={COPY.estimator.subtitle}
                className="mb-0"
              />
              <p className="mt-6 max-w-[56ch] text-sm text-muted">{COPY.estimator.note}</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <CostEstimator services={ESTIMATOR_SERVICES} />
            </div>
          </div>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
