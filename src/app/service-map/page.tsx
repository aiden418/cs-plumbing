import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { MapPin, Phone, Calendar } from "lucide-react";
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
              {/*
                Replace the placeholder below with your Google My Maps embed iframe:
                <iframe src="YOUR_GOOGLE_MY_MAPS_EMBED_URL" width="100%" height="600" style={{ border: 0 }} allowFullScreen loading="lazy" />
              */}
              <div className="relative aspect-[16/9] sm:aspect-[2.5/1] bg-gray-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <MapPin className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Interactive Service Map Coming Soon
                  </h2>
                  <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto mb-6">
                    We&apos;re building an interactive map showing all of our past, present, and
                    future job locations across Lee &amp; Collier County.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Cape Coral
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Fort Myers
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      North Fort Myers
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Naples
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Bonita Springs
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Lehigh Acres
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Estero
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F5F5F7] px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Sanibel
                    </span>
                  </div>
                </div>
              </div>
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
