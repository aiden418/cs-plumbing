import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceLandingTemplate from "@/components/services/ServiceLandingTemplate";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import { SERVICE_LANDINGS } from "@/lib/constants";

const landing = SERVICE_LANDINGS.find((s) => s.slug === "leak-repair")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/leak-repair",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <FaqJsonLd faqs={landing.faqs} />
      <ServiceLandingTemplate landing={landing} />
      <CTASection />
    </PageTransition>
  );
}
