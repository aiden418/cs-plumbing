import type { Builder, BuilderStat, BuilderGalleryItem, BuilderCaseStudy, BuilderSpecSheet } from "./types";

export const BUILDERS: Builder[] = [
  { name: "Alair Homes", logo: "/images/builders/alair-homes.svg" },
  { name: "Poseidon Homes", logo: "/images/builders/poseidon-homes.webp" },
  { name: "McDowell Construction", logo: "/images/builders/mcdowell.png" },
  { name: "Red Key Builders", logo: "/images/builders/red-key-builders.png" },
  { name: "Draft Construction LLC", logo: "/images/builders/draft-construction.png" },
  { name: "Heather Wood Construction", logo: "/images/builders/heather-wood.webp" },
  { name: "Stellar Development", logo: "/images/builders/stellar-development.jpg" },
  { name: "Engelke Construction Solutions", logo: "/images/builders/engelke.png" },
  { name: "Itasca Construction Associates", logo: "/images/builders/itasca.png" },
  { name: "Decker Homes", logo: "/images/builders/decker-homes.png" },
];

export const BUILDER_STATS: BuilderStat[] = [
  { value: 8500, suffix: "+", label: "Homes Since 1998" },
  { value: 3, suffix: "", label: "Counties: Lee, Collier, Charlotte" },
  { value: 20, suffix: "+", label: "Builder Partnerships" },
];

export const BUILDER_GALLERY: BuilderGalleryItem[] = [
  {
    id: "hansen-underground",
    src: "/images/projects/hansen-homes-cape-coral/underground/aerial-1.jpg",
    alt: "Hansen Homes new construction underground plumbing — Cape Coral aerial view",
    category: "production",
    caption: "Hansen Homes — Underground rough-in, Cape Coral",
    builder: "Hansen Homes",
  },
  {
    id: "hansen-underground-2",
    src: "/images/projects/hansen-homes-cape-coral/underground/aerial-3.jpg",
    alt: "Hansen Homes underground plumbing layout before slab pour",
    category: "production",
    caption: "Hansen Homes — Slab layout before pour",
    builder: "Hansen Homes",
  },
  {
    id: "seminal-build-1",
    src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-1.webp",
    alt: "306 Seminal Way custom new construction — Fort Myers Beach",
    category: "custom-residential",
    caption: "Custom Build — 306 Seminal Way, Fort Myers Beach",
  },
  {
    id: "seminal-build-2",
    src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-2.webp",
    alt: "Fort Myers Beach new construction plumbing build progress",
    category: "custom-residential",
    caption: "Custom Build — Fort Myers Beach in progress",
  },
  {
    id: "ifha-underground",
    src: "/images/projects/ifha-community-center/underground/IMG_0723.jpeg",
    alt: "IFHA Community Center commercial underground plumbing",
    category: "light-commercial",
    caption: "IFHA Community Center — Commercial underground",
  },
  {
    id: "ifha-trim",
    src: "/images/projects/ifha-community-center/trim-out/photo-0.jpg",
    alt: "IFHA Community Center commercial trim-out phase",
    category: "light-commercial",
    caption: "IFHA Community Center — Trim-out phase",
  },
  {
    id: "mangos-remodel",
    src: "/images/projects/mangos-bathroom-remodel/final/IMG_3409.jpeg",
    alt: "Mango's bathroom remodel — finished plumbing",
    category: "remodel",
    caption: "Bathroom Remodel — Finished result",
  },
  {
    id: "ifha-rough",
    src: "/images/projects/ifha-community-center/2nd-rough/IMG_0945.jpeg",
    alt: "IFHA Community Center second rough-in plumbing",
    category: "light-commercial",
    caption: "IFHA Community Center — 2nd rough-in",
  },
];

export const BUILDER_CASE_STUDIES: BuilderCaseStudy[] = [
  {
    id: "inspection-coordination",
    title: "Zero Failed Inspections",
    challenge:
      "A Cape Coral builder had three consecutive failed plumbing inspections with their previous sub, delaying the project by weeks and straining the relationship with the homeowner.",
    action:
      "C&S assigned a dedicated lead who pre-inspected every rough-in against Lee County code requirements before calling for the official inspection. Photo documentation was sent to the builder's PM before each phase sign-off.",
    outcome:
      "Zero failed inspections across the entire project. The builder moved C&S to their preferred sub list and awarded the next 8 starts without competitive bidding.",
    placeholder: true,
  },
  {
    id: "tight-sequencing",
    title: "4 Homes in 5 Days",
    challenge:
      "A production builder needed four homes rough-in ready within the same week to keep their drywall crew on schedule. Their previous plumber could only handle one home at a time.",
    action:
      "C&S staggered two crews across all four lots simultaneously, coordinating start times with the framing and HVAC trades to avoid overlap. Daily photo updates kept the builder's superintendent informed without requiring site visits.",
    outcome:
      "All four homes passed rough-in inspection on schedule. The builder's project timeline stayed intact, saving an estimated two weeks of cascading delays.",
    placeholder: true,
  },
  {
    id: "commercial-coordination",
    title: "Your Story Here",
    challenge:
      "[Replace with a real challenge from a commercial or remodel project — what was the builder facing?]",
    action:
      "[Replace with what C&S did differently — the specific steps, coordination, or solution you provided]",
    outcome:
      "[Replace with the measurable result — time saved, inspections passed, relationship gained]",
    placeholder: true,
  },
];

export const BUILDER_SPEC_SHEETS: BuilderSpecSheet[] = [
  {
    id: "rough-in",
    title: "Rough-In",
    icon: "Hammer",
    description: "Below-slab and in-wall plumbing before drywall.",
    items: [
      "Underground DWV (drain, waste, vent) piping",
      "Water supply line rough-in (copper or PEX)",
      "Stub-outs for all fixtures per plan",
      "Pressure testing and leak checks",
      "Lee County permit pull and inspection coordination",
    ],
    href: "/services/new-construction",
  },
  {
    id: "top-out",
    title: "Top-Out",
    icon: "ArrowUpFromLine",
    description: "Vent stacks and above-ceiling connections.",
    items: [
      "Vent stack extensions through roof",
      "Above-ceiling DWV connections",
      "Water heater rough-in and gas line (if applicable)",
      "Hose bib and irrigation stub-outs",
      "Pre-drywall photo documentation for builder",
    ],
  },
  {
    id: "trim",
    title: "Trim & Finish",
    icon: "Wrench",
    description: "Final fixture install, testing, and turnover.",
    items: [
      "Faucet, toilet, and shower valve installation",
      "Dishwasher, ice maker, and disposal connections",
      "Water heater final install and startup",
      "Full system pressure and flow testing",
      "Final inspection and Certificate of Completion",
    ],
    href: "/services/new-construction",
  },
  {
    id: "commercial",
    title: "Commercial",
    icon: "Building2",
    description: "Full-scope commercial plumbing with AIA pay apps.",
    items: [
      "AIA G702/G703 schedule of values and pay applications",
      "Multi-story DWV and supply risers",
      "Backflow preventer and RPZ installation",
      "Medical gas rough-in (healthcare projects)",
      "Grease trap and interceptor installation",
    ],
    href: "/services/commercial",
  },
];

export const AIDEN_CONTACT = {
  name: "Aiden Pellechio",
  title: "Operations & Estimating",
  phone: "833-PLUMB-IT",
  phoneRaw: "8337562648",
  email: "aiden@csplumbinglee.com",
} as const;
