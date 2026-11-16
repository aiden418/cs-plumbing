/**
 * Words and settings of the homepage. Change the text here, not in the
 * components. Wording that was already on the site is kept word for word.
 */

/** The film in the hero frame: "once" plays it and dissolves back to the still; "loop" repeats it. */
export type HeroFilmMode = "once" | "loop";

export const hero = {
  /** The plan-drawing line above the headline (also the line on the opening title card). */
  kicker: "Precision in every connection.",
  /** The homepage H1. Word for word; do not reword (search results and the content snapshot depend on it). */
  headline: "Southwest Florida's Most Trusted Plumbing Team",
  lead:
    "Family owned and operated since 1998, with 9,500+ homes plumbed. New construction for builders, and repairs, repipes and remodels for homeowners across Cape Coral, Fort Myers and Southwest Florida.",
  /** The small line under the hero photograph. */
  caption: "On the job site, from the drone",
  /** Labels of the hero actions. The call label reads the phone number from @/lib/business. */
  bookLabel: "Book a Service",
  quoteLabel: "Get an instant quote",
  /** Trust line under the actions: this, the license number, then the latest award. */
  licensePrefix: "Florida Certified Plumbing Contractor",
  /** Accessible names of the film controls. */
  pauseLabel: "Pause the film",
  playLabel: "Play the film",
  replayLabel: "Replay the film",
  skipLabel: "Skip intro",
  mode: "once" as HeroFilmMode,
};

/**
 * Interim block directly under the hero: everything the old hero showed that
 * the new hero does not place (rating, the two doors, the emergency line,
 * the trust points, the award). The Home team replaces it with the doors and
 * the proof strip.
 */
export const heroInterim = {
  ratingSuffix: "Stars",
  reviewsSuffix: "Reviews",
  doors: [
    {
      href: "/builders",
      label: "Builders & GCs",
      title: "New construction, slab to final",
      body: "Scope by phase, prequal packet, submit plans for a bid.",
      cta: "Builder services",
    },
    {
      href: "/booking",
      label: "Homeowners / Service",
      title: "Repairs, repipes & remodels",
      body: "Water heaters, leaks, drains, fixtures, whole-home repipes.",
      cta: "Book a service",
    },
  ],
  emergencyLead: "Plumbing emergency?",
  emergencyLink: { href: "/emergency", label: "24/7 service" },
  trust: ["Licensed & Insured", "9,500+ Homes Plumbed", "Free Estimates"],
  awardPrefix: "Voted",
};
