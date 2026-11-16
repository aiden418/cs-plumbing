import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PageHero from "@/components/ui/PageHero";
import { ArrowUpRight, Calendar } from "@/components/ui/icons";
import FamilyStory from "@/components/about/FamilyStory";
import Generations from "@/components/about/Generations";
import Timeline from "@/components/about/Timeline";
import MissionValues from "@/components/about/MissionValues";
import TeamGrid from "@/components/about/TeamGrid";
import Credentials from "@/components/about/Credentials";
import TrainingTrade from "@/components/about/TrainingTrade";
import CTASection from "@/components/home/CTASection";
import AboutPersonJsonLd from "@/components/seo/AboutPersonJsonLd";
import { LATEST_AWARD } from "@/lib/awards";
import { image, picture } from "@/lib/media";
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
    title: "About C&S Plumbing of Lee",
    description:
      "Three generations. One name on every job. Family owned and operated since 1998, 9,500+ homes plumbed. Meet the Pellechio family behind Southwest Florida's most trusted plumbing company.",
    url: "https://www.csplumbinglee.com/about",
  },
};

export default function AboutPage() {
  const badge = image(LATEST_AWARD.badge);
  return (
    <>
      <PageHero
        layout="split"
        frame={picture("about.lead")}
        className="about-hero"
        overline={ABOUT_HERO.overline}
        title={ABOUT_HERO.title}
        accent={ABOUT_HERO.accent}
        description={ABOUT_HERO.description}
        actions={
          <>
            <Button href={ABOUT_HERO.primaryAction.href} variant="inverse" iconRight={<ArrowUpRight className="size-5" />}>
              {ABOUT_HERO.primaryAction.label}
            </Button>
            <Button href={ABOUT_HERO.secondaryAction.href} variant="secondary" icon={<Calendar className="size-5" />}>
              {ABOUT_HERO.secondaryAction.label}
            </Button>
          </>
        }
      >
        <Link
          href="/awards"
          className="group mt-10 flex max-w-md items-center gap-4 border-t border-rule pt-6"
        >
          {badge && (
            <Image
              src={badge.src}
              alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
              width={badge.width}
              height={badge.height}
              sizes="80px"
              className="h-12 w-auto shrink-0"
            />
          )}
          <span className="min-w-0">
            <span className="block leading-snug font-semibold text-fg underline-offset-4 group-hover:underline">
              {LATEST_AWARD.title}
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              {ABOUT_HERO.awardVotedPrefix} {LATEST_AWARD.category}
            </span>
          </span>
          <ArrowUpRight
            aria-hidden="true"
            className="ml-auto size-5 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
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
