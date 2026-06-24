import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import type { FAQ } from "@/lib/types";

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
      "Yes. We hold two active Florida Certified Plumbing Contractor licenses (CFC1432485 and CFC057076) and carry full general liability and workers' comp insurance. We pull every required permit and pass every inspection — no exceptions.",
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
      "Yes. C&S is one of Southwest Florida's most experienced new-construction plumbers, with 8,500+ homes completed since 1997 for residential and commercial builders across Lee, Charlotte, and Collier counties.",
  },
];

export default function HomeFaq() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white">
      <Container>
        <SectionHeading
          overline="FAQ"
          title="Common Questions"
          subtitle="Quick answers about service, coverage, and what to expect from C&S Plumbing of Lee."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-7 sm:grid-cols-2 sm:mt-12">
          {HOME_FAQS.map((f) => (
            <div key={f.question}>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {f.question}
              </h3>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-500">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
