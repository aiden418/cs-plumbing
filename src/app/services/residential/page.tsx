import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceDetail from "@/components/services/ServiceDetail";
import CTASection from "@/components/home/CTASection";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import FaqAccordion from "@/components/ui/FaqAccordion";
import Container from "@/components/ui/Container";
import { BUSINESS, SERVICES } from "@/lib/constants";
import { RESIDENTIAL_FAQS } from "./residential-faqs";

export const metadata: Metadata = {
  alternates: { canonical: "/services/residential" },
  title: "Residential Plumbing Services",
  description:
    "Residential plumbing in Cape Coral & Fort Myers — emergency repairs, drain cleaning, water heaters, repiping and fixtures. Same-day service available.",
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
    title: "Residential Plumbing | C&S Plumbing of Lee",
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

// Inline Service schema (same pattern as services/uep-utilities/page.tsx) —
// this page is hand-written and has no SERVICE_LANDINGS entry to feed the
// shared ServiceJsonLd.
function ResidentialServiceJsonLd() {
  const BASE = "https://www.csplumbinglee.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/services/residential#service`,
    name: "Residential Plumbing Services",
    serviceType: "Residential Plumbing",
    url: `${BASE}/services/residential`,
    description:
      "Complete residential plumbing for Southwest Florida homes: emergency repairs, drain cleaning, water heaters, whole-home repiping, water quality systems, and fixture installation.",
    provider: {
      "@type": "Plumber",
      "@id": `${BASE}/#organization`,
      name: BUSINESS.fullName,
      telephone: `+1${BUSINESS.phoneRaw}`,
    },
    areaServed: [
      { "@type": "City", name: "Cape Coral" },
      { "@type": "City", name: "Fort Myers" },
      { "@type": "City", name: "North Fort Myers" },
      { "@type": "City", name: "Naples" },
      { "@type": "City", name: "Bonita Springs" },
      { "@type": "City", name: "Lehigh Acres" },
      { "@type": "City", name: "Estero" },
      { "@type": "City", name: "Sanibel Island" },
      { "@type": "City", name: "Punta Gorda" },
      { "@type": "City", name: "Port Charlotte" },
    ],
    termsOfService: `${BASE}/terms-of-service`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ResidentialPage() {
  return (
    <PageTransition>
      <FaqJsonLd faqs={RESIDENTIAL_FAQS} />
      <ResidentialServiceJsonLd />
      <ServiceDetail
        title="Residential Services"
        heroText="Your Home Deserves the Best Plumbing"
        description="Whether it's a midnight emergency or a planned renovation, our residential plumbing team delivers fast, reliable service that protects your home and keeps your family comfortable."
        services={residentialServices}
        highlights={highlights}
        heroImage="/images/team/team-work-1.jpg"
      />
      <section className="py-16 sm:py-24 bg-[#F5F5F7]">
        <Container size="narrow">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Residential Plumbing FAQs
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Common questions from Southwest Florida homeowners.
            </p>
          </div>
          <FaqAccordion faqs={RESIDENTIAL_FAQS} />
        </Container>
      </section>
      <CTASection />
    </PageTransition>
  );
}
