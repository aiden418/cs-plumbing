/**
 * Words typed inside the area and service-city templates, moved here
 * word for word so they can be read and edited in one place. Everything
 * else on these pages (hero lines, local context, neighborhoods, FAQs,
 * features, prices) comes from the landing data in src/lib and is not
 * repeated here. Business facts come from "@/lib/business".
 *
 * Functions take the city (and state) because most headings name it.
 */

/** /areas/<city> pages (AreaLandingTemplate and its blocks). */
export const AREA_COPY = {
  hero: {
    book: "Request Service",
    /** Prefix of the call button; the phone number follows. */
    call: "Call",
  },
  services: {
    heading: (city: string) => `Plumbing Services in ${city}`,
    lead: (city: string) => `Full-service residential and commercial plumbing for ${city} homes and businesses.`,
  },
  local: {
    heading: (city: string) => `Serving ${city} Since 1998`,
    neighborhoodsHeading: (city: string) => `Neighborhoods We Serve in ${city}`,
    /** Phone-only row that opens the rest of the local story. */
    more: "Read more",
  },
  proof: {
    eyebrow: "Local proof",
    heading: (city: string) => `Major projects we've done in and around ${city}`,
    lead: "New construction, repipes, remodels, and commercial work — the kind of plumbing scope that defines a project, not a service call.",
    statFigure: "9,500+",
    statCaption: "homes plumbed across Lee County since 1998",
    allProjects: "See all projects",
    /** Shown when no completed project is recorded for the city yet. */
    fallbackHeading: "We've built across Lee County since 1998",
    fallbackBody:
      "Cape Coral, Fort Myers, North Fort Myers, Bonita Springs, Estero, Naples, Lehigh Acres, and Sanibel — over 9,500 homes served by the same family-owned crew. New construction, repipes, remodels, and commercial.",
    fallbackLink: "See completed projects",
    fallbackStatCaption: "homes plumbed across Lee County",
  },
  trust: {
    heading: (city: string) => `Why ${city} Trusts C&S Plumbing`,
    /** Appended to the shared trust proof points. */
    localPoint: (city: string) => `Fast response to ${city}`,
  },
  faq: {
    eyebrow: "FAQ",
    heading: (city: string) => `${city} Plumbing Questions`,
  },
  links: {
    eyebrow: "Local pricing & FAQs",
    heading: (city: string) => `Popular Services in ${city}`,
    headingNoPages: (city: string) => `Plumbing resources for ${city}`,
    description: (city: string) =>
      `Dedicated pages with local pricing, FAQs, and details for ${city} homeowners.`,
    /** Prefix of the price line under each city page link; the range follows. */
    rangePrefix: "Typical range",
    builderBefore: (city: string) => `Building in ${city}? See `,
    builderLink: (city: string) => `new construction plumbing for builders and GCs in ${city}`,
    guidesHeading: (city: string) => `Guides for ${city} homeowners`,
    /** Phone-only row over the guides list. */
    showGuides: (count: number) => `Show all ${count} guides`,
  },
} as const;

/** /<service>-<city> landings (ServiceCityLandingTemplate and CityServiceLinks). */
export const SERVICE_CITY_COPY = {
  hero: {
    /** Prefix of the call button; the phone number follows. */
    call: "Call Now —",
    book: "Request Service",
    priceLabel: "Typical price range:",
    /** "Serving <city>" then this, then the license number. */
    since: " since 1998 · License #",
    servingPrefix: "Serving",
  },
  description: {
    /** Used when a landing has no hand-written section heading. */
    fallbackHeading: (city: string, state: string) => `Plumbing services in ${city}, ${state}`,
    /** Phone-only row that opens the rest of the description. */
    more: "Read more",
  },
  features: {
    heading: (city: string) => `What We Offer in ${city}`,
  },
  area: {
    heading: (city: string, state: string) => `Serving All of ${city}, ${state}`,
    sentence: (city: string, state: string) =>
      `Licensed plumbers covering all of ${city}, ${state}, including every neighborhood listed below.`,
    hubLink: (city: string) => `See everything we do in ${city}`,
    neighborhoodsHeading: (city: string) => `Neighborhoods We Serve in ${city}`,
  },
  faq: {
    heading: "Frequently Asked Questions",
  },
  related: {
    heading: "Related Services",
  },
  links: {
    heading: (city: string) => `More plumbing help in ${city}`,
    description: (city: string) =>
      `Every ${city} service page has local pricing, FAQs and the neighborhoods we cover.`,
    rangePrefix: "Typical range",
    hubHeading: (hubTitle: string) => `${hubTitle} in other Southwest Florida cities`,
    seePrefix: "See ",
    areaLink: (city: string, state: string) => `all plumbing services in ${city}, ${state}`,
    or: " or ",
    hubLink: (hubTitle: string) => `${hubTitle} across Southwest Florida`,
    /** Phone-only row over the same service in other cities. */
    showCities: (count: number) => `Show all ${count} cities`,
  },
} as const;

/** "Lee County" for a city in SERVICE_AREAS_BY_COUNTY (matched on its first word run), else null. */
export function countyLabel(
  city: string,
  byCounty: Readonly<Record<string, readonly string[]>>,
): string | null {
  const wanted = city.toLowerCase();
  for (const [county, cities] of Object.entries(byCounty)) {
    if (cities.some((c) => c.toLowerCase() === wanted || c.toLowerCase().startsWith(`${wanted} `))) {
      return `${county} County`;
    }
  }
  return null;
}
