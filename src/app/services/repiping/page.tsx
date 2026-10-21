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

const landing = SERVICE_LANDINGS.find((s) => s.slug === "repiping")!;

export const metadata: Metadata = {
  title: { absolute: landing.metaTitle },
  description: landing.metaDescription,
  keywords: landing.keywords,
    alternates: { canonical: "/services/repiping" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/repiping",
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
          { name: landing.title, href: `/services/${landing.slug}` },
        ]}
      />
      <ServiceLandingTemplate landing={landing} />
      <RelatedPosts
        posts={postsForHub("repiping")}
        heading="Repiping guides & costs"
        description="What a Cape Coral repipe costs, how to spot failing pipes, and why polybutylene homes get repiped."
      />
      <CTASection />
    </PageTransition>
  );
}
