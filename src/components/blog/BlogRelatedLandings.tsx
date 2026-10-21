import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import { landingsForPost } from "@/lib/internal-links";
import type { BlogPost } from "@/lib/types";

/**
 * The service-city landings a post points readers to (BlogPost.relatedLandings).
 * Server-rendered under the article so each post passes a real, descriptive
 * link to the matching local service page.
 */
export default function BlogRelatedLandings({ post }: { post: BlogPost }) {
  const landings = landingsForPost(post);
  if (landings.length === 0) return null;

  return (
    <LinkSection
      overline="Local service pages"
      heading="Pricing and details for your city"
      description="The service pages this guide refers to, with local price ranges, FAQs and the neighborhoods we cover."
      tone="surface"
      headingId="blog-related-landings-heading"
    >
      <LinkGrid
        links={landings.map((l) => ({
          href: `/${l.slug}`,
          label: l.h1,
          meta: l.priceRange
            ? `Typical range ${l.priceRange}`
            : `${l.city}, ${l.state}`,
        }))}
        columns={landings.length >= 4 ? 4 : 3}
      />
    </LinkSection>
  );
}
