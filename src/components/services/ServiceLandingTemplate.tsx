"use client";

import { useState } from "react";
import { Check, Phone, Calendar, ChevronDown } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion, AnimatePresence } from "framer-motion";
import { BUSINESS } from "@/lib/constants";
import type { ServiceLanding } from "@/lib/types";

export default function ServiceLandingTemplate({
  landing,
}: {
  landing: ServiceLanding;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              {landing.title}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              {landing.heroText}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-6 sm:mb-8">
              {landing.description}
            </p>
            {landing.priceRange && (
              <p className="text-sm text-gray-500 mb-6">
                Typical price range:{" "}
                <span className="text-white font-semibold">
                  {landing.priceRange}
                </span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                href="/booking"
                size="lg"
                icon={<Calendar className="w-5 h-5" />}
              >
                Book This Service
              </Button>
              <Button
                href={`tel:${BUSINESS.phoneRaw}`}
                variant="secondary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
              >
                Call {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-12">
              What We Offer
            </h2>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {landing.features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 lg:p-8 hover:border-primary/20 transition-all duration-500"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Highlights */}
      <section className="py-16 sm:py-24 lg:py-32 bg-surface">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-12">
                Why Choose C&S for {landing.title}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {landing.highlights.map((highlight) => (
              <motion.div
                key={highlight}
                variants={staggerItem}
                className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                </div>
                <span className="text-gray-300 text-sm">{highlight}</span>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {landing.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-surface rounded-xl border border-white/5 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                    >
                      <span className="text-sm sm:text-base font-medium text-white pr-4">
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
                          <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-400 text-xs sm:text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
