/**
 * Words of the Projects and Gallery pages that used to be typed inside the
 * components, moved here unchanged. The projects themselves (names, facts,
 * phases, case studies) stay in src/lib (constants → projects-data); the
 * gallery photos and their titles stay in public/images/gallery/images.json.
 *
 * Plain data, safe for server and client components.
 */

/** The two buttons in the first screen of every page of this family. */
export const PROJECTS_ACTIONS = {
  /** Followed by BUSINESS.phone. */
  call: "Call",
  book: { label: "Book a Service", href: "/booking" },
} as const;

/** /projects */
export const PROJECTS_INDEX = {
  overline: "Our Work",
  title: "Real jobs. Real craftsmanship.",
  description:
    "From below-slab underground to final trim — new construction, commercial buildouts, and remodels across Southwest Florida. Tap any project to walk it phase by phase.",
  stats: {
    homes: "Homes Plumbed",
    photos: "Site photos",
    cities: "Cities",
    /** Appended to each figure. */
    suffix: "+",
  },
  featured: {
    label: "Featured",
    cta: "Explore project",
  },
  filter: {
    all: "All",
    label: "Filter projects by category",
    empty: "No projects in this category yet — check back soon.",
  },
  photos: (n: number) => `${n} photos`,
  phases: (n: number) => `${n} phases`,
} as const;

/** /projects/[slug] */
export const PROJECT_PAGE = {
  breadcrumb: { home: "Home", projects: "Projects" },
  walk: "Scroll to walk the build",
  /** The small line over each phase heading ("Phase 2 of 3"). */
  phaseOf: (n: number, total: number) => `Phase ${n} of ${total}`,
  facts: {
    client: "Client",
    timeline: "Timeline",
    completed: "Completed",
    cost: "Cost",
    location: "Location",
    photos: "Photos",
  },
  caseStudy: {
    overline: "Case study",
    heading: "How we approached this project",
    challenge: "The challenge",
    solution: "Our solution",
    scope: "Scope of work",
    permits: "Permits & inspections",
    materials: "Materials installed",
  },
  /** CaseStudyFacts (only on projects with builder case-study facts). */
  glance: {
    overline: "Builder case study",
    heading: "The job at a glance",
    builder: "Builder",
    location: "Location",
    homeType: "Home type",
    projectType: "Project type",
    fixtures: "Fixtures",
    phasesPerformed: "Phases performed",
    projectManagement: "Estimating & PM",
    schedule: "Schedule vs. plan",
    planned: "Planned:",
    actual: "Actual:",
    inspections: "Inspection results",
    fieldProblem: "Field problem solved",
    problem: "Problem:",
    solution: "Solution:",
  },
  /** ProjectCrossLinks */
  crossLinks: {
    overline: "Where this work fits",
    heading: "Need the same scope on your job?",
    open: "Open",
    service: {
      label: "Service",
      blurb: (title: string) => `Everything we do for ${title.toLowerCase()} across Southwest Florida.`,
    },
    area: {
      label: "Service area",
      title: (city: string) => `Plumber in ${city}`,
      blurb: (city: string) => `Residential, commercial and emergency plumbing in ${city}.`,
    },
    cityPage: {
      label: "Local pricing",
      blurb: (range: string) => `Typical range ${range}. Free written estimates.`,
      fallback: "Local scope, pricing and FAQs for this service.",
    },
  },
  related: {
    overline: "Keep looking",
    heading: (city: string | undefined, category: string) =>
      city ? `More of our work in and around ${city}` : `More ${category.toLowerCase()} projects`,
    description:
      "Every project is documented phase by phase — underground, rough-in and trim — so you can judge the work, not the pitch.",
  },
} as const;

/** /gallery */
export const GALLERY_PAGE = {
  overline: "Our Work",
  title: "Project",
  accent: "Gallery",
  description:
    "Browse our portfolio of residential, commercial, and new construction plumbing projects across Southwest Florida.",
  /** Visually hidden heading of the grid (keeps the outline h1 → h2). */
  gridHeading: "Project gallery",
  /** Lightbox title. */
  lightboxTitle: "Project gallery",
} as const;
