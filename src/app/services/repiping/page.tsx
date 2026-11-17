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

const landing = SERVICE_LANDINGS.find((s) => s.slug === "repiping")!;

export const metadata: Metadata = {
  title: { absolute: landing.metaTitle },
  description: landing.metaDescription,
  keywords: landing.keywords,
    alternates: { canonical: "/services/repiping" },
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/services/repiping",
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
        projects={projectsForHub("repiping", 3)}
        overline="Documented repipes"
        heading="Repipe jobs we've photographed with the walls open"
        description="PEX water lines through attics and block walls, and new drain lines under an elevated home, photographed while the framing was still open."
      />
      <RelatedPosts
        posts={postsForHub("repiping")}
        heading="Repiping guides & costs"
        description="What a Cape Coral repipe costs, how to spot failing pipes, and why polybutylene homes get repiped."
      />
      <CTASection />
    </>
  );
}
