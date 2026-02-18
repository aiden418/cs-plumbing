import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import AreaLandingTemplate from "@/components/areas/AreaLandingTemplate";
import CTASection from "@/components/home/CTASection";
import { AREA_LANDINGS } from "@/lib/constants";

const landing = AREA_LANDINGS.find((a) => a.slug === "naples")!;

export const metadata: Metadata = {
  title: landing.metaTitle,
  description: landing.metaDescription,
  keywords: landing.keywords,
  openGraph: {
    title: landing.metaTitle,
    description: landing.metaDescription,
    url: "https://www.csplumbinglee.com/areas/naples",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <AreaLandingTemplate landing={landing} />
      <CTASection />
    </PageTransition>
  );
}
