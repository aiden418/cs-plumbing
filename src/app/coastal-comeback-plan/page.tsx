import type { Metadata } from "next";
import CoastalComebackPlanPage from "./CoastalComebackPlanPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { COASTAL_COMEBACK_FAQS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/coastal-comeback-plan" },
  title: "Coastal Comeback Plan — Snowbird Plumbing Protection",
  description:
    "Leaving Southwest Florida for the summer? The Coastal Comeback Plan from C&S Plumbing protects your vacant home from leaks, water heater failures, and mold. Annual plans from $349. Cape Coral, Fort Myers, Naples & beyond.",
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
      "Annual snowbird plumbing protection. Pre-departure shutdown, mid-summer checks, and a return-ready inspection — from $349/yr.",
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
      <CoastalComebackPlanPage />
    </>
  );
}
