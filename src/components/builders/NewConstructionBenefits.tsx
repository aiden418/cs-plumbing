import { BadgePercent, CalendarCheck, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { NEW_CONSTRUCTION_BENEFITS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  "lifetime-discount": <BadgePercent className="h-6 w-6" />,
  "first-year-visit": <CalendarCheck className="h-6 w-6" />,
};

/**
 * C&S New Construction Customer Benefits. Shared by the builder pages, the
 * homeowner new-construction / residential pages and the capability
 * statement. Wording comes from NEW_CONSTRUCTION_BENEFITS verbatim — it is
 * deliberately separate from warranty terms.
 */
export default function NewConstructionBenefits({
  tone = "white",
  overline = "After the build",
}: {
  tone?: "white" | "surface";
  overline?: string;
}) {
  const b = NEW_CONSTRUCTION_BENEFITS;
  return (
    <section
      id="customer-benefits"
      className={cn("scroll-mt-24 py-16 sm:py-24", tone === "surface" ? "bg-[#F5F5F7]" : "bg-white")}
    >
      <Container>
        <SectionHeading overline={overline} title={b.heading} />
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {b.items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border border-gray-200 p-6 sm:p-7",
                tone === "surface" ? "bg-white" : "bg-[#F5F5F7]"
              )}
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {ICONS[item.id]}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-navy">
                {item.appliesTo}
              </span>
              <h3 className="mt-1 text-lg font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-gray-500">
          <Phone className="h-4 w-4 text-primary" />
          Request your visit:{" "}
          <a href={`tel:${b.contactRaw}`} className="font-semibold text-primary hover:underline">
            {b.contact}
          </a>
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          Customer benefits are separate from warranty terms.
        </p>
      </Container>
    </section>
  );
}
