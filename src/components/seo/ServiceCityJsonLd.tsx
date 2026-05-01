import type { ServiceCityLanding } from "@/lib/types";

export default function ServiceCityJsonLd({
  landing,
}: {
  landing: ServiceCityLanding;
}) {
  const BASE = "https://www.csplumbinglee.com";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/${landing.slug}#service`,
    name: landing.h1,
    description: landing.metaDescription,
    serviceType: landing.h1,
    url: `${BASE}/${landing.slug}`,
    provider: {
      "@type": "Plumber",
      "@id": `${BASE}/#organization`,
      name: "C&S Plumbing of Lee",
      telephone: "+18337562648",
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional License",
          name: "Certified Plumbing Contractor — CFC1432485",
          recognizedBy: {
            "@type": "GovernmentOrganization",
            name: "Florida Department of Business and Professional Regulation",
          },
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "Professional License",
          name: "Certified Plumbing Contractor — CFC057076",
          recognizedBy: {
            "@type": "GovernmentOrganization",
            name: "Florida Department of Business and Professional Regulation",
          },
        },
      ],
    },
    areaServed: {
      "@type": "City",
      name: landing.city,
      containedInPlace: {
        "@type": "State",
        name: "Florida",
      },
    },
    termsOfService: `${BASE}/terms-of-service`,
    ...(landing.priceRange && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice:
          landing.priceRange.match(/\$([\d,]+)/)?.[1]?.replace(",", "") || "0",
        highPrice:
          landing.priceRange.match(/\$([\d,]+)\+?$/)?.[1]?.replace(",", "") ||
          landing.priceRange.match(/[\d,]+/g)?.[1]?.replace(",", "") ||
          "0",
        availability: "https://schema.org/InStock",
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
