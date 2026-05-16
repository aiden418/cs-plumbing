import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import PageTransition from "@/components/layout/PageTransition";

// Below-the-fold sections — server-rendered for SEO, JS deferred for performance
const CoastalComebackTeaser = dynamic(
  () => import("@/components/home/CoastalComebackTeaser"),
);
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs"));
const ServiceAreasSection = dynamic(
  () => import("@/components/home/ServiceAreasSection"),
);
const ServiceMapTeaser = dynamic(
  () => import("@/components/home/ServiceMapTeaser"),
);
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const GoogleReviews = dynamic(() => import("@/components/home/GoogleReviews"));
const BrandsCarousel = dynamic(
  () => import("@/components/home/BrandsCarousel"),
);
const BuilderShowcase = dynamic(
  () => import("@/components/home/BuilderShowcase"),
);
const CTASection = dynamic(() => import("@/components/home/CTASection"));

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title:
    "New Construction, Remodel & Service Plumber in Cape Coral & Fort Myers",
  description:
    "Southwest Florida's trusted new construction, remodel, repipe, and service plumber. 8,500+ homes built since 1998. Best of Cape Coral 2025. Serving Cape Coral, Fort Myers, Naples & all of Lee County. 24/7 emergency available.",
  keywords: [
    "new construction plumber SWFL",
    "new construction plumbing Cape Coral",
    "new construction plumbing Fort Myers",
    "remodel plumber Cape Coral",
    "remodel plumber Fort Myers",
    "kitchen remodel plumber SWFL",
    "bathroom remodel plumber Lee County",
    "whole-home repiping Cape Coral",
    "whole-home repiping Fort Myers",
    "polybutylene repipe Lee County",
    "builder plumbing partner Southwest Florida",
    "plumber Cape Coral",
    "plumber Fort Myers",
    "plumbing company Lee County",
    "emergency plumber Cape Coral",
    "24/7 plumber Southwest Florida",
    "drain cleaning Fort Myers",
    "water heater installation Cape Coral",
    "best plumber Cape Coral",
    "C&S Plumbing",
    "plumber near me",
    "licensed plumber Lee County FL",
    "residential plumbing Cape Coral",
    "commercial plumbing Fort Myers",
  ],
  openGraph: {
    title:
      "C&S Plumbing of Lee — New Construction, Remodel & Service Plumber in SWFL",
    description:
      "Family-owned since 1998. 8,500+ homes built. The new construction, remodel, and repipe partner Cape Coral and Fort Myers builders and homeowners trust. 24/7 emergency available.",
    url: "https://www.csplumbinglee.com",
  },
};

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <StatsBar />
      <ServiceHighlights />
      <BuilderShowcase />
      <WhyChooseUs />
      <CoastalComebackTeaser />
      <ServiceAreasSection />
      <ServiceMapTeaser />
      <Testimonials />
      <GoogleReviews />
      <BrandsCarousel />
      <CTASection />
    </PageTransition>
  );
}
