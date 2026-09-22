import type { Metadata } from "next";
import { Suspense } from "react";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import CTASection from "@/components/home/CTASection";
import QuoteBuilderPage from "./QuoteBuilderPage";

export const metadata: Metadata = {
  title: "Instant Water Heater & Repipe Quote",
  description:
    "Instant price estimate for water heater installation or whole-home repiping in Lee County. Answer a few questions, see your quote — no obligation.",
  alternates: { canonical: "/quote-builder" },
  openGraph: {
    title: "Instant Quote Builder — Water Heater & Repipe Estimates",
    description:
      "Get an instant price estimate for water heater installation or whole-home repiping in Lee County.",
    url: "https://www.csplumbinglee.com/quote-builder",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Instant Quote", href: "/quote-builder" },
        ]}
      />
      {/* The hero lives here, outside the Suspense boundary, so the H1 and
          page copy are in the prerendered HTML. The quiz below reads
          ?service= and is client-only by design. */}
      <PageHero
        size="sm"
        align="center"
        overline="Instant Quote Builder"
        title="Instant Plumbing Quote for"
        accent="Water Heaters & Repiping in Lee County"
        description="Answer a few questions and get an instant price range for water heater installation or whole-home repiping anywhere in Cape Coral, Fort Myers, and Lee County. Final price set after a free on-site inspection — no obligation, no pressure."
      >
        {/* What happens next */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/60">
          <span className="inline-flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold">1</span>
            Answer a few questions
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold">2</span>
            Get your instant range
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold">3</span>
            C&amp;S confirms within 1 business day
          </span>
        </div>
      </PageHero>
      <Suspense>
        <QuoteBuilderPage />
      </Suspense>
      <CTASection />
    </PageTransition>
  );
}
