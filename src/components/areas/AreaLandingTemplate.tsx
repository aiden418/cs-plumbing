"use client";

import { Phone, Calendar, MapPin, Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import CityProofBlock from "@/components/areas/CityProofBlock";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import AreaServiceJsonLd from "@/components/seo/AreaServiceJsonLd";
import { motion } from "framer-motion";
import Link from "next/link";
import { BUSINESS, SERVICES, TRUST_PROOF_POINTS } from "@/lib/constants";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";
import type { AreaLanding } from "@/lib/types";

export default function AreaLandingTemplate({
  landing,
}: {
  landing: AreaLanding;
}) {
  const displayServices = SERVICES.filter(
    (s) => s.id !== "commercial" && s.id !== "new-construction"
  );

  return (
    <>
      <AreaServiceJsonLd landing={landing} />
      {landing.faqs && landing.faqs.length > 0 && (
        <FaqJsonLd faqs={landing.faqs} />
      )}
      {/* Hero */}
      <PageHero
        size="sm"
        overline={`${landing.city}, ${landing.state}`}
        overlineIcon={<MapPin className="w-3.5 h-3.5" />}
        title={landing.heroText}
        description={landing.description}
        actions={
          <>
            <Button
              href="/booking"
              variant="gold"
              size="lg"
              icon={<Calendar className="w-5 h-5" />}
            >
              Book a Plumber
            </Button>
            <Button
              href={`tel:${BUSINESS.phoneRaw}`}
              variant="outline-light"
              size="lg"
              icon={<Phone className="w-5 h-5" />}
            >
              Call {BUSINESS.phone}
            </Button>
          </>
        }
      />

      {/* Services Available */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Plumbing Services in {landing.city}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl">
              Full-service residential and commercial plumbing for{" "}
              {landing.city} homes and businesses.
            </p>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayServices.map((service) => (
              <motion.a
                key={service.id}
                href={service.href}
                variants={staggerItem}
                className="bg-[#F5F5F7] rounded-2xl border border-gray-200 p-5 sm:p-6 card-lift card-lift-hover-subtle hover:border-primary/30 block"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3">
                  {service.description}
                </p>
                {service.features && (
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
                        <Check className="w-3 h-3 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.a>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Local Context */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Serving {landing.city} Since 1998
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                {landing.localContext}
              </p>

              {landing.neighborhoods && landing.neighborhoods.length > 0 && (
                <>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Neighborhoods We Serve in {landing.city}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {landing.neighborhoods.map((neighborhood) => (
                      <span
                        key={neighborhood}
                        className="px-3 py-1.5 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-600 border border-gray-200"
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

      {/* Major-project proof for this city */}
      <CityProofBlock cityName={landing.city} />

      {/* Popular Service+City Pages */}
      {(() => {
        const cityPages = SERVICE_CITY_LANDINGS.filter(
          (p) => p.city === landing.city
        );
        if (cityPages.length === 0) return null;
        return (
          <section className="py-16 sm:py-24 lg:py-32">
            <Container>
              <ScrollReveal>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Popular Services in {landing.city}
                </h2>
                <p className="text-gray-500 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl">
                  Dedicated pages with local pricing, FAQs, and details for {landing.city} homeowners.
                </p>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {cityPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${page.slug}`}
                    className="flex items-center gap-3 bg-[#F5F5F7] rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-primary/30 transition-all duration-300"
                  >
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">
                      {page.h1}
                    </span>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        );
      })()}

      {/* Why Choose C&S */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
                Why {landing.city} Trusts C&S Plumbing
              </h2>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[...TRUST_PROOF_POINTS, `Fast response to ${landing.city}`].map((highlight) => (
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

      {/* City FAQ */}
      {landing.faqs && landing.faqs.length > 0 && (
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
          <Container>
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 sm:mb-16">
                  <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                    FAQ
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {landing.city} Plumbing Questions
                  </h2>
                </div>
                <FaqAccordion faqs={landing.faqs} />
              </div>
            </ScrollReveal>
          </Container>
        </section>
      )}
    </>
  );
}
