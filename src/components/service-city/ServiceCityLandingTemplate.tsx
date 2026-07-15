"use client";

import { Check, Phone, Calendar, MapPin, Shield, Star, Award, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import { BUSINESS } from "@/lib/constants";
import { trackPhoneClick } from "@/lib/pixel";
import type { ServiceCityLanding } from "@/lib/types";

const TRUST_ICONS = [Shield, Award, Star, Check];

export default function ServiceCityLandingTemplate({
  landing,
}: {
  landing: ServiceCityLanding;
}) {
  return (
    <>
      {/* Hero — Above the Fold */}
      <PageHero
        size="sm"
        overline={`${landing.city}, ${landing.state}`}
        overlineIcon={<MapPin className="w-3.5 h-3.5" />}
        title={landing.h1}
        description={landing.heroSubtext}
        actions={
          <>
            <Button
              href={`tel:${BUSINESS.phoneRaw}`}
              onClick={trackPhoneClick}
              variant="gold"
              size="lg"
              icon={<Phone className="w-5 h-5" />}
            >
              Call Now — {BUSINESS.phone}
            </Button>
            <Button
              href="/booking"
              variant="outline-light"
              size="lg"
              icon={<Calendar className="w-5 h-5" />}
            >
              Book Online
            </Button>
          </>
        }
      >
        {landing.priceRange && (
          <p className="mt-5 text-sm text-white/60">
            Typical price range:{" "}
            <span className="text-white font-semibold">
              {landing.priceRange}
            </span>
          </p>
        )}
        <p className="mt-4 text-xs text-white/40">
          Serving {landing.city} since 1998 · License #CFC057076 · #CFC1432485
        </p>
      </PageHero>

      {/* Trust Block */}
      <section className="py-6 sm:py-8 border-b border-gray-100">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {landing.trustBadges.map((badge, i) => {
              const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{badge}</span>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Service Description — Main SEO Content Block */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                {landing.sectionHeading ??
                  `Plumbing services in ${landing.city}, ${landing.state}`}
              </h2>
              <div className="prose prose-gray max-w-none">
                {landing.serviceDescription.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
              What We Offer in {landing.city}
            </h2>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {landing.features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 card-lift card-lift-hover-subtle hover:border-primary/30"
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

      {/* Neighborhoods / Service Area */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Serving All of {landing.city}, {landing.state}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                C&S Plumbing proudly serves {landing.city} and the surrounding areas. Whether you&apos;re in the heart of the city or a nearby neighborhood, our licensed plumbers are just a call away.
              </p>

              {landing.neighborhoods.length > 0 && (
                <>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Neighborhoods We Serve in {landing.city}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {landing.neighborhoods.map((neighborhood) => (
                      <span
                        key={neighborhood}
                        className="px-3 py-1.5 bg-[#F5F5F7] rounded-full text-xs sm:text-sm text-gray-600 border border-gray-200"
                      >
                        {neighborhood}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* FAQ Accordion */}
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

      {/* Related Pages */}
      {landing.relatedPages.length > 0 && (
        <section className="py-16 sm:py-24 lg:py-32">
          <Container>
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                  Related Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {landing.relatedPages.map((page) => (
                    <a
                      key={page.href}
                      href={page.href}
                      className="flex items-center justify-between gap-3 bg-[#F5F5F7] rounded-xl border border-gray-200 p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-300 group"
                    >
                      <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">
                        {page.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}
    </>
  );
}
