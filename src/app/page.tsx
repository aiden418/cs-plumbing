import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import ServiceHighlights from "@/components/home/ServiceHighlights";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <StatsBar />
      <ServiceHighlights />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </PageTransition>
  );
}
