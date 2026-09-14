import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BuildersPage from "./BuildersPage";
import { BUILDER_FAQS } from "./builder-faqs";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/builders" },
  title: "New Construction Plumbing for Builders",
  description:
    "8,500+ homes since 1998. C&S Plumbing partners with builders across Lee, Collier and Charlotte counties for new construction rough-in, top-out and trim.",
  keywords: [
    "new construction plumber SWFL",
    "builder plumbing partner Cape Coral",
    "rough-in plumber Lee County",
    "production home plumber Southwest Florida",
    "commercial plumbing contractor Fort Myers",
    "new construction plumbing sub",
    "plumber for builders Fort Myers",
    "new home plumbing contractor",
    "GC plumbing subcontractor Lee County",
    "custom home plumber Cape Coral",
    "plumbing subcontractor SWFL",
    "prequalified plumbing contractor",
    "bonded plumber Lee County",
    "AIA pay app plumber",
    "tenant improvement plumber Fort Myers",
  ],
  openGraph: {
    title: "Builders — New Construction Plumbing Partner | C&S Plumbing of Lee",
    description:
      "8,500+ homes built. The builder's choice for new construction plumbing in Cape Coral, Fort Myers & all of Southwest Florida.",
    url: "https://www.csplumbinglee.com/builders",
  },
};

function BuildersJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "New Construction Plumbing",
          description:
            "Full-scope new construction plumbing services for residential and commercial builders — rough-in, top-out, trim, and commercial plumbing with AIA pay application capability.",
          provider: {
            "@type": "LocalBusiness",
            name: BUSINESS.fullName,
            telephone: BUSINESS.phone,
            url: "https://www.csplumbinglee.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: BUSINESS.address,
              addressLocality: BUSINESS.city,
              addressRegion: BUSINESS.state,
              postalCode: BUSINESS.zip,
            },
          },
          serviceType: "New Construction Plumbing",
          areaServed: [
            { "@type": "AdministrativeArea", name: "Lee County, Florida" },
            { "@type": "AdministrativeArea", name: "Collier County, Florida" },
            {
              "@type": "AdministrativeArea",
              name: "Charlotte County, Florida",
            },
          ],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "New Construction Plumbing Services",
            itemListElement: [
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Rough-In Plumbing",
                  description:
                    "Underground DWV piping, water supply rough-in, stub-outs, pressure testing, and permit coordination.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Top-Out Plumbing",
                  description:
                    "Vent stack extensions, above-ceiling DWV connections, water heater rough-in, and hose bib installation.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Trim & Finish Plumbing",
                  description:
                    "Fixture installation, appliance connections, system testing, and final inspection coordination.",
                },
              },
              {
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: "Commercial Plumbing",
                  description:
                    "Full-scope commercial plumbing with AIA G702/G703 pay applications, backflow prevention, and medical gas capability.",
                },
              },
            ],
          },
        }),
      }}
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
