import Link from "next/link";
import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import {
  areaForCity,
  hubForLanding,
  landingsForCity,
  landingsForHub,
} from "@/lib/internal-links";
import type { ServiceCityLanding } from "@/lib/types";

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

  return (
    <LinkSection
      overline={`${landing.city}, ${landing.state}`}
      heading={`More plumbing help in ${landing.city}`}
      description={`Every ${landing.city} service page has local pricing, FAQs and the neighborhoods we cover.`}
      headingId="city-service-links-heading"
    >
      {cityPages.length > 0 && (
        <LinkGrid
          links={cityPages.map((p) => ({
            href: `/${p.slug}`,
            label: p.h1,
            meta: p.priceRange ? `Typical range ${p.priceRange}` : undefined,
          }))}
        />
      )}

      {hub && hubPages.length > 0 && (
        <div className={cityPages.length > 0 ? "mt-10" : undefined}>
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            {hub.title} in other Southwest Florida cities
          </h3>
          <LinkGrid
            links={hubPages.map((p) => ({
              href: `/${p.slug}`,
              label: p.h1,
              meta: `${p.city}, ${p.state}`,
            }))}
          />
        </div>
      )}

      {(area || hub) && (
        <p className="mt-8 text-sm text-gray-600">
          See{" "}
          {area && (
            <Link
              href={`/areas/${area.slug}`}
              className="font-semibold text-primary hover:underline"
            >
              all plumbing services in {area.city}, {area.state}
            </Link>
          )}
          {area && hub && " or "}
          {hub && (
            <Link
              href={hub.href}
              className="font-semibold text-primary hover:underline"
            >
              {hub.title} across Southwest Florida
            </Link>
          )}
          .
        </p>
      )}
    </LinkSection>
  );
}
