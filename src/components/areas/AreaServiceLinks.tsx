import Link from "next/link";
import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import {
  landingsForCity,
  newConstructionCityFor,
  postsForCity,
} from "@/lib/internal-links";
import type { AreaLanding } from "@/lib/types";

/**
 * Server-rendered links under each area hub: every service-city landing for
 * the city, the builder-door city page where one exists, and the blog
 * guides that point at this city. Lived inside the client
 * AreaLandingTemplate before, which shipped the whole landing data set to
 * the browser; here it costs no client JS and every link is in the HTML.
 */
export default function AreaServiceLinks({ landing }: { landing: AreaLanding }) {
  const cityPages = landingsForCity(landing.city);
  const builderCity = newConstructionCityFor(landing.city);
  const posts = postsForCity(landing.city, 4);

  if (cityPages.length === 0 && !builderCity && posts.length === 0) {
    return null;
  }

  return (
    <LinkSection
      overline="Local pricing & FAQs"
      heading={
        cityPages.length > 0
          ? `Popular Services in ${landing.city}`
          : `Plumbing resources for ${landing.city}`
      }
      description={
        cityPages.length > 0
          ? `Dedicated pages with local pricing, FAQs, and details for ${landing.city} homeowners.`
          : undefined
      }
      headingId="area-service-links-heading"
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

      {builderCity && (
        <p className="mt-8 text-sm text-gray-600">
          Building in {landing.city}? See{" "}
          <Link
            href={`/new-construction-plumbing/${builderCity.slug}`}
            className="font-semibold text-primary hover:underline"
          >
            new construction plumbing for builders and GCs in {builderCity.city}
          </Link>
          .
        </p>
      )}

      {posts.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Guides for {landing.city} homeowners
          </h3>
          <LinkGrid
            links={posts.map((p) => ({
              href: `/blog/${p.slug}`,
              label: p.title,
              meta: `${p.category} · ${p.readTime}`,
            }))}
            columns={posts.length >= 4 ? 4 : 3}
          />
        </div>
      )}
    </LinkSection>
  );
}
