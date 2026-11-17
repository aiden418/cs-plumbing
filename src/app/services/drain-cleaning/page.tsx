import type { Metadata } from "next";
import ServiceLandingTemplate from "@/components/services/ServiceLandingTemplate";
import ServiceJsonLd from "@/components/seo/ServiceJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import RelatedPosts from "@/components/blog/RelatedPosts";
import RelatedProjects from "@/components/projects/RelatedProjects";
import { postsForHub } from "@/lib/internal-links";
import { SERVICE_LANDINGS } from "@/lib/constants";
import { projectsForHub } from "@/lib/projects";

const landing = SERVICE_LANDINGS.find((s) => s.slug === "drain-cleaning")!;

export const metadata: Metadata = {
  title: { absolute: landing.metaTitle },
  description: landing.metaDescription,
  keywords: landing.keywords,
    alternates: { canonical: "/services/drain-cleaning" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/drain-cleaning",
  },
};

export default function Page() {
  return (
    <>
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
        projects={projectsForHub("drain-cleaning", 3)}
        overline="Documented sewer work"
        heading="Sewer line work we've documented"
        description="A sewer line in Cape Coral located, inspected by camera and replaced, photographed from the first excavation to the new pipe in the trench."
      />
      <RelatedPosts
        posts={postsForHub("drain-cleaning")}
        heading="Drain cleaning guides"
        description="Why SWFL drains clog, what hydrojetting fixes, and how long a cleaning takes."
      />
      <CTASection />
    </>
  );
}
