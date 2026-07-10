"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Phone, Calendar, ChevronDown, ArrowRight, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion, AnimatePresence } from "framer-motion";
import JobGallery from "@/components/services/JobGallery";
import AnswerBlocks from "@/components/seo/AnswerBlocks";
import { BUSINESS, SERVICE_LANDINGS, AREA_LANDINGS } from "@/lib/constants";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";
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
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-[#F5F5F7] overflow-hidden">
        {landing.image && (
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src={landing.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              quality={85}
            />
            <div className="absolute inset-0 bg-white/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/20" />
          </div>
        )}
        <Container className="relative">
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              {landing.title}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
              {landing.heroText}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
              {landing.description}
            </p>
            {landing.priceRange && (
              <div className="inline-flex flex-wrap items-center gap-3 sm:gap-4 mb-6 px-4 py-3 rounded-xl bg-white/70 border border-gray-200">
                <span className="text-xs sm:text-sm text-gray-500">Typical range:</span>
                <span className="text-base sm:text-lg text-gray-900 font-bold">
                  {landing.priceRange}
                </span>
                <Link
                  href={`/booking?service=${encodeURIComponent(landing.slug)}`}
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
                >
                  Get a Quote <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                href={`/booking?service=${encodeURIComponent(landing.slug)}`}
                size="lg"
                icon={<Calendar className="w-5 h-5" />}
              >
                Book a Service
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

      {/* Quick Answers (AI-citation friendly, FAQ schema) */}
      {landing.answerBlocks && landing.answerBlocks.length > 0 && (
        <AnswerBlocks blocks={landing.answerBlocks} />
      )}

      {/* Features */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
              What We Offer
            </h2>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {landing.features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="bg-[#F5F5F7] rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 hover:border-primary/30 transition-all duration-500"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Highlights */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
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
                <span className="text-gray-600 text-sm">{highlight}</span>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Recent Work Gallery */}
      <JobGallery photos={landing.gallery} serviceTitle={landing.title} />

      {/* Cost Breakdown (optional) */}
      {landing.costBreakdown && landing.costBreakdown.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#F5F5F7]">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 text-center">
                  What it actually costs in SWFL
                </h2>
                <p className="text-sm sm:text-base text-gray-500 text-center mb-8 sm:mb-10">
                  Real ranges from C&S jobs in Lee County. Final price is based on a free in-home assessment.
                </p>
                <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-200 overflow-hidden">
                  {landing.costBreakdown.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-4 sm:p-5"
                    >
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {item.label}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
                        )}
                      </div>
                      <p className="text-sm sm:text-base font-bold text-primary whitespace-nowrap">
                        {item.range}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6 sm:mt-8">
                  <Button
                    href={`/booking?service=${encodeURIComponent(landing.slug)}`}
                    size="lg"
                    icon={<Calendar className="w-5 h-5" />}
                  >
                    Get your exact quote
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Case Studies (optional) */}
      {landing.caseStudies && landing.caseStudies.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Recent {landing.title} jobs
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {landing.caseStudies.map((cs) => (
                <article
                  key={cs.title}
                  className="bg-[#F5F5F7] border border-gray-200 rounded-2xl p-5 sm:p-6"
                >
                  <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                    {cs.cost}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{cs.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {cs.location}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{cs.summary}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {landing.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
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
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Internal Cross-Linking */}
      {(() => {
        const cityPages = SERVICE_CITY_LANDINGS.filter(
          (p) => p.serviceSlug === landing.slug
        );
        const hasRelatedServices = landing.relatedServices && landing.relatedServices.length > 0;
        const hasRelatedAreas = landing.relatedAreas && landing.relatedAreas.length > 0;
        const hasCityPages = cityPages.length > 0;

        if (!hasRelatedServices && !hasRelatedAreas && !hasCityPages) return null;

        return (
          <section className="py-16 sm:py-20 border-t border-gray-200">
            <Container>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
                {hasRelatedServices && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                      Related services
                    </h3>
                    <ul className="space-y-2">
                      {landing.relatedServices!.map((slug) => {
                        const target = SERVICE_LANDINGS.find((s) => s.slug === slug);
                        if (!target) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/services/${slug}`}
                              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                              <ArrowRight className="w-3.5 h-3.5 text-primary" />
                              {target.title}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {hasRelatedAreas && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                      {landing.title} across SWFL
                    </h3>
                    <ul className="space-y-2">
                      {landing.relatedAreas!.map((slug) => {
                        const target = AREA_LANDINGS.find((a) => a.slug === slug);
                        if (!target) return null;
                        return (
                          <li key={slug}>
                            <Link
                              href={`/areas/${slug}`}
                              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                              {target.city}, {target.state}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {hasCityPages && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                      Get local pricing
                    </h3>
                    <ul className="space-y-2">
                      {cityPages.map((page) => (
                        <li key={page.slug}>
                          <Link
                            href={`/${page.slug}`}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {page.h1}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Container>
          </section>
        );
      })()}
    </>
  );
}
