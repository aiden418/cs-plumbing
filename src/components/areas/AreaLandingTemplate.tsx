"use client";

import { Phone, Calendar, MapPin, Check } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import { BUSINESS, SERVICES } from "@/lib/constants";
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
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              <MapPin className="w-3.5 h-3.5" />
              {landing.city}, {landing.state}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              {landing.heroText}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-6 sm:mb-8">
              {landing.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                href="/booking"
                size="lg"
                icon={<Calendar className="w-5 h-5" />}
              >
                Book a Plumber
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

      {/* Services Available */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
              Plumbing Services in {landing.city}
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl">
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
                className="bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 hover:border-primary/20 transition-all duration-500 block"
              >
                <h3 className="text-lg font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3">
                  {service.description}
                </p>
                {service.features && (
                  <ul className="space-y-1.5">
                    {service.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-xs text-gray-300"
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
      <section className="py-16 sm:py-24 lg:py-32 bg-surface">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">
                Serving {landing.city} Since 1997
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
                {landing.localContext}
              </p>

              {landing.neighborhoods && landing.neighborhoods.length > 0 && (
                <>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                    Neighborhoods We Serve in {landing.city}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {landing.neighborhoods.map((neighborhood) => (
                      <span
                        key={neighborhood}
                        className="px-3 py-1.5 bg-white/5 rounded-full text-xs sm:text-sm text-gray-300 border border-white/5"
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

      {/* Why Choose C&S */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8 sm:mb-12">
                Why {landing.city} Trusts C&S Plumbing
              </h2>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {[
              "Family-owned since 1997",
              "8,500+ homes completed",
              "24/7 emergency service",
              "Licensed & insured (CFC1430355)",
              "5.0-star Google rating",
              "Upfront, transparent pricing",
              "Same-day service available",
              "All work permitted & inspected",
              `Fast response to ${landing.city}`,
            ].map((highlight) => (
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
    </>
  );
}
