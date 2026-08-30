export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  features?: string[];
  image?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "residential" | "commercial" | "new-construction" | "remodel";
  title: string;
  beforeSrc?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  /** Optional historical photo for this milestone. */
  image?: string;
  imageAlt?: string;
}

export interface BookingFormData {
  serviceCategory: string;
  specificService: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface AnswerBlock {
  question: string;
  answer: string;
  detail?: string;
}

export interface AreaLanding {
  slug: string;
  city: string;
  state: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroText: string;
  description: string;
  neighborhoods?: string[];
  localContext: string;
  relatedServices?: string[];
  faqs?: FAQ[];
}

export interface ServiceLanding {
  slug: string;
  title: string;
  heroText: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  features: { title: string; description: string }[];
  faqs: FAQ[];
  priceRange?: string;
  highlights: string[];
  image?: string;
  gallery?: { src: string; caption?: string }[];
  relatedServices?: string[];
  relatedAreas?: string[];
  costBreakdown?: { label: string; range: string; note?: string }[];
  caseStudies?: { title: string; location: string; cost: string; summary: string }[];
  answerBlocks?: AnswerBlock[];
}

export interface ServiceCityLanding {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  /**
   * Section H2 shown above the main service description block. Should read
   * naturally — written by a human, not templated. Keep it short (5–10 words)
   * and include the city when it fits. If omitted, falls back to a clean
   * city + state default.
   */
  sectionHeading?: string;
  heroSubtext: string;
  trustBadges: string[];
  serviceDescription: string;
  features: { title: string; description: string }[];
  city: string;
  state: string;
  neighborhoods: string[];
  faqs: FAQ[];
  relatedPages: { label: string; href: string }[];
  priceRange?: string;
  image?: string;
  /**
   * Slug of the parent service hub (see SERVICE_HUBS). Drives the hub page's
   * city cross-links and the 3-level breadcrumb. Omit for generic
   * "plumber-<city>" pages that have no single parent service.
   */
  serviceSlug?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
  content: string;
  publishDate: string;
  /** Set when a post gets a substantive refresh; feeds Article dateModified. */
  updatedDate?: string;
  category: string;
  readTime: string;
  /** Optional Q&A block — rendered under the article and emitted as FAQPage schema. */
  faqs?: FAQ[];
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  website?: string;
  image?: string | null;
}

export interface Builder {
  name: string;
  logo: string;
  /** Intrinsic pixel dimensions of `logo`. Required so next/image can reserve
   *  the right box and pick a small srcset entry instead of shipping the
   *  full-size source (these render 24–32px tall). */
  logoWidth: number;
  logoHeight: number;
  website?: string;
}

export interface BuilderStat {
  value: number;
  suffix: string;
  label: string;
}

export interface BuilderGalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "custom-residential" | "production" | "light-commercial" | "remodel";
  caption: string;
  builder?: string;
}

export interface BuilderCaseStudy {
  id: string;
  title: string;
  challenge: string;
  action: string;
  outcome: string;
  placeholder?: boolean;
}

export interface BuilderSpecSheet {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: string[];
  href?: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectPhase {
  name: string;
  slug: string;
  description?: string;
  images: ProjectImage[];
}

/**
 * Optional case-study fields. When populated, ProjectDetail renders a
 * "Case study" block (challenge + solution + scope + permits + materials)
 * between the project hero and the phase galleries. Leave undefined for
 * a phase-only project page.
 */
export interface CompletedProject {
  slug: string;
  name: string;
  client: string;
  clientUrl?: string;
  category: string;
  timeline: string;
  cost: string;
  description: string;
  location?: string;
  coverImage: string;
  phases: ProjectPhase[];
  /** 1–3 sentences on the core constraint or problem on this job. */
  challenge?: string;
  /** 1–3 sentences on what we did and why. */
  solution?: string;
  /** Bullet list — scope of work performed (e.g. "Underground rough-in", "Hot water recirc"). */
  scopeDetails?: string[];
  /** Bullet list — permits pulled and inspections cleared. */
  permits?: string[];
  /** Bullet list — materials / brands installed. */
  materials?: string[];
  metaTitle: string;
  metaDescription: string;
}
