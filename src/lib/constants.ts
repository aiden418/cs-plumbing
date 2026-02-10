import type { Service, TeamMember, Testimonial, TimelineEvent, NavLink, Stat } from "./types";

// ============================================
// BUSINESS INFO
// ============================================

export const BUSINESS = {
  name: "C&S Plumbing",
  fullName: "C&S Plumbing of Lee County",
  phone: "833-PLUMB-IT",
  phoneRaw: "8337562648",
  email: "office@csplumbinglee.com",
  address: "951 Pondella Rd",
  city: "North Fort Myers",
  state: "FL",
  zip: "33903",
  founded: 1997,
  homesCompleted: 8500,
  hours: {
    weekday: "Mon–Fri: 8:00 AM – 5:00 PM",
    saturday: "Sat: 9:00 AM – 3:00 PM",
    sunday: "Sun: Emergency Only",
    emergency: "24/7 Emergency Service",
  },
  tagline: "Southwest Florida's Most Trusted Plumbing Team",
  description:
    "Family-owned since 1997. From emergency repairs to new construction, C&S Plumbing delivers excellence across Southwest Florida.",
  license: "CFC1430355",
} as const;

// ============================================
// NAVIGATION
// ============================================

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Residential", href: "/services/residential" },
      { label: "Commercial", href: "/services/commercial" },
      { label: "New Construction", href: "/services/new-construction" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

// ============================================
// STATS
// ============================================

export const STATS: Stat[] = [
  { value: 8500, suffix: "+", label: "Homes Built" },
  { value: 27, suffix: "+", label: "Years of Service" },
  { value: 4, suffix: "%", label: "Top FL Contractors" },
  { value: 24, suffix: "/7", label: "Emergency Service" },
];

// ============================================
// SERVICES
// ============================================

export const SERVICES: Service[] = [
  {
    id: "emergency",
    title: "Emergency Plumbing",
    description:
      "Plumbing emergencies don't wait, and neither do we. Our team is available 24/7 to handle burst pipes, major leaks, sewage backups, and more.",
    icon: "Siren",
    href: "/services/residential",
    features: [
      "24/7 rapid response",
      "Burst pipe repair",
      "Sewage backup cleanup",
      "Gas leak detection",
      "Flood damage mitigation",
    ],
  },
  {
    id: "drain-cleaning",
    title: "Drain Cleaning",
    description:
      "Professional drain cleaning services to eliminate clogs, restore flow, and prevent future blockages using state-of-the-art equipment.",
    icon: "Waves",
    href: "/services/residential",
    features: [
      "Hydro-jetting",
      "Camera inspection",
      "Root intrusion removal",
      "Preventive maintenance",
      "All drain types",
    ],
  },
  {
    id: "water-heaters",
    title: "Water Heaters",
    description:
      "Installation, repair, and replacement of traditional, tankless, and hybrid water heaters to keep your hot water flowing efficiently.",
    icon: "Flame",
    href: "/services/residential",
    features: [
      "Tankless installation",
      "Traditional tank repair",
      "Hybrid systems",
      "Energy-efficient upgrades",
      "Same-day service",
    ],
  },
  {
    id: "repiping",
    title: "Whole-Home Repiping",
    description:
      "Complete repiping solutions for aging or corroded pipe systems. We upgrade your plumbing infrastructure with modern, durable materials.",
    icon: "Wrench",
    href: "/services/residential",
    features: [
      "Copper & PEX options",
      "Minimal wall damage",
      "Code-compliant installation",
      "Permit handling",
      "Full system warranty",
    ],
  },
  {
    id: "commercial",
    title: "Commercial Plumbing",
    description:
      "Comprehensive commercial plumbing services for businesses across Lee County. Preventive maintenance, emergency repairs, and system installations.",
    icon: "Building2",
    href: "/services/commercial",
    features: [
      "Preventive maintenance plans",
      "Code compliance",
      "Grease trap service",
      "Backflow prevention",
      "Tenant improvements",
    ],
  },
  {
    id: "new-construction",
    title: "New Construction",
    description:
      "With 8,500+ new construction homes completed, we're the go-to plumbing partner for builders who demand reliability and code compliance.",
    icon: "HardHat",
    href: "/services/new-construction",
    features: [
      "8,500+ homes completed",
      "Builder partnerships",
      "Timeline precision",
      "Full permit management",
      "Warranty coverage",
    ],
  },
  {
    id: "water-quality",
    title: "Water Quality",
    description:
      "Whole-home water softening and filtration systems to improve your water quality, protect your pipes, and enhance your daily comfort.",
    icon: "Droplets",
    href: "/services/residential",
    features: [
      "Water softeners",
      "Filtration systems",
      "Water testing",
      "Salt-free options",
      "Maintenance plans",
    ],
  },
  {
    id: "remodeling",
    title: "Plumbing Remodels",
    description:
      "Expert plumbing for kitchen and bathroom remodels. From relocating pipes to installing premium fixtures, we ensure seamless results.",
    icon: "PaintBucket",
    href: "/services/residential",
    features: [
      "Kitchen remodels",
      "Bathroom renovations",
      "Fixture upgrades",
      "Pipe relocation",
      "Code updates",
    ],
  },
];

// ============================================
// TEAM
// ============================================

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Samuel Pellechio Jr.",
    role: "Owner & President",
    image: "/images/team/samuel.jpg",
    bio: "Leading C&S Plumbing with the same dedication and family values his father instilled since 1997.",
  },
  {
    name: "Team Member",
    role: "Operations Manager",
    image: "/images/team/member-2.jpg",
    bio: "Keeping the family legacy running smoothly with expert operations management.",
  },
  {
    name: "Team Member",
    role: "Lead Technician",
    image: "/images/team/member-3.jpg",
    bio: "Bringing decades of hands-on experience to every service call.",
  },
];

// ============================================
// TESTIMONIALS
// ============================================

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Jennifer M.",
    location: "Cape Coral, FL",
    rating: 5,
    text: "C&S Plumbing arrived same day for our emergency. Professional, fast, and fair pricing. They've been our go-to plumber ever since.",
  },
  {
    name: "Robert K.",
    location: "Fort Myers, FL",
    rating: 5,
    text: "We've used C&S for three remodels now. Their attention to detail and clean work is unmatched. Highly recommend for any plumbing project.",
  },
  {
    name: "Maria S.",
    location: "Naples, FL",
    rating: 5,
    text: "Prompt, professional, and reasonably priced. They replaced our entire water heater system in one day. Outstanding service!",
  },
  {
    name: "David & Linda T.",
    location: "Sanibel, FL",
    rating: 5,
    text: "After Hurricane Ian, C&S was there for us when other companies wouldn't come to the island. True community heroes.",
  },
  {
    name: "Thompson Homes",
    location: "Lee County, FL",
    rating: 5,
    text: "As a builder, reliability is everything. C&S has done the plumbing on over 200 of our homes without a single callback. Exceptional quality.",
  },
];

// ============================================
// TIMELINE
// ============================================

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "1997",
    title: "The Beginning",
    description:
      "Two brothers, with the support of their father, founded C&S Plumbing of Lee County with a single truck and a commitment to quality.",
  },
  {
    year: "2003",
    title: "1,000 Homes Milestone",
    description:
      "Completed plumbing for our 1,000th new construction home, solidifying our reputation as a premier builder partner in Southwest Florida's growth boom.",
  },
  {
    year: "2010",
    title: "8,000 Homes & Growing",
    description:
      "Surpassed 8,000 new construction homes plumbed across Southwest Florida, becoming one of the region's most trusted plumbing contractors.",
  },
  {
    year: "2017",
    title: "20 Years of Excellence",
    description:
      "Celebrated two decades of service. Samuel Pellechio Jr. takes the helm, continuing the family legacy with fresh energy.",
  },
  {
    year: "2022",
    title: "Hurricane Ian Response",
    description:
      "Stepped up for our community during Hurricane Ian, providing emergency plumbing services across the hardest-hit areas including Sanibel and Fort Myers Beach.",
  },
  {
    year: "2024",
    title: "8,500+ Homes & Counting",
    description:
      "Surpassed 8,500 new construction homes. Now ranked in the top 4% of all licensed contractors in Florida.",
  },
];

// ============================================
// SERVICE AREAS
// ============================================

export const SERVICE_AREAS = [
  "Cape Coral",
  "Fort Myers",
  "North Fort Myers",
  "Naples",
  "Bonita Springs",
  "Estero",
  "Lehigh Acres",
  "Sanibel Island",
  "Captiva Island",
  "Fort Myers Beach",
  "Punta Gorda",
  "Port Charlotte",
  "Marco Island",
];

// ============================================
// COST ESTIMATOR DATA
// ============================================

export const ESTIMATOR_SERVICES = [
  {
    id: "drain-cleaning",
    label: "Drain Cleaning",
    baseMin: 150,
    baseMax: 500,
    factors: ["Kitchen drain", "Bathroom drain", "Main sewer line", "Multiple drains"],
  },
  {
    id: "water-heater",
    label: "Water Heater",
    baseMin: 800,
    baseMax: 3500,
    factors: ["Repair only", "Standard tank replacement", "Tankless installation", "Hybrid system"],
  },
  {
    id: "leak-repair",
    label: "Leak Repair",
    baseMin: 150,
    baseMax: 800,
    factors: ["Faucet/fixture leak", "Pipe leak (accessible)", "Pipe leak (behind wall)", "Slab leak"],
  },
  {
    id: "repiping",
    label: "Whole-Home Repiping",
    baseMin: 4000,
    baseMax: 15000,
    factors: ["1 bathroom home", "2 bathroom home", "3+ bathroom home", "Commercial property"],
  },
  {
    id: "fixture-install",
    label: "Fixture Installation",
    baseMin: 200,
    baseMax: 1000,
    factors: ["Faucet replacement", "Toilet installation", "Shower/tub install", "Multiple fixtures"],
  },
  {
    id: "water-softener",
    label: "Water Softener",
    baseMin: 1500,
    baseMax: 4000,
    factors: ["Basic softener", "Premium softener", "Reverse osmosis add-on", "Whole-home filtration"],
  },
];

// ============================================
// GALLERY CATEGORIES
// ============================================

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
  { id: "new-construction", label: "New Construction" },
  { id: "remodel", label: "Remodel" },
] as const;
