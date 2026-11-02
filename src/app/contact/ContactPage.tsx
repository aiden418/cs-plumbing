"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import WhatHappensNext from "@/components/ui/WhatHappensNext";
import ServiceRequestForm from "@/components/services/ServiceRequestForm";
import { BUSINESS } from "@/lib/constants";

export default function ContactPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        align="center"
        overline="Contact Us"
        title="Let's Talk"
        accent="Plumbing"
        description="Have a question, need a quote, or facing an emergency? We're here to help."
      />

      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 sm:gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Get in Touch
                </h2>

                <div className="space-y-5 sm:space-y-6">
                  <a
                    href={`tel:${BUSINESS.phoneRaw}`}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Phone</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {BUSINESS.phone}
                      </p>
                      <p className="text-primary text-[10px] sm:text-xs mt-1">
                        Available 24/7 for emergencies
                      </p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Email</p>
                      <p className="text-gray-500 text-xs sm:text-sm">{BUSINESS.email}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Office</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {BUSINESS.address}
                        <br />
                        {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
                      </p>
                      {/* Visible copy of the identity statement in JSON-LD and
                          llms.txt: stale directories still list a Cape Coral
                          address, one of them as "permanently closed". */}
                      <p className="mt-2 text-gray-500 text-xs leading-relaxed max-w-xs">
                        Our only office. Listings showing an older Cape Coral
                        address refer to our former location — we&apos;re open
                        and operating from North Fort Myers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm sm:text-base">Hours</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {BUSINESS.hours.weekday}
                        <br />
                        {BUSINESS.hours.saturday}
                        <br />
                        <span className="text-primary">
                          {BUSINESS.hours.emergency}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="right">
                <ServiceRequestForm />
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      <WhatHappensNext
        steps={[
          {
            title: "Send your message",
            description:
              "Use the form, email, or call. Tell us what you need — we route it to the right person on our team.",
          },
          {
            title: "Reply within 1 business day",
            description:
              "Most messages get a response within a few hours during business hours. Urgent? Call 833-PLUMB-IT.",
          },
          {
            title: "Free site visit if needed",
            description:
              "For quotes that need eyes on the work, we'll set up a no-charge visit at a time that fits your schedule.",
          },
          {
            title: "Written estimate",
            description:
              "Clear scope, fair price, no pressure. You decide if and when to schedule the work.",
          },
        ]}
      />
    </PageTransition>
  );
}
