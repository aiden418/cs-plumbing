import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import PartnersPage from "./PartnersPage";
import { PARTNERS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/partners" },
  title: "Recommended Companies",
  description:
    "Trusted local contractors and family-owned businesses recommended by C&S Plumbing of Lee County. HVAC, roofing, general contractors, screen enclosures, concrete & more in Cape Coral and Southwest Florida.",
  keywords: [
    "recommended contractors Lee County",
    "trusted local businesses Cape Coral",
    "family-owned contractors Southwest Florida",
    "HVAC Cape Coral",
    "roofing contractor Cape Coral",
    "general contractor Cape Coral",
    "screen enclosures Fort Myers",
    "concrete contractor Cape Coral",
    "well and water filtration Cape Coral",
    "C&S Plumbing recommended companies",
  ],
  openGraph: {
    title: "Recommended Companies | C&S Plumbing of Lee County",
    description:
      "Local, family-owned businesses we trust and recommend across Southwest Florida — from HVAC and roofing to general contractors and concrete work.",
    url: "https://www.csplumbinglee.com/partners",
  },
};

function PartnersJsonLd() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recommended Companies by C&S Plumbing of Lee County",
    description:
      "Local, family-owned businesses trusted and recommended by C&S Plumbing across Southwest Florida.",
    numberOfItems: PARTNERS.length,
    itemListElement: PARTNERS.map((partner, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: partner.name,
        description: partner.description,
        telephone: partner.phone,
        ...(partner.website ? { url: partner.website } : {}),
        ...(partner.image
          ? {
              image: `https://www.csplumbinglee.com${partner.image}`,
            }
          : {}),
        areaServed: {
          "@type": "City",
          name: "Cape Coral",
          containedInPlace: { "@type": "State", name: "Florida" },
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
    />
  );
}

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Recommended Companies", href: "/partners" },
        ]}
      />
      <PartnersJsonLd />
      <PartnersPage />
      <CTASection />
    </PageTransition>
  );
}
