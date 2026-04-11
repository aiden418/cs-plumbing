import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceDetail from "@/components/services/ServiceDetail";
import CTASection from "@/components/home/CTASection";
import { SERVICES } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/services/residential" },
  title: "Residential Plumbing Services",
  description:
    "Expert residential plumbing in Cape Coral & Fort Myers — emergency repairs, drain cleaning, water heaters, repiping, water quality & fixture installation. Same-day service available.",
  keywords: [
    "residential plumber Cape Coral",
    "home plumbing Fort Myers",
    "emergency plumber near me",
    "drain cleaning Cape Coral",
    "water heater installation Fort Myers",
    "repiping Cape Coral FL",
    "fixture installation Lee County",
    "bathroom plumbing SWFL",
    "kitchen plumbing Cape Coral",
  ],
  openGraph: {
    title: "Residential Plumbing | C&S Plumbing of Lee County",
    description:
      "Your home deserves the best plumbing. Emergency repairs, drain cleaning, water heaters, repiping & more in Cape Coral, Fort Myers & all of SWFL.",
    url: "https://www.csplumbinglee.com/services/residential",
  },
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
        heroImage="/images/team/team-work-1.jpg"
      />
      <CTASection />
    </PageTransition>
  );
}
