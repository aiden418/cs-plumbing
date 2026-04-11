import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { Phone, Calendar } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/service-map" },
  title: "Service Map",
  description:
    "Explore C&S Plumbing's service area across Southwest Florida. View our past, present, and future job locations in Cape Coral, Fort Myers, Naples & beyond.",
  keywords: [
    "plumber service area Cape Coral",
    "plumber near me SWFL",
    "plumbing service area Fort Myers",
    "C&S Plumbing locations",
    "Southwest Florida plumber map",
  ],
  openGraph: {
    title: "Service Map | C&S Plumbing of Lee County",
    description:
      "8,500+ jobs completed across Southwest Florida. See our service area and job locations.",
    url: "https://www.csplumbinglee.com/service-map",
  },
};

export default function ServiceMapPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-[#F5F5F7]">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Service Area
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
              Where We <span className="text-gradient">Work</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
              With over {BUSINESS.homesCompleted.toLocaleString()} jobs completed, C&S Plumbing serves all of
              Southwest Florida — from Cape Coral and Fort Myers to Naples,
              Bonita Springs, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
          </div>
        </Container>
      </section>

      {/* Map Embed */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1525gJBVH8SRdUNAF-0nemUswy8DmRjo&ehbc=2E312F"
                width="100%"
                height="600"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="C&S Plumbing Service Area & Jobs"
                className="w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]"
              />
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Service Map", href: "/service-map" },
        ]}
      />
      <CTASection />
    </PageTransition>
  );
}
