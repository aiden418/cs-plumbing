import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import HomeIntro from "@/components/home/HomeIntro";
import Services from "@/components/home/Services";
import EmergencyBand from "@/components/home/EmergencyBand";
import ProofStrip from "@/components/home/ProofStrip";
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
    `Licensed plumber (${BUSINESS.license}) serving Cape Coral, Fort Myers & SWFL since 1998. Repairs, repipes, water heaters, remodels and new construction.`,
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
    siteName: "C&S Plumbing of Lee",
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
      {/* The film/photo behind the headline, then the license line and the two doors */}
      <Hero />
      <HomeIntro />
      {/* Services, the emergency band, the proof numbers */}
      <Services />
      <EmergencyBand />
      <ProofStrip />
      {/* Our work, why C&S, reviews, service areas */}
      <WalkTheJob />
      <FamilyStory />
      <ReviewsAwards />
      <WhereWeWork />
      {/* Coastal Comeback and the brand and builder logo strips */}
      <CoastalComebackTeaser season={season()} />
      {/* Guides and FAQ (server-rendered: /blog had no inbound link in the HTML before) */}
      <GuidesFaq posts={latestPosts(3)} />
      <FaqJsonLd faqs={HOME_FAQS} />
      {/* Contact */}
      <CTASection />
    </>
  );
}
