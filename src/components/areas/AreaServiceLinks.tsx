import Link from "next/link";
import { LinkGrid } from "@/components/links/LinkGrid";
import SplitLinkSection from "@/components/areas/SplitLinkSection";
import MoreOnPhones from "@/components/areas/MoreOnPhones";
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

  const guideGrid = (
    <LinkGrid
      links={posts.map((p) => ({
        href: `/blog/${p.slug}`,
        label: p.title,
        meta: `${p.category} · ${p.readTime}`,
      }))}
      columns={2}
    />
  );

  return (
    <SplitLinkSection
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
      tone="shell"
      headingId="area-service-links-heading"
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

      {builderCity && (
        <p className="mt-6 max-w-[68ch] text-body">
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
        <div className="mt-10">
          <h3 className="mb-4 text-xl leading-snug font-semibold text-fg">
            {copy.guidesHeading(landing.city)}
          </h3>
          {posts.length > 2 ? (
            <MoreOnPhones summary={copy.showGuides(posts.length)}>{guideGrid}</MoreOnPhones>
          ) : (
            guideGrid
          )}
        </div>
      )}
    </SplitLinkSection>
  );
}
