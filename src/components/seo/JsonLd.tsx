export default function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": "https://www.csplumbinglee.com/#organization",
    name: "C&S Plumbing of Lee County",
    alternateName: "C&S Plumbing",
    url: "https://www.csplumbinglee.com",
    logo: "https://www.csplumbinglee.com/images/logos/logo.png",
    image: "https://www.csplumbinglee.com/images/hero/drone-construction.jpg",
    telephone: "+18337562648",
    email: "office@csplumbinglee.com",
    foundingDate: "1997",
    description:
      "Family-owned plumbing company serving Southwest Florida since 1997. 8,500+ homes built. 24/7 emergency service. Residential, commercial & new construction plumbing across Cape Coral, Fort Myers, Naples & all of SWFL.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "951 Pondella Rd",
      addressLocality: "North Fort Myers",
      addressRegion: "FL",
      postalCode: "33903",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.6695,
      longitude: -81.8726,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "15:00",
      },
    ],
    priceRange: "$$",
    paymentAccepted: "Cash, Credit Card, Check",
    areaServed: [
      { "@type": "City", name: "Cape Coral", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Fort Myers", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "North Fort Myers", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Naples", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Bonita Springs", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Estero", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Lehigh Acres", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Sanibel Island", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Fort Myers Beach", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Punta Gorda", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Port Charlotte", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Marco Island", containedInPlace: { "@type": "State", name: "Florida" } },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plumbing Services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Emergency Plumbing",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "24/7 Emergency Plumbing Repair" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Burst Pipe Repair" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sewage Backup Cleanup" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Residential Plumbing",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Drain Cleaning" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Water Heater Installation & Repair" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Whole-Home Repiping" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fixture Installation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Water Filtration Systems" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Commercial Plumbing",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Plumbing Maintenance" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Grease Trap Service" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Backflow Prevention" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "New Construction Plumbing",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "New Construction Plumbing" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Underground Rough-In" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Trim & Finish Plumbing" } },
          ],
        },
      ],
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
    />
  );
}
