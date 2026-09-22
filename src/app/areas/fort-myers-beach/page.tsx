import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import AreaLandingTemplate from "@/components/areas/AreaLandingTemplate";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import { AREA_LANDINGS } from "@/lib/constants";

const landing = AREA_LANDINGS.find((a) => a.slug === "fort-myers-beach")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
  alternates: { canonical: "/areas/fort-myers-beach" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/areas/fort-myers-beach",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: landing.city, href: `/areas/${landing.slug}` },
        ]}
      />
      <AreaLandingTemplate landing={landing} />
      <CTASection />
    </PageTransition>
  );
}
