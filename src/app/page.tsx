import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import HomeIntro from "@/components/home/HomeIntro";
import Services from "@/components/home/Services";
import EmergencyBand from "@/components/home/EmergencyBand";
import CoastalComebackTeaser from "@/components/home/CoastalComebackTeaser";
import WalkTheJob from "@/components/home/WalkTheJob";
import FamilyStory from "@/components/home/FamilyStory";
import WhereWeWork from "@/components/home/WhereWeWork";
import ReviewsAwards from "@/components/home/ReviewsAwards";
import GuidesFaq from "@/components/home/GuidesFaq";
import CTASection from "@/components/home/CTASection";
import { HOME_FAQS } from "@/components/home/HomeFaq";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { latestPosts } from "@/lib/internal-links";
import { season } from "@/lib/claims";
import { BUSINESS } from "@/lib/business";

// The snowbird teaser flips between arrival (Nov–Apr) and departure copy;
// daily revalidation means the flip needs no deploy.
export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  // Keyword first, brand last, 60 characters so results don't cut it off.
  // The builder door lives in the description, the H1 and /builders; the
  // old title plus the layout template ran 81 characters.
  title: { absolute: "Plumber in Cape Coral & Fort Myers, FL | C&S Plumbing of Lee" },
  description:
    `Licensed Florida plumbing contractor (${BUSINESS.license}) serving Cape Coral, Fort Myers & SWFL since 1998. Repairs, repipes, water heaters and remodels for homeowners; new construction plumbing for builders. 5.0-star rated.`,
  keywords: [
    "new construction plumber SWFL",
    "new construction plumbing Cape Coral",
    "new construction plumbing Fort Myers",
    "remodel plumber Cape Coral",
    "remodel plumber Fort Myers",
    "kitchen remodel plumber SWFL",
    "bathroom remodel plumber Lee County",
    "whole-home repiping Cape Coral",
    "whole-home repiping Fort Myers",
    "polybutylene repipe Lee County",
    "builder plumbing partner Southwest Florida",
    "plumber Cape Coral",
    "plumber Fort Myers",
    "plumbing company Lee County",
    "emergency plumber Cape Coral",
    "24/7 plumber Southwest Florida",
    "drain cleaning Fort Myers",
    "water heater installation Cape Coral",
    "best plumber Cape Coral",
    "C&S Plumbing",
    "plumber near me",
    "licensed plumber Lee County FL",
    "residential plumbing Cape Coral",
    "commercial plumbing Fort Myers",
    "plumber Punta Gorda",
    "plumber Port Charlotte",
    "plumber North Fort Myers",
    "Charlotte County plumber",
  ],
  openGraph: {
    title:
      "C&S Plumbing of Lee — New Construction, Remodel & Service Plumber in SWFL",
    description:
      "Family owned and operated since 1998, 9,500+ homes plumbed. New construction for builders and GCs; repairs, repipes and remodels for homeowners across Cape Coral, Fort Myers & SWFL.",
    url: "https://www.csplumbinglee.com",
  },
};

export default function Home() {
  return (
    <>
      {/* 1. Opening (frozen) and, on ink under it, the two doors and the proof strip */}
      <Hero />
      <HomeIntro />
      {/* 2. Services, the emergency band, Coastal Comeback and brands */}
      <Services />
      <EmergencyBand />
      <CoastalComebackTeaser season={season()} />
      {/* 3. Walk the job and the builders logo wall */}
      <WalkTheJob />
      {/* 4. Family story and "Built on Trust" */}
      <FamilyStory />
      {/* 5. Where we work */}
      <WhereWeWork />
      {/* 6. Reviews and awards */}
      <ReviewsAwards />
      {/* 7. Guides and FAQ (server-rendered: /blog had no inbound link in the HTML before) */}
      <GuidesFaq posts={latestPosts(3)} />
      <FaqJsonLd faqs={HOME_FAQS} />
      {/* 8. Contact */}
      <CTASection />
    </>
  );
}
