import { BUSINESS } from "@/lib/constants";
import { fetchPlaceData } from "@/lib/google-reviews";

export default async function JsonLd() {
  const BASE = "https://www.csplumbinglee.com";

  // Live Google rating when configured (24h-cached, deduped with the
  // homepage reviews strip); falls back to the static constants.
  const live = await fetchPlaceData(0);
  const ratingValue = (live?.rating ?? BUSINESS.rating).toFixed(1);
  const reviewCount = String(live?.total ?? BUSINESS.reviewCount);

  /* ── Person entities (reusable via @id) ── */
  const founder = {
    "@type": "Person",
    "@id": `${BASE}/#founder`,
    name: "Samuel Pellechio Sr.",
    jobTitle: "Founding Patriarch",
    worksFor: { "@id": `${BASE}/#organization` },
    description:
      "A mason and general contractor who built thousands of homes in Philadelphia before moving the family to Cape Coral in 1984. He taught the trade to his sons Chris and Sam, who founded C&S Plumbing of Lee — every standard the company holds traces back to him. Passed away in 2020.",
  };

  const owner = {
    "@type": "Person",
    "@id": `${BASE}/#owner`,
    name: "Samuel Pellechio Jr.",
    jobTitle: "Owner & President",
    url: `${BASE}/about`,
    image: `${BASE}/images/team/samuel.jpeg`,
    worksFor: { "@id": `${BASE}/#organization` },
    description:
      "First-generation licensed plumber and second-generation contractor leading C&S Plumbing since 1997. Licensed Florida plumbing contractor (CFC1432485 / CFC057076).",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Professional License",
      name: "Certified Plumbing Contractor",
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "Florida Department of Business and Professional Regulation",
        url: "https://www.myfloridalicense.com",
      },
    },
    knowsAbout: [
      "Residential Plumbing",
      "Commercial Plumbing",
      "New Construction Plumbing",
      "Whole-Home Repiping",
      "Water Heater Installation",
      "Florida Building Code Compliance",
      "Backflow Prevention",
    ],
  };

  const operationsManager = {
    "@type": "Person",
    "@id": `${BASE}/#operations-manager`,
    name: "Aiden Pellechio",
    jobTitle: "Project Manager & Estimator",
    url: `${BASE}/about`,
    image: `${BASE}/images/team/aiden.jpg`,
    worksFor: { "@id": `${BASE}/#organization` },
    description:
      "Third-generation Pellechio working full-time as project manager and estimator at C&S Plumbing of Lee — also handling permitting and marketing — while earning a construction management degree at Florida Gulf Coast University (FGCU), Class of 2028.",
  };

  /* ── LocalBusiness / Plumber ── */
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${BASE}/#organization`,
    name: "C&S Plumbing of Lee",
    alternateName: "C&S Plumbing",
    url: BASE,
    logo: `${BASE}/images/logos/logo-new.png`,
    image: `${BASE}/images/hero/drone-construction.jpg`,
    telephone: `+1${BUSINESS.phoneRaw}`,
    email: "office@csplumbinglee.com",
    foundingDate: "1997",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 5, maxValue: 10 },
    description:
      "Family-owned plumbing company serving Southwest Florida since 1997. 8,500+ homes built. 24/7 emergency service. Residential, commercial & new construction plumbing across Cape Coral, Fort Myers, Naples & all of SWFL.",
    slogan: "Southwest Florida's Most Trusted Plumbing Team",
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
        opens: "07:30",
        closes: "16:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "15:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "00:00",
        closes: "23:59",
        description: "Emergency service only",
      },
    ],
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, Check, Financing",
    isAccessibleForFree: false,

    /* ── People ── */
    founder,
    employee: [owner, operationsManager],

    /* ── Credentials & Licensing ── */
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional License",
        name: "Florida Certified Plumbing Contractor — CFC1432485",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Florida Department of Business and Professional Regulation",
          url: "https://www.myfloridalicense.com",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional License",
        name: "Florida Certified Plumbing Contractor — CFC057076",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Florida Department of Business and Professional Regulation",
          url: "https://www.myfloridalicense.com",
        },
      },
    ],

    /* ── Expertise ── */
    knowsAbout: [
      "Residential plumbing repair and installation",
      "Commercial plumbing systems",
      "New construction plumbing — rough-in and trim",
      "Whole-home repiping with PEX and CPVC",
      "Tankless and hybrid water heater installation",
      "Drain cleaning and hydro-jetting",
      "Water softener and filtration systems",
      "UEP utility connections in Cape Coral",
      "Florida Building Code 8th Edition (2023) compliance",
      "Lee County and Cape Coral permitting requirements",
      "Backflow prevention installation (inspections subcontracted)",
      "Emergency plumbing — burst pipes, slab leaks, sewage backups",
    ],

    /* ── Service Areas ── */
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

    /* ── Service Catalog ── */
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
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Water Filtration & Softener Systems" } },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Commercial Plumbing",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Plumbing Maintenance" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Grease Trap Service" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Backflow Prevention & Testing" } },
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
        {
          "@type": "OfferCatalog",
          name: "UEP Utilities Hookup",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Water Service Line Installation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Irrigation Line Installation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sewer Lateral Installation" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Septic Tank Abandonment & Pump-Out" } },
          ],
        },
      ],
    },

    /* ── Ratings & Reviews ── */
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Dennis Shy" },
        datePublished: "2025-01-15",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "Reasonable price. Great Company 100% Responsive and quick to show up and get the work done. I will use this company any time I have a plumbing need and would definitely recommend them to anyone.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Richard Pace" },
        datePublished: "2025-02-10",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "Great service! Friendly people! They answered all my questions and made suggestions that were helpful. They only know how to do things one way, and that's the right way!",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Linda" },
        datePublished: "2024-11-20",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody:
          "Could not be happier with Sam and his team. They did a fabulous job, efficient, prompt and cleaned up beautifully. I highly recommend them. And this is a family business which we all should support.",
      },
    ],

    /* ── Awards ── */
    award: ["Best of Cape Coral 2025 — Plumbing"],

    /* ── Citations to Authoritative Sources ── */
    citation: [
      {
        "@type": "CreativeWork",
        name: "Florida Building Code 8th Edition (2023) — Plumbing",
        url: "https://floridabuilding.org/fbc/thecode/code-resources.aspx",
        description:
          "The Florida Building Code governs all plumbing installations, repairs, and inspections in Lee County. C&S Plumbing is fully compliant with the latest edition.",
      },
      {
        "@type": "CreativeWork",
        name: "Lee County Building Permits & Inspections",
        url: "https://www.leegov.com/dcd/BldPermit",
        description:
          "All C&S Plumbing projects requiring permits are filed through the Lee County Department of Community Development.",
      },
      {
        "@type": "CreativeWork",
        name: "Cape Coral UEP (Utilities Extension Program)",
        url: "https://www.capecoral.gov/department/public_works_and_utilities/utilities_extension_program_uep/index.php",
        description:
          "C&S Plumbing is a leading contractor for the City of Cape Coral's UEP program, connecting homes to municipal water and sewer.",
      },
      {
        "@type": "CreativeWork",
        name: "Florida DBPR — Verify a Contractor License",
        url: "https://www.myfloridalicense.com/wl11.asp?mode=0&SID=&bession_id=vbSessionId",
        description:
          "C&S Plumbing's Certified Plumbing Contractor license (CFC1432485) can be verified through the Florida DBPR.",
      },
    ],

    /* ── Social / Profiles ── */
    sameAs: [
      "https://www.google.com/maps/place/C%26S+Plumbing+of+Lee",
      "https://www.facebook.com/csplumbingoflc",
      "https://www.instagram.com/cs_plumbing_of_lee/",
    ],
  };

  /* ── WebSite schema ── */
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: "C&S Plumbing of Lee",
    url: BASE,
    description:
      "Official website of C&S Plumbing of Lee — family-owned plumbing contractor serving Cape Coral, Fort Myers, Naples, and all of Southwest Florida since 1997.",
    publisher: { "@id": `${BASE}/#organization` },
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}
