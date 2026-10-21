import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import { landingsForHub } from "@/lib/internal-links";
import { getServiceHub } from "@/lib/service-hubs";

/**
 * City variants of a service hub, for the hand-written hub pages that don't
 * use ServiceLandingTemplate (which already lists them). Server-rendered.
 */
export default function HubCityLinks({
  hub,
  heading,
  description,
  tone = "white",
}: {
  hub: string;
  heading?: string;
  description?: string;
  tone?: "white" | "surface";
}) {
  const pages = landingsForHub(hub);
  const parent = getServiceHub(hub);
  if (pages.length === 0) return null;

  return (
    <LinkSection
      overline="By city"
      heading={heading ?? `${parent?.title ?? "Service"} by city`}
      description={description}
      tone={tone}
      headingId="hub-city-links-heading"
    >
      <LinkGrid
        links={pages.map((p) => ({
          href: `/${p.slug}`,
          label: p.h1,
          meta: `${p.city}, ${p.state}`,
        }))}
      />
    </LinkSection>
  );
}
