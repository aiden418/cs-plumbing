import type { ServiceLanding } from "@/lib/types";

export default function ServiceJsonLd({ landing }: { landing: ServiceLanding }) {
  const BASE = "https://www.csplumbinglee.com";

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
      telephone: "+18337562648",
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
    />
  );
}
