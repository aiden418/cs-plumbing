import FaqAccordion from "@/components/ui/FaqAccordion";
import type { FAQ } from "@/lib/types";

/** The builder FAQ list: the shared FaqAccordion (native <details>, every answer in the HTML). */
export default function FaqAccordionList({ faqs, className }: { faqs: FAQ[]; className?: string }) {
  return <FaqAccordion faqs={faqs} className={className} />;
}
