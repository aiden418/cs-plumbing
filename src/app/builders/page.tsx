import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BuildersPage from "./BuildersPage";
import { BUILDER_FAQS } from "./builder-faqs";
import { BUILDER_PROOF, CONSTRUCTION_PHASES, NEW_CONSTRUCTION_CITIES } from "@/lib/builder-program";

export const metadata: Metadata = {
  alternates: { canonical: "/builders" },
  // Keep under ~60 chars with the " | C&S Plumbing of Lee" template.
  title: "New Construction Plumbing for Builders",
  description:
    "9,500+ new construction homes plumbed since 1998. Slab layout to final for builders in Lee and Charlotte counties. Capability statement and bid form.",
  keywords: [
    "new construction plumber SWFL",
    "builder plumbing partner Cape Coral",
    "rough-in plumber Lee County",
    "top-out plumber Fort Myers",
    "production home plumber Southwest Florida",
    "new construction plumbing sub",
    "plumber for builders Fort Myers",
    "GC plumbing subcontractor Lee County",
    "plumbing subcontractor SWFL",
    "plumbing capability statement",
    "prequalified plumbing contractor",
    "UEP hookup new construction Cape Coral",
  ],
  openGraph: {
    title: "For Builders & GCs — New Construction Plumbing | C&S Plumbing of Lee",
    description: `${BUILDER_PROOF.headline}. Three generations, two Florida plumbing contractor licenses, slab to final.`,
    url: "https://www.csplumbinglee.com/builders",
  },
};

const BASE = "https://www.csplumbinglee.com";

function BuildersJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/builders#service`,
    name: "New Construction Plumbing for Builders",
    description:
      "Phase-by-phase new construction plumbing for residential builders and general contractors: underground / slab layout, 2nd rough (top-out), trim, water and sewer hookup, and final inspection.",
    serviceType: "New Construction Plumbing",
    audience: { "@type": "BusinessAudience", audienceType: "Home builders and general contractors" },
    provider: { "@id": `${BASE}/#organization` },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Lee County, Florida" },
      { "@type": "AdministrativeArea", name: "Charlotte County, Florida" },
      ...NEW_CONSTRUCTION_CITIES.map((c) => ({ "@type": "City", name: `${c.city}, FL` })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "New Construction Plumbing Phases",
      itemListElement: CONSTRUCTION_PHASES.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: p.name, description: p.summary },
      })),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Builders", href: "/builders" },
        ]}
      />
      <BuildersJsonLd />
      <FaqJsonLd faqs={BUILDER_FAQS} />
      <BuildersPage />
    </PageTransition>
  );
}
