/**
 * Words of the Services pages that used to be typed inside components:
 * headings, labels and button text, moved here word for word. Page data
 * (SERVICES, SERVICE_LANDINGS, prices, FAQs) stays in src/lib and in the
 * page files; nothing here is a price or a business fact.
 *
 * Plain strings only, no imports: the cost estimator (a client component)
 * reads ESTIMATOR_COPY from this file.
 */

/** /services */
export const SERVICES_INDEX = {
  /** The hero photograph: a named position in media.json (a C&S kitchen job). */
  heroPhoto: "service.header.residential",
  hero: {
    overline: "Our Services",
    title: "Every Plumbing Solution",
    accent: "Under One Roof",
    description:
      "From a dripping faucet to a 500-unit development, C&S Plumbing has the expertise, equipment, and team to handle it all.",
  },
  /** The grid's heading for screen readers (the hero says it visually). */
  gridHeading: "All plumbing services",
  /** Tiles in two groups; ids are SERVICES ids, listed in SERVICES order. */
  groups: [
    {
      id: "for-your-home",
      title: "For your home",
      serviceIds: ["repiping", "remodeling", "uep-utilities", "water-heaters", "drain-cleaning", "water-quality", "emergency"],
    },
    {
      id: "for-builders-business",
      title: "For builders & business",
      serviceIds: ["new-construction", "commercial"],
    },
  ],
  tileMore: "Learn more",
  estimator: {
    overline: "Quick Estimate",
    title: "How Much Will It Cost?",
    subtitle:
      "Get a rough estimate for your plumbing project in seconds. Select a service and answer a quick question to see typical price ranges.",
    note: "*All estimates are approximate and vary based on specific conditions, materials, and scope. Contact us for a free, accurate quote.",
  },
} as const;

/** The cost estimator on /services (client component). */
export const ESTIMATOR_COPY = {
  title: "Cost Estimator",
  tagline: "Get a rough estimate in seconds",
  pickService: "What service do you need?",
  /** "What type of {service, lower case}?" */
  pickFactorBefore: "What type of ",
  pickFactorAfter: "?",
  startOver: "Start over",
  disclaimer: "*Estimate only. Actual cost depends on specific conditions.",
  disclaimerMore: "Contact us for a free, accurate quote.",
  book: "Book a Service",
  bookHref: "/booking",
  again: "Try another service",
  detailed: "Want a detailed estimate? Build your custom quote →",
  detailedHref: "/quote-builder",
} as const;

/** The shared parts of every service page. */
export const SERVICE_PAGE = {
  call: "Call",
  book: "Book a Service",
  request: "Request Service",
  typicalRange: "Typical range:",
  /** UEP Utilities words its range line differently. */
  typicalPriceRange: "Typical price range:",
  getQuote: "Get a Quote",
  requestForm: {
    titleBefore: "Request ",
    titleRepipe: "a Repipe Estimate",
    titleWaterHeater: "Water Heater Service",
    intro: "Tell us how to reach you and where you need service. Our office will follow up to discuss the work.",
  },
  answers: {
    overline: "Quick Answers",
    title: "What homeowners ask us first",
  },
  offer: "What We Offer",
  /** "Why Choose C&S for {service}" */
  whyBefore: "Why Choose C&S for ",
  gallery: {
    overline: "Recent Work",
    /** "Real {service} jobs" */
    titleBefore: "Real ",
    titleAfter: " jobs",
    titleFallback: "Real jobs from our crews",
    description:
      "Photos from actual C&S Plumbing jobs across Lee, Collier, and Charlotte counties. No stock images — this is what we do every day.",
  },
  cost: {
    title: "What it actually costs in SWFL",
    description: "Real ranges from C&S jobs in Lee County. Final price is based on a free in-home assessment.",
    cta: "Get your exact quote",
  },
  /** "Recent {service} jobs" */
  casesBefore: "Recent ",
  casesAfter: " jobs",
  faq: "Frequently Asked Questions",
  related: {
    services: "Related services",
    /** "{service} across SWFL" */
    areasAfter: " across SWFL",
    cityPages: "Get local pricing",
  },
} as const;

/**
 * The header photograph of a service page that has no named header position
 * (service.header.<slug>) yet: a real C&S job photo from that page's own job
 * gallery. The services index uses the same photo for the service's tile when
 * home.service.<slug> is empty. A named position, once filled, wins.
 */
export const SERVICE_PHOTO_FALLBACK: Readonly<Record<string, { src: string; position?: string }>> = {
  repiping: { src: "/images/gallery/attic-pex-repipe.jpg", position: "50% 45%" },
  "drain-cleaning": { src: "/images/gallery/residential-sewer-excavation.jpg", position: "50% 60%" },
  "leak-repair": { src: "/images/gallery/residential-excavation.jpg", position: "50% 55%" },
  "water-softeners": { src: "/images/gallery/water-filtration-system.jpg", position: "50% 40%" },
};

/**
 * Job photos shown when a service lists fewer than three of its own
 * (the old JobGallery fallback, same files and captions).
 */
export const DEFAULT_JOB_PHOTOS: readonly { src: string; caption?: string }[] = [
  { src: "/images/gallery/cs-plumbing-crew.jpg", caption: "Our crew on site" },
  { src: "/images/gallery/new-construction-roughin.jpg", caption: "New construction rough-in" },
  { src: "/images/gallery/kitchen-faucet-sink.jpg", caption: "Kitchen faucet install" },
  { src: "/images/gallery/tank-water-heater-replacement.jpg", caption: "Water heater replacement" },
  { src: "/images/gallery/underground-pipe-work.jpg", caption: "Underground pipe work" },
  { src: "/images/gallery/freestanding-soaking-tub.jpg", caption: "Freestanding tub install" },
];

/** /services/residential */
export const RESIDENTIAL_PAGE = {
  faqTitle: "Residential Plumbing FAQs",
  faqDescription: "Common questions from Southwest Florida homeowners.",
} as const;

/** /services/commercial */
export const COMMERCIAL_PAGE = {
  faqOverline: "FAQ",
  faqTitle: "Commercial Plumbing Questions",
} as const;

/** /services/new-construction */
export const NEW_CONSTRUCTION_PAGE = {
  partner: "Partner With Us",
  partnerHref: "/builders",
  bigNumber: "9,500+",
  bigNumberCaption: "New Construction Homes Plumbed Across SWFL",
  processOverline: "Our Process",
  processTitle: "From Blueprint to Move-In",
  faqOverline: "FAQ",
  faqTitle: "New Construction Plumbing Questions",
} as const;

/** /services/uep-utilities */
export const UEP_PAGE = {
  galleryTitle: "Our UEP Work",
} as const;
