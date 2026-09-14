import type { FAQ } from "@/lib/types";
import { AWARDS, LATEST_AWARD } from "@/lib/constants";

// Co-located route FAQs (same pattern as services/residential/residential-faqs.ts).
// Written for this page — about the award itself, not the /faq bank — so the
// two FAQPage schemas don't duplicate each other. Facts are pulled from AWARDS
// so an answer can't drift from the cards above it.
export const AWARDS_FAQS: FAQ[] = [
  {
    question: "What is Best of Cape Coral?",
    answer: `Best of Cape Coral is the ${LATEST_AWARD.issuer}'s annual readership voting contest. Each year, readers nominate and vote for the local businesses they trust, category by category, and the Breeze publishes the winners in its Best of Cape Coral Winners Book each fall.`,
  },
  {
    question: "What has C&S Plumbing won?",
    answer: AWARDS.map((a) => `${a.year}: ${a.title} — ${a.category}.`).join(" ") +
      ` Both were voted by ${LATEST_AWARD.issuer} readers.`,
  },
  {
    question: "How are Best of Cape Coral winners chosen?",
    answer: `Winners are decided by reader votes collected by the ${LATEST_AWARD.issuer} during its annual voting period, which opens each August. The category with the most reader votes wins — there is no judging panel.`,
  },
  {
    question: "How can I verify these awards and C&S's credentials?",
    answer: `The ${LATEST_AWARD.issuer} publishes its Best of Cape Coral winners each year. Separately, both of our Florida Certified Plumbing Contractor licenses (CFC1432485 and CFC057076) can be checked on the DBPR's MyFloridaLicense.com, and our Google rating and reviews are public on our reviews page.`,
  },
];
