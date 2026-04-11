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
}

export interface ServiceCityLanding {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
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
  category: string;
  readTime: string;
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
  metaTitle: string;
  metaDescription: string;
}
