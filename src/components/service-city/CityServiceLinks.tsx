import Link from "next/link";
import { LinkGrid } from "@/components/links/LinkGrid";
import SplitLinkSection from "@/components/areas/SplitLinkSection";
import MoreOnPhones from "@/components/areas/MoreOnPhones";
import { SERVICE_CITY_COPY } from "@/content/areas";
import {
  areaForCity,
  hubForLanding,
  landingsForCity,
  landingsForHub,
} from "@/lib/internal-links";
import type { ServiceCityLanding } from "@/lib/types";

const copy = SERVICE_CITY_COPY.links;
const LINK_CLASS = "font-semibold text-link underline underline-offset-[0.2em] decoration-1 hover:decoration-2";

/**
 * Cross-links under every service-city landing: the other service pages for
 * the same city, the same service in other cities, and both parents (area
 * hub + service hub). Server component so every anchor is in the HTML for
 * crawlers. Before this block each landing had 1–7 inbound links site-wide.
 */
export default function CityServiceLinks({
  landing,
}: {
  landing: ServiceCityLanding;
}) {
  const area = areaForCity(landing.city);
  const hub = hubForLanding(landing);
  const cityPages = landingsForCity(landing.city, landing.slug);
  const hubPages = landingsForHub(landing.serviceSlug, landing.slug);

  if (!area && !hub && cityPages.length === 0 && hubPages.length === 0) {
    return null;
  }

  const hubGrid = (
    <LinkGrid
      columns={2}
      links={hubPages.map((p) => ({
        href: `/${p.slug}`,
        label: p.h1,
        meta: `${p.city}, ${p.state}`,
      }))}
    />
  );

  return (
    <SplitLinkSection
      overline={`${landing.city}, ${landing.state}`}
      heading={copy.heading(landing.city)}
      description={copy.description(landing.city)}
      tone="white"
      headingId="city-service-links-heading"
    >
      {cityPages.length > 0 && (
        <LinkGrid
          columns={2}
          links={cityPages.map((p) => ({
            href: `/${p.slug}`,
            label: p.h1,
            meta: p.priceRange ? `${copy.rangePrefix} ${p.priceRange}` : undefined,
          }))}
        />
      )}

      {hub && hubPages.length > 0 && (
        <div className={cityPages.length > 0 ? "mt-10" : undefined}>
          <h3 className="mb-4 text-xl leading-snug font-semibold text-fg">
            {copy.hubHeading(hub.title)}
          </h3>
          {hubPages.length > 3 ? (
            <MoreOnPhones summary={copy.showCities(hubPages.length)}>{hubGrid}</MoreOnPhones>
          ) : (
            hubGrid
          )}
        </div>
      )}

      {(area || hub) && (
        <p className="mt-6 max-w-[68ch] text-body">
          {copy.seePrefix}
          {area && (
            <Link
              href={`/areas/${area.slug}`}
              className={LINK_CLASS}
            >
              {copy.areaLink(area.city, area.state)}
            </Link>
          )}
          {area && hub && copy.or}
          {hub && (
            <Link
              href={hub.href}
              className={LINK_CLASS}
            >
              {copy.hubLink(hub.title)}
            </Link>
          )}
          .
        </p>
      )}
    </SplitLinkSection>
  );
}
