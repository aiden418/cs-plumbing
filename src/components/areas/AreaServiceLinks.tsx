import Link from "next/link";
import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import { AREA_COPY } from "@/content/areas";
import {
  landingsForCity,
  newConstructionCityFor,
  postsForCity,
} from "@/lib/internal-links";
import type { AreaLanding } from "@/lib/types";

const copy = AREA_COPY.links;

/**
 * Server-rendered links under each area hub: every service-city landing for
 * the city, the builder-door city page where one exists, and the blog
 * guides that point at this city. Costs no client JS and every link is in
 * the HTML.
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
      overline={copy.eyebrow}
      heading={
        cityPages.length > 0
          ? copy.heading(landing.city)
          : copy.headingNoPages(landing.city)
      }
      description={
        cityPages.length > 0
          ? copy.description(landing.city)
          : undefined
      }
      headingId="area-service-links-heading"
    >
      {cityPages.length > 0 && (
        <LinkGrid
          links={cityPages.map((p) => ({
            href: `/${p.slug}`,
            label: p.h1,
            meta: p.priceRange ? `${copy.rangePrefix} ${p.priceRange}` : undefined,
          }))}
        />
      )}

      {builderCity && (
        <p className="mt-8 max-w-[68ch] text-body">
          {copy.builderBefore(landing.city)}
          <Link
            href={`/new-construction-plumbing/${builderCity.slug}`}
            className="font-semibold text-link underline underline-offset-[0.2em] decoration-1 hover:decoration-2"
          >
            {copy.builderLink(builderCity.city)}
          </Link>
          .
        </p>
      )}

      {posts.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-5 text-lg leading-snug font-semibold text-fg">
            {copy.guidesHeading(landing.city)}
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
