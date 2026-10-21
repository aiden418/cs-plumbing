import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import { NEW_CONSTRUCTION_CITIES } from "@/lib/builder-program";

/**
 * The seven builder-door city pages, for the /services/new-construction hub.
 * /builders already lists them; this gives each a second crawlable parent.
 */
export default function NewConstructionCityLinks({
  tone = "white",
}: {
  tone?: "white" | "surface";
}) {
  return (
    <LinkSection
      overline="By city"
      heading="New construction plumbing by city"
      description="Builder-facing pages for each city we serve, with local notes, FAQs and the plan-submission form."
      tone={tone}
      headingId="new-construction-city-links-heading"
    >
      <LinkGrid
        links={NEW_CONSTRUCTION_CITIES.map((c) => ({
          href: `/new-construction-plumbing/${c.slug}`,
          label: `New Construction Plumbing in ${c.city}, FL`,
          meta: `${c.county} County`,
        }))}
        columns={4}
      />
    </LinkSection>
  );
}
