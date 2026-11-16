/**
 * Words and settings of the homepage. Change the text here, not in the
 * components. Wording that was already on the site is kept word for word.
 */

export const hero = {
  /** The homepage H1. Word for word; do not reword (search results and the content snapshot depend on it). */
  headline: "Southwest Florida's Most Trusted Plumbing Team",
  lead:
    "Family owned and operated since 1998, with 9,500+ homes plumbed. New construction for builders, and repairs, repipes and remodels for homeowners across Cape Coral, Fort Myers and Southwest Florida.",
  /** Labels of the hero actions. The call label reads the phone number from @/lib/business. */
  bookLabel: "Book a Service",
  quoteLabel: "Get an instant quote",
  /** Trust line just under the hero: this, the license number, then the latest award. */
  licensePrefix: "Florida Certified Plumbing Contractor",
  /** Accessible names of the film control. */
  pauseLabel: "Pause the film",
  playLabel: "Play the film",
};

/* ---------------------------------------------------------------------------
 * The eight chapters under the hero. Every line below was already on the
 * homepage; it moved here word for word from the old components. Numbers,
 * prices, response times and business facts are not typed here: they come
 * from @/lib (STATS, SERVICES, PRICES, EMERGENCY_CLAIMS, BUSINESS, AWARDS).
 * ------------------------------------------------------------------------ */

/** Chapter 1: the two doors under the hero. `slot` is the photograph's named position in media.json. */
export const doors = [
  {
    href: "/builders",
    slot: "home.door.build",
    label: "Builders & GCs",
    title: "New construction, slab to final",
    body: "Scope by phase, prequal packet, submit plans for a bid.",
    cta: "Builder services",
  },
  {
    href: "/booking",
    slot: "home.door.home",
    label: "Homeowners / Service",
    title: "Repairs, repipes & remodels",
    body: "Water heaters, leaks, drains, fixtures, whole-home repipes.",
    cta: "Book a service",
  },
];

/** Chapter 1: the proof strip. The numbers are STATS in @/lib/constants; the rating is the live Google rating. */
export const proof = {
  label: "Proof",
  ratingSuffix: "Stars",
  reviewsSuffix: "Reviews",
  emergencyLead: "Plumbing emergency?",
  emergencyLink: { href: "/emergency", label: "24/7 service" },
  trust: ["Licensed & Insured", "9,500+ Homes Plumbed", "Free Estimates"],
  awardPrefix: "Voted",
};

/** Chapter 2: services. */
export const services = {
  overline: "What We Do",
  title: "Expert Plumbing Services",
  subtitle:
    "From emergency repairs to large-scale construction, our team delivers precision and reliability on every job.",
  tileCta: "Learn more",
  allLink: { href: "/services", label: "All services" },
};

/** Chapter 2: the emergency band. The response time comes from EMERGENCY_CLAIMS. */
export const emergency = {
  overline: "24/7 Emergency Response",
  title: "Burst pipe at 2 AM? We're already rolling.",
  /** The line under the heading; `responseTime` is EMERGENCY_CLAIMS.responseTime. */
  body: (responseTime: string) =>
    `Response ${responseTime}. Upfront pricing before any work begins — nights, weekends, and holidays included.`,
  callLine: "One call. A licensed plumber on the way.",
  licensePrefix: "Florida Certified Plumbing Contractor",
  ariaLabel: "24/7 emergency plumbing",
};

/** Chapter 2: the Coastal Comeback row. The seasonal wording is SEASON_COPY in @/lib/claims; prices come from PRICES. */
export const coastal = {
  plansLink: { href: "/coastal-comeback-plan", label: "See the Plans" },
  plansListLabel: "Annual Plans",
  plansHref: "/coastal-comeback-plan#plans",
  tiers: [
    { name: "Coastal Comfort", price: "plan.comfort" },
    { name: "Coastal Shield", price: "plan.shield", featured: true },
    { name: "Coastal Smart", price: null },
  ] as const,
  featuredBadge: "Best",
  /** Shown where a tier has no listed price. */
  callPrice: "Call",
  note: "Cancel anytime. Available across Cape Coral, Fort Myers, Naples, Bonita Springs & all of Lee & Collier County.",
};

/** Chapter 2: the brands row. */
export const brands = {
  overline: "Our Brands",
  title: "Trusted Brands We Install",
  subtitle:
    "We work with the industry's best manufacturers to deliver quality, durability, and performance on every job.",
  items: [
    { name: "Moen", logo: "/images/brands/moen.png" },
    { name: "Delta", logo: "/images/brands/delta.svg" },
    { name: "Kohler", logo: "/images/brands/kohler.png" },
    { name: "A.O. Smith", logo: "/images/brands/ao-smith.svg" },
    { name: "Rinnai", logo: "/images/brands/rinnai.svg" },
    { name: "Uponor", logo: "/images/brands/uponor.png" },
    { name: "Navien", logo: "/images/brands/navien.png" },
    { name: "InSinkErator", logo: "/images/brands/insinkerator.png" },
  ],
};

/** Chapter 3: walk the job (the chapter name from the approved plan) and the builders logo wall. */
export const walk = {
  title: "Walk the job",
  projects: ["ifha-community-center", "usps-cape-coral-remodel"],
  allLink: { href: "/projects", label: "All projects" },
};

export const builders = {
  overline: "Our Partners",
  title: "Builders Who Trust C&S",
  subtitle:
    "From custom homes to commercial developments, builders across Southwest Florida choose C&S Plumbing for reliability and quality.",
  link: { href: "/builders", label: "Builder services" },
};

/** Chapter 4: the family story and "Built on Trust". Award and license wording is built from @/lib in the component. */
export const family = {
  overline: "Why C&S",
  title: "Built on Trust, Backed by Results",
  subtitle:
    "28+ years of keeping Southwest Florida flowing. Here's why thousands of homeowners and builders choose C&S.",
  reasons: {
    family: {
      title: "Family-Owned & Operated",
      description:
        "Three generations strong. We treat every home like it's our own because our reputation is our livelihood.",
    },
    /** The award row: its title is LATEST_AWARD.title; the facts come from @/lib/awards and @/lib/business. */
    award: (a: { category: string; issuer: string }, rating: string, reviewCount: number) =>
      `Voted ${a.category} by ${a.issuer} readers — and rated ${rating} stars across ${reviewCount} Google reviews by the homeowners we serve.`,
    emergency: {
      title: "24/7 Emergency Response",
      description:
        "Pipes don't wait for business hours. Neither do we. Call anytime, day or night, and we'll be there.",
    },
    licensed: {
      title: "Licensed & Insured",
      /** "Fully licensed ({BUSINESS.license}), " goes before this. */
      descriptionAfterLicense: "bonded, and insured. Your property and your peace of mind are protected.",
      licenseLead: "Fully licensed",
    },
    guarantee: {
      title: "Satisfaction Guaranteed",
      description:
        "We stand behind every job with a satisfaction guarantee. If you're not happy, we'll make it right.",
    },
    estimates: {
      title: "Free Estimates",
      description:
        "Transparent pricing with no surprises. We assess your needs and provide clear, upfront estimates before any work begins.",
    },
  },
  aboutLink: { href: "/about", label: "Our story" },
};

/** Chapter 5: where we work. The response time comes from EMERGENCY_CLAIMS; the areas from AREA_LANDINGS. */
export const areas = {
  id: "service-areas",
  overline: "Service Areas",
  title: "Serving All of Southwest Florida",
  /** `responseTime` is EMERGENCY_CLAIMS.responseTime. */
  subtitle: (responseTime: string) => `From Cape Coral to Naples — response ${responseTime}.`,
  countySuffix: "County",
  more: "Plus Fort Myers Beach, Captiva Island, Punta Gorda, Port Charlotte, Marco Island & more.",
  bookLink: { href: "/booking", label: "Book a Plumber in Your Area" },
  mapLink: { href: "/service-map", label: "Service map" },
};

/** Chapter 6: the award badges under the Google reviews. */
export const awards = {
  link: { href: "/awards" },
};

/** Chapter 7: guides and FAQ. */
export const guides = {
  overline: "From the blog",
  title: "Plumbing guides for Southwest Florida homeowners",
  description: "Costs, warning signs and storm prep, written for Cape Coral, Fort Myers and the rest of SWFL.",
  allLink: { href: "/blog", label: "All plumbing guides & tips" },
};

export const faq = {
  overline: "FAQ",
  title: "Common Questions",
  subtitle: "Quick answers about service, coverage, and what to expect from C&S Plumbing of Lee.",
  allLink: { href: "/faq", label: "FAQ" },
};
