/**
 * Words for the reading pages: the blog index and posts, the FAQ, the
 * service map, the privacy policy and the 404 page.
 *
 * Every heading and button label that used to be typed inside these pages
 * lives here, word for word, so it can be changed without touching layout
 * code. Business facts (phone, email, address, hours, job count) are not
 * here: they come from "@/lib/business". Articles, answers and areas stay in
 * their data modules under src/lib.
 */

export const BLOG_INDEX = {
  overline: "Blog & Tips",
  title: "Plumbing Tips",
  accent: "from the Pros",
  description:
    "Expert advice, how-to guides, and insider tips to help you take care of your home's plumbing — from Southwest Florida's most trusted plumbing team.",
  /** The link line at the foot of every post row. */
  readMore: "Read More",
  /** Accessible name of the list of posts. */
  listLabel: "All posts",
} as const;

export const BLOG_POST = {
  backToBlog: "Back to Blog",
  /** The byline under the headline: "By <author>, <role>". */
  bylineBy: "By",
  author: "Aiden Pellechio",
  authorHref: "/about",
  authorRole: ", Project Manager & Estimator at C&S Plumbing of Lee",
  updated: "Updated",
  faqHeading: "Frequently Asked Questions",
  help: {
    heading: "Need Help?",
    body: "Our team is ready to help with any plumbing question or project. Call us or book online.",
    book: "Book Online",
    bookHref: "/booking",
  },
  /** The other guides under the article (RelatedPosts). */
  related: {
    heading: "Plumbing guides for Southwest Florida homeowners",
    count: 3,
  },
} as const;

export const FAQ_PAGE = {
  overline: "FAQ",
  title: "Frequently Asked",
  accent: "Questions",
  /** The hero line; the contact link and the phone number sit between these parts. */
  intro:
    "Answers to the most common plumbing questions from homeowners across Cape Coral, Fort Myers, and Southwest Florida. Can't find what you're looking for?",
  contactLabel: "Contact us",
  contactHref: "/contact",
  orCall: "or call",
  /** Label of the category list. */
  categoriesLabel: "Categories",
  learnMore: "Learn more →",
  closing: {
    title: "Still Have",
    accent: "Questions?",
    body: "Our team is happy to answer any plumbing question. Get a free estimate or schedule a service call — we're here to help.",
    book: { label: "Book a Service", href: "/booking" },
    quote: { label: "Get an Instant Quote", href: "/quote-builder" },
  },
} as const;

export const SERVICE_MAP = {
  overline: "Service Area",
  title: "Where We",
  accent: "Work",
  book: "Book a Service",
  bookHref: "/booking",
  map: {
    src: "https://www.google.com/maps/d/embed?mid=1525gJBVH8SRdUNAF-0nemUswy8DmRjo&ehbc=2E312F",
    title: "C&S Plumbing Service Area & Jobs",
  },
  /** The area pages, grouped by county (cities from SERVICE_AREAS_BY_COUNTY). */
  areas: {
    /** The site's existing label for these pages (main menu, footer). */
    heading: "Service Areas",
    /** "Lee" → "Lee County". */
    countySuffix: " County",
  },
} as const;

export const PRIVACY = {
  overline: "Legal",
  title: "Privacy Policy",
} as const;

export const NOT_FOUND = {
  overline: "404 — Page Not Found",
  title: "Oops,",
  accent: "wrong pipe.",
  body: "The page you're looking for doesn't exist or has been moved. Let us help you find what you need.",
  book: { label: "Book a Service", href: "/booking" },
  services: { label: "View Services", href: "/services" },
  home: { label: "Go Home", href: "/" },
  contact: { label: "Contact Us", href: "/contact" },
} as const;
