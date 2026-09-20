import { BUSINESS } from "@/lib/constants";

const BASE = "https://www.csplumbinglee.com";

const SERVICE_CITIES = [
  "Cape Coral",
  "Fort Myers",
  "North Fort Myers",
  "Naples",
  "Bonita Springs",
  "Estero",
  "Lehigh Acres",
  "Punta Gorda",
  "Port Charlotte",
];

/**
 * Service schema for the hand-written service pages that aren't backed by a
 * SERVICE_LANDINGS record (commercial, new-construction), so they can't use
 * the price-aware ServiceJsonLd. Same provider/areaServed shape, no pricing.
 */
export default function SimpleServiceJsonLd({
  slug,
  name,
  description,
  serviceType,
  offers,
}: {
  slug: string;
  name: string;
  description: string;
  serviceType?: string;
  offers?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/services/${slug}#service`,
    name,
    description,
    serviceType: serviceType ?? name,
    url: `${BASE}/services/${slug}`,
    provider: {
      "@type": "Plumber",
      "@id": `${BASE}/#organization`,
      name: BUSINESS.fullName,
      telephone: `+1${BUSINESS.phoneRaw}`,
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional License",
        name: `Certified Plumbing Contractor — ${BUSINESS.license}`,
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Florida Department of Business and Professional Regulation",
        },
      },
    },
    areaServed: SERVICE_CITIES.map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "State", name: "Florida" },
    })),
    ...(offers?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name,
            itemListElement: offers.map((offer) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: offer },
            })),
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
