import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import AwardsPage from "./AwardsPage";
import { AWARDS_FAQS } from "./awards-faqs";
import { AWARDS, LATEST_AWARD } from "@/lib/constants";

const BASE = "https://www.csplumbinglee.com";

export const metadata: Metadata = {
  alternates: { canonical: "/awards" },
  title: "Awards & Recognition",
  description: `Voted ${LATEST_AWARD.category} in the ${LATEST_AWARD.year} Best of Cape Coral awards by ${LATEST_AWARD.issuer} readers. Every award C&S Plumbing has earned and how it's decided.`,
  keywords: [
    "best plumbing contractor Cape Coral",
    "Best of Cape Coral 2026 plumbing",
    "Best of Cape Coral plumber",
    "award winning plumber Cape Coral",
    "Cape Coral Breeze best of plumbing",
    "best plumber Cape Coral",
    "C&S Plumbing awards",
  ],
  openGraph: {
    title: `Awards & Recognition | C&S Plumbing of Lee`,
    description: `${LATEST_AWARD.summary} See every award and how it's decided.`,
    url: `${BASE}/awards`,
  },
};

/**
 * Page-level schema, inline like PartnersJsonLd and BuildersJsonLd. The
 * sitewide Plumber node in JsonLd.tsx already carries `award[]` — that is the
 * canonical signal. This adds what a string can't: the issuer, the date, and
 * the badge image for each one. schema.org has no Award type, so each item is
 * a plain Thing.
 */
function AwardsJsonLd() {
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE}/awards#webpage`,
    url: `${BASE}/awards`,
    name: "Awards & Recognition — C&S Plumbing of Lee",
    description: metadata.description,
    isPartOf: { "@id": `${BASE}/#website` },
    about: { "@id": `${BASE}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      name: "Awards won by C&S Plumbing of Lee",
      numberOfItems: AWARDS.length,
      itemListElement: AWARDS.map((a, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: `${a.title} — ${a.category}`,
          description: `${a.summary} Awarded ${a.awardedOn} by ${a.issuer} (${a.program}).`,
          image: `${BASE}${a.badge}`,
          url: a.citationUrl ?? a.issuerUrl,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
    />
  );
}

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Awards & Recognition", href: "/awards" },
        ]}
      />
      <FaqJsonLd faqs={AWARDS_FAQS} />
      <AwardsJsonLd />
      <AwardsPage />
      <CTASection />
    </PageTransition>
  );
}
