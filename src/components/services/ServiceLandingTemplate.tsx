"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Phone, Calendar, ArrowRight, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import JobGallery from "@/components/services/JobGallery";
import AnswerBlocks from "@/components/seo/AnswerBlocks";
import { BUSINESS, SERVICE_LANDINGS, AREA_LANDINGS } from "@/lib/constants";
import { trackPhoneClick } from "@/lib/pixel";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";
import type { ServiceLanding } from "@/lib/types";

export default function ServiceLandingTemplate({
  landing,
}: {
  landing: ServiceLanding;
}) {
  return (
    <>
      {/* Hero */}
      <PageHero
        overline={landing.title}
        title={landing.heroText}
        description={landing.description}
        media={
          landing.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={landing.image}
                alt={landing.title}
                fill
                priority
                quality={85}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
            </div>
          ) : undefined
        }
        actions={
          <>
            <Button
              href={`/booking?service=${encodeURIComponent(landing.slug)}`}
              variant="gold"
              size="lg"
              icon={<Calendar className="w-5 h-5" />}
            >
              Book a Service
            </Button>
            <Button
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={trackPhoneClick}
              variant="outline-light"
              size="lg"
              icon={<Phone className="w-5 h-5" />}
            >
              Call {BUSINESS.phone}
            </Button>
          </>
        }
      >
        {landing.priceRange && (
          <div className="mt-6 inline-flex flex-wrap items-center gap-3 sm:gap-4 px-4 py-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur">
            <span className="text-xs sm:text-sm text-white/60">Typical range:</span>
            <span className="text-base sm:text-lg text-white font-bold">
              {landing.priceRange}
            </span>
            <Link
              href={`/booking?service=${encodeURIComponent(landing.slug)}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-gold hover:underline"
            >
              Get a Quote <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </PageHero>

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
                className="bg-[#F5F5F7] rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 card-lift card-lift-hover-subtle hover:border-primary/30"
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
              <FaqAccordion faqs={landing.faqs} />
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
