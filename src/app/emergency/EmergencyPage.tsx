"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, AlertTriangle, Clock, Droplets, Flame, Bug, ShowerHead, MessageSquareText, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import PageTransition from "@/components/layout/PageTransition";
import ScrollReveal from "@/components/animations/ScrollReveal";
import WhatHappensNext from "@/components/ui/WhatHappensNext";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { BUSINESS, EMERGENCY_CLAIMS } from "@/lib/constants";
import { EMERGENCY_FAQS } from "./emergency-faqs";

const emergencyTypes = [
  { icon: <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Burst Pipes", description: "Water spraying? Shut off your main water valve and call us immediately." },
  { icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Sewage Backup", description: "Sewage in your home is a health hazard. Don't try to clean it yourself." },
  { icon: <Flame className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Gas Leak", description: "Smell gas? Leave the house immediately, call 911 first, then call us." },
  { icon: <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Major Water Leak", description: "Ceiling leaking, wall damage, or flooding? Time is critical — call now." },
  { icon: <ShowerHead className="w-5 h-5 sm:w-6 sm:h-6" />, title: "No Hot Water", description: "Complete loss of hot water could mean a failed water heater. We can help today." },
  { icon: <Bug className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Clogged Sewer Line", description: "Multiple drains backing up at once? Your main sewer line may be blocked." },
];

const tips = [
  "Shut off your main water valve to stop flooding",
  "Turn off your water heater if there's no water supply",
  "Open cabinets under sinks to check for leaks",
  "If you smell gas, leave the building and call 911",
  "Move valuables away from standing water",
  "Don't use electrical appliances near standing water",
];

export default function EmergencyPage({
  emergencyCities,
}: {
  emergencyCities: { slug: string; city: string; state: string }[];
}) {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 overflow-hidden bg-navy">
        <div className="pointer-events-none absolute -top-32 left-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emergency/15 blur-[100px]" />

        <Container className="relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emergency/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-emergency">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-emergency" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block text-emergency text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4">
                Plumbing Emergency?
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-6">
                We&apos;re Here <span className="text-emergency">24/7</span>
              </h1>
              <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 px-2">
                Don&apos;t wait. Every minute counts in a plumbing emergency.
                Call us now and we&apos;ll be on our way.
              </p>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-emergency hover:bg-red-600 text-white text-base sm:text-xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,59,48,0.3)] active:scale-[0.98]"
            >
              <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              Call {BUSINESS.phone}
            </motion.a>

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              href={BUSINESS.smsHref}
              className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white/70 hover:text-white transition-colors"
            >
              <MessageSquareText className="w-4 h-4" />
              Can&apos;t talk? Text us instead
            </motion.a>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-white/60"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Response time: {EMERGENCY_CLAIMS.responseTime}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Emergency Types */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
              Common Plumbing Emergencies
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {emergencyTypes.map((type, i) => (
              <ScrollReveal key={type.title} delay={i * 0.08}>
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200 card-lift card-lift-hover-subtle hover:border-emergency/30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emergency/10 flex items-center justify-center text-emergency mb-3 sm:mb-4">
                    {type.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Tips While Waiting */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container size="narrow">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                While You Wait
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Quick steps you can take to minimize damage before we arrive.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-3 sm:space-y-4">
            {tips.map((tip, i) => (
              <ScrollReveal key={tip} delay={i * 0.05}>
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#F5F5F7] border border-gray-200">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-xs sm:text-sm font-bold">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm">{tip}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal>
            <div className="mt-10 sm:mt-16 text-center">
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                Remember: call us first, then take these steps.
              </p>
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-emergency hover:bg-red-600 text-white text-base sm:text-lg font-bold rounded-xl transition-all duration-300"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                {BUSINESS.phone}
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Emergency FAQ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container size="narrow">
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Emergency Plumbing FAQs
              </h2>
              <p className="text-sm sm:text-base text-gray-500">
                Straight answers on response times, after-hours pricing, and
                what to do right now.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <FaqAccordion faqs={EMERGENCY_FAQS} />
          </ScrollReveal>
        </Container>
      </section>

      {/* 24/7 Coverage Areas */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Areas We Cover 24/7
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
                Night or day, these Southwest Florida communities get the same
                emergency response. Tap your city for local details.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {emergencyCities.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 0.04}>
                <Link
                  href={`/${c.slug}`}
                  className="flex items-center gap-2 p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200 card-lift card-lift-hover-subtle hover:border-emergency/30 text-sm sm:text-base font-semibold text-gray-900"
                >
                  <MapPin className="w-4 h-4 text-emergency flex-shrink-0" />
                  {c.city}
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <WhatHappensNext
        title="What happens when you call us"
        steps={[
          {
            title: "Call us 24/7",
            description:
              "A real dispatcher answers — not a call center. We confirm your address and get the right crew rolling.",
          },
          {
            title: "Tech dispatched fast",
            description: `Lee County trucks are staged across the service area. Arrival is ${EMERGENCY_CLAIMS.responseTime}.`,
          },
          {
            title: "Quote before we work",
            description: `Written price for the repair before anything starts. After-hours calls carry a ${EMERGENCY_CLAIMS.afterHoursSurcharge} surcharge — it's in the quote, never a surprise.`,
          },
          {
            title: "Same-visit repair",
            description:
              "Trucks carry parts for burst pipes, leaks, water heater failures, and drain backups. We finish what we start.",
          },
        ]}
      />
    </PageTransition>
  );
}
