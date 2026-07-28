import type { Metadata } from "next";
import EmergencyPage from "./EmergencyPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { EMERGENCY_FAQS } from "./emergency-faqs";
import { BUSINESS } from "@/lib/constants";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";

const DESCRIPTION =
  "24/7 emergency plumbing service in Cape Coral, Fort Myers, North Fort Myers & Southwest Florida. Burst pipes, sewage backups, gas leaks, flooding — call C&S Plumbing now at 833-PLUMB-IT.";

export const metadata: Metadata = {
  alternates: { canonical: "/emergency" },
  title: "24/7 Emergency Plumber",
  description: DESCRIPTION,
  keywords: [
    "emergency plumber Cape Coral",
    "24/7 plumber Fort Myers",
    "emergency plumbing SWFL",
    "burst pipe repair Lee County",
    "emergency plumber near me",
    "after hours plumber Fort Myers",
    "weekend plumber Cape Coral",
  ],
  openGraph: {
    title: "24/7 Emergency Plumber | Cape Coral, Fort Myers, SWFL",
    description:
      "Plumbing emergency? C&S Plumbing responds 24/7 across Southwest Florida. Call 833-PLUMB-IT now.",
    url: "https://www.csplumbinglee.com/emergency",
  },
};

// City pages with 24/7 coverage — drives both the schema areaServed and the
// visible "Areas we cover" grid, so they can never drift apart.
const EMERGENCY_CITIES = SERVICE_CITY_LANDINGS.filter(
  (p) => p.serviceSlug === "emergency"
).map((p) => ({ slug: p.slug, city: p.city, state: p.state }));

// Inline Service schema (same pattern as services/uep-utilities/page.tsx).
// @type stays "Service" — schema.org EmergencyService is a LocalBusiness
// subtype and would create a second business entity beside the Plumber node.
function EmergencyServiceJsonLd() {
  const BASE = "https://www.csplumbinglee.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/emergency#service`,
    name: "24/7 Emergency Plumbing",
    serviceType: "Emergency plumbing repair",
    url: `${BASE}/emergency`,
    description: DESCRIPTION,
    provider: {
      "@type": "Plumber",
      "@id": `${BASE}/#organization`,
      name: BUSINESS.fullName,
      telephone: `+1${BUSINESS.phoneRaw}`,
    },
    areaServed: EMERGENCY_CITIES.map((c) => ({
      "@type": "City",
      name: c.city,
      containedInPlace: { "@type": "State", name: "Florida" },
    })),
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Emergency Plumber", href: "/emergency" }]} />
      <FaqJsonLd faqs={EMERGENCY_FAQS} />
      <EmergencyServiceJsonLd />
      <EmergencyPage emergencyCities={EMERGENCY_CITIES} />
    </>
  );
}
