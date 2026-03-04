import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import CTASection from "@/components/home/CTASection";
import PartnersPage from "./PartnersPage";

export const metadata: Metadata = {
  alternates: { canonical: "/partners" },
  title: "Recommended Companies",
  description:
    "Local, family-owned businesses we trust and recommend. From electricians to HVAC and roofing — these are the Southwest Florida companies we stand behind.",
  keywords: [
    "recommended contractors Lee County",
    "trusted local businesses Cape Coral",
    "family-owned contractors Southwest Florida",
    "electrician Fort Myers",
    "HVAC Cape Coral",
    "roofing Lee County",
  ],
};

export default function Page() {
  return (
    <PageTransition>
      <PartnersPage />
      <CTASection />
    </PageTransition>
  );
}
