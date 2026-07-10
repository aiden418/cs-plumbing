import type { AreaLanding } from "@/lib/types";
import { BUSINESS } from "@/lib/constants";

export default function AreaServiceJsonLd({
  landing,
}: {
  landing: AreaLanding;
}) {
  const BASE = "https://www.csplumbinglee.com";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/areas/${landing.slug}#service`,
    name: `Plumbing Services in ${landing.city}, ${landing.state}`,
    description: landing.metaDescription,
    serviceType: "Plumbing",
    url: `${BASE}/areas/${landing.slug}`,
    provider: {
      "@type": "Plumber",
      "@id": `${BASE}/#organization`,
      name: "C&S Plumbing of Lee",
      telephone: `+1${BUSINESS.phoneRaw}`,
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
