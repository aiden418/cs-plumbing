import type { ServiceLanding } from "@/lib/types";

export default function ServiceJsonLd({ landing }: { landing: ServiceLanding }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: landing.title,
    description: landing.description,
    provider: {
      "@type": "Plumber",
      "@id": "https://www.csplumbinglee.com/#organization",
      name: "C&S Plumbing of Lee County",
    },
    areaServed: {
      "@type": "State",
      name: "Florida",
    },
    url: `https://www.csplumbinglee.com/services/${landing.slug}`,
    ...(landing.priceRange && {
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: landing.priceRange.match(/\$([\d,]+)/)?.[1]?.replace(",", "") || "0",
        highPrice: landing.priceRange.match(/\$([\d,]+)\+?$/)?.[1]?.replace(",", "") || landing.priceRange.match(/[\d,]+/g)?.[1]?.replace(",", "") || "0",
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
