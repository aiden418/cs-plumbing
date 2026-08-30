import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import ServiceCard from "@/components/services/ServiceCard";
import CostEstimator from "@/components/estimator/CostEstimator";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/home/CTASection";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Plumbing Services",
  description:
    "Full-service plumbing in Cape Coral & Fort Myers — emergency repairs, drain cleaning, water heaters, repiping and new construction. Free estimates.",
  keywords: [
    "plumbing services Cape Coral",
    "plumbing services Fort Myers",
    "emergency plumbing Lee County",
    "drain cleaning Cape Coral",
    "water heater repair Fort Myers",
    "repiping Southwest Florida",
    "new construction plumbing SWFL",
    "commercial plumbing Cape Coral",
    "plumber near me",
  ],
  openGraph: {
    title: "Plumbing Services | C&S Plumbing of Lee",
    description:
      "Every plumbing solution under one roof — emergency repairs, drain cleaning, water heaters, repiping, new construction & commercial plumbing across SWFL.",
    url: "https://www.csplumbinglee.com/services",
  },
};

export default function ServicesPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        align="center"
        size="lg"
        overline="Our Services"
        title="Every Plumbing Solution"
        accent="Under One Roof"
        accentPosition="block"
        description="From a dripping faucet to a 500-unit development, C&S Plumbing has the expertise, equipment, and team to handle it all."
      />

      {/* Services Grid */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          {/* The hero <h1> carries this visually; the grid still needs a
              section heading so the outline doesn't jump h1 -> h3. */}
          <h2 className="sr-only">All plumbing services</h2>
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
