import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import CoastalComebackTeaser from "@/components/home/CoastalComebackTeaser";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ServiceAreasSection from "@/components/home/ServiceAreasSection";
import Testimonials from "@/components/home/Testimonials";
import GoogleReviews from "@/components/home/GoogleReviews";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import BuilderShowcase from "@/components/home/BuilderShowcase";
import ServiceMapTeaser from "@/components/home/ServiceMapTeaser";
import CTASection from "@/components/home/CTASection";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Plumber in Cape Coral & Fort Myers",
  description:
    "C&S Plumbing of Lee County — family-owned since 1998, 8,500+ homes built. Best of Cape Coral 2025. 24/7 emergency plumbing, repiping, drain cleaning, water heaters & new construction across Southwest Florida.",
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
    title: "C&S Plumbing of Lee County — Cape Coral & Fort Myers Plumber",
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
      <CoastalComebackTeaser />
      <WhyChooseUs />
      <ServiceAreasSection />
      <ServiceMapTeaser />
      <Testimonials />
      <GoogleReviews />
      <BrandsCarousel />
      <BuilderShowcase />
      <CTASection />
    </PageTransition>
  );
}
