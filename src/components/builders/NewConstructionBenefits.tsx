import Container from "@/components/ui/Container";
import Section, { type Tone } from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { Phone } from "@/components/ui/icons";
import { NEW_CONSTRUCTION_BENEFITS } from "@/lib/constants";

/**
 * C&S New Construction Customer Benefits. Shared by the builder pages, the
 * homeowner new-construction / residential pages and the capability
 * statement. Wording comes from NEW_CONSTRUCTION_BENEFITS verbatim — it is
 * deliberately separate from warranty terms.
 *
 * A simple list: each benefit is a row with a 1 px line with who it applies
 * to as the plan label, the title and the terms. `#customer-benefits` stays.
 */
export default function NewConstructionBenefits({
  tone = "white",
  overline = "After the build",
}: {
  /** The section's surface; "surface" is the legacy name of shell. */
  tone?: Tone | "surface";
  overline?: string;
}) {
  const b = NEW_CONSTRUCTION_BENEFITS;
  return (
    <Section
      id="customer-benefits"
      tone={tone === "surface" ? "shell" : tone}
      spacing="sm"
      divider={tone === "white"}
      labelledBy="customer-benefits-heading"
      className="scroll-mt-[calc(var(--nav-h)+0.75rem)]"
    >
      <Container>
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <SectionHeading
            id="customer-benefits-heading"
            overline={overline}
            title={b.heading}
            align="left"
            className="mb-0 lg:col-span-5"
          />
          <div className="lg:col-span-7">
            <ul className="border-b border-rule">
              {b.items.map((item) => (
                <li key={item.id} className="grid gap-y-1.5 border-t border-rule py-5 sm:grid-cols-[11rem_1fr] sm:gap-x-8 sm:py-6">
                  <p className="meta pt-1 text-accent">{item.appliesTo}</p>
                  <div>
                    <h3 className="text-xl leading-snug font-semibold text-fg">{item.title}</h3>
                    <p className="mt-2 max-w-[60ch] text-body">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-body">
              <Phone className="size-5 shrink-0 text-accent" />
              Request your visit:{" "}
              <a
                href={b.contactHref}
                className="inline-flex min-h-11 items-center font-semibold text-link underline-offset-[0.2em] hover:underline"
              >
                {b.contact}
              </a>
            </p>
            <p className="mt-1 text-[0.9375rem] text-muted">Customer benefits are separate from warranty terms.</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
