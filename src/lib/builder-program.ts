import { BUSINESS, CONTRACTOR_RANKING, LATEST_AWARD, WARRANTY } from "./constants";

// ============================================
// BUILDER PROGRAM — single source of truth
// ============================================
//
// Everything the builder door says about scope, capacity, prequal documents
// and SWFL conditions lives here, for the same reason EMERGENCY_CLAIMS does:
// /builders, the /new-construction-plumbing/[city] pages, the capability
// statement, JSON-LD and llms.txt must tell one consistent, verifiable story.
//
// RULE: never publish a number we can't back up. Unknown values are `null`
// and the section that would show them is hidden — customers never see a
// placeholder. The outstanding items live in docs/builder-door-checklist.md.
//
// Project counts (homesCompleted, repipesCompleted) are owner-provided
// figures, not independently verified records. Keep them separate and never
// combine them into another total.

/** Builder-door proof line. The company was founded in 1998 (BUSINESS.founded);
 *  Sam's Dec 1997 license date is a personal milestone, not the company's. */
export const BUILDER_PROOF = {
  headline: `${BUSINESS.homesCompleted.toLocaleString()}+ new construction homes plumbed since ${BUSINESS.founded}`,
  subline: `Family owned and operated since ${BUSINESS.founded}. Three generations of the Pellechio family. Two active Florida Certified Plumbing Contractor licenses. ${LATEST_AWARD.title} — ${LATEST_AWARD.category}.`,
  generations: [
    {
      generation: "1st",
      name: "Samuel Pellechio Sr.",
      role: "Mason & general contractor",
      body: "Built homes in Philadelphia before moving the family to Cape Coral in 1984. Every standard we hold on a job site traces back to him.",
    },
    {
      generation: "2nd",
      name: "Samuel Pellechio Jr.",
      role: "Owner & co-founder",
      body: "Licensed plumbing contractor. Founded C&S in Cape Coral in 1998 with his brother Chris and their father, and has run the company, and its builder relationships, ever since.",
    },
    {
      generation: "3rd",
      name: "Aiden Pellechio",
      role: "Office manager, estimating & project management",
      body: "Runs builder-side estimating and project management: takeoffs, bid scopes, phase scheduling and trade sequencing. Currently working toward a construction management degree at FGCU.",
    },
  ],
} as const;

/** The builder-facing PM/estimating desk — framed as a team function. */
export const BUILDER_DESK = {
  label: "Builder project management & estimating",
  contactName: "Aiden Pellechio",
  contactRole: "Office Manager, Estimating & Project Management",
  email: BUSINESS.email,
  phone: BUSINESS.builderPhone,
  phoneRaw: BUSINESS.phoneRaw,
  functions: [
    { title: "Takeoffs & bid scopes", body: "Fixture counts, pipe runs and material lists off your plans, returned as a written scope with inclusions and exclusions spelled out." },
    { title: "Phase scheduling", body: "Underground, top-out and trim dates set against your schedule, not ours, and adjusted when the slab or framing moves." },
    { title: "Trade sequencing", body: "Coordination with your framer, HVAC and electrical so nobody is waiting on plumbing and plumbing isn't waiting on them." },
    { title: "Permits & inspections", body: "Plumbing permits pulled under our license and each phase inspection called, tracked and reported back to your super." },
  ],
} as const;

// ============================================
// PHASE-BY-PHASE SCOPE
// ============================================

export interface ConstructionPhase {
  id: string;
  name: string;
  summary: string;
  scope: string[];
  /** What we need from the framer / GC before we mobilize. */
  needFromGC: string[];
  inspection: string;
}

/** Owner-approved wording in place of per-phase durations. Do not add fixed
 *  completion times for any phase. */
export const PHASE_SCHEDULE_NOTE =
  "Phase schedules are coordinated with your superintendent based on project scope, site readiness, material availability, and inspection scheduling.";

export const CONSTRUCTION_PHASES: ConstructionPhase[] = [
  {
    id: "underground",
    name: "Underground / slab layout",
    summary: "Below-slab drain, waste and vent laid to plan, stubbed up and tested before the pour.",
    scope: [
      "Fixture layout checked against architectural plans and stub locations marked",
      "Below-slab DWV trenched, bedded and sloped to plan",
      "Stub-ups set for every floor fixture and the building drain",
      "Water service sleeves and slab penetrations",
      "Test and underground inspection before the pour",
    ],
    needFromGC: [
      "Pad graded and compacted to plan elevation",
      "Stem wall or forms set and lot corners staked",
      "Current approved plans with final fixture locations",
      "Pour date, so inspection is passed ahead of it",
    ],
    inspection: "Underground plumbing inspection before the slab is poured",
  },
  {
    id: "top-out",
    name: "2nd rough / top-out",
    summary: "In-wall supply and DWV, vents through the roof, tub and valve rough-in.",
    scope: [
      "Water distribution run to every fixture location",
      "In-wall drain and vent piping; vents through the roof",
      "Tubs and shower valves set",
      "Water heater location roughed in",
      "Test and rough (top-out) inspection before insulation and drywall",
    ],
    needFromGC: [
      "Framing complete and trusses set",
      "Roof dried in (vent penetrations)",
      "Tubs, shower pans and valve selections on site",
      "Water heater type and location confirmed",
    ],
    inspection: "Rough-in / top-out inspection before insulation and drywall",
  },
  {
    id: "trim",
    name: "Trim / set-out",
    summary: "Fixtures, faucets, appliances and water heater set; system started up.",
    scope: [
      "Toilets, sinks, faucets and shower trim set",
      "Dishwasher, disposal and ice-maker connections",
      "Water heater set and started",
      "Leak check at every connection",
    ],
    needFromGC: [
      "Cabinets and countertops installed",
      "Tile and paint complete in wet areas",
      "Fixture package on site (if builder-supplied)",
      "Appliances delivered",
    ],
    inspection: "Carried into the final plumbing inspection",
  },
  {
    id: "hookup",
    name: "Water & sewer hookup",
    summary: "Service line from the meter and building sewer to the tap, or septic where there's no sewer.",
    scope: [
      "Water service from meter to house",
      "Building sewer to the utility connection",
      "Cape Coral UEP water, irrigation and sewer connections",
      "Irrigation tie-in where specified",
    ],
    needFromGC: [
      "Meter set / utility tap location confirmed",
      "Sewer vs. septic determined for the lot",
      "Clear path from house to connection point",
    ],
    inspection: "Service line and sewer connection inspections per jurisdiction",
  },
  {
    id: "final",
    name: "Final",
    summary: "Final inspection passed and the house turned over with water on.",
    scope: [
      "Final plumbing inspection called and attended",
      "Punch items closed",
      "Plumbing sign-off toward the certificate of occupancy",
    ],
    needFromGC: [
      "Other trades complete in wet areas",
      "Water (and gas, if applicable) turned on",
      "Final inspection window from your schedule",
    ],
    inspection: "Final plumbing inspection",
  },
];

// ============================================
// SCHEDULING & COVERAGE
// ============================================
//
// No homes-per-month, crew count or permit-jurisdiction list is published.
// The unverified jurisdiction list lives in docs/builder-door-checklist.md.

/** Owner-approved wording in place of capacity numbers. */
export const SCHEDULING_NOTE =
  "Contact our estimating team to discuss upcoming starts, project volume, and scheduling availability.";

/** Where we work. Coverage, not a list of confirmed permit jurisdictions. */
export const SERVICE_COVERAGE = "Southwest Florida, from Port Charlotte through Naples";

// ============================================
// CONFIRMED QUALIFICATIONS
// ============================================
//
// Owner-confirmed (Sep 2026). State each as written; do not expand into
// further promises.
export const QUALIFICATIONS = [
  { id: "gl", label: "$2 million general liability coverage" },
  { id: "wc", label: "Workers' compensation coverage" },
  { id: "bond", label: "Bonding available — bonding information on request" },
  { id: "osha", label: "OSHA-30 trained" },
  { id: "self-perform", label: "100% self-performed plumbing work — no sub-to-sub layering" },
  { id: "aia", label: "AIA G702/G703 pay applications" },
  { id: "portals", label: "Procore and Textura experience" },
  {
    id: "top5",
    label: `Ranked in the ${CONTRACTOR_RANKING.claimInline} on ${CONTRACTOR_RANKING.source}`,
    source: CONTRACTOR_RANKING.source,
    sourceUrl: CONTRACTOR_RANKING.sourceUrl,
    checkedOn: CONTRACTOR_RANKING.checkedOn,
  },
  { id: "warranty", label: WARRANTY.summary },
] as const;

// ============================================
// PREQUALIFICATION DOCUMENTS
// ============================================

export type PrequalStatus = "available" | "on-request";

export interface PrequalDoc {
  id: string;
  title: string;
  detail: string;
  status: PrequalStatus;
  /** Public link (download or verification). Only set when status is "available". */
  href?: string;
  hrefLabel?: string;
}

export const CAPABILITY_STATEMENT_PDF = "/downloads/cs-plumbing-capability-statement.pdf";
export const PREQUAL_PACKET_PDF = "/downloads/cs-plumbing-prequal-packet.pdf";

export const PREQUAL_DOCS: PrequalDoc[] = [
  {
    id: "license",
    title: "Florida Certified Plumbing Contractor licenses",
    detail: `${BUSINESS.license} and ${BUSINESS.license2}, issued by the Florida DBPR. Search either number on the DBPR license lookup.`,
    status: "available",
    href: BUSINESS.licenseLookupUrl,
    hrefLabel: "Verify on DBPR",
  },
  {
    id: "coi",
    title: "Certificate of insurance (COI)",
    detail: "Project-specific COI naming your company as certificate holder, with any additional-insured wording you need.",
    status: "on-request",
  },
  {
    id: "w9",
    title: "IRS Form W-9",
    detail: "Signed, current-year W-9.",
    status: "on-request",
  },
  {
    id: "workers-comp",
    title: "Workers' compensation certificate",
    detail: "Proof of workers' compensation coverage.",
    status: "on-request",
  },
  {
    id: "bonding",
    title: "Bonding information",
    detail: "Bonding details for your project.",
    status: "on-request",
  },
  {
    id: "warranty",
    title: "Warranty terms",
    detail: `${WARRANTY.detail} The written terms are sent with each proposal.`,
    status: "on-request",
  },
];

/** One mailto for every on-request document — goes to the office, not a person. */
export const PREQUAL_REQUEST_HREF = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
  "Prequalification documents request",
)}&body=${encodeURIComponent(
  "Company:\nProject / community:\nDocuments needed (COI, W-9, workers' comp, bonding, warranty terms):\nCertificate holder / additional insured wording (for COI):\n",
)}`;

export const PREQUAL_STATUS_LABEL: Record<PrequalStatus, string> = {
  available: "Available",
  "on-request": "On request",
};

// ============================================
// SWFL CONDITIONS
// ============================================

export const SWFL_EXPERTISE = [
  {
    id: "high-water-table",
    title: "Slab-on-grade in a high water table",
    body: "Much of Lee County sits on sandy fill over a shallow water table. Below-slab drain lines have to hold their slope in soil that shifts when it's wet, so bedding, compaction around the pipe, and testing before the pour matter more here than inland.",
  },
  {
    id: "flood-zone",
    title: "Flood-zone and elevated rebuilds",
    body: "On Fort Myers Beach, Sanibel and other coastal lots, post-Ian rebuilds are going up on elevated foundations. Plumbing runs down to grade through the flood zone, so risers, cleanouts and water heaters have to be planned around the design flood elevation and salt air.",
  },
  {
    id: "uep",
    title: "UEP water & sewer hookups in Cape Coral",
    body: "Cape Coral's Utilities Extension Program is bringing city water and sewer to neighborhoods that were on wells and septic. New homes in UEP areas need the right connection at the right time — sewer lateral, water service, irrigation, and septic abandonment where it applies.",
    href: "/services/uep-utilities",
  },
  {
    id: "materials",
    title: "Pipe material options",
    body: "PEX or CPVC water distribution, copper where the spec calls for it, and PVC drain, waste and vent. We price the option on your plans and tell you where the trade-offs are.",
  },
] as const;

// ============================================
// NEW CONSTRUCTION CITY PAGES
// ============================================

export interface NewConstructionCity {
  slug: string;
  city: string;
  county: "Lee" | "Charlotte";
  /** Authority that issues building/plumbing permits for the city. */
  permitAuthority: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** City-specific conditions — facts about the place, not claims about us. */
  localConditions: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  areaHref?: string;
  related: { label: string; href: string }[];
}

const cityFaqs = (city: string, authority: string) => [
  {
    question: `Who pulls the plumbing permit for new construction in ${city}?`,
    answer: `We do. Plumbing permits are pulled under our Florida Certified Plumbing Contractor license (${BUSINESS.license} / ${BUSINESS.license2}) through ${authority}, and we call each phase inspection.`,
  },
  {
    question: "What phases does C&S handle?",
    answer:
      "All of them: underground / slab layout, 2nd rough (top-out), trim, water and sewer hookup, and final. You can hire us for the whole house or specific phases.",
  },
  {
    question: `How do I get a bid for a ${city} project?`,
    answer:
      "Send plans through the bid form on this page with your community, number of units and target start date. Our estimating team returns a written scope and price.",
  },
];

export const NEW_CONSTRUCTION_CITIES: NewConstructionCity[] = [
  {
    slug: "cape-coral",
    city: "Cape Coral",
    county: "Lee",
    permitAuthority: "the City of Cape Coral",
    metaTitle: "New Construction Plumbing Cape Coral | Builders & GCs",
    metaDescription:
      "Cape Coral new construction plumbing for builders: slab layout, top-out, trim, UEP hookup and final. 9,500+ homes plumbed since 1998. Submit plans for a bid.",
    intro:
      "Cape Coral is still building out lot by lot. Canal lots, a shallow water table and the city's utility expansion all change how the plumbing goes in. C&S was founded here in 1998, and we've been plumbing Cape Coral homes ever since.",
    localConditions: [
      {
        title: "Canal lots and a shallow water table",
        body: "Below-slab drain lines on canal lots sit in sandy fill close to groundwater. Bedding and compaction around the pipe and a test before the pour keep the slope where the plans put it.",
      },
      {
        title: "UEP water and sewer",
        body: "In Utilities Extension Program areas, new homes connect to city water and sewer. Where a lot was on septic, abandonment is part of the scope.",
      },
      {
        title: "City of Cape Coral permitting",
        body: "Cape Coral issues its own building and plumbing permits and runs its own inspections, separate from unincorporated Lee County.",
      },
    ],
    faqs: [
      ...cityFaqs("Cape Coral", "the City of Cape Coral"),
      {
        question: "Can you handle the UEP connection on a new home?",
        answer:
          "Yes. Water service, sewer lateral and irrigation connections, plus septic abandonment where a lot is converting.",
      },
    ],
    areaHref: "/areas/cape-coral",
    related: [
      { label: "UEP connections in Cape Coral", href: "/uep-connection-cape-coral" },
      { label: "Commercial plumbing in Cape Coral", href: "/commercial-plumbing-cape-coral" },
    ],
  },
  {
    slug: "fort-myers",
    city: "Fort Myers",
    county: "Lee",
    permitAuthority: "the City of Fort Myers (inside city limits) or Lee County (unincorporated addresses)",
    metaTitle: "New Construction Plumbing Fort Myers | Builders & GCs",
    metaDescription:
      "Fort Myers new construction plumbing for builders: underground, top-out, trim, hookup and final. 9,500+ homes plumbed since 1998. Submit plans for a bid.",
    intro:
      "A Fort Myers mailing address can be inside city limits or in unincorporated Lee County, and that decides who issues the permit and who inspects it. We sort that out before we bid.",
    localConditions: [
      {
        title: "City vs. county jurisdiction",
        body: "The City of Fort Myers and Lee County run separate permitting and inspections. The parcel, not the ZIP code, decides which one applies.",
      },
      {
        title: "Infill and teardown rebuilds",
        body: "Older neighborhoods mean existing service lines, old sewer laterals and tight lots. We confirm tap locations and what can be reused before the underground goes in.",
      },
    ],
    faqs: cityFaqs("Fort Myers", "the City of Fort Myers or Lee County, depending on the parcel"),
    areaHref: "/areas/fort-myers",
    related: [
      { label: "Commercial plumbing in Fort Myers", href: "/commercial-plumbing-fort-myers" },
      { label: "Plumbing subcontractor for GCs", href: "/plumbing-subcontractor-swfl" },
    ],
  },
  {
    slug: "lehigh-acres",
    city: "Lehigh Acres",
    county: "Lee",
    permitAuthority: "Lee County (Lehigh Acres is unincorporated)",
    metaTitle: "New Construction Plumbing Lehigh Acres | Builders & GCs",
    metaDescription:
      "Lehigh Acres new construction plumbing for production and scattered-lot builders. Underground through final, permitted through Lee County. Submit plans for a bid.",
    intro:
      "Lehigh Acres is one of the busiest scattered-lot markets in Lee County. We have documented slab-to-rough builds here, and production schedules are where phase-by-phase coordination pays off.",
    localConditions: [
      {
        title: "Well and septic vs. utility service",
        body: "Many Lehigh lots are on private well and septic, others on utility water and sewer. Which one a lot has changes the hookup scope, so we confirm it at bid.",
      },
      {
        title: "Lee County permitting",
        body: "Lehigh Acres is unincorporated, so building and plumbing permits and inspections run through Lee County.",
      },
    ],
    faqs: cityFaqs("Lehigh Acres", "Lee County"),
    areaHref: "/areas/lehigh-acres",
    related: [{ label: "Plumber in Lehigh Acres", href: "/plumber-lehigh-acres" }],
  },
  {
    slug: "estero",
    city: "Estero",
    county: "Lee",
    permitAuthority: "the Village of Estero",
    metaTitle: "New Construction Plumbing Estero | Builders & GCs",
    metaDescription:
      "New construction plumbing in Estero for custom and community builders. Slab layout through final, permitted through the Village of Estero. Submit plans for a bid.",
    intro:
      "Estero building is mostly planned communities and custom homes, where builders want the plumbing scope nailed down before the slab and the fixture package to match the spec at trim.",
    localConditions: [
      {
        title: "Village of Estero permitting",
        body: "Estero issues its own building permits and runs its own inspections through the Village's building and permitting services.",
      },
      {
        title: "Community standards",
        body: "Planned communities often carry their own specs for fixtures, water heaters and irrigation. We build the takeoff from the community spec, not a generic one.",
      },
    ],
    faqs: cityFaqs("Estero", "the Village of Estero"),
    areaHref: "/areas/estero",
    related: [{ label: "Plumber in Estero", href: "/plumber-estero" }],
  },
  {
    slug: "bonita-springs",
    city: "Bonita Springs",
    county: "Lee",
    permitAuthority: "the City of Bonita Springs",
    metaTitle: "New Construction Plumbing Bonita Springs | Builders & GCs",
    metaDescription:
      "Bonita Springs new construction plumbing for builders and GCs, from underground to final. Permitted through the City of Bonita Springs. Submit plans for a bid.",
    intro:
      "Bonita Springs runs from Gulf-front rebuilds to inland communities. Coastal lots bring flood-zone elevations into the plumbing plan; inland builds bring production schedules.",
    localConditions: [
      {
        title: "City of Bonita Springs permitting",
        body: "Bonita Springs issues its own building and trade permits through its Community Development department.",
      },
      {
        title: "Coastal elevations",
        body: "Near the Gulf, elevated foundations put risers, cleanouts and equipment in play around the design flood elevation.",
      },
    ],
    faqs: cityFaqs("Bonita Springs", "the City of Bonita Springs"),
    areaHref: "/areas/bonita-springs",
    related: [{ label: "Repiping in Bonita Springs", href: "/repiping-bonita-springs" }],
  },
  {
    slug: "punta-gorda",
    city: "Punta Gorda",
    county: "Charlotte",
    permitAuthority: "the City of Punta Gorda Building Division",
    metaTitle: "New Construction Plumbing Punta Gorda | Builders & GCs",
    metaDescription:
      "Punta Gorda new construction plumbing for builders: slab layout, top-out, trim, hookup and final. Documented Punta Gorda builds. Submit plans for a bid.",
    intro:
      "We've documented new construction and commercial plumbing in Punta Gorda, from ground-up homes to airport hangar work, and we take on builder work across Charlotte County.",
    localConditions: [
      {
        title: "City of Punta Gorda permitting",
        body: "Inside city limits, permits and inspections run through the City of Punta Gorda Building Division rather than Charlotte County.",
      },
      {
        title: "Canal and waterfront lots",
        body: "Punta Gorda Isles and Burnt Store Isles are canal communities, with the same shallow-groundwater considerations below slab as Cape Coral.",
      },
    ],
    faqs: cityFaqs("Punta Gorda", "the City of Punta Gorda"),
    areaHref: "/areas/punta-gorda",
    related: [{ label: "Repiping in Punta Gorda", href: "/repiping-punta-gorda" }],
  },
  {
    slug: "port-charlotte",
    city: "Port Charlotte",
    county: "Charlotte",
    permitAuthority: "Charlotte County (Port Charlotte is unincorporated)",
    metaTitle: "New Construction Plumbing Port Charlotte | Builders & GCs",
    metaDescription:
      "Port Charlotte new construction plumbing for builders and GCs, underground through final, permitted through Charlotte County. Submit plans for a bid.",
    intro:
      "Port Charlotte's platted lots are filling in with new single-family homes. Builders need a plumbing sub who can keep pace lot to lot and knows Charlotte County's inspection process.",
    localConditions: [
      {
        title: "Charlotte County permitting",
        body: "Port Charlotte is unincorporated, so building and plumbing permits and inspections run through Charlotte County.",
      },
      {
        title: "Septic vs. sewer by lot",
        body: "Sewer availability varies by neighborhood, so whether a lot gets a sewer lateral or a septic connection is settled at bid.",
      },
    ],
    faqs: cityFaqs("Port Charlotte", "Charlotte County"),
    areaHref: "/areas/port-charlotte",
    related: [{ label: "Drain cleaning in Port Charlotte", href: "/drain-cleaning-port-charlotte" }],
  },
];

export const getNewConstructionCity = (slug: string) =>
  NEW_CONSTRUCTION_CITIES.find((c) => c.slug === slug);

// ============================================
// BUILDER REVIEW REQUEST
// ============================================

/** Open prompts, deliberately not a script — builders write in their own words. */
export const BUILDER_REVIEW_PROMPTS = [
  "What was the project, and which phases did we handle?",
  "How did our schedule line up with yours?",
  "How did inspections go?",
  "Was there a problem in the field? How was it handled?",
  "What would you tell another builder who's deciding on a plumbing sub?",
] as const;
