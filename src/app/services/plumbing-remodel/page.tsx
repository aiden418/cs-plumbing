import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceLandingTemplate from "@/components/services/ServiceLandingTemplate";
import ServiceJsonLd from "@/components/seo/ServiceJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import RelatedProjects from "@/components/projects/RelatedProjects";
import { SERVICE_LANDINGS } from "@/lib/constants";
import { projectsForHub } from "@/lib/projects";

const landing = SERVICE_LANDINGS.find((s) => s.slug === "plumbing-remodel")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
    alternates: { canonical: "/services/plumbing-remodel" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/plumbing-remodel",
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
      <RelatedProjects
        projects={projectsForHub("plumbing-remodel", 3)}
        overline="Documented remodels"
        heading="Remodel plumbing we've documented, demo to trim"
        description="Commercial restroom and kitchen remodels photographed at every phase — demolition, repipe, rough-in and finished fixtures."
      />
      <CTASection />
    </PageTransition>
  );
}
