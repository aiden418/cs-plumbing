"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

export default function ServiceMapTeaser() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
      <Container>
        <ScrollReveal>
          <SectionHeading
            overline="Where We Work"
            title="See Our Service Area"
            subtitle="From Cape Coral to Naples, we've completed thousands of jobs across Southwest Florida. Explore our service map to see where we work."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Map placeholder — will be replaced with Google My Maps embed */}
              <div className="relative aspect-[16/9] sm:aspect-[2/1] bg-gray-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-gray-900 font-bold text-lg sm:text-xl mb-2">
                    Interactive Service Map
                  </p>
                  <p className="text-gray-500 text-sm max-w-md">
                    View our past, present, and future job locations across Lee &amp; Collier County
                  </p>
                </div>
              </div>

              {/* Bottom bar with stats + CTA */}
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {BUSINESS.homesCompleted.toLocaleString()}+ jobs completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Lee &amp; Collier County
                  </span>
                </div>
                <Button
                  href="/service-map"
                  variant="secondary"
                  size="sm"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View Full Map
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
