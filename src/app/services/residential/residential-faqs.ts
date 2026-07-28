import type { FAQ } from "@/lib/types";

// Co-located route FAQs (same pattern as builders/builder-faqs.ts and
// emergency/emergency-faqs.ts). Written for this page — not copied from the
// /faq bank, so the two FAQPage schemas don't duplicate each other.
export const RESIDENTIAL_FAQS: FAQ[] = [
  {
    question: "Do you handle small residential jobs, or only big projects?",
    answer:
      "Both. The same licensed techs who repipe entire homes also fix dripping faucets, running toilets, garbage disposals, and slow drains. No job is too small — most of our 5-star reviews come from everyday service calls.",
  },
  {
    question: "Can I get same-day plumbing service?",
    answer:
      "Usually, yes. Calls that reach us in the morning are typically handled the same day across Cape Coral, Fort Myers, and North Fort Myers. True emergencies — burst pipes, sewage backups, no water — are dispatched 24/7 through 833-PLUMB-IT.",
  },
  {
    question: "What does a residential service call cost?",
    answer:
      "Every job gets an upfront written price before work begins. Common fixture repairs start around $125, drain clearing runs $150–$250 for a single fixture, and larger projects like water heaters or repipes get a free estimate with itemized pricing.",
  },
  {
    question: "Are your plumbers licensed and background-checked?",
    answer:
      "Yes. C&S Plumbing of Lee is a Florida Certified Plumbing Contractor (CFC1432485, CFC057076), fully insured, and every technician who enters your home is background-checked. All permit-required work is permitted and inspected.",
  },
  {
    question: "Which areas do you serve for residential plumbing?",
    answer:
      "All of Lee County — Cape Coral, Fort Myers, North Fort Myers, Lehigh Acres, Estero, Bonita Springs, Sanibel — plus Naples in Collier County and Punta Gorda and Port Charlotte in Charlotte County.",
  },
];
