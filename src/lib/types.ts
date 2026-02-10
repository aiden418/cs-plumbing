export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  features?: string[];
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
