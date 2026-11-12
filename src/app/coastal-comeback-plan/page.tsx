import type { Metadata } from "next";
import CoastalComebackPlanPage from "./CoastalComebackPlanPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { COASTAL_COMEBACK_FAQS } from "@/lib/constants";
import { perYear } from "@/lib/pricing";
import { season } from "@/lib/claims";

// Seasonal copy (arrival Nov–Apr, departure May–Oct) is computed at request
// time; revalidating daily means the flip needs no deploy.
export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "/coastal-comeback-plan" },
  title: "Snowbird Plumbing Protection Plan",
  description:
    `Snowbird plumbing protection for SWFL: shutdown before you leave, checks while you're away, start-up inspection when you're back. Annual plans from ${perYear("plan.comfort")}.`,
  keywords: [
    "snowbird plumbing Cape Coral",
    "vacant home plumbing inspection Fort Myers",
    "snowbird home watch plumbing",
    "vacation home plumbing maintenance Florida",
    "summer plumbing check SWFL",
    "seasonal homeowner plumber",
    "vacant home water leak prevention",
  ],
  openGraph: {
    title: "Coastal Comeback Plan | C&S Plumbing of Lee",
    description:
      `Annual snowbird plumbing protection. Pre-departure shutdown, mid-summer checks, and a return-ready inspection — from ${perYear("plan.comfort")}.`,
    url: "https://www.csplumbinglee.com/coastal-comeback-plan",
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Coastal Comeback Plan", href: "/coastal-comeback-plan" },
        ]}
      />
      <FaqJsonLd faqs={COASTAL_COMEBACK_FAQS} />
      <CoastalComebackPlanPage season={season()} />
    </>
  );
}
