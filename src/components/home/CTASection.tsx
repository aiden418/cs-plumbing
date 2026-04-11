"use client";

import Image from "next/image";
import { Phone, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { BUSINESS } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/team/team-work-1.jpg"
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-white/75" />
      </div>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-primary/5 to-white/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,119,204,0.06)_0%,transparent_60%)]" />

      <Container className="relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 leading-relaxed">
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
