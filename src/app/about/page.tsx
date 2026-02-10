import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import FamilyStory from "@/components/about/FamilyStory";
import Timeline from "@/components/about/Timeline";
import TeamGrid from "@/components/about/TeamGrid";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Family-owned since 1997. Learn about the Pellechio family and the team behind C&S Plumbing of Lee County — Southwest Florida's most trusted plumber.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight">
            Built by Family.
            <br />
            <span className="text-gradient">Trusted by Thousands.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Since 1997, C&S Plumbing has been the backbone of Southwest
            Florida&apos;s plumbing infrastructure — from residential homes to
            commercial projects.
          </p>
        </div>
      </section>

      <FamilyStory />
      <Timeline />
      <TeamGrid />
      <CTASection />
    </PageTransition>
  );
}
