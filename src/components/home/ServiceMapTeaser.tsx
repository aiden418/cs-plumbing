"use client";

import { ArrowRight } from "lucide-react";
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
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1525gJBVH8SRdUNAF-0nemUswy8DmRjo&ehbc=2E312F"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="C&S Plumbing Service Area & Jobs"
                className="w-full min-h-[300px] sm:min-h-[400px]"
              />

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
