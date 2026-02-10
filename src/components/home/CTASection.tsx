"use client";

import { Phone, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,153,255,0.1)_0%,transparent_60%)]" />

      <Container className="relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 leading-relaxed">
              Whether it&apos;s an emergency or a planned project, our team is
              ready to deliver the quality and reliability that&apos;s made us
              Southwest Florida&apos;s most trusted plumbing company.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                href="/booking"
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
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
              Free estimates &middot; No hidden fees &middot; Satisfaction
              guaranteed
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
