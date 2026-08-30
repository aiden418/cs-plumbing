import type { Metadata } from "next";
import { Suspense } from "react";
import PageTransition from "@/components/layout/PageTransition";
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
      <Suspense>
        <QuoteBuilderPage />
      </Suspense>
      <CTASection />
    </PageTransition>
  );
}
