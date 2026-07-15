import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
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
    title: "Service Map | C&S Plumbing of Lee",
    description:
      "8,500+ jobs completed across Southwest Florida. See our service area and job locations.",
    url: "https://www.csplumbinglee.com/service-map",
  },
};

export default function ServiceMapPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        overline="Service Area"
        title="Where We"
        accent="Work"
        description={`With over ${BUSINESS.homesCompleted.toLocaleString()} jobs completed, C&S Plumbing serves all of Southwest Florida — from Cape Coral and Fort Myers to Naples, Bonita Springs, and beyond.`}
        actions={
          <>
            <Button
              href="/booking"
              variant="gold"
              size="lg"
              icon={<Calendar className="w-5 h-5" />}
            >
              Book a Service
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

      {/* Map Embed */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1525gJBVH8SRdUNAF-0nemUswy8DmRjo&ehbc=2E312F"
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
