import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceLandingTemplate from "@/components/services/ServiceLandingTemplate";
import ServiceJsonLd from "@/components/seo/ServiceJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { postsForHub } from "@/lib/internal-links";
import { SERVICE_LANDINGS } from "@/lib/constants";

// Spoke of the water-heaters hub (not a SERVICE_HUB: it has no city pages).
// Built 2026-11-12 after Search Console showed ~265 tankless impressions in
// 14 days landing on the generic water-heaters page at positions 17–35.
const landing = SERVICE_LANDINGS.find((s) => s.slug === "tankless-water-heaters")!;

export const metadata: Metadata = {
  title: { absolute: landing.metaTitle },
  description: landing.metaDescription,
  keywords: landing.keywords,
  alternates: { canonical: "/services/tankless-water-heaters" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/tankless-water-heaters",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <ServiceJsonLd landing={landing} />
      <FaqJsonLd faqs={landing.faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Water Heaters", href: "/services/water-heaters" },
          { name: landing.title, href: `/services/${landing.slug}` },
        ]}
      />
      <ServiceLandingTemplate landing={landing} />
      <RelatedPosts
        posts={postsForHub("water-heaters")}
        heading="Tankless & water heater guides"
        description="Tankless vs. tank, what a replacement costs, and how to keep a heater alive through storm season."
      />
      <CTASection />
    </PageTransition>
  );
}
