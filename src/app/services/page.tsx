import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import ServiceCard from "@/components/services/ServiceCard";
import CostEstimator from "@/components/estimator/CostEstimator";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Comprehensive plumbing services across Southwest Florida — emergency repairs, drain cleaning, water heaters, repiping, new construction, commercial, and more.",
};

export default function ServicesPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Our Services
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
              Every Plumbing Solution
              <br />
              <span className="text-gradient">Under One Roof</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-400">
              From a dripping faucet to a 500-unit development, C&S Plumbing has
              the expertise, equipment, and team to handle it all.
            </p>
          </div>
        </Container>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Cost Estimator */}
      <section className="py-16 sm:py-24 lg:py-32 bg-surface">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start">
            <div>
              <SectionHeading
                align="left"
                overline="Quick Estimate"
                title="How Much Will It Cost?"
                subtitle="Get a rough estimate for your plumbing project in seconds. Select a service and answer a quick question to see typical price ranges."
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                *All estimates are approximate and vary based on specific conditions, materials, and scope. Contact us for a free, accurate quote.
              </p>
            </div>
            <CostEstimator />
          </div>
        </Container>
      </section>

      <CTASection />
    </PageTransition>
  );
}
