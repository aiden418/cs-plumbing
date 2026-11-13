"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Phone, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS } from "@/lib/constants";
import { perYear } from "@/lib/pricing";
import { SEASON_COPY, type Season } from "@/lib/claims";

const tierPills = [
  { name: "Coastal Comfort", price: perYear("plan.comfort") },
  { name: "Coastal Shield", price: perYear("plan.shield"), featured: true },
  { name: "Coastal Smart", price: "Call" },
];

export default function CoastalComebackTeaser({ season = "departure" }: { season?: Season }) {
  const copy = SEASON_COPY[season];
  return (
    <section className="relative py-16 sm:py-24 lg:py-28 bg-[#F5F5F7] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/gallery/aerial-waterfront-newbuild.jpg"
          alt="Aerial view of a waterfront Cape Coral new construction home"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-white/85" />
      </div>
      <Container className="relative z-10">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Left: copy */}
            <div>
              <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                {copy.teaserEyebrow}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
                {copy.teaserTitle}
              </h2>
              <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
                {copy.teaserBody}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  href="/coastal-comeback-plan"
                  size="lg"
                  icon={<ShieldCheck className="w-5 h-5" />}
                >
                  See the Plans
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

            {/* Right: tier preview card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
                Annual Plans
              </p>
              <ul className="space-y-3">
                {tierPills.map((t) => (
                  <li key={t.name}>
                    <Link
                      href="/coastal-comeback-plan#plans"
                      className={`group flex items-center justify-between rounded-xl px-4 py-3 sm:px-5 sm:py-4 border card-lift card-lift-hover-subtle ${
                        t.featured
                          ? "bg-primary/5 border-primary/30 hover:border-primary"
                          : "bg-[#F5F5F7] border-gray-200 hover:border-primary/40"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`text-sm sm:text-base font-semibold ${
                            t.featured ? "text-primary" : "text-gray-900"
                          }`}
                        >
                          {t.name}
                        </span>
                        {t.featured && (
                          <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-primary px-2 py-0.5 rounded-full">
                            Best
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-900">
                        {t.price}
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-5 leading-relaxed">
                Cancel anytime. Available across Cape Coral, Fort Myers, Naples,
                Bonita Springs & all of Lee &amp; Collier County.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
