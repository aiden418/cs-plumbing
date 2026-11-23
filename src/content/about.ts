/**
 * Words for the About, Reviews, Awards and Partners pages.
 *
 * Every heading, label and short line that used to be typed inside the page
 * components lives here, word for word, so it can be edited without touching
 * layout code. Business facts (phone, license, rating, founding year) are not
 * typed here: they come from "@/lib/business". Team members, the timeline,
 * awards, partners and testimonials stay in src/lib, where the rest of the
 * site reads them.
 */

import { LATEST_AWARD } from "@/lib/awards";
import { OFFICE_CONTACTS } from "@/lib/business";

/* ---------------------------------------------------------------- About -- */

export const ABOUT_HERO = {
  overline: "About Us",
  title: "Three Generations.",
  accent: "One Name on Every Job.",
  /** The hero keeps the first sentence; the rest opens the story section below, word for word. */
  description: "Family owned and operated since 1998.",
  descriptionMore:
    "From a Philadelphia builder's job sites to 9,500+ homes plumbed across Southwest Florida, the Pellechio family has been doing it the right way for over 28 years.",
  /** "Call {phone}": the first button of the hero (the number comes from @/lib/business). */
  callLabel: "Call",
  primaryAction: { label: "Meet the Family", href: "#team" },
  secondaryAction: { label: "Request Service", href: "/booking" },
  /** Prefix of the award line under the actions ("Voted Best Plumbing Contractor"). */
  awardVotedPrefix: "Voted",
} as const;

export const ABOUT_STORY = {
  overline: "Our Story",
  title: "A Family Trade, Passed Down by Hand",
  pullLine: "Some companies sell plumbing. We inherited it.",
  stats: [
    { value: "9,500+", label: "Homes Plumbed" },
    { value: "28+", label: "Years of Service" },
  ],
  /** The third stat is the live rating: "{rating}★" over "{count} Google Reviews". */
  reviewsLabel: "Google Reviews",
  storefront: {
    image: "/images/history/og-storefront.jpg",
    alt: "The original C&S Plumbing of Lee storefront in the early days",
  },
  portrait: {
    image: "/images/team/sam-and-aiden.jpg",
    alt: "Sam Pellechio Jr. with a young Aiden — the family trade passed down by hand",
  },
} as const;

export interface Generation {
  gen: string;
  /** The short tag that used to sit on the photo ("Gen 1"). */
  tag: string;
  name: string;
  label: string;
  image?: string;
  /** CSS object-position that keeps the face in frame inside the 4:3 frame. */
  imagePosition?: string;
  note?: string;
  body: string;
}

export const ABOUT_GENERATIONS = {
  overline: "Three Generations",
  title: "One Name on Every Job",
  subtitle: "The trade, handed down father to son — and the people who carry it now.",
  items: [
    {
      gen: "First Generation",
      tag: "Gen 1",
      name: "Samuel Pellechio Sr.",
      label: "The Foundation",
      image: "/images/team/sam-sr-office.jpg",
      note: "In loving memory",
      body: "A mason and general contractor in Philadelphia who built thousands of homes before moving the family to Cape Coral in 1984. He taught his sons that craftsmanship isn't a shortcut business — you do it right, and you stand behind it. Every standard C&S holds today traces back to him.",
    },
    {
      gen: "Second Generation",
      tag: "Gen 2",
      name: "Chris & Sam — Founders",
      label: "Owner & Co-Founder: Samuel Pellechio Jr.",
      image: "/images/team/chris-and-sam.jpg",
      body: "Both Cape Coral High grads. Sam earned his plumbing license in December 1997 and, with his brother Chris and their father's backing, founded C&S Plumbing of Lee in Cape Coral in 1998 — C&S, for Chris and Sam. Sam has led it ever since: honest work, fair pricing, and treating every customer like family, growing C&S into one of Southwest Florida's most trusted plumbing companies.",
    },
    {
      gen: "Third Generation",
      tag: "Gen 3",
      name: "Aiden Pellechio",
      label: "Office Manager, Estimating & Project Management",
      image: "/images/team/aiden.jpg",
      imagePosition: "50% 30%",
      body: "Aiden grew up around C&S job sites and never really left. These days he runs the office, estimating and project management — and a little of everything else — while working toward his construction management degree at FGCU. The plan from there is to earn his GC license, then his plumbing license, and keep the name on the truck right where it's always been.",
    },
  ] satisfies Generation[],
};

export const ABOUT_TIMELINE = {
  overline: "Our Journey",
  title: "28+ Years of Excellence",
  subtitle: "From a single truck to Southwest Florida's most trusted plumbing team.",
  /** Names the timeline for screen readers (the Stepper's nav landmark). */
  label: "C&S Plumbing of Lee timeline",
} as const;

export const ABOUT_MISSION = {
  overline: "Our Mission",
  statement:
    "To carry forward three generations of plumbing craftsmanship across Southwest Florida — treating every home like our own, charging fairly, and standing behind every connection we make. We're not just installing plumbing.",
  emphasis: "We're protecting the homes our neighbors live in.",
  values: [
    { title: "Honest Work", body: "No cut corners. Our paperwork is open to anyone who asks." },
    { title: "Fair Pricing", body: "Free estimates, no hidden fees, ever." },
    { title: "Family Treatment", body: "We live in the same neighborhoods we work in." },
    { title: "Done Right the First Time", body: "Every pipe, every connection, every time." },
    { title: "Training the Trade", body: "We teach the next generation so it stays strong." },
  ],
} as const;

export const ABOUT_TEAM = {
  overline: "Our Team",
  title: "Meet the People Behind Every Job",
  subtitle: "The family and crew keeping Southwest Florida flowing.",
  /** Under the portraits: who runs the office (OFFICE_CONTACTS in src/lib/business.ts). */
  office: {
    heading: "In the office",
    lead: `${OFFICE_CONTACTS.map((person) => person.name.split(" ")[0]).join(" and ")} run the office. Call or email and ask for either of them.`,
  },
} as const;

export const ABOUT_CREDENTIALS = {
  overline: "Why Homeowners & Builders Trust Us",
  title: "Licensed, insured, and accountable to the community we live in.",
  lead: "The plumbing trade in Florida has high stakes — get it wrong and water damage ruins floors, walls, and equipment. We don’t cut corners, and our paperwork is open to anyone who asks.",
  stats: {
    years: { value: "28+", label: "Years in business" },
    homes: { value: "9,500+", label: "Homes plumbed" },
    /** "{count} Google reviews" under the live rating. */
    reviewsLabel: "Google reviews",
    /** "{n}×" over this label. */
    awardsLabel: "Best of Cape Coral",
  },
  /** Names the credentials list for screen readers. */
  listLabel: "Credentials",
} as const;

export const ABOUT_TRAINING = {
  overline: "Training the Next Generation",
  title: "Keeping the Trade Strong",
  body: "We train every apprentice through a structured 4-year program covering Florida Building Code, drainage and venting design, gas, and code-compliant install practices. The trade only stays strong if we keep teaching it — the same way it was taught to us.",
} as const;

/* -------------------------------------------------------------- Reviews -- */

export const REVIEWS_PAGE = {
  overline: "Reviews",
  title: "What Your Neighbors",
  accent: "Say",
  writeReviewLabel: "Leave Us a Review",
  readAllLabel: "Read All on Google",
  /** "Based on {total}+ verified Google reviews across Southwest Florida" */
  basedOnPrefix: "Based on",
  basedOnSuffix: "+ verified Google reviews across Southwest Florida",
  listLabel: "Google reviews",
  sourceNote: "Reviews shown are from our public Google Business Profile.",
  ratingTitle: "A 5.0 Rating",
  ratingAccent: "Isn't Luck",
  shareLabel: "Share Your Experience",
  /** "Call {phone}" in the hero. */
  callLabel: "Call",
  shareBody:
    "Had us out recently? A quick Google review helps your neighbors find a plumber they can trust — and it means a lot to our family.",
} as const;

/* --------------------------------------------------------------- Awards -- */

export const AWARDS_PAGE = {
  overline: "Community Voted",
  title: "Awards &",
  accent: "Recognition",
  list: {
    overline: "Best of Cape Coral",
    title: "Voted by the people",
    accent: "we work for",
    awardedLabel: "Awarded",
    votedByLabel: "Voted by",
    /** "{issuer} readers" */
    readersSuffix: "readers",
  },
  how: {
    overline: "How it's decided",
    title: "What a Best of Cape Coral",
    accent: "award actually means",
    subtitle:
      "It isn't a paid list or a panel of judges. It's a readership vote run by the city's newspaper — and the votes come from people whose homes we've been in.",
    steps: [
      {
        title: "Readers vote",
        body: `Each summer the ${LATEST_AWARD.issuer} opens Best of Cape Coral voting. Residents nominate and vote for the local businesses they trust, category by category.`,
      },
      {
        title: "Most votes wins",
        body: "The business with the most reader votes in each category wins. There's no judging panel — the result is the community's call.",
      },
      {
        title: "Published each fall",
        body: "Winners are announced in September and published in the Breeze's Best of Cape Coral Winners Book, with a luncheon for the winners in October.",
      },
    ],
  },
  /** "Call {phone}" in the hero. */
  callLabel: "Call",
  faq: {
    overline: "Questions",
    title: "About the",
    accent: "awards",
  },
} as const;

/* ------------------------------------------------------------- Partners -- */

export const PARTNERS_PAGE = {
  overline: "Recommended Companies",
  title: "Local Businesses",
  accent: "We Trust",
  description:
    "We believe in supporting our community. These are local, family-owned companies we've worked alongside and trust to deliver quality work for our customers.",
  listHeading: "Trusted contractor partners",
  allLabel: "All",
  filterLabel: "Filter by category",
  websiteLabel: "Website",
  emptyLabel: "No companies listed in this category yet.",
  /** "Call {phone}" in the hero (C&S's own line; the partner numbers are their own). */
  callLabel: "Call",
} as const;
