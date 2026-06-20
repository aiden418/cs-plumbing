import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import FamilyStory from "@/components/about/FamilyStory";
import Generations from "@/components/about/Generations";
import Timeline from "@/components/about/Timeline";
import MissionValues from "@/components/about/MissionValues";
import TeamGrid from "@/components/about/TeamGrid";
import Credentials from "@/components/about/Credentials";
import TrainingTrade from "@/components/about/TrainingTrade";
import CTASection from "@/components/home/CTASection";
import AboutPersonJsonLd from "@/components/seo/AboutPersonJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "Three generations of the Pellechio family, family-owned since 1997 and 8,500+ homes plumbed. Meet the team behind C&S Plumbing of Lee — Southwest Florida's most trusted plumber. Best of Cape Coral 2025.",
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
    title: "About C&S Plumbing of Lee",
    description:
      "Three generations. One name on every job. Family-owned since 1997, 8,500+ homes built. Meet the Pellechio family behind Southwest Florida's most trusted plumbing company.",
    url: "https://www.csplumbinglee.com/about",
  },
};

export default function AboutPage() {
  return (
    <PageTransition>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-32 left-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Copy */}
            <div>
              <span className="mb-4 inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-gold">
                About Us
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-white">
                Three Generations.{" "}
                <span className="bg-gradient-to-r from-gold to-[#F6C453] bg-clip-text text-transparent">
                  One Name on Every Job.
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/70">
                Family-owned since 1997. From a Philadelphia builder&apos;s job sites to 8,500+
                homes plumbed across Southwest Florida, the Pellechio family has been doing it
                the right way for over 28 years.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#team"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy transition-all hover:gap-3"
                >
                  Meet the Family <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Book a Service
                </Link>
              </div>

              {/* Award chip */}
              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur">
                <Image
                  src="/images/awards/best-of-cape-coral-2025.png"
                  alt="Best of Cape Coral 2025 Award"
                  width={48}
                  height={36}
                />
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Best of Cape Coral 2025
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/50">
                    Award-Winning Plumbing Company
                  </p>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="/images/team/family.jpeg"
                alt="The Pellechio family — three generations behind C&S Plumbing of Lee"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      <AboutPersonJsonLd />
      <FamilyStory />
      <Generations />
      <Timeline />
      <MissionValues />
      <TeamGrid />
      <Credentials />
      <TrainingTrade />
      <CTASection />
    </PageTransition>
  );
}
