import type { ServiceLanding } from "@/lib/types";
import { BUSINESS } from "@/lib/constants";

// Parses simple money ranges — "$4,200 – $6,500", "$195 – $4,500+" — into
// numbers for PriceSpecification. Returns null for non-price rows
// ("Included"), upcharges ("+$500 – $1,200"), and per-foot/multi-line
// strings, which stay prose-only.
function parseMoneyRange(s: string | undefined): { min: number; max: number } | null {
  if (!s) return null;
  const m = s.match(/^\$([\d,]+)\s*[–-]\s*\$?([\d,]+)\+?$/);
  if (!m) return null;
  return { min: Number(m[1].replace(/,/g, "")), max: Number(m[2].replace(/,/g, "")) };
}

export default function ServiceJsonLd({ landing }: { landing: ServiceLanding }) {
  const BASE = "https://www.csplumbinglee.com";

  // Real price data for AI crawlers — derived from the same priceRange and
  // costBreakdown the page already displays, so schema can't drift from copy.
  const range = parseMoneyRange(landing.priceRange);
  const catalogRows = (landing.costBreakdown ?? []).flatMap((row) => {
    const r = parseMoneyRange(row.range);
    return r ? [{ label: row.label, note: row.note, min: r.min, max: r.max }] : [];
  });

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/services/${landing.slug}#service`,
    name: landing.title,
    description: landing.description,
    serviceType: landing.title,
    url: `${BASE}/services/${landing.slug}`,
    provider: {
      "@type": "Plumber",
      "@id": `${BASE}/#organization`,
      name: "C&S Plumbing of Lee",
      telephone: `+1${BUSINESS.phoneRaw}`,
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional License",
        name: "Certified Plumbing Contractor — CFC1432485",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Florida Department of Business and Professional Regulation",
        },
      },
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
    ],
    termsOfService: `${BASE}/terms-of-service`,
    ...(range && {
      offers: {
        "@type": "Offer",
        url: `${BASE}/services/${landing.slug}`,
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: range.min,
          maxPrice: range.max,
          priceCurrency: "USD",
        },
      },
    }),
    ...(catalogRows.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${landing.title} — Typical Pricing`,
        itemListElement: catalogRows.map((row) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: row.label },
          ...(row.note ? { description: row.note } : {}),
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: row.min,
            maxPrice: row.max,
            priceCurrency: "USD",
          },
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}
