import type { ServiceCityLanding } from "@/lib/types";
import { BUSINESS } from "@/lib/constants";

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
      telephone: `+1${BUSINESS.phoneRaw}`,
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}
