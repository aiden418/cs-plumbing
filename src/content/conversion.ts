/**
 * Words of the conversion pages: contact, booking, quote builder, emergency
 * and the Coastal Comeback Plan. Moved here word for word from the page
 * components; business facts come from "@/lib/business", prices from
 * "@/lib/pricing" and response wording from "@/lib/claims".
 *
 * Client components import this file, so it must never import
 * "@/lib/constants", "@/lib/media" or anything generated.
 */
import { BUSINESS, OFFICE_CONTACTS } from "@/lib/business";
import { CLAIMS, EMERGENCY_CLAIMS } from "@/lib/claims";
import { money, price } from "@/lib/pricing";

export interface NextStep {
  title: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  hero: {
    overline: "Contact Us",
    title: "Let's Talk",
    accent: "Plumbing",
    description: "Have a question, need a quote, or facing an emergency? We're here to help.",
  },
  detailsHeading: "Get in Touch",
  phoneLabel: "Phone",
  phoneNote: "Available 24/7 for emergencies",
  textLabel: "Text",
  textAction: "Can't talk? Text us instead",
  emailLabel: "Email",
  /** Who runs the office; the names and what each handles are OFFICE_CONTACTS in src/lib/business.ts. */
  peopleLabel: "Ask for",
  peopleNote: "Both answer the office line and the office email above.",
  officeLabel: "Office",
  officeNote:
    "Our only office. Listings showing an older Cape Coral address refer to our former location — we're open and operating from North Fort Myers.",
  mapAction: "Open in Google Maps",
  hoursLabel: "Hours",
  nextHeading: "What happens next",
  nextSteps: [
    {
      title: "Send your message",
      description:
        `Use the form, email, or call. ${OFFICE_CONTACTS.map((person) => `${person.name.split(" ")[0]} handles ${person.handles.toLowerCase()}`).join("; ")}.`,
    },
    {
      title: "Reply within 1 business day",
      description: `${CLAIMS.bookingConfirmation} Urgent? Call ${BUSINESS.phone}.`,
    },
    {
      title: "Free site visit if needed",
      description:
        "For quotes that need eyes on the work, we'll set up a no-charge visit at a time that fits your schedule.",
    },
    {
      title: "Written estimate",
      description: "Clear scope, fair price, no pressure. You decide if and when to schedule the work.",
    },
  ] satisfies NextStep[],
} as const;

/* ------------------------------------------------------------------ */
/* Booking                                                             */
/* ------------------------------------------------------------------ */

export const BOOKING = {
  hero: {
    booking: {
      overline: "Request Service",
      title: "Request a",
      accent: "Preferred Time",
      description: `Tell us what you need and when works for you. Our office calls to confirm the appointment. ${CLAIMS.bookingConfirmation}`,
    },
    estimate: {
      overline: "Request an Estimate",
      title: "Get a Free",
      accent: "Estimate",
      description: "Tell us about your project and we’ll get back to you with a quote.",
    },
    preferToTalk: "Prefer to talk?",
  },
  requestTypeLegend: "Request type",
  requestTypes: { booking: "Request Service", estimate: "Request an Estimate" },
  steps: {
    booking: ["Service", "Details", "Preferred time", "Info"],
    estimate: ["Service", "Details", "Info"],
  },
  serviceHeading: "What do you need help with?",
  detailsHeading: { booking: "Tell us more about the issue", estimate: "Tell us more about your project" },
  descriptionLabel: "Description",
  descriptionPlaceholder: {
    booking: "Describe the plumbing issue or project...",
    estimate: "Describe your project or what you need a quote for...",
  },
  photosLabel: {
    booking: "Photos of the problem",
    estimate: "Photos of the space or plans",
  },
  budgetLegend: "What's your budget range?",
  urgencyLegend: "How urgent is this?",
  urgencyLabels: { normal: "normal", soon: "Within a week", emergency: "emergency" } as Record<string, string>,
  scheduleHeading: "Choose a preferred date and time",
  /** Under the heading: this step asks, it does not book. */
  scheduleNote: "This is the time you would like. Our office calls to confirm it or to offer the closest opening.",
  dateLegend: "Preferred Date",
  timeLegend: "Preferred Time",
  infoHeading: "Your Information",
  nameLabel: "Full Name",
  emailLabel: "Email",
  phoneLabel: "Phone",
  addressLabel: "Service Address (street, city)",
  allRequired: "All fields required so we can dispatch the right tech to you.",
  back: "Back",
  continue: "Continue",
  submit: { booking: "Request a preferred time", estimate: "Request an estimate" },
  submitting: "Submitting...",
  summaryHeading: "Your request",
  summaryEmpty: "Nothing chosen yet.",
  confirmTitle: { booking: "Request received", estimate: "Estimate request received" },
  confirmationPrefix: "Request ID ",
  confirmBody: {
    estimate: `We’ll review your project details and get back to you with a quote. ${CLAIMS.bookingConfirmation} For urgent needs, call us directly.`,
    booking: `Your preferred time is a request, not a confirmed appointment yet. Our office will call to confirm it. ${CLAIMS.bookingConfirmation} A copy was sent to `,
  },
  submitError: `Something went wrong and your request was not submitted. Please try again, or call us at ${BUSINESS.phone}.`,
  errors: {
    service: "Choose a service to continue.",
    description: "Describe the job in a few words (at least 5 characters).",
    date: "Choose a preferred date.",
    time: "Choose a preferred time.",
    name: "Enter your name.",
    email: "Enter an email address like name@example.com.",
    phone: "Enter a phone number with at least 10 digits.",
    address: "Enter the service address.",
  },
  nextHeading: "What happens after you submit",
  nextSteps: [
    {
      title: "Send your request",
      description:
        "Pick a service and the time you would prefer, and add a note if there's anything we should know in advance.",
    },
    {
      title: "We call to confirm",
      description: `${CLAIMS.bookingConfirmation} We confirm the appointment window and answer any quick questions.`,
    },
    {
      title: "Tech arrives in the confirmed window",
      description:
        "Once we have confirmed a time with you, the tech comes in that window. We diagnose, quote, and only proceed with your sign-off.",
    },
    {
      title: "Clean, code-compliant work",
      description: `Licensed under ${BUSINESS.license}. Permits handled when required. We leave the worksite spotless.`,
    },
  ] satisfies NextStep[],
} as const;

/* ------------------------------------------------------------------ */
/* Quote builder                                                       */
/* ------------------------------------------------------------------ */

export const QUOTE = {
  hero: {
    overline: "Instant Quote Builder",
    title: "Instant Plumbing Quote for",
    accent: "Water Heaters & Repiping in Lee County",
    // The hero lead is split for version 2 (a lead of at most three lines):
    // the first sentence stays in the hero, the second opens the section below.
    description:
      "Answer a few questions and get an instant price range for water heater installation or whole-home repiping anywhere in Cape Coral, Fort Myers, and Lee County.",
    descriptionMore: "Final price set after a free on-site inspection — no obligation, no pressure.",
    steps: ["Answer a few questions", "Get your instant range", "C&S confirms within 1 business day"],
    stepsLabel: "What happens next",
  },
  selectorHeading: "What project are you planning?",
  selectorLead: "Choose a service to get started with your custom estimate.",
  services: {
    "water-heater": { title: "Water Heater Install", line: "Tank, tankless, or hybrid", toggle: "Water Heater" },
    repipe: { title: "Whole-Home Repipe", line: "PEX or copper repiping", toggle: "Repipe" },
  },
  serviceToggleLabel: "Service",
  reassurance:
    "This helps us understand your project. Your final price is confirmed with a free on-site visit — no obligation.",
  stepPrefix: "Step",
  back: "Back",
  continue: "Continue",
  seeEstimate: "See My Estimate",
  summaryHeading: "Your selections",
  summaryEmpty: "Nothing chosen yet.",
  chooseOne: "Choose an option to continue.",
  addressError: "Enter the service address (at least 5 characters).",
  addressLabel: "Service address",
  result: {
    heading: "Your preliminary estimate",
    lead: "Most homeowners in Lee County pay",
    verification: "Free on-site verification included",
    breakdown: "Price Breakdown",
    credit: " credit",
    included: "What's Included",
    emailQuote: "Email Me This Quote",
    schedule: "Request Your Free Visit",
    formIntro: "We'll email you this quote — no spam, ever.",
    nameLabel: "Your name",
    emailLabel: "Email",
    phoneLabel: "Phone",
    send: "Send My Quote",
    sending: "Sending...",
    error: "Something went wrong. Please call us directly.",
    sentTitle: "Quote sent!",
    sentBody: "Check your email. We'll be in touch shortly.",
    startOver: "Start Over",
    errors: {
      name: "Enter your name.",
      email: "Enter an email address like name@example.com.",
      phone: "Enter a phone number.",
    },
  },
  included: {
    "water-heater": [
      "Professional installation by a licensed plumber",
      "Old unit removal & disposal",
      "All required permits & inspections",
      "Post-install cleanup",
      "Warranty coverage as selected",
    ],
    repipe: [
      "All materials & labor",
      "Permit & inspections",
      CLAIMS.repipeRestoration,
      "Post-install cleanup",
      "Pressure testing & inspection",
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/* Emergency                                                           */
/* ------------------------------------------------------------------ */

export const EMERGENCY = {
  hero: {
    overline: "Plumbing Emergency?",
    title: "We're Here",
    accent: "24/7",
    description:
      "Don't wait. Every minute counts in a plumbing emergency. Call us now and we'll be on our way.",
    text: "Can't talk? Text us instead",
    // Arrival wording comes from EMERGENCY_CLAIMS.arrival (src/lib/claims.ts).
  },
  typesHeading: "Common Plumbing Emergencies",
  types: [
    { title: "Burst Pipes", description: "Water spraying? Shut off your main water valve and call us immediately." },
    { title: "Sewage Backup", description: "Sewage in your home is a health hazard. Don't try to clean it yourself." },
    { title: "Gas Leak", description: "Smell gas? Leave the house immediately, call 911 first, then call us." },
    { title: "Major Water Leak", description: "Ceiling leaking, wall damage, or flooding? Time is critical — call now." },
    { title: "No Hot Water", description: "Complete loss of hot water could mean a failed water heater. We can help today." },
    { title: "Clogged Sewer Line", description: "Multiple drains backing up at once? Your main sewer line may be blocked." },
  ],
  tipsHeading: "While You Wait",
  tipsLead: "Quick steps you can take to minimize damage before we arrive.",
  tips: [
    "Shut off your main water valve to stop flooding",
    "Turn off your water heater if there's no water supply",
    "Open cabinets under sinks to check for leaks",
    "If you smell gas, leave the building and call 911",
    "Move valuables away from standing water",
    "Don't use electrical appliances near standing water",
  ],
  callFirst: "Remember: call us first, then take these steps.",
  faqHeading: "Emergency Plumbing FAQs",
  faqLead: "Straight answers on response times, after-hours pricing, and what to do right now.",
  areasHeading: "Areas We Cover 24/7",
  areasLead:
    "Night or day, these Southwest Florida communities get the same emergency response. Tap your city for local details.",
  nextHeading: "What happens when you call us",
  nextSteps: [
    {
      title: "Call us 24/7",
      description:
        "A real dispatcher answers — not a call center. We confirm your address and get the right crew rolling.",
    },
    {
      title: "Tech dispatched fast",
      description: `Lee County trucks are staged across the service area. ${EMERGENCY_CLAIMS.arrival}`,
    },
    {
      title: "Quote before we work",
      description: `Written price for the repair before anything starts. After-hours calls carry a ${EMERGENCY_CLAIMS.afterHoursSurcharge} surcharge — it's in the quote, never a surprise.`,
    },
    {
      title: "Same-visit repair",
      description:
        "Trucks carry parts for burst pipes, leaks, water heater failures, and drain backups. We finish what we start.",
    },
  ] satisfies NextStep[],
} as const;

/* ------------------------------------------------------------------ */
/* Coastal Comeback Plan                                               */
/* ------------------------------------------------------------------ */

export interface CoastalTier {
  name: string;
  price: string;
  period: string;
  tagline: string;
  cta: string;
  href: string;
  highlight: boolean;
  inclusions: string[];
}

export const COASTAL = {
  hero: {
    seePlans: "See the Plans",
    trust: [`Licensed ${BUSINESS.license}`, "Family owned and operated since 1998", "5★ on Google"],
  },
  risk: {
    overline: "The Risk",
    title: "What Happens to a Vacant Florida Home",
    subtitle:
      "Six months of heat, humidity, and pressure on a system no one is checking. Here's what we see most often when snowbirds come back.",
    items: [
      {
        title: "Silent leaks behind the wall",
        body: "A pinhole leak in a copper line can run for months in an empty house — by the time you fly back, drywall is soaked, baseboards are warped, and mold is already in the framing.",
      },
      {
        title: "Water heater failure",
        body: "Florida's hard water eats anode rods. Tanks rust, leak, or burst while no one is home — flooding garages, closets, and laundry rooms with 40+ gallons of hot water.",
      },
      {
        title: "Drain & valve seizure",
        body: "Dry P-traps let sewer gas push back into the home. Shut-off valves freeze in place. Toilet seals dry and crack. None of it is visible until you turn the water back on.",
      },
    ],
  },
  plans: {
    overline: "Annual Plans",
    title: "Pick Your Coastal Comeback Plan",
    subtitle:
      "One yearly fee covers your visits, reports, and priority access. No hidden trip charges, no per-visit upcharges.",
    highlightLabel: "Best for Snowbirds",
    tiers: [
      {
        name: "Coastal Comfort",
        price: money(price("plan.comfort").min),
        period: "/yr",
        tagline: "Pre-departure shutdown + return-ready inspection.",
        cta: "Get Started",
        href: "/booking?plan=comfort",
        highlight: false,
        inclusions: [
          "Pre-departure home shutdown visit",
          "Main shut-off & valve test",
          "Water heater inspection",
          "Return-ready start-up inspection",
          "Written before/after report",
        ],
      },
      {
        name: "Coastal Shield",
        price: money(price("plan.shield").min),
        period: "/yr",
        tagline: "Everything in Comfort + a mid-summer check & priority dispatch.",
        cta: "Get Started",
        href: "/booking?plan=shield",
        highlight: true,
        inclusions: [
          "Everything in Coastal Comfort",
          "Mid-summer mid-season check (photo report emailed)",
          "Priority emergency dispatch",
          "10% off any in-season repairs",
          "Direct text line to your technician",
        ],
      },
      {
        name: "Coastal Smart",
        price: "Call",
        period: "for Quote",
        tagline: "Custom plans for multi-property owners, estates & STR managers.",
        cta: `Call ${BUSINESS.phone}`,
        href: BUSINESS.phoneHref,
        highlight: false,
        inclusions: [
          "Everything in Coastal Shield",
          "Smart leak detector install (Wi-Fi, app alerts)",
          "Monthly remote monitoring",
          "Multi-property pricing",
          "Dedicated account manager",
        ],
      },
    ] satisfies CoastalTier[],
  },
  steps: {
    overline: "How It Works",
    title: "Four Steps. One Worry-Free Summer.",
    items: [
      {
        title: "Sign up online or by phone",
        body: "Pick a tier that fits, give us your travel dates, and we'll lock in your visit window.",
      },
      {
        title: "Pre-departure visit",
        body: "Before you fly out, we shut down, drain, and document the entire plumbing system.",
      },
      {
        title: "Mid-summer check (Shield+)",
        body: "Mid-season we walk the home, test for leaks, and email you a photo report.",
      },
      {
        title: "Return-ready inspection",
        body: "A week before you land, we restart the system so you walk into a working home.",
      },
    ],
  },
  trustItems: [
    `Lic. #${BUSINESS.license}`,
    `Family-owned since ${BUSINESS.founded}`,
    "5★ on Google",
    "Insured & bonded",
    "Part of Draft Construction",
  ],
  faq: { overline: "FAQ", title: "Common Questions from Snowbirds" },
  closing: {
    title: "Fly home to a dry house.",
    body: "Enroll once. Travel for the summer. Come back to the same home you left — not a flood and a phone call to insurance.",
    enroll: "Enroll Now",
    enrollHref: "/booking?plan=coastal-comeback",
  },
} as const;
