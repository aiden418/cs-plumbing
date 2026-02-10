import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceDetail from "@/components/services/ServiceDetail";
import CTASection from "@/components/home/CTASection";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Residential Plumbing Services",
  description:
    "Expert residential plumbing — emergency repairs, drain cleaning, water heaters, repiping, water quality, fixture installation. Serving Cape Coral, Fort Myers & SWFL.",
};

const residentialServices = SERVICES.filter((s) =>
  ["emergency", "drain-cleaning", "water-heaters", "repiping", "water-quality", "remodeling"].includes(s.id)
);

const highlights = [
  "Same-day service available",
  "Upfront, transparent pricing",
  "Licensed & insured technicians",
  "All brands serviced & installed",
  "Satisfaction guaranteed",
  "Clean, respectful work environment",
  "Permits pulled & inspections handled",
  "Warranty on all workmanship",
  "Background-checked technicians",
];

export default function ResidentialPage() {
  return (
    <PageTransition>
      <ServiceDetail
        title="Residential Services"
        heroText="Your Home Deserves the Best Plumbing"
        description="Whether it's a midnight emergency or a planned renovation, our residential plumbing team delivers fast, reliable service that protects your home and keeps your family comfortable."
        services={residentialServices}
        highlights={highlights}
      />
      <CTASection />
    </PageTransition>
  );
}
