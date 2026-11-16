import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { ArrowRight } from "@/components/ui/icons";
import { faq } from "@/content/home";
import type { FAQ } from "@/lib/types";
import { BUSINESS } from "@/lib/business";

export const HOME_FAQS: FAQ[] = [
  {
    question: "Do you offer 24/7 emergency plumbing service?",
    answer:
      "Yes. We're available around the clock for burst pipes, slab leaks, sewage backups, and other plumbing emergencies across Southwest Florida — day, night, weekends, and holidays.",
  },
  {
    question: "What areas does C&S Plumbing serve?",
    answer:
      "We serve Cape Coral, Fort Myers, North Fort Myers, Lehigh Acres, Punta Gorda, Port Charlotte, Naples, Bonita Springs, Estero, Sanibel, and the surrounding Lee, Charlotte, and Collier County communities.",
  },
  {
    question: "Is C&S Plumbing licensed and insured?",
    answer:
      `Yes. We work under Florida Certified Plumbing Contractor license ${BUSINESS.license} and carry full general liability and workers' comp insurance. We pull every required permit and pass every inspection — no exceptions.`,
  },
  {
    question: "What plumbing services do you offer?",
    answer:
      "Everything from service calls and drain cleaning to water heaters, whole-home repipes, water softeners, and kitchen and bathroom remodels — plus full residential and commercial new construction. If it's plumbing, we cover it.",
  },
  {
    question: "How much does a plumber cost in Cape Coral and Fort Myers?",
    answer:
      "It depends on the job, but you'll always get an upfront price before any work starts — no surprises. We offer free estimates on larger work like repipes, water heaters, and new construction.",
  },
  {
    question: "Do you handle new construction plumbing for builders?",
    answer:
      "Yes. C&S is one of Southwest Florida's most experienced new-construction plumbers, with 9,500+ homes plumbed since 1998 for residential and commercial builders across Lee, Charlotte, and Collier counties.",
  },
];

/** The home FAQ as a native accordion: every answer is in the HTML. The FAQPage JSON-LD stays in page.tsx. */
export default function HomeFaq() {
  return (
    <div>
      <Eyebrow className="mb-4">{faq.overline}</Eyebrow>
      <h2 id="home-faq-title" className="font-display text-display-sm font-bold text-fg [font-stretch:108%]">
        {faq.title}
      </h2>
      <p className="mt-4 max-w-[56ch] text-body">{faq.subtitle}</p>
      <FaqAccordion faqs={HOME_FAQS} name="home-faq" className="mt-8" />
      <p className="mt-6">
        <Link
          href={faq.allLink.href}
          className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
        >
          {faq.allLink.label}
          <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </Link>
      </p>
    </div>
  );
}
