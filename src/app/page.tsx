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
  title: "Plumber in Cape Coral & Fort Myers",
  description:
    "C&S Plumbing of Lee — family-owned since 1998, 8,500+ homes built. Best of Cape Coral 2025. 24/7 emergency plumbing, repiping, drain cleaning, water heaters & new construction across Southwest Florida.",
  keywords: [
    "plumber Cape Coral",
    "plumber Fort Myers",
    "plumbing company Lee County",
    "emergency plumber Cape Coral",
    "24/7 plumber Southwest Florida",
    "repiping Cape Coral",
    "drain cleaning Fort Myers",
    "water heater installation Cape Coral",
    "new construction plumbing SWFL",
    "best plumber Cape Coral",
    "C&S Plumbing",
    "plumber near me",
    "licensed plumber Lee County FL",
    "residential plumbing Cape Coral",
    "commercial plumbing Fort Myers",
  ],
  openGraph: {
    title: "C&S Plumbing of Lee — Cape Coral & Fort Myers Plumber",
    description:
      "Family-owned since 1998. Best of Cape Coral 2025. 24/7 emergency service, repiping, drain cleaning, water heaters & new construction. 8,500+ homes built across SWFL.",
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
