import { LinkGrid } from "@/components/links/LinkGrid";
import LinkBlock from "@/components/links/LinkBlock";
import type { Tone } from "@/components/ui/Section";
import { NEW_CONSTRUCTION_CITIES } from "@/lib/builder-program";

/**
 * The seven builder-door city pages, for the /services/new-construction hub.
 * /builders already lists them; this gives each a second crawlable parent.
 */
export default function NewConstructionCityLinks({
  tone = "white",
}: {
  /** "surface" is the legacy name of shell. */
  tone?: Tone | "surface";
}) {
  return (
    <LinkBlock
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
    </LinkBlock>
  );
}
