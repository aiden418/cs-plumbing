/**
 * Local job examples: one real job shown beside the service it proves, with
 * what the estimate covered and the next step for a customer who wants the
 * same work. Service pages and city pages read this list, so a job is typed
 * once and shows up everywhere it belongs.
 *
 * HOW TO UPDATE A JOB (office):
 *   1. Pull the job in ServiceM8 and confirm every fact in `summary`,
 *      `estimateCovered` and `cost` with the technician.
 *   2. Put the approved photo of THAT job in public/images/jobs/ (run
 *      `npm run photos` so it is resized and stripped of location data), set
 *      `photo.src` to it and `photo.ofThisJob` to true.
 *   3. Fill in `verified` (date, who checked, the job number) and delete the
 *      lines in `needs` that are now answered.
 *
 * `needs` is never printed on the site. `npm test` lists every job that
 * still has open items, so the list cannot be forgotten.
 *
 * Plain data: no imports, so any page (and llms.txt) can read it.
 */

export interface LocalJob {
  id: string;
  /** Service pages that show this job (their slugs under /services/). */
  services: string[];
  /** City page that shows it (its slug under /areas/), and the city's name. */
  area?: { slug: string; city: string };
  /** The service page a city page links to for this job. */
  primaryService: { slug: string; label: string };
  title: string;
  /** What happened, in a few sentences. */
  summary: string;
  /** What the customer's estimate covered. */
  estimateCovered: string[];
  /** The price of this job, when it is published. */
  cost?: string;
  /**
   * The photo beside the job. `ofThisJob: false` means it is a C&S photo of
   * the same kind of work, not of this job: the caption then says so.
   */
  photo?: { src: string; alt: string; ofThisJob: boolean; caption: string; position?: string };
  /** The project page that documents it, when there is one. */
  project?: { slug: string; label: string };
  /** Title of the older case-study card on the service page that this job replaces. */
  replacesCaseStudy?: string;
  /** The button beside the work, per page family. */
  cta: { label: string; service: string };
  /** Who checked this job against its record, and when. Absent: not checked yet. */
  verified?: { on: string; by: string; job?: string };
  /** Open items for the office. Internal. */
  needs: string[];
}

export const LOCAL_JOBS: LocalJob[] = [
  {
    id: "fort-myers-tank-replacement",
    services: ["water-heaters"],
    area: { slug: "fort-myers", city: "Fort Myers" },
    primaryService: { slug: "water-heaters", label: "Water heater installation and repair" },
    title: "Emergency tank replacement in Fort Myers",
    replacesCaseStudy: "Emergency replacement — Fort Myers",
    summary:
      "An 11-year-old tank failed on a Friday at 5 pm with water on the floor. We were on site by 7 pm Saturday with a new 50-gallon Bradford White, and the old unit was hauled away on the same trip.",
    estimateCovered: [
      "New 50-gallon Bradford White tank, installed",
      "Haul-away of the old tank",
      "Code-compliant drain pan and fittings",
      "Permit and final inspection",
    ],
    cost: "$2,150", // claim-ok: documented job
    photo: {
      src: "/images/gallery/tank-water-heater-replacement.jpg",
      alt: "A new Bradford White tank water heater installed by C&S Plumbing in a garage, on a drain pan",
      ofThisJob: false,
      caption: "A Bradford White tank installed by C&S, from our job photos.",
      position: "50% 15%",
    },
    cta: { label: "Request a water-heater estimate", service: "water-heater" },
    needs: [
      "Job record: confirm this job in ServiceM8 (job number, date, address city) and that the price, tank size and brand are right.",
      "Confirm the timing with the technician: failed Friday 5 pm, on site by 7 pm Saturday.",
      "Confirm what the estimate listed: haul-away, drain pan and fittings, permit and inspection.",
      "Approved photo of this job. The photo shown is a C&S Bradford White install from the gallery, not confirmed to be this job.",
    ],
  },
  {
    id: "cape-coral-tankless-conversion",
    services: ["water-heaters", "tankless-water-heaters"],
    area: { slug: "cape-coral", city: "Cape Coral" },
    primaryService: { slug: "tankless-water-heaters", label: "Tankless water heater installation" },
    title: "Tank-to-tankless conversion in Cape Coral",
    replacesCaseStudy: "Tankless conversion — Cape Coral",
    summary:
      "A family of five was running out of hot water by the third shower. We swapped the 50-gallon tank for a Navien NPE-A2 and installed a new gas line and a concentric vent. The work took six hours.",
    estimateCovered: [
      "Navien NPE-A2 gas tankless unit, installed",
      "New gas line to the unit",
      "Concentric vent",
      "Removal of the old 50-gallon tank",
      "Permit and final inspection",
    ],
    cost: "$4,650", // claim-ok: documented job
    cta: { label: "Request a tankless water-heater estimate", service: "water-heater" },
    needs: [
      "Job record: confirm this job in ServiceM8 (job number, date) and that the price, the Navien NPE-A2 model and the six hours are right.",
      "Confirm what the estimate listed: gas line, concentric vent, removal of the old tank, permit and inspection.",
      "Approved photo of this job. None is shown: the only tankless photo in the gallery is a Rinnai unit carrying another company's sticker (Maher Natural Gas & Propane Services), so it was not used.",
      "One site condition that affected the estimate (venting or gas supply), for the December 7 job story.",
    ],
  },
];

/** The heading and one line above the jobs, per page. */
export const LOCAL_JOB_SECTIONS: Record<string, { heading: string; lead: string }> = {
  "water-heaters": {
    heading: "Water-heater jobs in Fort Myers and Cape Coral",
    lead: "Two jobs, what each estimate covered, and how to ask for the same.",
  },
  "tankless-water-heaters": {
    heading: "A tankless conversion in Cape Coral",
    lead: "What the job involved and what the estimate covered.",
  },
  "fort-myers": {
    heading: "A water-heater job in Fort Myers",
    lead: "One job, what the estimate covered, and how to ask for the same.",
  },
  "cape-coral": {
    heading: "A tankless job in Cape Coral",
    lead: "One job, what the estimate covered, and how to ask for the same.",
  },
};

/** Jobs a service page shows, in list order. */
export function localJobsForService(slug: string): LocalJob[] {
  return LOCAL_JOBS.filter((job) => job.services.includes(slug));
}

/** Jobs a city page shows, in list order. */
export function localJobsForArea(slug: string): LocalJob[] {
  return LOCAL_JOBS.filter((job) => job.area?.slug === slug);
}
