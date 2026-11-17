import type { Metadata } from "next";
import AreaLandingTemplate from "@/components/areas/AreaLandingTemplate";
import { cityProofProjects } from "@/lib/projects-data";
import AreaServiceLinks from "@/components/areas/AreaServiceLinks";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import { AREA_LANDINGS } from "@/lib/constants";

const landing = AREA_LANDINGS.find((a) => a.slug === "north-fort-myers")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
    alternates: { canonical: "/areas/north-fort-myers" },
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/areas/north-fort-myers",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: landing.city, href: `/areas/${landing.slug}` },
        ]}
      />
      <AreaLandingTemplate landing={landing} proofProjects={cityProofProjects(landing.city)} />
      <AreaServiceLinks landing={landing} />
      <CTASection />
    </>
  );
}
