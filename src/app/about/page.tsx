import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import { ArrowRight, Calendar, Phone } from "@/components/ui/icons";
import FamilyStory from "@/components/about/FamilyStory";
import Generations from "@/components/about/Generations";
import Timeline from "@/components/about/Timeline";
import MissionValues from "@/components/about/MissionValues";
import TeamGrid from "@/components/about/TeamGrid";
import Credentials from "@/components/about/Credentials";
import TrainingTrade from "@/components/about/TrainingTrade";
import CTASection from "@/components/home/CTASection";
import AboutPersonJsonLd from "@/components/seo/AboutPersonJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { image, slot } from "@/lib/media";
import { ABOUT_HERO } from "@/content/about";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Us",
  description:
    "Three generations of the Pellechio family, family owned and operated since 1998, 9,500+ homes plumbed. Voted Best Plumbing Contractor, Best of Cape Coral 2026.",
  keywords: [
    "C&S Plumbing about",
    "Pellechio family plumbing",
    "family-owned plumber Cape Coral",
    "plumbing company Lee County history",
    "best plumbing contractor Cape Coral 2026",
    "best of cape coral plumbing",
    "trusted plumber Southwest Florida",
    "licensed plumber Fort Myers",
  ],
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: "About C&S Plumbing of Lee",
    description:
      "Three generations. One name on every job. Family owned and operated since 1998, 9,500+ homes plumbed. Meet the Pellechio family behind Southwest Florida's most trusted plumbing company.",
    url: "https://www.csplumbinglee.com/about",
  },
};

export default function AboutPage() {
  const badge = image(LATEST_AWARD.badge);
  // The about.lead position, uncropped: the aerial of a C&S waterfront new
  // build reads well full width behind the headline (the family portrait
  // would be cut through the faces); the portrait opens the story below.
  const lead = slot("about.lead")?.desktop ?? null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <PageHero
        layout="photo"
        frame={lead ? { ...lead, position: "30% 60%" } : null}
        overline={ABOUT_HERO.overline}
        title={ABOUT_HERO.title}
        accent={ABOUT_HERO.accent}
        description={ABOUT_HERO.description}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} variant="primary" size="lg" icon={<Phone className="size-5" />}>
              {ABOUT_HERO.callLabel} {BUSINESS.phone}
            </Button>
            <Button href={ABOUT_HERO.secondaryAction.href} variant="onPhoto" size="lg" icon={<Calendar className="size-5" />}>
              {ABOUT_HERO.secondaryAction.label}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href={ABOUT_HERO.primaryAction.href}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-fg underline decoration-1 underline-offset-4 hover:decoration-2"
          >
            {ABOUT_HERO.primaryAction.label}
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 rotate-90" />
          </Link>
          <Link href="/awards" className="group inline-flex min-h-11 items-center gap-3">
            {badge && (
              <Image
                src={badge.src}
                alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
                width={badge.width}
                height={badge.height}
                sizes="64px"
                className="h-11 w-auto shrink-0"
              />
            )}
            <span className="min-w-0 leading-snug">
              <span className="block font-semibold text-fg underline-offset-4 group-hover:underline">
                {LATEST_AWARD.title}
              </span>
              <span className="block text-[0.9375rem] text-body">
                {ABOUT_HERO.awardVotedPrefix} {LATEST_AWARD.category}
              </span>
            </span>
          </Link>
        </div>
      </PageHero>

      <AboutPersonJsonLd />
      <FamilyStory />
      <Generations />
      <Timeline />
      <MissionValues />
      <TeamGrid />
      <Credentials />
      <TrainingTrade />
      <CTASection />
    </>
  );
}
