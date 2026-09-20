"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  faqs: { question: string; answer: string }[];
  className?: string;
}

/**
 * Shared FAQ accordion — extracted from ServiceLandingTemplate so the faq
 * page and all landing templates render the same interaction. FAQ JSON-LD
 * stays in the server page.tsx (FaqJsonLd); this is presentation only.
 *
 * Answers are always in the DOM (collapsed with a CSS grid-rows transition)
 * so the visible page matches the FAQPage schema and crawlers can read them.
 */
export default function FaqAccordion({ faqs, className }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      {faqs.map((faq, index) => {
        const open = openFaq === index;
        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(open ? null : index)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
            >
              <span className="text-sm sm:text-base font-semibold text-gray-900 pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300",
                  open && "rotate-180",
                )}
              />
            </button>
            <div
              id={`faq-panel-${index}`}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              {/* `hidden="until-found"` would be ideal, but visibility keeps
                  collapsed answers out of the tab order and screen readers
                  while leaving the text in the HTML. */}
              <div className={cn("overflow-hidden", !open && "invisible")}>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
