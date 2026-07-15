"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  faqs: { question: string; answer: string }[];
  className?: string;
}

/**
 * Shared FAQ accordion — extracted from ServiceLandingTemplate so the faq
 * page and all landing templates render the same interaction. FAQ JSON-LD
 * stays in the server page.tsx (FaqJsonLd); this is presentation only.
 */
export default function FaqAccordion({ faqs, className }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className={cn("space-y-3", className)}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setOpenFaq(openFaq === index ? null : index)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 transition-colors"
            aria-expanded={openFaq === index}
          >
            <span className="text-sm sm:text-base font-semibold text-gray-900 pr-4">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                openFaq === index ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openFaq === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
