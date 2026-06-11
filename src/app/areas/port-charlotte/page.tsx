import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import AreaLandingTemplate from "@/components/areas/AreaLandingTemplate";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import { AREA_LANDINGS } from "@/lib/constants";

const landing = AREA_LANDINGS.find((a) => a.slug === "port-charlotte")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
  alternates: { canonical: "/areas/port-charlotte" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/areas/port-charlotte",
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
      {landing.faqs && <FaqJsonLd faqs={landing.faqs} />}
      <AreaLandingTemplate landing={landing} />
      <CTASection />
    </PageTransition>
  );
}
