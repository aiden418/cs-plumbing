import Link from "next/link";
import Container from "@/components/ui/Container";
import { EMERGENCY_CLAIMS } from "@/lib/claims";
import { AREA_LANDINGS, SERVICE_AREAS_BY_COUNTY } from "@/lib/constants";
import { areas } from "@/content/home";
import { ArrowLink, HomeHeading } from "./HomeHeading";

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
 * Service areas on shell: the heading with the response-time wording from
 * EMERGENCY_CLAIMS, then the eleven area pages as a compact wrap of text
 * links by county (no cards), the other towns, and the two links.
 */
export default function WhereWeWork() {
  const groups = byCounty();
  return (
    <section data-tone="shell" id={areas.id} aria-labelledby="home-areas-title" className="relative bg-canvas py-14 text-body lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <HomeHeading
            id="home-areas-title"
            eyebrow={areas.overline}
            title={areas.title}
            subtitle={areas.subtitle(EMERGENCY_CLAIMS.responseTime)}
            className="lg:col-span-5"
          />
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-x-6 border-t border-rule pt-4">
              {groups.map((group, i) => (
                <div key={group.county} className={i === 0 ? "col-span-2 mb-3" : undefined}>
                  <h3 className="text-sm font-semibold text-muted">{`${group.county} ${areas.countySuffix}`}</h3>
                  <ul className="flex flex-wrap gap-x-5">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex min-h-11 items-center text-lg font-semibold text-link underline-offset-[0.2em] hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-rule pt-4 text-muted">{areas.more}</p>
            <p className="mt-2 flex flex-wrap gap-x-8">
              <ArrowLink href={areas.bookLink.href}>{areas.bookLink.label}</ArrowLink>
              <ArrowLink href={areas.mapLink.href}>{areas.mapLink.label}</ArrowLink>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
