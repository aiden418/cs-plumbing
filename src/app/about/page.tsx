import type { Metadata } from "next";
import Image from "next/image";
import PageTransition from "@/components/layout/PageTransition";
import FamilyStory from "@/components/about/FamilyStory";
import Timeline from "@/components/about/Timeline";
import TeamGrid from "@/components/about/TeamGrid";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "Family-owned since 1997. Learn about the Pellechio family and the team behind C&S Plumbing of Lee County — Southwest Florida's most trusted plumber. Best of Cape Coral 2025.",
  keywords: [
    "C&S Plumbing about",
    "Pellechio family plumbing",
    "family-owned plumber Cape Coral",
    "plumbing company Lee County history",
    "best plumber Cape Coral 2025",
    "trusted plumber Southwest Florida",
    "licensed plumber Fort Myers",
  ],
  openGraph: {
    title: "About C&S Plumbing of Lee County",
    description:
      "Family-owned since 1997, 8,500+ homes built. Meet the Pellechio family and the team behind Southwest Florida's most trusted plumbing company.",
    url: "https://www.csplumbinglee.com/about",
  },
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
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
            Built by Family.
            <br />
            <span className="text-gradient">Trusted by Thousands.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Since 1997, C&S Plumbing has been the backbone of Southwest
            Florida&apos;s plumbing infrastructure — from residential homes to
            commercial projects.
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-gray-200 shadow-sm">
              <Image
                src="/images/awards/best-of-cape-coral-2025.png"
                alt="Best of Cape Coral 2025 Award"
                width={56}
                height={42}
              />
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  Best of Cape Coral 2025
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Award-Winning Plumbing Company
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FamilyStory />
      <Timeline />
      <TeamGrid />
      <CTASection />
    </PageTransition>
  );
}
