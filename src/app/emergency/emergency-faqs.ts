import { EMERGENCY_CLAIMS } from "@/lib/constants";
import type { FAQ } from "@/lib/types";

// Co-located route FAQs (same pattern as builders/builder-faqs.ts).
// Rendered by EmergencyPage and emitted as FAQPage schema in page.tsx —
// answers interpolate EMERGENCY_CLAIMS so visible text always matches schema.
export const EMERGENCY_FAQS: FAQ[] = [
  {
    question: "What counts as a plumbing emergency?",
    answer:
      "Anything where water, sewage, or gas is actively causing damage or risk: burst pipes, a main sewer line backing up into the home, sewage overflow, major leaks through ceilings or walls, a failed water heater flooding the garage, or no water to the house. If you smell gas, leave the building and call 911 first — then call us. When in doubt, call; a dispatcher will tell you honestly whether it can wait for business hours.",
  },
  {
    question: "How fast can you actually get here?",
    answer: `Response time is ${EMERGENCY_CLAIMS.responseTime} across our Lee County core — Cape Coral, Fort Myers, and North Fort Myers — where trucks are staged. Farther areas like Naples, Punta Gorda, and Sanibel can run toward the top of that window depending on time of night and bridge traffic.`,
  },
  {
    question: "Do you charge extra for nights, weekends, or holidays?",
    answer: `We're upfront about this: ${EMERGENCY_CLAIMS.afterHoursPricing} You'll never get an inflated "emergency rate" on the work itself, and you approve the full written price before we start.`,
  },
  {
    question: "Is it really 24/7 — will a person answer at 3am?",
    answer:
      "Yes. The emergency line is answered around the clock, every day of the year, by a real C&S dispatcher — not an answering service that takes a message for the morning. We confirm your address, talk you through immediate steps like shutting off the main valve, and get a crew rolling.",
  },
  {
    question: "Which areas do you cover overnight?",
    answer:
      "All of our Southwest Florida service area, 24/7: Cape Coral, Fort Myers, North Fort Myers, Lehigh Acres, Bonita Springs, Naples, Punta Gorda, Port Charlotte, and Sanibel Island.",
  },
  {
    question: "What should I do before your crew arrives?",
    answer:
      "Shut off the main water valve (usually near the water meter at the street or on an exterior wall — turn it clockwise), switch off the water heater if the water supply is off, and move valuables away from standing water. Don't run electrical appliances near water, and don't try to clean up sewage yourself — it's a health hazard we handle with proper equipment.",
  },
];
