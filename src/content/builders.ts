import { BUSINESS } from "@/lib/business";

/**
 * Words of the builders family (/builders, /builder-portal,
 * /builders/review and /new-construction-plumbing/[city]) that used to be
 * typed inside the components. Moved here word for word; the data itself
 * (phases, qualifications, prequal documents, cities, logos, gallery) stays
 * in src/lib/builder-program.ts and src/lib/builders-data.ts.
 *
 * Client-safe: imported by the portal wizard and the gallery filter, so it
 * reads nothing but @/lib/business.
 */

export const BUILDERS_HUB = {
  hero: {
    overline: "For Builders & General Contractors",
    accent: "Since 1998",
    /** Followed by BUILDER_PROOF.subline. */
    leadPrefix: "New construction plumbing for builders and GCs across Lee and Charlotte counties, from slab layout to final.",
    bidAction: "Submit Plans for a Bid",
    capabilityAction: "Capability Statement",
    /** Followed by the builder desk's phone number. */
    call: "Call",
  },
  logoWall: {
    overline: "Trusted By",
    title: "Builders Who Choose C&S",
    subtitle:
      "From custom waterfront homes to large-scale production builds, these builders trust C&S Plumbing to deliver on time and on code.",
  },
  gallery: {
    overline: "Our Work",
    title: "Project Gallery",
    subtitle: "New construction, commercial, and remodel plumbing across Southwest Florida.",
    filterLabel: "Filter projects",
    empty: "No projects in this category yet.",
    allProjects: "View All Projects",
    categories: [
      { id: "all", label: "All" },
      { id: "custom-residential", label: "Custom Residential" },
      { id: "production", label: "Production" },
      { id: "light-commercial", label: "Light Commercial" },
      { id: "remodel", label: "Remodel" },
    ],
  },
  caseStudies: {
    overline: "Results",
    title: "How We Deliver for Builders",
    subtitle:
      "Real challenges, real solutions. Here's what it looks like when your plumber is a partner, not just a sub.",
    challenge: "Challenge",
    action: "Action",
    outcome: "Outcome",
  },
  cities: {
    overline: "Where we build",
    title: "New construction plumbing by city",
    subtitle: "Local permitting and site conditions for each market we plumb.",
    /** The Builder Portal's own name, as the navigation prints it. */
    portal: "Builder Portal",
  },
  faq: {
    overline: "FAQ",
    title: "Questions from Builders & GCs",
  },
} as const;

export const BUILDER_SECTIONS = {
  proof: {
    overline: "Three generations",
    generationSuffix: "generation",
  },
  phases: {
    overline: "Scope by phase",
    title: "Slab to final, one plumbing sub",
    subtitle:
      "What we do in each phase, what we need on site before we show up, and which inspection closes it out.",
    stepperLabel: "Construction phases",
    phase: "Phase",
    weDo: "What we do",
    weNeed: "What we need from the framer / GC",
    /** The toggle that opens a phase's two lists on phones. */
    detailsToggle: "What we do and what we need",
  },
  swfl: {
    overline: "Built for Southwest Florida",
    title: "What's different about plumbing here",
    subtitle:
      "Southwest Florida soil, flood zones and utilities change how new construction plumbing goes in.",
  },
  scheduling: {
    overline: "Scheduling & coverage",
    title: "Upcoming starts",
    whereWeWork: "Where we work",
    talkToEstimating: "Talk to estimating",
    orSend: ", or ",
    sendPlans: "send plans for a bid",
  },
  qualifications: {
    overline: "Qualifications",
    title: "What your office will ask about",
    subtitle: "Insurance, safety, billing and how we staff the work.",
    source: "Source:",
    profile: "profile",
    /** Followed by the date the ranking was checked and ")". */
    checkedPrefix: "(third-party ranking, checked",
  },
  prequal: {
    overline: "Prequalification",
    title: "Capability statement & prequal packet",
    subtitle:
      "What your office needs to set us up as a vendor. Licenses verify online; everything else is sent by our office on request.",
    capabilityPdf: "Capability statement (PDF)",
    prequalPdf: "Prequal packet (PDF)",
    requestDocuments: "Request documents",
    request: "Request",
    requestsGoTo: "Document requests go to",
    requestsNote: ". Tell us the project and any certificate-holder or additional-insured wording.",
    /** The toggle that opens the document list on phones. */
    showAll: (count: number) => `Show all ${count} documents`,
  },
  desk: {
    overline: "Your point of contact",
    title: "A project management desk for builders",
    subtitle:
      "Builder work runs through our office: one team handling bids, schedule and sequencing, backed by the same crews that have been in the field since 1998.",
    bidsAndScheduling: "Bids and scheduling:",
  },
} as const;

/** The steps after a plan submission, shared by the portal and beside the bid forms. */
export const AFTER_SUBMIT = {
  title: "What happens after you submit",
  steps: [
    {
      title: "Plans received",
      description:
        "You'll get a confirmation email immediately, and our office picks it up from there.",
    },
    {
      title: "Takeoff & questions",
      description:
        "We work through the plumbing scope and reach out with any clarifying questions on fixtures, materials, or scheduling.",
    },
    {
      title: "Written proposal",
      description:
        "Detailed written proposal — scope, materials, schedule, price, and warranty terms.",
    },
    {
      title: "Kickoff scheduled",
      description:
        "Once approved, we lock in rough-in dates and coordinate with your other trades to keep the build on track.",
    },
  ],
} as const;

export const NC_CITY = {
  overline: (city: string) => `For builders & GCs · ${city}, FL`,
  title: "New Construction Plumbing in",
  accent: (city: string) => `${city}, FL`,
  breadcrumb: (city: string) => `New Construction Plumbing — ${city}`,
  bidAction: "Submit Plans for a Bid",
  capabilityAction: "Capability Statement",
  /** Followed by the builder desk's phone number. */
  call: "Call",
  conditionsOverline: (city: string) => `${city} site conditions`,
  conditionsTitle: (city: string) => `What changes the plumbing in ${city}`,
  /** "Permits and inspections in {city}: {authority}." */
  permitsPrefix: (city: string) => `Permits and inspections in ${city}:`,
  projectsOverline: "Documented builds",
  projectsHeading: (city: string) => `Our work in ${city}`,
  projectsDescription: (city: string) => `Jobs we've photographed phase by phase in ${city}.`,
  bidHeading: (city: string) => `Submit ${city} plans for a bid`,
  prequalQuestion: "Need our license, COI or W-9 first?",
  prequalLink: "See the prequal packet",
  faqOverline: "FAQ",
  faqTitle: (city: string) => `${city} new construction questions`,
  linksOverline: "Where we build",
  allBuilderServices: "All builder services",
  serviceArea: (city: string) => `${city} service area`,
} as const;

export const BUILDER_REVIEW = {
  overline: "For builders & GCs",
  title: "How did we",
  accent: "do on your job?",
  description:
    "Other builders pick a plumbing sub on what builders say. There's no script. Write it in your own words, good or bad.",
  promptsTitle: "Not sure where to start?",
  promptsNote: "Pick any of these that apply, or skip them. They're prompts, not a template.",
  writeReview: "Write a Google review",
  fixPrefix:
    "Something we should fix before the next job? Tell our project management desk directly at",
  fixSuffix: ". That goes to our team, and it doesn't replace a public review.",
} as const;

export const BUILDER_PORTAL = {
  hero: {
    overline: "Builder Portal",
    builderStory: "See our full builder story",
    title: "Plans in. Quote out.",
    accent: "Crews ready.",
    leadStart: "C&S Plumbing has been the underground-to-trim partner for Lee County builders since 1998. ",
    leadStrong: "9,500+ homes plumbed",
    leadEnd: `, Florida Certified Plumbing Contractor license ${BUSINESS.license}, and a 5.0 rating from the GCs and custom home builders we work with every week.`,
    lead2:
      "Upload your plans below. We'll come back with a detailed takeoff and proposal — no upfront cost, no commitment.",
    submitPlans: "Submit Plans",
    licenseLine: `License #${BUSINESS.license} · #${BUSINESS.license2} · Family owned and operated since 1998`,
  },
  why: {
    overline: "Why C&S",
    title: "Why builders choose us for the plumbing scope",
    subtitle: "The plumber on a project either keeps the schedule or breaks it. We keep it.",
    items: [
      {
        title: "Rough-in to trim",
        description:
          "Full underground, in-wall rough, water heater set, fixture trim, and final inspection on every project.",
      },
      {
        title: "Permit + inspection support",
        description:
          "We pull permits, coordinate inspections, and own the paperwork so your project clears Lee County without delay.",
      },
      {
        title: "On-schedule delivery",
        description:
          "Lee County crews staged across the service area. We hit your rough-in date and stay coordinated with your other trades.",
      },
      {
        title: "Code-compliant from day one",
        description: `Florida Certified Plumbing Contractor license ${BUSINESS.license}; co-founder Samuel Pellechio also holds ${BUSINESS.license2}. Every fixture, slope, and vent meets current FL Building Code.`,
      },
    ],
  },
  process: {
    overline: "Our process",
    // A no-break space keeps the dash from starting a line.
    title: "Plan to inspection — no surprises",
    subtitle: "The same playbook we've run on 9,500+ homes.",
    steps: [
      { title: "Plans uploaded", description: "Submit prints, scope notes, and target dates via the form below." },
      { title: "Takeoff & proposal", description: "Detailed plumbing takeoff and written proposal back to you." },
      {
        title: "Kickoff scheduled",
        description:
          "Once approved, we schedule rough-in around your slab / framing dates and confirm material delivery.",
      },
      { title: "Rough-in", description: "Underground first, then in-wall. Pressure-tested before pour and before drywall." },
      {
        title: "Trim & final inspection",
        description:
          "Fixture trim, water heater set, and final county inspection. We don't leave until it's signed off.",
      },
    ],
  },
  logos: {
    overline: "Who we build with",
    title: "Lee County's busiest builders pick C&S",
    subtitle:
      "From custom homes to commercial developments, these builders trust us to keep their projects moving.",
    altSuffix: "C&S Plumbing builder partner",
  },
  need: {
    overline: "What we need from you",
    title: "What to send with your plans",
    items: [
      "Site plans and architectural drawings (PDF or DWG)",
      "Plumbing fixture schedule (or rough fixture count if not finalized)",
      "Permit set if you have one — otherwise we'll work from the architecturals",
      "Target rough-in date and any GC scheduling constraints",
    ],
    submitPlans: "Submit Plans",
  },
  wizard: {
    overline: "Submit your plans",
    title: "Send us your project",
    intro:
      "Four short steps — contact info, project details, plans, then review. We'll get back to you with a detailed scope and quote.",
    progressLabel: "Submission steps",
    steps: ["Contact", "Project", "Plans", "Review"],
    contact: {
      title: "Your Contact Information",
      name: { label: "Full Name *", placeholder: "John Smith" },
      company: { label: "Company Name *", placeholder: "Smith Builders LLC" },
      email: { label: "Email *", placeholder: "john@smithbuilders.com" },
      phone: { label: "Phone *", placeholder: "(239) 555-0123" },
    },
    project: {
      title: "Project Details",
      address: { label: "Project Address *", placeholder: "123 Main St, Cape Coral, FL 33904" },
      community: { label: "Community / Subdivision", placeholder: "e.g. Cape Coral Unit 42, or scattered lots" },
      projectType: "Project Type *",
      units: { label: "Number of Units", placeholder: "e.g. 12" },
      sqft: { label: "Approx. Square Footage", placeholder: "e.g. 2,500" },
      startDate: "Target Start Date",
      budget: { label: "Budget Range", placeholder: "Select..." },
      description: {
        label: "Project Description *",
        placeholder: "Describe the scope of work, number of fixtures, any special requirements...",
        hint: "Minimum 10 characters",
      },
    },
    plans: {
      title: "Upload Plans & Documents",
      intro:
        "Upload blueprints, site plans, floor plans, or photos of existing conditions. This helps us provide a more accurate quote.",
    },
    review: {
      title: "Review Your Submission",
      edit: "Edit",
      contact: "Contact Info",
      project: "Project Details",
      files: "Uploaded Files",
      noFiles: "No files uploaded",
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      address: "Address",
      community: "Community",
      type: "Type",
      units: "Units",
      sqft: "Sq Ft",
      startDate: "Start Date",
      budget: "Budget",
      description: "Description",
    },
    back: "Back",
    next: "Continue",
    submit: "Submit Quote Request",
    submitting: "Submitting...",
  },
  success: {
    title: "Quote Request Submitted",
    /** "Thank you, {name}! We've received your project details{ and N files}." */
    thanks: (name: string, fileCount: number) =>
      `Thank you, ${name}! We've received your project details${
        fileCount > 0 ? ` and ${fileCount} file${fileCount !== 1 ? "s" : ""}` : ""
      }.`,
    next: "Our team will review your plans and follow up with a detailed scope and quote.",
    home: "Back to Home",
  },
} as const;
