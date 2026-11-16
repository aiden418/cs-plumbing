import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import { BUSINESS } from "@/lib/business";
import { EMERGENCY_CLAIMS } from "@/lib/claims";
import { AREA_LANDINGS, SERVICE_AREAS_BY_COUNTY } from "@/lib/constants";
import { formatCoordinates } from "@/lib/hero-images";
import { areas } from "@/content/home";

const linkClass =
  "group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline";

/** The area pages grouped by county, in the order of SERVICE_AREAS_BY_COUNTY. */
function byCounty() {
  return Object.entries(SERVICE_AREAS_BY_COUNTY)
    .map(([county, cities]) => ({
      county,
      links: (cities as readonly string[]).flatMap((city) => {
        const area = AREA_LANDINGS.find((a) => a.city === city);
        return area ? [{ href: `/areas/${area.slug}`, label: area.city }] : [];
      }),
    }))
    .filter((group) => group.links.length > 0);
}

/**
 * Chapter 5 on ink: the service-area heading with the response-time
 * wording from EMERGENCY_CLAIMS, the eleven area pages as a LinkGrid grouped
 * by county, and the shop's coordinates as a plan-drawing detail.
 */
export default function WhereWeWork() {
  const groups = byCounty();
  const [first, ...rest] = groups;
  return (
    <Section tone="ink" id={areas.id} spacing="none" className="py-section-sm lg:py-section" labelledBy="home-areas-title">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
          <SectionHeading
            id="home-areas-title"
            align="left"
            overline={areas.overline}
            title={areas.title}
            subtitle={areas.subtitle(EMERGENCY_CLAIMS.responseTime)}
            className="mb-6 lg:mb-10 lg:col-span-8"
          />
          <p className="label-tech mb-8 text-muted tabular-nums lg:mb-10 lg:col-span-4 lg:self-end lg:text-right">
            {formatCoordinates(BUSINESS.geo)}
          </p>
        </div>

        <Reveal className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          {first && (
            <div className="lg:col-span-8">
              <h3 className="label-tech mb-3 text-accent">{`${first.county} ${areas.countySuffix}`}</h3>
              <LinkGrid links={first.links} columns={2} className="grid-cols-2 gap-x-6 sm:gap-x-8" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 lg:col-span-4 lg:grid-cols-1">
            {rest.map((group) => (
              <div key={group.county}>
                <h3 className="label-tech mb-3 text-accent">{`${group.county} ${areas.countySuffix}`}</h3>
                <LinkGrid links={group.links} columns={2} className="sm:grid-cols-1" />
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-x-10 gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[68ch] text-sm text-muted">{areas.more}</p>
          <p className="flex flex-wrap gap-x-8">
            <Link href={areas.bookLink.href} className={linkClass}>
              {areas.bookLink.label}
              <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
            </Link>
            <Link href={areas.mapLink.href} className={linkClass}>
              {areas.mapLink.label}
              <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
            </Link>
          </p>
        </div>
      </Container>
    </Section>
  );
}
