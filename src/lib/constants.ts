import type { Service, TeamMember, Testimonial, TimelineEvent, NavLink, Stat, ServiceLanding, AreaLanding, BlogPost, CompletedProject, Partner } from "./types";

// ============================================
// BUSINESS INFO
// ============================================

export const BUSINESS = {
  name: "C&S Plumbing",
  fullName: "C&S Plumbing of Lee",
  phone: "833-PLUMB-IT",
  phoneRaw: "8337586248",
  // "?&body=" works on both iOS and Android
  smsHref:
    "sms:+18337586248?&body=Hi%20C%26S%20Plumbing%2C%20I%20need%20help%20with%20",
  email: "office@csplumbinglee.com",
  address: "951 Pondella Rd",
  city: "North Fort Myers",
  state: "FL",
  zip: "33903",
  founded: 1997,
  homesCompleted: 8500,
  hours: {
    weekday: "Mon–Fri: 7:30 AM – 4:30 PM",
    saturday: "Sat: 9:00 AM – 3:00 PM",
    sunday: "Sun: Emergency Only",
    emergency: "24/7 Emergency Service",
  },
  tagline: "Southwest Florida's Most Trusted Plumbing Team",
  description:
    "Family-owned since 1997. From emergency repairs to new construction, C&S Plumbing delivers excellence across Southwest Florida.",
  license: "CFC1432485",
  license2: "CFC057076",
  licenseLookupUrl:
    "https://www.myfloridalicense.com/wl11.asp?mode=2&search=License&SID=&brd=&typ=",
  rating: 5.0,
  reviewCount: 46,
  googleProfileUrl:
    "https://www.google.com/maps/search/?api=1&query=C%26S+Plumbing+of+Lee+County+North+Fort+Myers",
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
      { label: "Repiping", href: "/services/repiping" },
      { label: "Water Heaters", href: "/services/water-heaters" },
      { label: "Drain Cleaning", href: "/services/drain-cleaning" },
      { label: "Leak Repair", href: "/services/leak-repair" },
      { label: "Water Softeners", href: "/services/water-softeners" },
      { label: "Plumbing Remodels", href: "/services/plumbing-remodel" },
      { label: "UEP Utilities", href: "/services/uep-utilities" },
    ],
  },
  { label: "Projects", href: "/projects" },
  {
    label: "Service Areas",
    href: "/areas/cape-coral",
    children: [
      { label: "Cape Coral", href: "/areas/cape-coral" },
      { label: "Fort Myers", href: "/areas/fort-myers" },
      { label: "North Fort Myers", href: "/areas/north-fort-myers" },
      { label: "Naples", href: "/areas/naples" },
      { label: "Bonita Springs", href: "/areas/bonita-springs" },
      { label: "Lehigh Acres", href: "/areas/lehigh-acres" },
      { label: "Estero", href: "/areas/estero" },
      { label: "Sanibel Island", href: "/areas/sanibel" },
      { label: "Punta Gorda", href: "/areas/punta-gorda" },
      { label: "Port Charlotte", href: "/areas/port-charlotte" },
    ],
  },
  { label: "Coastal Comeback", href: "/coastal-comeback-plan" },
  { label: "Contact", href: "/contact" },
  {
    label: "More",
    href: "/gallery",
    children: [
      { label: "Gallery", href: "/gallery" },
      { label: "Blog", href: "/blog" },
      { label: "Builders", href: "/builders" },
      { label: "Builder Portal", href: "/builder-portal" },
      { label: "Recommended", href: "/partners" },
    ],
  },
];

// ============================================
// STATS
// ============================================

export const STATS: Stat[] = [
  { value: 8500, suffix: "+", label: "Homes Built" },
  { value: 28, suffix: "+", label: "Years of Service" },
  { value: 4, suffix: "%", label: "Top FL Contractors" },
  { value: 24, suffix: "/7", label: "Emergency Service" },
];

// Shared proof bullets — keep these identical everywhere they appear so
// search engines and AI assistants extract one consistent story.
export const TRUST_PROOF_POINTS = [
  "Family-owned since 1997",
  "8,500+ homes completed",
  "5.0 stars across 46 Google reviews",
  "Best of Cape Coral 2025",
  "24/7 emergency service",
  "Licensed & insured (CFC057076 / CFC1432485)",
  "5.0-star Google rating",
  "Upfront, transparent pricing",
  "Same-day service available",
  "All work permitted & inspected",
  "Serving Lee, Collier & Charlotte counties",
];

// ============================================
// SERVICES
// ============================================

// Order is intentional: major-project lanes (new construction, repiping,
// remodels) lead, followed by commercial / UEP, then service work, with
// emergency contained at the end. Emergency stays prominent on its own
// /emergency page and in the sticky CTA — homepage doesn't lead with it.
export const SERVICES: Service[] = [
  {
    id: "new-construction",
    title: "New Construction",
    description:
      "With 8,500+ new construction homes completed, we're the go-to plumbing partner for builders who demand reliability and code compliance.",
    icon: "HardHat",
    href: "/services/new-construction",
    image: "/images/services/cards/new-construction.jpg",
    features: [
      "8,500+ homes completed",
      "Builder partnerships",
      "Timeline precision",
      "Full permit management",
      "Warranty coverage",
    ],
  },
  {
    id: "repiping",
    title: "Whole-Home Repiping",
    description:
      "Complete repiping solutions for aging or corroded pipe systems. We upgrade your plumbing infrastructure with modern, durable materials.",
    icon: "Wrench",
    href: "/services/repiping",
    image: "/images/services/cards/repiping.jpg",
    features: [
      "Copper & PEX options",
      "Minimal wall damage",
      "Code-compliant installation",
      "Permit handling",
      "Full system warranty",
    ],
  },
  {
    id: "remodeling",
    title: "Plumbing Remodels",
    description:
      "Expert plumbing for kitchen and bathroom remodels. From relocating pipes to installing premium fixtures, we ensure seamless results.",
    icon: "PaintBucket",
    href: "/services/plumbing-remodel",
    image: "/images/services/cards/plumbing-remodel.jpg",
    features: [
      "Kitchen remodels",
      "Bathroom renovations",
      "Fixture upgrades",
      "Pipe relocation",
      "Code updates",
    ],
  },
  {
    id: "commercial",
    title: "Commercial Plumbing",
    description:
      "Comprehensive commercial plumbing services for businesses across Lee County. Preventive maintenance, emergency repairs, and system installations.",
    icon: "Building2",
    href: "/services/commercial",
    image: "/images/services/cards/commercial.jpg",
    features: [
      "Preventive maintenance plans",
      "Code compliance",
      "Grease trap service",
      "Backflow prevention",
      "Tenant improvements",
    ],
  },
  {
    id: "uep-utilities",
    title: "UEP Utilities Hookup",
    description:
      "Full-service Cape Coral UEP utilities connection — water service, irrigation, sewer laterals, and septic abandonment. We handle every permit and inspection from start to finish.",
    icon: "Shovel",
    href: "/services/uep-utilities",
    image: "/images/services/uep-utilities/photo-1.jpg",
    features: [
      "Water service line",
      "Irrigation line",
      "Sewer lateral",
      "Septic abandonment",
      "All permits included",
    ],
  },
  {
    id: "water-heaters",
    title: "Water Heaters",
    description:
      "Installation, repair, and replacement of traditional, tankless, and hybrid water heaters to keep your hot water flowing efficiently.",
    icon: "Flame",
    href: "/services/water-heaters",
    image: "/images/services/cards/water-heaters.jpg",
    features: [
      "Tankless installation",
      "Traditional tank repair",
      "Hybrid systems",
      "Energy-efficient upgrades",
      "Same-day service",
    ],
  },
  {
    id: "drain-cleaning",
    title: "Drain Cleaning",
    description:
      "Professional drain cleaning services to eliminate clogs, restore flow, and prevent future blockages using state-of-the-art equipment.",
    icon: "Waves",
    href: "/services/drain-cleaning",
    image: "/images/services/cards/drain-cleaning.jpg",
    features: [
      "Hydro-jetting",
      "Camera inspection",
      "Root intrusion removal",
      "Preventive maintenance",
      "All drain types",
    ],
  },
  {
    id: "water-quality",
    title: "Water Quality",
    description:
      "Whole-home water softening and filtration systems to improve your water quality, protect your pipes, and enhance your daily comfort.",
    icon: "Droplets",
    href: "/services/water-softeners",
    image: "/images/services/cards/water-softeners.jpg",
    features: [
      "Water softeners",
      "Filtration systems",
      "Water testing",
      "Salt-free options",
      "Maintenance plans",
    ],
  },
  {
    id: "emergency",
    title: "Emergency Plumbing",
    description:
      "Plumbing emergencies don't wait, and neither do we. Our team is available 24/7 to handle burst pipes, major leaks, sewage backups, and more.",
    icon: "Siren",
    href: "/services/leak-repair",
    image: "/images/services/cards/emergency.jpg",
    features: [
      "24/7 rapid response",
      "Burst pipe repair",
      "Sewage backup cleanup",
      "Gas leak detection",
      "Flood damage mitigation",
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
    image: "/images/team/samuel.jpeg",
    bio: "Second-generation plumber and co-founder — the “S” in C&S. A Cape Coral High grad who earned his plumbing license in 1997 and has led the company ever since with the values his father instilled: honest work, fair pricing, and treating every customer like family.",
  },
  {
    name: "Aiden Pellechio",
    role: "Project Manager & Estimator",
    image: "/images/team/aiden.jpg",
    bio: "Third-generation Pellechio. Runs projects, estimating, permitting, and marketing at C&S while earning his construction-management degree at FGCU (Class of 2028), with plans to pursue his GC and plumbing licenses.",
  },
  {
    name: "Dylan Redecker",
    role: "Lead Plumber",
    image: "/images/team/dylan.jpeg",
    bio: "Hands-on expertise and dedication on every job site across Southwest Florida.",
  },
];

// ============================================
// TESTIMONIALS
// ============================================

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Dennis Shy",
    location: "Google Review",
    rating: 5,
    text: "Reasonable price. Great Company 100% Responsive and quick to show up and get the work done. I will use this company any time I have a plumbing need and would definitely recommend them to anyone.",
  },
  {
    name: "Richard Pace",
    location: "Google Review",
    rating: 5,
    text: "Great service! Friendly people! They answered all my questions and made suggestions that were helpful. They only know how to do things one way, and that's the right way!",
  },
  {
    name: "Lisa D",
    location: "Google Review",
    rating: 5,
    text: "Crew was timely and honest about what needed to be fixed. Thanks!",
  },
  {
    name: "Linda",
    location: "Google Review",
    rating: 5,
    text: "Could not be happier with Sam and his team. They did a fabulous job, efficient, prompt and cleaned up beautifully. I highly recommend them. And this is a family business which we all should support.",
  },
  {
    name: "Bob Romanoff",
    location: "Google Review",
    rating: 5,
    text: "I am a handyman who got in over my head changing the main shutoff and adding a new line in the 55 year old system. Sam came and quickly fixed the complex problems. He charged a fair amount also.",
  },
  {
    name: "Jana Hamrick",
    location: "Google Review",
    rating: 5,
    text: "Highly recommend. They're our go-to plumbers for the past 5 years. They show up on time and get the job done.",
  },
  {
    name: "Dennis Nelson",
    location: "Google Review",
    rating: 5,
    text: "Great service on replumbing.",
  },
  {
    name: "Fran Prego",
    location: "Google Review",
    rating: 5,
    text: "Work completed quickly and Aidan and Sam were great. Prices were very reasonable in installation of water and irrigation lines hooking up to the city.",
  },
  {
    name: "Yvonne Sunderland",
    location: "Cape Coral, FL",
    rating: 5,
    text: "C&S Plumbing converted a Laundry Room in our new home into a Beautiful New Bathroom. They were excellent from start to completion, which took a fraction of the time we expected. Sam had everyone on point and organized at all times. All the guys were very professional, courteous and friendly. We would recommend them to anyone needing a job done no matter how small or big.",
  },
  {
    name: "Brian Hamill",
    location: "Google Review",
    rating: 5,
    text: "C&S is the best! Incredibly responsive every time. They have fantastic employees and Sam (the owner) is great to work with. He truly cares. Do yourself a favor and use them.",
  },
  {
    name: "Brent Biagi",
    location: "Google Review",
    rating: 5,
    text: "I've used this company for many plumbing issues. Sam the owner is very responsive to your needs and Tom and the other workers know their job. Thanks again!",
  },
  {
    name: "Andrew Nerenberg",
    location: "Google Review",
    rating: 5,
    text: "Fast and reliable, Aiden in the office is the best. He is efficient and courteous. Dillon the young man that did the actual work was knowledgeable and also efficient. Will definitely be using C&S again.",
  },
  {
    name: "Nancy Doyle",
    location: "Google Review",
    rating: 5,
    text: "Thank you C&S for your quick response in fixing my plumbing issue today. Your technicians were informative and resolved my issue quickly. They left after cleaning up after themselves and making sure I was satisfied.",
  },
  {
    name: "Sarah Jones",
    location: "Google Review",
    rating: 5,
    text: "The whole team is super professional, informative, reliable and definitely know how to get the job done. I recommend them for all your plumbing needs! This is a family business, they are super personable. Awesome job Sam, Evan, Dylan, Tommy!",
  },
  {
    name: "Thomas Linn",
    location: "North Cape Coral, FL",
    rating: 5,
    text: "I have used C&S a few times since moving into my new home. They show up when they say, they are knowledgeable and professional, operate efficiently, and offer solutions instead of excuses. I highly recommend this company for your plumbing needs!",
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
      "Brothers Chris and Sam — with the support of their father — founded C&S Plumbing of Lee with a single truck and a commitment to quality. The name says it plainly: C&S, for Chris and Sam.",
    image: "/images/history/first-shop.jpg",
    imageAlt: "The original C&S Plumbing of Lee shop in the early days",
  },
  {
    year: "2003",
    title: "1,000 Homes Milestone",
    description:
      "Completed plumbing for our 1,000th new construction home, solidifying our reputation as a premier builder partner in Southwest Florida's growth boom.",
    image: "/images/history/sam-working-2002.jpg",
    imageAlt: "Sam Pellechio Jr. running underground plumbing on a job site in the early 2000s",
  },
  {
    year: "2010",
    title: "8,000 Homes & Growing",
    description:
      "Surpassed 8,000 new construction homes plumbed across Southwest Florida, becoming one of the region's most trusted plumbing contractors.",
    image: "/images/history/og-truck.jpg",
    imageAlt: "An early C&S Plumbing of Lee box truck",
  },
  {
    year: "2018",
    title: "20 Years of Excellence",
    description:
      "Celebrated two decades of service as one of Southwest Florida's most trusted plumbing contractors.",
    image: "/images/history/truck-tundra.jpg",
    imageAlt: "A branded C&S Plumbing of Lee service truck",
  },
  {
    year: "2022",
    title: "Hurricane Ian Response",
    description:
      "Stepped up for our community during Hurricane Ian, providing emergency plumbing services across the hardest-hit areas including Sanibel and Fort Myers Beach.",
    image: "/images/history/ian-response.jpg",
    imageAlt: "Hurricane Ian storm damage during cleanup and restoration work",
  },
  {
    year: "2024",
    title: "8,500+ Homes & Counting",
    description:
      "Surpassed 8,500 new construction homes — among Lee County's most experienced new-construction plumbers.",
    image: "/images/history/truck-new-home.jpg",
    imageAlt: "A C&S Plumbing of Lee truck at a new-construction home in Southwest Florida",
  },
];

// ============================================
// SERVICE AREAS
// ============================================

export const SERVICE_AREAS = [
  "Cape Coral",
  "Fort Myers",
  "North Fort Myers",
  "Punta Gorda",
  "Port Charlotte",
  "Naples",
  "Bonita Springs",
  "Estero",
  "Lehigh Acres",
  "Sanibel Island",
  "Captiva Island",
  "Fort Myers Beach",
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
// SERVICE LANDING PAGES
// ============================================

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: "repiping",
    image: "/images/services/cards/repiping.jpg",
    title: "Whole-Home Repiping",
    heroText: "Whole-Home Repiping in Cape Coral, Fort Myers & SWFL",
    description:
      "Aging pipes cause low water pressure, discolored water, and costly leaks. C&S Plumbing replaces your entire plumbing system with modern copper or PEX piping — backed by 8,500+ homes completed and a full warranty.",
    metaTitle: "Whole-Home Repiping | Cape Coral & Fort Myers Repipe Specialists",
    metaDescription:
      "Expert whole-home repiping in Cape Coral, Fort Myers & Southwest Florida. Copper & PEX options, minimal wall damage, full warranty. 8,500+ homes completed. Call 833-PLUMB-IT.",
    keywords: [
      "repiping Cape Coral",
      "repipe Fort Myers",
      "whole home repiping SWFL",
      "PEX repiping Cape Coral",
      "copper repiping Fort Myers",
      "repiping cost Cape Coral",
      "pipe replacement Lee County",
      "plumber repiping near me",
    ],
    features: [
      {
        title: "Copper & PEX Options",
        description:
          "We offer both copper and PEX repiping to match your home's needs and budget. PEX is flexible, corrosion-resistant, and often more affordable. Copper provides proven durability for decades.",
      },
      {
        title: "Minimal Wall Damage",
        description:
          "Our experienced crews plan pipe routes carefully to minimize drywall cuts. We patch and restore any openings so your home looks like we were never there.",
      },
      {
        title: "Full Permit & Inspection",
        description:
          "Every repipe job includes permit pulling, code-compliant installation, and final inspection by Lee County — no shortcuts, ever.",
      },
      {
        title: "Same-Week Scheduling",
        description:
          "Most whole-home repipes are completed in 1-2 days. We work efficiently to minimize disruption to your daily routine.",
      },
      {
        title: "Lifetime Warranty on PEX",
        description:
          "PEX piping comes with a manufacturer warranty, and C&S Plumbing backs every installation with a 1-year labor warranty. Your investment is fully protected.",
      },
    ],
    faqs: [
      {
        question: "How much does it cost to repipe a house in Cape Coral?",
        answer:
          "Whole-home repiping in Cape Coral typically costs between $4,000 and $15,000 depending on the size of your home, number of bathrooms, and pipe material (copper vs PEX). C&S Plumbing provides free estimates with upfront pricing — no hidden fees.",
      },
      {
        question: "How long does a whole-home repipe take?",
        answer:
          "Most homes can be fully repiped in 1-2 days. Larger homes or homes with complex layouts may take up to 3 days. We work to minimize disruption and keep you informed throughout the process.",
      },
      {
        question: "Should I choose copper or PEX for repiping?",
        answer:
          "PEX is more affordable, flexible, and resistant to corrosion — making it the most popular choice in Southwest Florida. Copper is more traditional and extremely durable. We'll help you choose the best option for your home and budget.",
      },
      {
        question: "How do I know if my home needs repiping?",
        answer:
          "Common signs include rusty or discolored water, low water pressure, frequent leaks, pinhole leaks in pipes, and homes built before 1990 with original polybutylene or galvanized pipes. If you notice any of these, call for a free inspection.",
      },
      {
        question: "Do you pull permits for repiping in Lee County?",
        answer:
          "Yes, every C&S Plumbing repipe job includes full permitting and final inspection by Lee County. This ensures your repiping is code-compliant and protects your home's value. Our license number is CFC1432485.",
      },
      {
        question: "Will repiping damage my walls or floors?",
        answer:
          "We minimize wall openings by using flexible PEX piping that can be routed through existing pathways. Small access holes are necessary, but we patch drywall after the job and leave your home clean. Most homeowners are surprised at how little disruption is involved.",
      },
      {
        question: "Does repiping increase my home's value?",
        answer:
          "Yes. A whole-home repipe is one of the best investments you can make. It eliminates the risk of pipe failure, can improve water pressure, and is often required by insurance companies and home inspectors during a sale.",
      },
    ],
    priceRange: "$4,000 – $15,000",
    highlights: [
      "8,500+ homes repiped & plumbed",
      "1-2 day completion for most homes",
      "Copper & PEX options available",
      "Full permit & inspection included",
      "Minimal wall damage guaranteed",
      "Licensed & insured (CFC1432485)",
      "Free estimates with upfront pricing",
      "1-year labor warranty + manufacturer warranty on PEX",
      "Serving all of Southwest Florida",
    ],
    costBreakdown: [
      { label: "PEX repipe — 2BR / 2BA, ≤1,500 sq ft", range: "$4,200 – $6,500", note: "Most condos and small slab homes" },
      { label: "PEX repipe — 3BR / 2BA, 1,800–2,400 sq ft", range: "$6,800 – $9,500", note: "Typical Cape Coral / Fort Myers single-family" },
      { label: "PEX repipe — 4BR+, ≥2,500 sq ft", range: "$9,500 – $13,000", note: "Two-story or larger floor plans" },
      { label: "Copper repipe (premium)", range: "+$2,000 – $4,000 over PEX", note: "Type-L copper, longer install time" },
      { label: "Polybutylene removal upcharge", range: "+$500 – $1,200", note: "Required for 1978–1995 homes still on poly" },
      { label: "Drywall patch & paint-ready finish", range: "Included", note: "We patch every access cut before we leave" },
      { label: "Lee County permit + final inspection", range: "Included", note: "Required by code; we handle it" },
    ],
    caseStudies: [
      {
        title: "1990 Cape Coral SE — polybutylene → PEX",
        location: "Cape Coral, FL",
        cost: "$7,200",
        summary: "3BR / 2BA, 1,950 sq ft. Original Quest poly with three pinhole leaks in 18 months. Crew of 3 finished rough + trim in 1.5 days, 9 access cuts patched.",
      },
      {
        title: "Fort Myers River District — copper for resale",
        location: "Fort Myers, FL",
        cost: "$11,800",
        summary: "4BR / 3BA, 2,650 sq ft pre-1985 home. Owner wanted Type-L copper for inspection appraisal. 2-day job; passed county final on first inspection.",
      },
      {
        title: "North Fort Myers condo — fast turn",
        location: "North Fort Myers, FL",
        cost: "$4,950",
        summary: "2BR / 2BA, 1,300 sq ft. PEX repipe done in a single day so the unit could be re-rented that weekend. Minimal wall openings — drywall ready for paint.",
      },
    ],
    relatedServices: ["leak-repair", "water-heaters", "plumbing-remodel"],
    relatedAreas: ["cape-coral", "fort-myers", "north-fort-myers", "naples"],
    answerBlocks: [
      {
        question: "How much does whole-home repiping cost in Southwest Florida?",
        answer: "Most repipes run $4,000–$15,000.",
        detail: "PEX repipes for a 3-bed, 2-bath home typically land between $4,000–$8,000. Copper repipes and larger homes (4+ baths or 2-story) push the range to $10,000–$15,000. Every estimate includes Lee County permitting and final inspection.",
      },
      {
        question: "How long does a repipe take?",
        answer: "Most homes are done in 1–2 days.",
        detail: "Standard 3/2 homes complete in a single day for the rough + trim. 4+ bath or 2-story homes take 2 days. We protect your floors and walls, patch all access points, and pressure-test before turning water back on.",
      },
      {
        question: "PEX or copper — which is better in Cape Coral?",
        answer: "PEX-A is the right answer for most Cape Coral homes.",
        detail: "Cape Coral's high-chloride soil causes pinhole corrosion in copper from the outside in. PEX-A is flexible, corrosion-proof, and carries a 25-year warranty. We still install copper when it's required for resale appraisals or HOA rules.",
      },
      {
        question: "Do you pull permits for repiping?",
        answer: "Yes — permits and final inspection are included in every repipe.",
        detail: "Every C&S repipe job includes Lee County permitting and final inspection. Our license number is CFC1432485. Skipping permits voids most homeowner insurance claims and creates problems at resale.",
      },
    ],
  },
  {
    slug: "water-heaters",
    image: "/images/services/cards/water-heaters.jpg",
    title: "Water Heaters",
    heroText: "Water Heater Installation & Repair in Cape Coral & Fort Myers",
    description:
      "No hot water? Whether you need a quick repair or a full replacement, C&S Plumbing installs and services all types of water heaters — traditional tank, tankless, and hybrid systems.",
    metaTitle: "Water Heater Installation & Repair | Cape Coral & Fort Myers",
    metaDescription:
      "Water heater installation, repair & replacement in Cape Coral, Fort Myers & SWFL. Tankless, traditional & hybrid options. Same-day service. Call 833-PLUMB-IT.",
    keywords: [
      "water heater Cape Coral",
      "water heater installation Fort Myers",
      "tankless water heater Cape Coral",
      "water heater repair SWFL",
      "hot water heater replacement",
      "water heater cost Fort Myers",
      "Rinnai tankless Cape Coral",
      "water heater plumber near me",
    ],
    features: [
      {
        title: "Tankless Water Heaters",
        description:
          "Endless hot water on demand with up to 40% energy savings. We install and service all major brands including Rinnai, Navien, and Noritz.",
      },
      {
        title: "Traditional Tank Systems",
        description:
          "Reliable and affordable hot water storage tanks in 40, 50, and 80 gallon sizes. We handle installation, repair, and replacement for all brands.",
      },
      {
        title: "Hybrid Heat Pump",
        description:
          "The most energy-efficient option available — hybrid water heaters use heat pump technology to cut energy costs by up to 60% compared to traditional tanks.",
      },
      {
        title: "Same-Day Repair & Replacement",
        description:
          "No hot water is an emergency. We offer same-day water heater repair and often same-day replacement with units stocked on our trucks.",
      },
      {
        title: "Energy Efficiency Upgrades",
        description:
          "Upgrading from an old tank to a modern tankless or hybrid system can save hundreds per year on energy bills while providing better performance.",
      },
    ],
    faqs: [
      {
        question: "How much does a water heater cost in Cape Coral?",
        answer:
          "Water heater costs in Cape Coral start at $195 for a basic repair. Traditional tank replacements typically run $995-$2,000 installed, and tankless installations start at $1,200. C&S Plumbing provides free estimates.",
      },
      {
        question: "Should I get a tankless or traditional water heater?",
        answer:
          "Tankless heaters cost more upfront but save money long-term with lower energy bills and a 20+ year lifespan. Traditional tanks are more affordable initially and work well for most homes. We'll help you decide based on your household size and usage.",
      },
      {
        question: "How long do water heaters last in Florida?",
        answer:
          "Traditional tank water heaters last 8-12 years in Florida's hard water conditions. Tankless units can last 20+ years with proper maintenance. Regular flushing and anode rod replacement extend the life of any water heater.",
      },
      {
        question: "Can you install a water heater the same day?",
        answer:
          "Yes, in most cases we can install a new water heater the same day you call. We stock the most popular models on our trucks for quick replacement when your water heater fails.",
      },
      {
        question: "Do tankless water heaters work well in Florida?",
        answer:
          "Absolutely. Florida's warm incoming water temperature means tankless heaters perform excellently here, reaching target temperatures faster and more efficiently than in colder climates.",
      },
      {
        question: "What brands of water heaters do you install?",
        answer:
          "We install all major brands including Rinnai, Navien, Rheem, A.O. Smith, and Bradford White. We'll recommend the best brand and model for your home based on your hot water needs, energy goals, and budget.",
      },
      {
        question: "How do I know when my water heater needs to be replaced?",
        answer:
          "Common signs include inconsistent water temperature, rusty water from the hot side only, rumbling or popping noises, visible corrosion or leaking around the base, and an age of 10+ years. If your water heater shows any of these signs, schedule a free inspection.",
      },
    ],
    priceRange: "$195 – $4,500+",
    highlights: [
      "Same-day service available",
      "All brands installed & serviced",
      "Tankless, tank & hybrid options",
      "Energy efficiency upgrades",
      "Upfront pricing, no surprises",
      "Licensed & insured (CFC1432485)",
      "Free estimates",
      "Warranty on all installations",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
    costBreakdown: [
      { label: "40-gallon electric tank — installed", range: "$1,650 – $2,200", note: "Includes haul-away of old unit, code-compliant pan & T&P" },
      { label: "50-gallon electric tank — installed", range: "$1,850 – $2,500", note: "Most common SWFL family-of-four size" },
      { label: "Tankless gas (Rinnai/Navien)", range: "$3,500 – $5,200", note: "Gas line + venting included; whole-home flow" },
      { label: "Heat-pump hybrid (50–80 gal)", range: "$3,200 – $4,800", note: "Up to ~$2,000 in FL utility rebates available" },
      { label: "Same-day repair (thermostat / element / T&P)", range: "$195 – $475", note: "If it can be repaired vs replaced" },
      { label: "Permit + Lee County final", range: "Included on installs", note: "Required when replacing a unit" },
    ],
    caseStudies: [
      {
        title: "Tankless conversion — Cape Coral",
        location: "Cape Coral, FL",
        cost: "$4,650",
        summary: "Family of 5 was running out of hot water by shower #3. Swapped a 50-gal tank for a Navien NPE-A2. Installed new gas line + concentric vent. Done in 6 hours.",
      },
      {
        title: "Emergency replacement — Fort Myers",
        location: "Fort Myers, FL",
        cost: "$2,150",
        summary: "11-year-old tank failed Friday at 5pm with water on the floor. On-site by 7pm Saturday with a new 50-gal Bradford White; old unit hauled away same trip.",
      },
      {
        title: "Heat-pump retrofit — Naples",
        location: "Naples, FL",
        cost: "$3,950",
        summary: "Replaced an 80-gal electric tank with a Rheem ProTerra hybrid. Customer netted a $1,800 utility rebate; runs ~70% less than the old unit per FPL bill comparison.",
      },
    ],
    relatedServices: ["repiping", "leak-repair", "water-softeners"],
    relatedAreas: ["cape-coral", "fort-myers", "naples", "bonita-springs"],
    answerBlocks: [
      {
        question: "How much does a water heater cost installed in Cape Coral?",
        answer: "Tank replacements run $995–$2,000; tankless installs start at $1,200.",
        detail: "Standard 40–50 gallon electric or gas tank replacement is typically $995–$1,800 installed with old unit haul-away. Tankless installs start at $1,200 and go up to $4,500 depending on gas line work and unit size. Hybrid heat-pump units are $2,500–$3,950 and often qualify for FPL rebates.",
      },
      {
        question: "Tankless vs traditional — which is right for my home?",
        answer: "Tankless wins on lifespan and energy use; tank wins on upfront cost and simplicity.",
        detail: "Tankless units last 20+ years vs 8–12 for tank in Florida, use less energy, and never run out. But they cost 2–3× upfront and may need a gas-line upgrade. Tank water heaters are cheaper to install and replace, easier to service, but the tank fails eventually and needs replacement more often.",
      },
      {
        question: "How fast can you replace a failed water heater?",
        answer: "Same-day installation in most cases.",
        detail: "If your tank fails in the morning, we can usually have a new unit installed and running the same day. After-hours and weekend emergency installs are available 24/7. Repairs (thermostat, element, valve) start at $195.",
      },
      {
        question: "Do tankless water heaters work in Florida hard water?",
        answer: "Yes — but plan on annual flushing.",
        detail: "Florida's hard water builds scale inside tankless heat exchangers. We install with isolation valves so we (or you) can flush the unit annually with vinegar or descaling solution. Skipping the flush voids most manufacturer warranties and shortens unit life.",
      },
    ],
  },
  {
    slug: "drain-cleaning",
    image: "/images/services/cards/drain-cleaning.jpg",
    title: "Drain Cleaning",
    heroText: "Professional Drain Cleaning in Cape Coral & Fort Myers",
    description:
      "Slow drains, recurring clogs, and sewage backups need professional attention. C&S Plumbing uses hydro-jetting and camera inspection technology to clear any blockage and keep your drains flowing.",
    metaTitle: "Drain Cleaning Services | Cape Coral & Fort Myers Plumber",
    metaDescription:
      "Professional drain cleaning in Cape Coral, Fort Myers & SWFL. Hydro-jetting, camera inspection, root removal. Fast service, fair pricing. Call 833-PLUMB-IT.",
    keywords: [
      "drain cleaning Cape Coral",
      "drain cleaning Fort Myers",
      "clogged drain plumber SWFL",
      "hydro jetting Cape Coral",
      "sewer camera inspection",
      "root removal drain",
      "slow drain repair",
      "drain cleaning near me",
    ],
    features: [
      {
        title: "Hydro-Jetting",
        description:
          "High-pressure water jetting blasts through grease, scale, roots, and debris — restoring your pipes to near-new condition without harsh chemicals.",
      },
      {
        title: "Camera Inspection",
        description:
          "We use sewer camera technology to see exactly what's causing your drain problems — no guessing. You'll see the footage and know exactly what needs fixing.",
      },
      {
        title: "Root Intrusion Removal",
        description:
          "Tree roots are a common cause of drain backups in Southwest Florida. We cut through roots and can recommend solutions to prevent them from returning.",
      },
      {
        title: "Kitchen & Bathroom Drains",
        description:
          "From kitchen sink grease clogs to bathroom hair blockages, we handle all residential drain cleaning with the right tools for each situation.",
      },
      {
        title: "Main Sewer Line Cleaning",
        description:
          "Main line backups affect your entire home. We clear main sewer lines quickly and can identify underlying issues that could cause future problems.",
      },
    ],
    faqs: [
      {
        question: "How much does drain cleaning cost in Cape Coral?",
        answer:
          "Drain cleaning in Cape Coral typically costs between $150 and $500 depending on the type of drain, severity of the clog, and method required. Simple clogs start around $150, while main sewer line cleaning with hydro-jetting can be $300-$500.",
      },
      {
        question: "What causes recurring drain clogs?",
        answer:
          "Recurring clogs are usually caused by tree root intrusion, grease buildup, pipe scale, or damaged/bellied pipes. A camera inspection can identify the root cause so we can fix the problem permanently, not just temporarily clear it.",
      },
      {
        question: "Is hydro-jetting safe for older pipes?",
        answer:
          "Hydro-jetting is safe for most pipe types when performed by a licensed professional. We always perform a camera inspection first to assess pipe condition. For very old or fragile pipes, we'll recommend the safest cleaning method.",
      },
      {
        question: "How often should I have my drains cleaned?",
        answer:
          "For preventive maintenance, we recommend professional drain cleaning every 1-2 years. Homes with large trees near sewer lines or older pipes may benefit from annual cleaning. Commercial kitchens should have grease lines cleaned quarterly.",
      },
      {
        question: "Do you offer emergency drain cleaning?",
        answer:
          "Yes, we offer 24/7 emergency drain cleaning for sewage backups and critical drain failures. Call 833-PLUMB-IT any time and we'll dispatch a technician as quickly as possible.",
      },
      {
        question: "What is hydro-jetting and how does it work?",
        answer:
          "Hydro-jetting uses a high-pressure stream of water (up to 4,000 PSI) to blast through grease, mineral scale, tree roots, and debris inside your pipes. It's the most thorough cleaning method available and restores pipes to near-new condition without chemicals.",
      },
      {
        question: "Can tree roots damage my sewer line?",
        answer:
          "Yes, tree roots are one of the most common causes of sewer line blockages in Southwest Florida. Roots seek out moisture and can infiltrate tiny cracks in pipes, growing until they block the line entirely. We use camera inspections to identify root intrusion and hydro-jetting to clear them.",
      },
    ],
    priceRange: "$150 – $500",
    highlights: [
      "Same-day service available",
      "Hydro-jetting technology",
      "Camera inspection included",
      "Root intrusion specialists",
      "All drain types serviced",
      "Licensed & insured (CFC1432485)",
      "Upfront pricing",
      "Preventive maintenance plans",
      "24/7 emergency service",
    ],
    costBreakdown: [
      { label: "Single-fixture clog (sink, tub, toilet)", range: "$150 – $250", note: "Cabling from accessible cleanout" },
      { label: "Main line cabling (sewer)", range: "$295 – $475", note: "Includes cleanout access if available" },
      { label: "Hydro-jetting — main line", range: "$450 – $800", note: "4,000 PSI; most thorough cleaning method" },
      { label: "Sewer camera inspection", range: "$245 – $395", note: "Free with hydro-jetting on same trip" },
      { label: "Root removal + jetting + camera", range: "$650 – $1,100", note: "Common for older Cape Coral homes near big trees" },
      { label: "After-hours / weekend surcharge", range: "+$95 – $150", note: "We aim to never charge it — most jobs handled in business hours" },
    ],
    caseStudies: [
      {
        title: "Recurring kitchen backup — Lehigh Acres",
        location: "Lehigh Acres, FL",
        cost: "$520",
        summary: "Customer was paying another plumber 3x/year to cable. We jetted the line, camera-inspected, and found a low spot trapping grease. Hasn't backed up in 14 months.",
      },
      {
        title: "Root-blocked main — Fort Myers",
        location: "Fort Myers, FL",
        cost: "$895",
        summary: "1976 home, 60-ft cast-iron run with two large oak roots. Jetting + cutter cleared it; camera found one cracked joint flagged for future replacement.",
      },
      {
        title: "Restaurant grease line — Cape Coral",
        location: "Cape Coral, FL",
        cost: "$1,250 / quarter",
        summary: "Quarterly preventive jetting on a 4-inch grease line keeps the kitchen open. Better than the alternative — a Friday-night shutdown for emergency cabling.",
      },
    ],
    relatedServices: ["leak-repair", "repiping", "uep-utilities"],
    relatedAreas: ["cape-coral", "fort-myers", "lehigh-acres", "north-fort-myers"],
    answerBlocks: [
      {
        question: "How much does drain cleaning cost?",
        answer: "Most residential drains cost $150–$500.",
        detail: "A simple sink, tub, or toilet cable runs $150–$250. Main-line cabling is $250–$400. Hydro-jetting (up to 4,000 PSI) for grease, roots, or recurring blockages is $400–$650. Sewer camera inspection is $150 standalone or included with most jet jobs.",
      },
      {
        question: "Cable or hydro-jet — which do I need?",
        answer: "Cable for a one-time clog; hydro-jet for recurring or grease/root issues.",
        detail: "If it's the first clog in years, cabling clears it cheaply. If it backs up every few months, the line wall is coated with grease, soap scum, or root intrusion — cabling just punches a hole through it. Hydro-jetting scrubs the pipe wall back to bare and usually buys you 2–4 years before the next service.",
      },
      {
        question: "How often should I have drains cleaned preventively?",
        answer: "Homes: every 1–2 years. Commercial kitchens: quarterly.",
        detail: "Annual mainline jetting is cheap insurance for older homes with cast iron drains, mature landscaping, or any history of backups. Restaurants and food service should be on a quarterly schedule to stay ahead of grease — including grease trap pumping if applicable.",
      },
    ],
  },
  {
    slug: "leak-repair",
    image: "/images/services/cards/emergency.jpg",
    title: "Leak Detection & Repair",
    heroText: "Leak Detection & Emergency Repair in Cape Coral & Fort Myers",
    description:
      "Water leaks waste money and cause serious damage. C&S Plumbing finds and fixes leaks fast — from dripping faucets to hidden slab leaks — protecting your home and your wallet.",
    metaTitle: "Leak Detection & Repair | Cape Coral & Fort Myers Emergency Plumber",
    metaDescription:
      "Expert leak detection & repair in Cape Coral, Fort Myers & SWFL. Slab leaks, pipe leaks, faucet repair. 24/7 emergency service. Call 833-PLUMB-IT.",
    keywords: [
      "leak repair Cape Coral",
      "leak detection Fort Myers",
      "slab leak repair SWFL",
      "pipe leak plumber",
      "emergency leak repair",
      "water leak plumber near me",
      "faucet leak repair Cape Coral",
      "hidden leak detection",
    ],
    features: [
      {
        title: "Electronic Leak Detection",
        description:
          "Advanced electronic equipment pinpoints hidden leaks behind walls, under slabs, and underground — without unnecessary demolition.",
      },
      {
        title: "Slab Leak Repair",
        description:
          "Slab leaks are common in Southwest Florida homes. We locate and repair slab leaks with minimal disruption, or reroute pipes when repair isn't practical.",
      },
      {
        title: "Pipe Leak Repair",
        description:
          "From pinhole leaks in copper pipes to burst PVC lines, we fix all types of pipe leaks with permanent solutions — not temporary patches.",
      },
      {
        title: "Faucet & Fixture Leaks",
        description:
          "A dripping faucet wastes thousands of gallons per year. We repair or replace leaking faucets, toilets, valves, and fixtures quickly and affordably.",
      },
      {
        title: "24/7 Emergency Response",
        description:
          "Water leaks can cause catastrophic damage in hours. Our emergency team responds around the clock to stop leaks and prevent further damage to your home.",
      },
    ],
    faqs: [
      {
        question: "How much does leak repair cost in Cape Coral?",
        answer:
          "Leak repair costs in Cape Coral range from $150 for a simple faucet leak to $800+ for slab leaks or pipe leaks behind walls. The cost depends on leak location and accessibility. We provide free estimates with transparent pricing.",
      },
      {
        question: "How do I know if I have a slab leak?",
        answer:
          "Signs of a slab leak include unexplained increases in your water bill, warm spots on the floor, the sound of running water when nothing is on, damp or warped flooring, and mold or mildew smell. If you suspect a slab leak, call for an inspection right away.",
      },
      {
        question: "Can you detect leaks without tearing up walls?",
        answer:
          "Yes. We use electronic leak detection equipment that can locate leaks behind walls, under slabs, and underground without destructive exploration. This saves time, money, and damage to your home.",
      },
      {
        question: "How quickly can you respond to a water leak emergency?",
        answer:
          "We offer 24/7 emergency service and typically arrive within 1-2 hours for active water leaks in the Cape Coral, Fort Myers, and North Fort Myers area. Call 833-PLUMB-IT immediately if you have an active leak.",
      },
      {
        question: "Should I repair or reroute a slab leak?",
        answer:
          "It depends on the pipe condition and location. If it's a single leak in otherwise good pipes, repair is usually best. If you have multiple slab leaks or old corroded pipes, rerouting through the attic or walls is often more cost-effective long-term.",
      },
      {
        question: "Does homeowner's insurance cover water leak damage?",
        answer:
          "Most homeowner's insurance policies cover sudden and accidental water damage, but not damage from neglected maintenance or slow leaks. Document all damage with photos before cleanup and contact your insurance provider promptly. We can provide repair documentation for your claim.",
      },
      {
        question: "What should I do if I find a leak in my home?",
        answer:
          "First, shut off the water supply at the nearest valve or the main shutoff. Then contain the water with towels or buckets to minimize damage. Call C&S Plumbing at 833-PLUMB-IT for 24/7 emergency response — we typically arrive within 1-2 hours in our service area.",
      },
    ],
    priceRange: "$150 – $800+",
    highlights: [
      "24/7 emergency response",
      "Electronic leak detection",
      "Slab leak specialists",
      "Non-destructive methods",
      "Fast, same-day service",
      "Licensed & insured (CFC1432485)",
      "Free estimates",
      "All pipe types repaired",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
    costBreakdown: [
      { label: "Faucet / fixture leak repair", range: "$125 – $325", note: "Most common — washer, cartridge, supply line" },
      { label: "Toilet leak (flapper, fill valve, wax seal)", range: "$165 – $385", note: "Stops $200+/yr in wasted water on a single toilet" },
      { label: "Visible pipe leak under-sink / vanity", range: "$185 – $475", note: "Drain trap, supply, or drain arm replacement" },
      { label: "Slab leak detection + spot repair", range: "$1,200 – $2,800", note: "Acoustic + thermal locate, single break under slab" },
      { label: "Slab leak — full reroute (bypass)", range: "$2,800 – $5,500", note: "Often more cost-effective than chasing multiple leaks" },
      { label: "Whole-house pressure regulator", range: "$425 – $725", note: "Fixes pressure-driven pinholes; required at 80+ PSI" },
    ],
    caseStudies: [
      {
        title: "Hidden slab leak — Cape Coral",
        location: "Cape Coral, FL",
        cost: "$2,450",
        summary: "$300/mo water bill, no visible leak. Acoustic locate found a hot-side pinhole under the kitchen slab. Bypassed via attic; floor untouched.",
      },
      {
        title: "Wax-ring failure — Naples",
        location: "Naples, FL",
        cost: "$285",
        summary: "Customer thought they had a slab leak. Actually a 12-year-old wax ring leaking on every flush. Reset toilet + new ring; saved a $2k+ slab investigation.",
      },
      {
        title: "Pinhole hot line — Bonita Springs",
        location: "Bonita Springs, FL",
        cost: "$675",
        summary: "Garage ceiling staining; pinhole on hot line above. Cut a 2x2 access, replaced 8ft of copper with PEX-A, patched drywall paint-ready.",
      },
    ],
    relatedServices: ["repiping", "drain-cleaning", "water-heaters"],
    relatedAreas: ["cape-coral", "fort-myers", "naples", "bonita-springs"],
    answerBlocks: [
      {
        question: "How much does leak detection cost?",
        answer: "Simple visible leaks start at $150; slab and underground leak detection runs $400–$800.",
        detail: "If we can see and access the leak, repairs typically run $150–$400. Hidden leaks behind walls, under slabs, or in irrigation lines need electronic detection equipment — $400–$800 to find, plus repair cost. We use acoustic and pressure-trace methods first to avoid unnecessary demolition.",
      },
      {
        question: "What are the signs of a slab leak?",
        answer: "Warm or wet spots on floors, unexplained water bill spikes, and the sound of running water with all fixtures off.",
        detail: "Other clues: foundation cracks appearing or widening, hot water heater running constantly, mildew or musty smell in carpets, and a water meter that keeps moving when nothing is on. If you see two or more of these together, call us — slab leaks worsen fast.",
      },
      {
        question: "How fast can you respond to a leak emergency?",
        answer: "Within 60 minutes for active leaks in Cape Coral and Fort Myers.",
        detail: "If you have water actively running where it shouldn't be, call 833-PLUMB-IT and shut off your main water valve. We'll dispatch a licensed plumber 24/7. While you wait, move valuables off the floor and document damage with photos for insurance.",
      },
    ],
  },
  {
    slug: "water-softeners",
    image: "/images/services/cards/water-softeners.jpg",
    title: "Water Softeners & Filtration",
    heroText: "Water Softener & Filtration Systems in Cape Coral & Fort Myers",
    description:
      "Southwest Florida's hard water damages pipes, appliances, and fixtures. C&S Plumbing installs whole-home water softeners and filtration systems to protect your home and improve your water quality.",
    metaTitle: "Water Softener Installation | Cape Coral & Fort Myers",
    metaDescription:
      "Water softener & filtration installation in Cape Coral, Fort Myers & SWFL. Protect pipes, improve water quality. Free water testing. Call 833-PLUMB-IT.",
    keywords: [
      "water softener Cape Coral",
      "water softener Fort Myers",
      "water filtration SWFL",
      "water softener installation",
      "hard water solution Cape Coral",
      "reverse osmosis Fort Myers",
      "whole home water filter",
      "water softener near me",
    ],
    features: [
      {
        title: "Whole-Home Water Softeners",
        description:
          "Remove calcium, magnesium, and minerals that cause scale buildup, pipe damage, and appliance wear. Enjoy softer water throughout your entire home.",
      },
      {
        title: "Reverse Osmosis Systems",
        description:
          "Pure, great-tasting drinking water from every tap. Our RO systems remove up to 99% of contaminants for clean, healthy water.",
      },
      {
        title: "Salt-Free Conditioning",
        description:
          "Prefer a salt-free option? We install conditioning systems that prevent scale buildup without adding sodium to your water supply.",
      },
      {
        title: "Free Water Testing",
        description:
          "Not sure what you need? We test your water for hardness, chlorine, pH, and contaminants — then recommend the right solution for your home.",
      },
      {
        title: "Maintenance & Repair",
        description:
          "Keep your system running efficiently with our maintenance plans. We service all brands and can repair or upgrade your existing water treatment equipment.",
      },
    ],
    faqs: [
      {
        question: "Do I need a water softener in Cape Coral?",
        answer:
          "Almost certainly yes. Cape Coral and most of Southwest Florida have very hard water (15-25 grains per gallon). Hard water causes scale buildup in pipes and appliances, reduces soap effectiveness, and leaves spots on dishes and fixtures.",
      },
      {
        question: "How much does a water softener cost in Fort Myers?",
        answer:
          "Water softener installation in Fort Myers typically costs between $1,500 and $4,000 depending on the system type and capacity. Basic softeners start around $1,500, while premium whole-home systems with reverse osmosis run $3,000-$4,000.",
      },
      {
        question: "How long do water softeners last?",
        answer:
          "A quality water softener lasts 10-15 years with proper maintenance. Regular salt refills and occasional resin replacement keep your system running efficiently. We offer maintenance plans to extend the life of your system.",
      },
      {
        question: "Is a salt-free water softener worth it?",
        answer:
          "Salt-free conditioners prevent new scale buildup but don't remove existing minerals from your water. They're a good option for people on low-sodium diets or who prefer not to add salt. For the hardest water, traditional salt-based systems are more effective.",
      },
      {
        question: "Can you install a water softener in a condo?",
        answer:
          "Yes, we install compact water softeners and under-sink filtration systems for condos and smaller spaces. We'll recommend the right size and type based on your unit's plumbing and your water quality needs.",
      },
    ],
    priceRange: "$1,500 – $4,000",
    highlights: [
      "Free water testing",
      "All major brands installed",
      "Salt-based & salt-free options",
      "Reverse osmosis systems",
      "Protects pipes & appliances",
      "Licensed & insured (CFC1432485)",
      "Maintenance plans available",
      "Upfront pricing",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
    relatedServices: ["repiping", "water-heaters", "leak-repair"],
    relatedAreas: ["cape-coral", "fort-myers", "naples", "estero"],
  },
  {
    slug: "plumbing-remodel",
    image: "/images/services/cards/plumbing-remodel.jpg",
    title: "Plumbing Remodels",
    heroText: "Kitchen & Bathroom Plumbing Remodels in Cape Coral & Fort Myers",
    description:
      "Remodeling your kitchen or bathroom? C&S Plumbing handles everything from pipe relocation to premium fixture installation — ensuring your remodel is done right the first time.",
    metaTitle: "Kitchen & Bathroom Plumbing Remodels | Cape Coral & Fort Myers",
    metaDescription:
      "Expert plumbing remodel services in Cape Coral, Fort Myers & SWFL. Kitchen & bathroom renovations, fixture upgrades, pipe relocation. Call 833-PLUMB-IT.",
    keywords: [
      "plumbing remodel Cape Coral",
      "bathroom remodel plumber Fort Myers",
      "kitchen plumbing remodel SWFL",
      "fixture installation Cape Coral",
      "bathroom renovation plumber",
      "kitchen sink installation",
      "plumbing renovation near me",
      "remodel plumber Lee County",
    ],
    features: [
      {
        title: "Kitchen Remodels",
        description:
          "Relocate water lines, install new sinks, connect dishwashers and ice makers, and upgrade to modern fixtures. We coordinate with your contractor for seamless results.",
      },
      {
        title: "Bathroom Renovations",
        description:
          "From walk-in showers to freestanding tubs, we handle all bathroom plumbing — including drain relocation, valve installation, and fixture hookups.",
      },
      {
        title: "Fixture Upgrades",
        description:
          "Upgrade to modern, water-efficient fixtures that look great and save water. We install all brands and styles of faucets, toilets, showerheads, and more.",
      },
      {
        title: "Pipe Relocation",
        description:
          "Changing your layout? We reroute water supply lines and drain pipes to accommodate your new design, ensuring proper flow and code compliance.",
      },
      {
        title: "Code Compliance",
        description:
          "Every remodel requires updated plumbing that meets current building codes. We handle permits, inspections, and ensure everything is up to code.",
      },
    ],
    faqs: [
      {
        question: "How much does a bathroom plumbing remodel cost?",
        answer:
          "Bathroom plumbing remodel costs in Cape Coral range from $2,000 for basic fixture swaps to $8,000+ for full layout changes with pipe relocation. The cost depends on scope — a simple fixture upgrade is much less than moving plumbing for a new layout.",
      },
      {
        question: "Do I need a plumber for a kitchen remodel?",
        answer:
          "Yes. Any work involving water supply lines, drain pipes, gas lines, or fixture installation requires a licensed plumber. Even seemingly simple tasks like moving a sink require proper plumbing to prevent leaks and code violations.",
      },
      {
        question: "How long does plumbing take during a remodel?",
        answer:
          "Rough-in plumbing (moving pipes, adding connections) typically takes 1-2 days. Finish plumbing (installing fixtures, connecting appliances) takes another 1-2 days. We coordinate with your general contractor to stay on schedule.",
      },
      {
        question: "Can you work with my general contractor?",
        answer:
          "Absolutely. We regularly partner with general contractors throughout Lee County. We coordinate scheduling, handle our own permits, and communicate directly with your GC to keep your project on track.",
      },
      {
        question: "Do you install luxury fixtures?",
        answer:
          "Yes, we install all brands from budget-friendly to high-end luxury. Whether it's a Kohler, Moen, Delta, or premium brands like Brizo or Grohe, we have experience with professional installation of any fixture.",
      },
    ],
    priceRange: "$2,000 – $8,000+",
    highlights: [
      "Kitchen & bathroom specialists",
      "All fixture brands installed",
      "Pipe relocation services",
      "Code-compliant renovations",
      "Permit handling included",
      "Licensed & insured (CFC1432485)",
      "Coordinates with contractors",
      "Free estimates",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
    relatedServices: ["repiping", "water-heaters", "drain-cleaning"],
    relatedAreas: ["cape-coral", "fort-myers", "naples", "bonita-springs"],
  },
  {
    slug: "uep-utilities",
    title: "UEP Utilities Hookup",
    heroText:
      "Cape Coral UEP Utilities Hookup — Start to Finish",
    description:
      "Cape Coral's Utilities Extension Program (UEP) requires homeowners to connect to city water and sewer. C&S Plumbing handles the entire process — from pulling permits to final inspection. We install water service lines, irrigation lines, sewer laterals, and perform septic pump-out and abandonment so you can get connected fast.",
    metaTitle:
      "UEP Utilities Hookup Cape Coral | Water, Sewer & Septic Abandonment",
    metaDescription:
      "Full-service UEP utilities hookup in Cape Coral. Water service $13-15/ft, irrigation $9-10/ft, sewer $25-33/ft, septic abandonment $2,500. All permits included. Call 833-PLUMB-IT.",
    keywords: [
      "UEP Cape Coral",
      "UEP utilities hookup",
      "Cape Coral utilities connection",
      "UEP plumber Cape Coral",
      "water service line Cape Coral",
      "sewer lateral Cape Coral",
      "septic abandonment Cape Coral",
      "irrigation line Cape Coral",
      "UEP permit Cape Coral",
      "utilities hookup plumber near me",
    ],
    features: [
      {
        title: "Water Service Line — $13–15/ft",
        description:
          "We install your water service line from the city meter to your home. You list C&S as your plumber with Cape Coral Utilities, and we handle the rest — from trenching to connection and pressure testing.",
      },
      {
        title: "Irrigation Line — $9–10/ft",
        description:
          "Separate irrigation meter connection to keep your lawn and landscaping on its own water line. We run the line from the irrigation meter to your system with proper backflow prevention.",
      },
      {
        title: "Sewer Lateral — $25–33/ft",
        description:
          "We connect your home to the city sewer main with a new sewer lateral. Pricing varies based on distance and depth. Every install includes proper grade, cleanouts, and full inspection.",
      },
      {
        title: "Septic Abandonment & Pump-Out — $2,500",
        description:
          "Once you're connected to city sewer, your old septic tank needs to be pumped out and properly abandoned. We coordinate the pump truck, collapse or fill the tank, and handle the required permit and inspection.",
      },
      {
        title: "Extras & Upgrades",
        description:
          "While we're on-site, we can install new shutoff valves, pressure regulators, hose bibs, and other upgrades. It's the perfect time to address anything else since we already have the ground open.",
      },
    ],
    faqs: [
      {
        question: "What is the UEP program in Cape Coral?",
        answer:
          "The Utilities Extension Program (UEP) is Cape Coral's initiative to bring city water and sewer to neighborhoods that currently use wells and septic systems. When city lines reach your area, homeowners are required to connect within a set timeframe. C&S Plumbing handles the full connection process.",
      },
      {
        question: "How much does a UEP utilities hookup cost?",
        answer:
          "Costs depend on what services you need and the distance from the city connection to your home. Water service lines run $13–15 per foot, irrigation lines $9–10 per foot, sewer laterals $25–33 per foot, and septic abandonment is a flat $2,500. We provide a free estimate based on your specific property.",
      },
      {
        question: "What is the process for getting connected?",
        answer:
          "Once you sign with us, we send an initial deposit invoice that covers permitting and mobilization. We apply for all required permits. For water service, you'll need to list C&S as your plumber with Cape Coral Utilities. Once permits are issued and the water meter is installed, we get to work. The install and hookup process, including septic abandonment, typically takes 1–3 days with city inspections.",
      },
      {
        question: "How long does a UEP hookup take?",
        answer:
          "The actual installation work takes 1–3 days depending on the scope. The permitting process can take a few weeks before we break ground. Once permits are issued and the meter is set, we mobilize quickly and get you connected with minimal disruption.",
      },
      {
        question: "Do you handle all the permits and inspections?",
        answer:
          "Yes — we handle everything from start to finish. That includes pulling all required permits, coordinating with Cape Coral Utilities, scheduling inspections, and closing out permits after the work passes. You don't have to deal with any of the paperwork.",
      },
    ],
    priceRange:
      "Water: $13–15/ft · Irrigation: $9–10/ft · Sewer: $25–33/ft · Septic: $2,500",
    highlights: [
      "Full start-to-finish service",
      "All permits & inspections handled",
      "1–3 day installation",
      "Cape Coral UEP specialists",
      "Septic pump-out & abandonment included",
      "Licensed & insured (CFC1432485)",
      "Free estimates with upfront pricing",
      "New shutoff valves & extras available",
      "Serving all Cape Coral UEP phases",
    ],
    relatedServices: ["leak-repair", "drain-cleaning", "repiping"],
    relatedAreas: ["cape-coral", "fort-myers", "north-fort-myers", "lehigh-acres"],
  },
];

// ============================================
// AREA LANDING PAGES
// ============================================

export const AREA_LANDINGS: AreaLanding[] = [
  {
    slug: "cape-coral",
    city: "Cape Coral",
    state: "FL",
    metaTitle: "Plumber in Cape Coral, FL",
    metaDescription:
      "Trusted plumber in Cape Coral, FL. Emergency plumbing, repiping, drain cleaning, water heaters & more. Family-owned since 1997. 8,500+ homes. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Cape Coral",
      "plumber Cape Coral FL",
      "Cape Coral plumbing",
      "emergency plumber Cape Coral",
      "repiping Cape Coral",
      "drain cleaning Cape Coral",
      "water heater Cape Coral",
      "plumber near me Cape Coral",
      "best plumber Cape Coral",
    ],
    heroText: "Your Trusted Plumber in Cape Coral, FL",
    description:
      "C&S Plumbing has been serving Cape Coral homeowners and businesses since 1997. From emergency repairs to whole-home repiping, we deliver fast, reliable plumbing backed by 8,500+ completed homes.",
    neighborhoods: [
      "SW Cape Coral",
      "NW Cape Coral",
      "SE Cape Coral",
      "NE Cape Coral",
      "Pelican",
      "Burnt Store",
      "Cape Harbour",
      "Tarpon Point",
      "Yacht Club",
      "Cape Coral Parkway",
    ],
    faqs: [
      {
        question: "Do you handle UEP water and sewer connections in Cape Coral?",
        answer:
          "Yes — UEP hookups are one of our specialties. As Cape Coral expands municipal water and sewer through the Utilities Extension Program, we connect homes to the new lines, properly abandon old septic tanks and wells to code, and pull the required City of Cape Coral permits.",
      },
      {
        question: "My Cape Coral home still has its original pipes — should I repipe?",
        answer:
          "Many Cape Coral homes built in the 1970s–90s still have polybutylene or galvanized pipe that's prone to leaks and low pressure. We've repiped thousands of Cape homes in PEX or copper, usually in 1–2 days, with a free upfront estimate.",
      },
      {
        question: "Can you help with Cape Coral's hard water?",
        answer:
          "Absolutely. Cape Coral's hard water scales fixtures and shortens water-heater life. We install and service whole-home water softeners and filtration sized to your water quality and household.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in Cape Coral?",
        answer:
          "Yes. Burst pipes, slab leaks, and sewage backups don't wait, so we're available around the clock across all four quadrants of the Cape plus Cape Harbour, Tarpon Point, and the Yacht Club area.",
      },
      {
        question: "Are you licensed to pull permits in Cape Coral?",
        answer:
          "Yes. We're Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, and we pull every required City of Cape Coral permit and pass inspection — no exceptions.",
      },
    ],
    localContext:
      "Cape Coral's unique canal system and waterfront properties require plumbers who understand the area's specific challenges. From salt-air corrosion on outdoor plumbing to the hard water that's common throughout the Cape, C&S Plumbing has the local expertise to keep your home's plumbing running smoothly. We've repiped thousands of Cape Coral homes built in the 1970s-1990s that still have original polybutylene or galvanized pipes.",
  },
  {
    slug: "fort-myers",
    city: "Fort Myers",
    state: "FL",
    metaTitle: "Plumber in Fort Myers, FL",
    metaDescription:
      "Expert plumber in Fort Myers, FL. Residential & commercial plumbing, emergency service, repiping, water heaters. 28+ years serving SWFL. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Fort Myers",
      "plumber Fort Myers FL",
      "Fort Myers plumbing",
      "emergency plumber Fort Myers",
      "repiping Fort Myers",
      "drain cleaning Fort Myers",
      "water heater Fort Myers",
      "plumber near me Fort Myers",
      "best plumber Fort Myers",
    ],
    heroText: "Expert Plumbing Services in Fort Myers, FL",
    description:
      "From downtown Fort Myers to the surrounding communities, C&S Plumbing provides full-service residential and commercial plumbing. 24/7 emergency service, competitive pricing, and the experience of 8,500+ completed projects.",
    neighborhoods: [
      "Downtown Fort Myers",
      "McGregor",
      "Gateway",
      "Daniels Corridor",
      "Colonial Blvd",
      "Page Field",
      "Whiskey Creek",
      "Three Oaks",
      "Iona",
      "San Carlos",
    ],
    faqs: [
      {
        question: "Do you handle commercial plumbing in Fort Myers?",
        answer:
          "Yes. We serve restaurants, offices, retail, and new commercial construction across Fort Myers — including grease traps, backflow prevention, and tenant build-outs, alongside our residential work.",
      },
      {
        question: "Can you repipe older Fort Myers homes?",
        answer:
          "Yes. Many older and historic Fort Myers homes still run on galvanized or polybutylene pipe. We repipe in PEX or copper to restore pressure and stop chronic leaks, with free estimates.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in Fort Myers?",
        answer:
          "Yes — around the clock across Fort Myers, including downtown, McGregor, Whiskey Creek, and the surrounding neighborhoods. Call any time for burst pipes, leaks, or backups.",
      },
      {
        question: "Are you a new construction plumber in Fort Myers?",
        answer:
          "Yes. C&S is one of Southwest Florida's most experienced new-construction plumbers, with 8,500+ homes completed since 1997 for residential and commercial builders across Lee County.",
      },
      {
        question: "Are you licensed and insured in Fort Myers?",
        answer:
          "Yes — Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, pulling every required Lee County permit.",
      },
    ],
    localContext:
      "Fort Myers is the commercial hub of Lee County, and C&S Plumbing serves both its residential neighborhoods and thriving business community. Whether you're a homeowner in McGregor needing a water heater replacement or a restaurant on Cleveland Avenue needing grease trap service, we have the team and equipment to handle it. Our proximity to Fort Myers means fast response times for emergencies.",
  },
  {
    slug: "north-fort-myers",
    city: "North Fort Myers",
    state: "FL",
    metaTitle: "Plumber in North Fort Myers, FL — Our Hometown",
    metaDescription:
      "North Fort Myers' hometown plumber since 1997. C&S Plumbing is headquartered right here on Pondella Rd. Emergency service, repiping, drains & more. Call 833-PLUMB-IT.",
    keywords: [
      "plumber North Fort Myers",
      "plumber North Fort Myers FL",
      "North Fort Myers plumbing",
      "emergency plumber North Fort Myers",
      "repiping North Fort Myers",
      "drain cleaning North Fort Myers",
      "water heater North Fort Myers",
      "plumber near me North Fort Myers",
    ],
    heroText: "North Fort Myers' Hometown Plumber Since 1997",
    description:
      "C&S Plumbing is headquartered right here in North Fort Myers at 951 Pondella Rd. As your neighbors, we take extra pride in serving our hometown community with fast, reliable plumbing services.",
    neighborhoods: [
      "North Fort Myers",
      "Bayshore",
      "Pine Island Rd",
      "Pondella",
      "Del Prado",
      "Hancock Bridge",
      "Tropicana",
      "Lochmoor",
    ],
    faqs: [
      {
        question: "Where is C&S Plumbing located?",
        answer:
          "We're based right here in North Fort Myers, at 951 Pondella Rd — it's our hometown. Being local means fast response times across North Fort Myers and the surrounding area.",
      },
      {
        question: "Do you service well and septic homes in North Fort Myers?",
        answer:
          "Yes. Many North Fort Myers properties are on well water and septic. We handle well-water plumbing and filtration, septic-to-sewer connections, and the related permitting.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in North Fort Myers?",
        answer:
          "Yes — and because we're local, we get to North Fort Myers emergencies fast, day or night, for burst pipes, slab leaks, and sewage backups.",
      },
      {
        question: "Can you repipe homes in North Fort Myers?",
        answer:
          "Yes. Older North Fort Myers and manufactured homes often need repiping; we replace failing galvanized or polybutylene with PEX or copper, usually in 1–2 days.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes — Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, and family-owned since 1997.",
      },
    ],
    localContext:
      "North Fort Myers is our home. C&S Plumbing's office is located at 951 Pondella Rd, and many of our team members live right here in the community. That means the fastest response times in the area — often under 30 minutes for emergencies. We've plumbed hundreds of homes in North Fort Myers and understand the specific needs of properties in this area, from older homes near the river to newer construction east of I-75.",
  },
  {
    slug: "naples",
    city: "Naples",
    state: "FL",
    metaTitle: "Plumber in Naples, FL",
    metaDescription:
      "Professional plumber in Naples, FL. Luxury home plumbing, repiping, water heaters, emergency service. Family-owned, 8,500+ homes completed. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Naples",
      "plumber Naples FL",
      "Naples plumbing",
      "emergency plumber Naples",
      "repiping Naples",
      "drain cleaning Naples",
      "water heater Naples",
      "plumber near me Naples",
      "luxury home plumber Naples",
    ],
    heroText: "Professional Plumbing Services in Naples, FL",
    description:
      "C&S Plumbing extends our 28+ years of expertise to Naples and Collier County. From luxury home plumbing to emergency repairs, we deliver the same quality and reliability that's made us Southwest Florida's most trusted plumber.",
    neighborhoods: [
      "Old Naples",
      "Park Shore",
      "Pelican Bay",
      "Vanderbilt Beach",
      "North Naples",
      "East Naples",
      "Golden Gate",
      "Lely Resort",
    ],
    faqs: [
      {
        question: "Do you serve Naples and Collier County?",
        answer:
          "Yes. We serve Naples and the surrounding Collier County communities for residential and commercial plumbing, from service calls to full new construction.",
      },
      {
        question: "Do you work on luxury and custom homes in Naples?",
        answer:
          "Yes. We handle high-end and custom Naples homes — premium fixtures, tankless water heaters, whole-home filtration, and the careful finish work those projects demand.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in Naples?",
        answer:
          "Yes, around the clock. Burst pipes, slab leaks, and backups get a fast response anywhere in the Naples area.",
      },
      {
        question: "Do you do new construction plumbing in Naples?",
        answer:
          "Yes. As a builder partner across Southwest Florida, we handle underground, rough-in, and trim for new residential and commercial construction in Naples and Collier County.",
      },
      {
        question: "Do you pull permits in Naples?",
        answer:
          "Yes. We're Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, and we pull every required Collier County permit.",
      },
    ],
    localContext:
      "Naples homeowners expect the highest quality — and C&S Plumbing delivers. We have extensive experience with Naples' luxury homes, including custom plumbing installations, high-end fixture work, and whole-home repiping for older properties in neighborhoods like Old Naples and Park Shore. Our licensed team handles everything from routine maintenance to complex renovations with the attention to detail Naples residents deserve.",
  },
  {
    slug: "bonita-springs",
    city: "Bonita Springs",
    state: "FL",
    metaTitle: "Plumber in Bonita Springs, FL",
    metaDescription:
      "Reliable plumber in Bonita Springs, FL. Repiping, water heaters, drain cleaning, emergency service. 28+ years in SWFL. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Bonita Springs",
      "plumber Bonita Springs FL",
      "Bonita Springs plumbing",
      "emergency plumber Bonita Springs",
      "repiping Bonita Springs",
      "drain cleaning Bonita Springs",
      "water heater Bonita Springs",
      "plumber near me Bonita Springs",
    ],
    heroText: "Reliable Plumbing Services in Bonita Springs, FL",
    description:
      "C&S Plumbing serves Bonita Springs with the same commitment to quality that's earned us 8,500+ completed projects across Southwest Florida. Fast response, fair pricing, and workmanship you can trust.",
    neighborhoods: [
      "Bonita Bay",
      "Pelican Landing",
      "Spanish Wells",
      "Worthington",
      "Coconut Point",
      "Brooks",
      "Highland Woods",
      "Bonita Fairways",
    ],
    faqs: [
      {
        question: "Do you serve Bonita Springs?",
        answer:
          "Yes. C&S Plumbing covers Bonita Springs and the surrounding communities for repairs, remodels, water heaters, repipes, and new construction.",
      },
      {
        question: "Can you check on a seasonal or snowbird home in Bonita Springs?",
        answer:
          "Yes. We help seasonal residents protect their homes — pre-season inspections, leak prevention, and water shutoff while you're away. Ask about our Coastal Comeback Plan for snowbirds.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in Bonita Springs?",
        answer:
          "Yes, around the clock for burst pipes, leaks, and sewage backups across Bonita Springs.",
      },
      {
        question: "Do you install and repair water heaters in Bonita Springs?",
        answer:
          "Yes — tank and tankless installation, repair, and replacement, plus water softeners and whole-home filtration.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes — Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, family-owned since 1997.",
      },
    ],
    localContext:
      "Bonita Springs sits at the crossroads of Lee and Collier County, and C&S Plumbing is ideally located to serve this growing community quickly. Many Bonita Springs homes, especially in established communities like Bonita Bay and Pelican Landing, are reaching the age where repiping and water heater replacement become necessary. We understand the HOA requirements and community standards that come with working in these neighborhoods.",
  },
  {
    slug: "lehigh-acres",
    city: "Lehigh Acres",
    state: "FL",
    metaTitle: "Plumber in Lehigh Acres, FL",
    metaDescription:
      "Trusted plumber in Lehigh Acres, FL. Emergency plumbing, repiping, drain cleaning, water heaters & more. Family-owned since 1997. 8,500+ homes. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Lehigh Acres",
      "plumber Lehigh Acres FL",
      "Lehigh Acres plumbing",
      "emergency plumber Lehigh Acres",
      "repiping Lehigh Acres",
      "drain cleaning Lehigh Acres",
      "water heater Lehigh Acres",
      "plumber near me Lehigh Acres",
      "best plumber Lehigh Acres",
    ],
    heroText: "Your Trusted Plumber in Lehigh Acres, FL",
    description:
      "C&S Plumbing provides fast, reliable plumbing services to Lehigh Acres homeowners and businesses. From emergency repairs to whole-home repiping, we bring 28+ years of experience and 8,500+ completed projects to every job.",
    neighborhoods: [
      "Lehigh Acres",
      "Mirror Lakes",
      "Harlem Heights",
      "Homestead",
      "Buckingham",
      "East Lehigh",
      "Lee Blvd",
      "Joel Blvd",
    ],
    faqs: [
      {
        question: "Do you handle well water and water treatment in Lehigh Acres?",
        answer:
          "Yes. Many Lehigh Acres homes are on well water that's hard or carries a sulfur smell. We install and service water softeners, filtration, and treatment systems sized to your water.",
      },
      {
        question: "Do you do new construction plumbing in Lehigh Acres?",
        answer:
          "Yes — Lehigh Acres is one of our most active new-construction areas. We partner with builders on underground, rough-in, and trim for new homes throughout the community.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in Lehigh Acres?",
        answer:
          "Yes, around the clock for burst pipes, slab leaks, and sewage backups across Lehigh Acres.",
      },
      {
        question: "Can you connect my Lehigh Acres home from septic to sewer, or repipe it?",
        answer:
          "Yes. We handle septic-to-sewer connections where service is available, and we repipe older homes in PEX or copper with free upfront estimates.",
      },
      {
        question: "Are you licensed and insured in Lehigh Acres?",
        answer:
          "Yes — Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, pulling every required Lee County permit.",
      },
    ],
    localContext:
      "Lehigh Acres is one of the fastest-growing communities in Lee County, with a mix of established homes and new construction that keeps our team busy. Many homes built in the 1980s and 1990s in Lehigh Acres still have original polybutylene pipes that are overdue for replacement. We also see a lot of well water systems in the eastern parts of Lehigh Acres, which require water treatment expertise alongside standard plumbing services. C&S Plumbing's North Fort Myers headquarters is just a short drive from Lehigh Acres, ensuring fast response times for emergencies.",
  },
  {
    slug: "estero",
    city: "Estero",
    state: "FL",
    metaTitle: "Plumber in Estero, FL",
    metaDescription:
      "Professional plumber in Estero, FL. Repiping, water heaters, drain cleaning, emergency plumbing. Family-owned, 28+ years in SWFL. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Estero",
      "plumber Estero FL",
      "Estero plumbing",
      "emergency plumber Estero",
      "repiping Estero",
      "drain cleaning Estero",
      "water heater Estero",
      "plumber near me Estero",
      "best plumber Estero",
    ],
    heroText: "Professional Plumbing Services in Estero, FL",
    description:
      "C&S Plumbing serves Estero with the same quality and reliability that has earned us 8,500+ completed projects across Southwest Florida. Fast response, fair pricing, and expert workmanship for every home and business.",
    neighborhoods: [
      "Estero",
      "Coconut Point",
      "Miromar Lakes",
      "The Brooks",
      "Grandezza",
      "Bella Terra",
      "Corkscrew Shores",
      "Rapallo",
    ],
    faqs: [
      {
        question: "Do you serve Estero and the surrounding communities?",
        answer:
          "Yes. C&S Plumbing covers Estero and the nearby Coconut Point and Miromar areas for service, remodels, water heaters, repipes, and new construction.",
      },
      {
        question: "Do you work on newer Estero homes and gated communities?",
        answer:
          "Yes. We service Estero's newer homes and communities — from fixture and water-heater work to remodels and warranty-friendly repairs.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing in Estero?",
        answer:
          "Yes, around the clock for burst pipes, leaks, and sewage backups throughout Estero.",
      },
      {
        question: "Do you install tankless water heaters in Estero?",
        answer:
          "Yes — tank and tankless water heater installation and repair, plus water softeners and whole-home filtration.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes — Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, family-owned since 1997.",
      },
    ],
    localContext:
      "Estero has transformed from a quiet community into one of Southwest Florida's most desirable addresses, with master-planned communities like Miromar Lakes, The Brooks, and Grandezza attracting homeowners who expect top-quality service. C&S Plumbing understands the HOA standards and architectural guidelines that come with working in these upscale neighborhoods. Whether you need a water heater replacement in a single-family home or repiping for a villa, we deliver the professionalism and attention to detail that Estero homeowners demand.",
  },
  {
    slug: "sanibel",
    city: "Sanibel Island",
    state: "FL",
    metaTitle: "Plumber on Sanibel Island, FL",
    metaDescription:
      "Experienced plumber on Sanibel Island, FL. Emergency plumbing, repiping, water heaters, hurricane recovery. Family-owned, 28+ years in SWFL. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Sanibel Island",
      "plumber Sanibel FL",
      "Sanibel Island plumbing",
      "emergency plumber Sanibel",
      "repiping Sanibel Island",
      "plumber near me Sanibel",
      "Sanibel hurricane plumbing repair",
      "Sanibel water heater",
    ],
    heroText: "Experienced Plumbing Services on Sanibel Island, FL",
    description:
      "C&S Plumbing serves Sanibel Island with the expertise required for island living. From salt-air corrosion challenges to hurricane recovery plumbing, we bring 28+ years of Southwest Florida experience to every job on the island.",
    neighborhoods: [
      "Sanibel",
      "East End",
      "West End",
      "Captiva",
      "Blind Pass",
      "Sanibel Bayous",
      "The Dunes",
      "Gulf Pines",
    ],
    faqs: [
      {
        question: "Do you work on Sanibel Island?",
        answer:
          "Yes. We provide residential plumbing across Sanibel — repairs, repipes, water heaters, fixture upgrades, and storm-recovery work.",
      },
      {
        question: "Do you handle hurricane and flood plumbing repairs on Sanibel?",
        answer:
          "Yes. After storms like Hurricane Ian, we handle repipes, fixture and water-heater replacement, and full plumbing rebuilds for flood-damaged and elevated Sanibel homes. Ask about our Coastal Comeback Plan.",
      },
      {
        question: "How do you handle salt-air corrosion on Sanibel plumbing?",
        answer:
          "Sanibel's coastal exposure corrodes outdoor plumbing and fixtures over time. We use corrosion-resistant materials and can upgrade the components most vulnerable to salt air.",
      },
      {
        question: "Do you offer emergency plumbing on Sanibel?",
        answer:
          "Yes — around the clock for burst pipes, leaks, and backups. Island access can affect timing, but we respond as fast as conditions allow.",
      },
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes — Florida Certified Plumbing Contractors (CFC1432485 / CFC057076), fully insured, family-owned since 1997.",
      },
    ],
    localContext:
      "Sanibel Island's unique barrier island environment presents specific plumbing challenges that mainland homes don't face. Salt air accelerates pipe corrosion, hurricane damage can compromise entire plumbing systems, and the island's building codes require contractors who understand the local requirements. C&S Plumbing has been helping Sanibel and Captiva Island homeowners rebuild and maintain their plumbing systems for years, including extensive work following recent hurricane seasons. Our team is experienced with the logistics of island work, including coordinating with the causeway schedule and island-specific permitting requirements.",
  },
  {
    slug: "punta-gorda",
    city: "Punta Gorda",
    state: "FL",
    metaTitle: "Plumber in Punta Gorda, FL",
    metaDescription:
      "Trusted plumber in Punta Gorda, FL. Water heaters, emergency plumbing, repiping & drain service across Charlotte County. Family-owned since 1997. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Punta Gorda",
      "plumber Punta Gorda FL",
      "Punta Gorda plumbing",
      "emergency plumber Punta Gorda",
      "water heater Punta Gorda",
      "water heater replacement Punta Gorda",
      "repiping Punta Gorda",
      "drain cleaning Punta Gorda",
      "plumber near me Punta Gorda",
      "Charlotte County plumber",
    ],
    heroText: "Your Trusted Plumber in Punta Gorda, FL",
    description:
      "C&S Plumbing brings 28+ years of Southwest Florida experience to Punta Gorda and Charlotte County. Water heater replacements, emergency repairs, repiping, and drain service — backed by 8,500+ completed homes and two active state licenses.",
    neighborhoods: [
      "Punta Gorda Isles",
      "Burnt Store Isles",
      "Historic District",
      "Burnt Store Meadows",
      "Seminole Lakes",
      "Charlotte Park",
      "Solana",
      "Charlotte Harbor",
    ],
    localContext:
      "Punta Gorda's housing stock is a mix that keeps plumbers honest: canal-front homes in Punta Gorda Isles with aging water heaters and salt-air exposure, rebuilt homes from the Hurricane Charley and Ian recovery years, and older properties in and around the Historic District where original supply lines and fixtures are reaching end of life. Water heaters are a recurring theme in Punta Gorda — many units installed during the post-Charley rebuild wave are now past their service life. C&S Plumbing is licensed to pull permits in Charlotte County, and our North Fort Myers shop is a straight run up US-41 or I-75, so Punta Gorda jobs get the same response we give Lee County.",
    faqs: [
      {
        question: "Do you really service Punta Gorda from North Fort Myers?",
        answer:
          "Yes. Our shop at 951 Pondella Rd in North Fort Myers is about 25–35 minutes from most of Punta Gorda via US-41 or I-75. We schedule Charlotte County work daily, and emergency calls are dispatched 24/7 — same as Lee County.",
      },
      {
        question: "Can you replace a water heater in Punta Gorda the same day?",
        answer:
          "In most cases, yes. We stock common 40- and 50-gallon tank water heaters, and if you call in the morning we can usually have a new unit installed and permitted the same day. Tankless conversions typically take 1–2 days including the upgraded gas or electric supply.",
      },
      {
        question: "Do you work on canal-front homes in Punta Gorda Isles?",
        answer:
          "All the time. PGI homes come with their own plumbing quirks — exterior fixtures and water heaters exposed to salt air, dock and outdoor shower lines, and slab-on-grade construction where leaks hide. We've worked waterfront homes across Southwest Florida since 1997.",
      },
      {
        question: "Do you pull permits with Charlotte County?",
        answer:
          "Yes. C&S Plumbing holds two active Florida CFC licenses (CFC1432485 and CFC057076) and we pull permits and coordinate inspections with Charlotte County for water heaters, repipes, and remodel work. You never have to handle the paperwork yourself.",
      },
      {
        question: "Is your emergency service available in Punta Gorda?",
        answer:
          "Yes — 24/7 emergency plumbing covers Punta Gorda and all of Charlotte County. Call 833-PLUMB-IT any hour. Office hours are Mon–Fri 7:30 AM–4:30 PM and Sat 9 AM–3 PM, but the emergency line never closes.",
      },
    ],
  },
  {
    slug: "port-charlotte",
    city: "Port Charlotte",
    state: "FL",
    metaTitle: "Plumber in Port Charlotte, FL",
    metaDescription:
      "Reliable plumber in Port Charlotte, FL. Drain cleaning, water treatment, water heaters & emergency plumbing. Family-owned since 1997. Call 833-PLUMB-IT.",
    keywords: [
      "plumber Port Charlotte",
      "plumber Port Charlotte FL",
      "Port Charlotte plumbing",
      "emergency plumber Port Charlotte",
      "drain cleaning Port Charlotte",
      "water treatment Port Charlotte",
      "water heater Port Charlotte",
      "well water plumber Port Charlotte",
      "plumber near me Port Charlotte",
      "Charlotte County plumber",
    ],
    heroText: "Reliable Plumbing Services in Port Charlotte, FL",
    description:
      "C&S Plumbing serves Port Charlotte homeowners with drain cleaning, water treatment, water heaters, and 24/7 emergency repairs. Family-owned since 1997, with 8,500+ completed homes across Southwest Florida.",
    neighborhoods: [
      "Murdock",
      "Parkside",
      "Deep Creek",
      "Harbour Heights",
      "Gulf Cove",
      "El Jobean",
      "Charlotte Harbor",
      "Midway",
    ],
    localContext:
      "Port Charlotte was largely built out in the 1970s and 1980s, and the plumbing shows it: cast iron drain lines that have spent forty-plus years in Florida soil are behind a steady share of the calls we get from Port Charlotte. Slow drains, recurring backups, and that sewer smell in the yard usually trace back to original drain pipe that's due for cleaning, lining, or replacement. The other big one is water quality — homes in Gulf Cove, El Jobean, and the outlying sections often run on well water with the sulfur and hardness problems that come with it, and even Charlotte County Utilities customers deal with hard water that scales up fixtures and water heaters. C&S Plumbing handles drain cleaning with camera inspection, whole-home water treatment, and everything in between, with Charlotte County permits pulled and inspections handled by us.",
    faqs: [
      {
        question: "Why do drains keep backing up in older Port Charlotte homes?",
        answer:
          "Most Port Charlotte homes built in the 1970s and 1980s still have original cast iron drain lines. After four decades in Florida's soil and humidity, the pipe walls rust rough and narrow, catching grease and paper until backups become routine. We camera-inspect the line first, so you know whether a cleaning, a spot repair, or a replacement actually solves it.",
      },
      {
        question: "Do you treat well water in Port Charlotte?",
        answer:
          "Yes. Homes in Gulf Cove, El Jobean, and other outlying areas often run on private wells with sulfur odor, iron staining, and hardness. We install and service whole-home treatment systems — softeners, carbon filtration, and aeration — sized to your well and water test results.",
      },
      {
        question: "How fast can you get to Port Charlotte for an emergency?",
        answer:
          "Our North Fort Myers shop is roughly 30–40 minutes from most of Port Charlotte via US-41 or I-75. The emergency line at 833-PLUMB-IT is answered 24/7, and a licensed plumber is dispatched — not an answering service promise.",
      },
      {
        question: "Do you pull permits with Charlotte County?",
        answer:
          "Yes. We hold two active Florida CFC licenses (CFC1432485 and CFC057076) and handle Charlotte County permitting and inspections for water heaters, repipes, drain line replacements, and remodel plumbing.",
      },
      {
        question: "Can you replace a water heater in Port Charlotte?",
        answer:
          "Yes — tank, tankless, and hybrid water heaters, usually with same-day availability on common tank sizes. Hard water in Charlotte County shortens water heater life, so we'll also tell you honestly whether a softener will pay for itself on the next unit.",
      },
    ],
  },
];

// ============================================
// BLOG POSTS
// ============================================

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "signs-you-need-a-repipe",
    title: "5 Signs You Need a Whole-Home Repipe",
    metaTitle: "5 Signs You Need a Whole-Home Repipe",
    metaDescription:
      "How do you know if your home needs repiping? Learn the 5 warning signs from Southwest Florida's repiping experts. C&S Plumbing has repiped 8,500+ homes.",
    keywords: ["signs you need repiping", "when to repipe house", "repiping Cape Coral", "old pipes replacement", "polybutylene pipe replacement"],
    excerpt:
      "Aging pipes don't always announce themselves with a dramatic burst. Often, the signs are subtle — until they're not. Here are 5 warning signs that your home may need a whole-home repipe.",
    category: "Repiping",
    publishDate: "2025-01-15",
    readTime: "5 min read",
    content: `<h2>1. Discolored or Rusty Water</h2>
<p>If your water runs brown, yellow, or has a reddish tint — especially when you first turn on the tap — it's a sign that your pipes are corroding from the inside. This is particularly common in homes with original galvanized steel pipes, which were standard in Southwest Florida homes built before the 1980s.</p>
<p>While occasional discoloration after water main work is normal, consistent rusty water means your pipes are deteriorating and need attention.</p>

<h2>2. Low Water Pressure Throughout the House</h2>
<p>A sudden drop in water pressure at one fixture usually points to a localized problem. But when water pressure is low at every faucet, shower, and spigot in your home, it often means mineral deposits and corrosion have narrowed the inside diameter of your pipes significantly.</p>
<p>This is especially common in <a href="/areas/cape-coral">Cape Coral</a> and <a href="/areas/fort-myers">Fort Myers</a> homes with hard water — the mineral buildup accelerates pipe deterioration over time.</p>

<h2>3. Frequent Leaks and Pinhole Leaks</h2>
<p>One leak can be a fluke. Two is a coincidence. Three or more leaks in a short period means your entire pipe system is failing. Pinhole leaks in copper pipes are especially common in Southwest Florida due to our water chemistry.</p>
<p>If you're calling a plumber for leak repairs multiple times a year, a whole-home repipe will actually save you money compared to endless spot repairs.</p>

<h2>4. Your Home Has Polybutylene Pipes</h2>
<p>Polybutylene (poly-B) pipes were widely used in Florida construction from the 1970s through the mid-1990s. These gray plastic pipes are known to deteriorate and fail, especially when exposed to chlorinated water. If your home was built during this era and still has the original plumbing, repiping should be a priority — not a question of "if" but "when."</p>
<p>Many insurance companies are now requiring homes with polybutylene pipes to repipe before they'll issue or renew a homeowner's policy.</p>

<h2>5. Your Home Is Over 25 Years Old with Original Plumbing</h2>
<p>Even well-maintained plumbing systems have a lifespan. Copper pipes typically last 50-70 years, but galvanized steel and polybutylene have much shorter lifespans. If your home was built before 2000 and hasn't been repiped, it's worth having a professional inspection.</p>
<p>At C&S Plumbing, we offer free repipe consultations where we inspect your current pipes and provide an honest assessment of their condition. We've completed repiping on over 8,500 homes across Southwest Florida, including <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, and <a href="/areas/bonita-springs">Bonita Springs</a> — we know exactly what to look for.</p>

<h2>What to Do Next</h2>
<p>If you're experiencing any of these signs, don't wait for a catastrophic pipe failure. <a href="/services/repiping">Contact C&S Plumbing for a free repipe evaluation</a>. We offer both copper and PEX repiping options, complete most homes in 1-2 days, and handle all permits and inspections.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book online</a> to schedule your free consultation.</p>`,
  },
  {
    slug: "tankless-vs-traditional-water-heaters",
    title: "Tankless vs Traditional Water Heaters: Which Is Right for Your Home?",
    metaTitle: "Tankless vs Traditional Water Heaters — Which Is Right for You?",
    metaDescription:
      "Tankless or traditional water heater? Compare costs, efficiency, lifespan & performance for Southwest Florida homes. Expert advice from C&S Plumbing.",
    keywords: ["tankless vs traditional water heater", "tankless water heater Florida", "water heater comparison", "best water heater Cape Coral", "water heater cost Fort Myers"],
    excerpt:
      "Choosing between a tankless and traditional water heater is one of the most common questions we get. Here's an honest comparison to help you make the right choice for your Southwest Florida home.",
    category: "Water Heaters",
    publishDate: "2025-02-01",
    readTime: "6 min read",
    content: `<h2>Traditional Tank Water Heaters</h2>
<p>Traditional water heaters store 40-80 gallons of hot water in an insulated tank, keeping it heated and ready for use. They've been the standard in American homes for decades and remain the most affordable option upfront.</p>

<h3>Pros</h3>
<ul>
<li><strong>Lower upfront cost:</strong> $1,200-$2,000 installed in Southwest Florida</li>
<li><strong>Simple installation:</strong> Straightforward replacement of existing units</li>
<li><strong>Reliable technology:</strong> Proven and well-understood by all plumbers</li>
<li><strong>Works during power outages:</strong> Gas models continue heating without electricity</li>
</ul>

<h3>Cons</h3>
<ul>
<li><strong>Higher energy bills:</strong> Constantly heats water even when you're not using it</li>
<li><strong>Limited hot water:</strong> Once the tank is empty, you wait 30-60 minutes to reheat</li>
<li><strong>Shorter lifespan:</strong> 8-12 years in Florida's hard water conditions</li>
<li><strong>Larger footprint:</strong> Takes up significant space in your garage or utility closet</li>
</ul>

<h2>Tankless Water Heaters</h2>
<p>Tankless (on-demand) water heaters heat water only when you need it, using high-powered burners to bring water to temperature as it flows through the unit.</p>

<h3>Pros</h3>
<ul>
<li><strong>Endless hot water:</strong> Never run out — water is heated on demand</li>
<li><strong>Lower energy bills:</strong> 24-34% more efficient for typical households</li>
<li><strong>Longer lifespan:</strong> 20+ years with proper maintenance</li>
<li><strong>Compact size:</strong> Mounts on a wall, freeing up floor space</li>
<li><strong>Better in Florida:</strong> Warm incoming water means peak performance</li>
</ul>

<h3>Cons</h3>
<ul>
<li><strong>Higher upfront cost:</strong> $2,500-$3,500+ installed</li>
<li><strong>May need gas line upgrades:</strong> Some homes need larger gas lines</li>
<li><strong>Flow rate limits:</strong> Very high simultaneous usage can overwhelm smaller units</li>
</ul>

<h2>Our Recommendation for Southwest Florida</h2>
<p>For most <a href="/areas/cape-coral">Cape Coral</a> and <a href="/areas/fort-myers">Fort Myers</a> homes, we recommend tankless water heaters. Florida's warm incoming water temperature (around 75°F) means tankless units perform exceptionally well here — better than in colder climates. The energy savings add up quickly, and the 20+ year lifespan means you'll replace a tank heater twice before a tankless unit needs replacement.</p>
<p>That said, traditional tanks are still a great choice for budget-conscious homeowners or homes with lower hot water demand.</p>

<h2>Not Sure? We'll Help You Decide</h2>
<p>Every home is different. <a href="/services/water-heaters">C&S Plumbing's water heater specialists</a> will evaluate your home's hot water needs, current setup, and budget to recommend the best option. We install all major brands including Rinnai, Navien, Rheem, and A.O. Smith.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book a consultation</a> today.</p>`,
  },
  {
    slug: "plumbing-emergency-what-to-do",
    title: "What to Do in a Plumbing Emergency (Before the Plumber Arrives)",
    metaTitle: "What to Do in a Plumbing Emergency Before the Plumber Arrives",
    metaDescription:
      "Plumbing emergency? Learn what to do immediately to minimize damage before your plumber arrives. 24/7 emergency tips from C&S Plumbing in SWFL.",
    keywords: ["plumbing emergency what to do", "burst pipe what to do", "plumbing emergency tips", "emergency plumber Cape Coral", "water leak emergency"],
    excerpt:
      "A plumbing emergency can cause thousands of dollars in damage within hours. Knowing what to do in the first few minutes can save your home — and your wallet. Here's your action plan.",
    category: "Emergency",
    publishDate: "2025-02-10",
    readTime: "4 min read",
    content: `<h2>Step 1: Shut Off the Water</h2>
<p>This is the single most important thing you can do. Every second water flows from a burst pipe or major leak, it's causing more damage.</p>
<ul>
<li><strong>Know your main shutoff location:</strong> In most Southwest Florida homes, the main water shutoff is near the front of the house, often near the water meter by the street or on an exterior wall</li>
<li><strong>Turn it clockwise</strong> (righty-tighty) to shut off water to the entire house</li>
<li><strong>For localized issues:</strong> Use individual shutoff valves under sinks, behind toilets, or near water heaters to isolate the problem without cutting water to the whole house</li>
</ul>

<h2>Step 2: Turn Off Your Water Heater</h2>
<p>If you've shut off the main water supply, turn off your water heater to prevent damage. Running a water heater without water flow can cause overheating.</p>
<ul>
<li><strong>Gas water heaters:</strong> Turn the thermostat to "Pilot" or "Off"</li>
<li><strong>Electric water heaters:</strong> Switch off the breaker at your electrical panel</li>
</ul>

<h2>Step 3: Open Faucets to Drain Remaining Water</h2>
<p>After shutting off the main water, open a few faucets (both hot and cold) to drain any remaining water from the pipes. This reduces pressure and minimizes additional leaking.</p>

<h2>Step 4: Contain the Water</h2>
<p>Use towels, buckets, and mops to contain standing water. The faster you remove water from floors, the less chance of structural damage, mold growth, and ruined belongings.</p>
<ul>
<li>Move furniture, electronics, and valuables away from the water</li>
<li>Place buckets under active drips</li>
<li>Use towels or old blankets to create barriers directing water toward drains</li>
</ul>

<h2>Step 5: Document Everything</h2>
<p>Before you start major cleanup, take photos and video of the damage. Your homeowner's insurance will need documentation to process a claim. Photograph the source of the leak, any water damage to floors, walls, and belongings.</p>

<h2>Step 6: Call C&S Plumbing</h2>
<p>Once you've contained the immediate emergency, call <a href="tel:8337586248">833-PLUMB-IT</a> for 24/7 emergency plumbing service. We serve <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/north-fort-myers">North Fort Myers</a>, and all of Southwest Florida with rapid emergency response.</p>
<p>Our emergency team will:</p>
<ul>
<li>Arrive as quickly as possible (typically within 1-2 hours in our service area)</li>
<li>Identify and fix the source of the problem</li>
<li>Help you understand next steps for any water damage restoration</li>
<li>Provide upfront pricing before any work begins</li>
</ul>

<h2>Prevent Future Emergencies</h2>
<p>The best plumbing emergency is one that never happens. Regular maintenance, <a href="/services/repiping">timely repiping of aging systems</a>, and annual plumbing inspections can prevent most emergencies before they start.</p>
<p><a href="/booking">Schedule a plumbing inspection</a> to identify potential problems before they become emergencies.</p>`,
  },
  {
    slug: "how-to-choose-a-plumber-cape-coral",
    title: "How to Choose a Plumber in Cape Coral & Fort Myers",
    metaTitle: "How to Choose a Plumber in Cape Coral & Fort Myers",
    metaDescription:
      "Choosing a plumber in Cape Coral or Fort Myers? Learn what to look for: licensing, reviews, pricing, and experience. Tips from C&S Plumbing.",
    keywords: ["how to choose a plumber", "best plumber Cape Coral", "plumber reviews Fort Myers", "licensed plumber Cape Coral", "plumber tips SWFL"],
    excerpt:
      "Not all plumbers are created equal. Whether you need an emergency repair or a major project, here's what to look for when choosing a plumber in Cape Coral and Fort Myers.",
    category: "Tips",
    publishDate: "2025-03-01",
    readTime: "5 min read",
    content: `<h2>1. Verify Their License</h2>
<p>Florida law requires plumbers to be licensed. A legitimate plumber will have a Certified Plumbing Contractor (CPC) or Registered Plumbing Contractor (RPC) license. You can verify any plumber's license at the <a href="https://www.myfloridalicense.com" target="_blank" rel="noopener noreferrer">Florida DBPR website</a>.</p>
<p>At C&S Plumbing, our license number is CFC1432485 — we're happy to have you verify it.</p>

<h2>2. Check Google Reviews</h2>
<p>Online reviews are the most reliable way to gauge a plumber's quality. Look for:</p>
<ul>
<li><strong>Volume:</strong> A company with 50+ reviews has a proven track record</li>
<li><strong>Consistency:</strong> Look for consistently high ratings, not just a few 5-star reviews</li>
<li><strong>Recency:</strong> Recent reviews tell you about current service quality</li>
<li><strong>Responses:</strong> Companies that respond to reviews care about customer satisfaction</li>
</ul>

<h2>3. Ask About Pricing Upfront</h2>
<p>A reputable plumber provides clear pricing before starting work. Be wary of plumbers who:</p>
<ul>
<li>Won't give estimates over the phone for common services</li>
<li>Charge a "diagnostic fee" that doesn't apply to the repair</li>
<li>Present significantly higher prices once they've started the job</li>
<li>Pressure you into immediate decisions on expensive repairs</li>
</ul>
<p>At C&S Plumbing, we provide upfront pricing on every job. You know the cost before we start — no surprises.</p>

<h2>4. Look for Experience and Specialization</h2>
<p>Plumbing covers a wide range of services. For major projects like <a href="/services/repiping">whole-home repiping</a> or <a href="/services/new-construction">new construction plumbing</a>, experience matters enormously. Ask:</p>
<ul>
<li>How long have you been in business?</li>
<li>How many jobs like mine have you completed?</li>
<li>Do you pull permits and schedule inspections?</li>
<li>What warranty do you offer on your work?</li>
</ul>

<h2>5. Confirm Insurance Coverage</h2>
<p>Any plumber working in your home should carry general liability insurance and workers' compensation. This protects you if something goes wrong during the job. Don't hesitate to ask for proof of insurance.</p>

<h2>6. Consider Local and Family-Owned</h2>
<p>Local plumbing companies have a reputation to maintain in the community. They're more likely to stand behind their work because their business depends on word-of-mouth referrals from neighbors, not anonymous online leads.</p>
<p>C&S Plumbing has been family-owned and operated in Southwest Florida since 1997. We live here, we work here, and our reputation is everything to us.</p>

<h2>Ready to Experience the C&S Difference?</h2>
<p>We've built our reputation on honest work, fair pricing, and treating every home like our own. With 8,500+ completed projects and a 5.0-star Google rating, we let our track record speak for itself.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book online</a> to experience the difference a trusted, local plumber makes.</p>`,
  },
  {
    slug: "hurricane-plumbing-preparation-swfl",
    title: "How to Prepare Your Plumbing for Hurricane Season in Southwest Florida",
    metaTitle: "How to Prepare Your Plumbing for Hurricane Season in SWFL",
    metaDescription:
      "Protect your home's plumbing during hurricane season. Learn essential steps to prevent water damage, pipe breaks, and flooding. Tips from C&S Plumbing in SWFL.",
    keywords: ["hurricane plumbing preparation", "hurricane plumbing tips Florida", "protect plumbing hurricane", "storm plumbing damage", "hurricane season Cape Coral", "plumbing hurricane checklist"],
    excerpt:
      "Hurricane season in Southwest Florida runs from June through November. Taking a few proactive steps to protect your plumbing system can save you thousands in repairs and help your home recover faster after a storm.",
    category: "Tips",
    publishDate: "2026-03-10",
    readTime: "5 min read",
    content: `<h2>Know Your Shutoff Valves</h2>
<p>The single most important thing you can do before a hurricane is know where your main water shutoff valve is located. In most <a href="/areas/cape-coral">Cape Coral</a> and <a href="/areas/fort-myers">Fort Myers</a> homes, it's near the front of the house by the water meter. Practice turning it off so you can act quickly when a storm approaches.</p>
<p>You should also know the individual shutoff valves for toilets, sinks, and your water heater. Shutting these off before evacuation prevents flooding if a supply line breaks during the storm.</p>

<h2>Turn Off Your Water Heater</h2>
<p>Before evacuating or when a hurricane warning is issued, turn off your <a href="/services/water-heaters">water heater</a>. For gas units, switch to "Pilot" or "Off." For electric units, flip the breaker. Running a water heater without a consistent water supply can cause overheating and damage the unit.</p>
<p>If your water heater is in a flood-prone area (like a garage at ground level), consider having it elevated or relocated before hurricane season.</p>

<h2>Clear Your Drains and Gutters</h2>
<p>Heavy rainfall during hurricanes can overwhelm drainage systems. Make sure all exterior drains, gutters, and downspouts are clear of debris before the storm. Inside, ensure <a href="/services/drain-cleaning">all drains are flowing freely</a> — a clogged drain during a hurricane can lead to interior flooding.</p>
<p>Consider having a professional drain cleaning done before June to ensure your entire system is clear.</p>

<h2>Protect Exposed Pipes</h2>
<p>Exposed pipes — especially on the exterior of your home or in crawl spaces — are vulnerable to flying debris during a hurricane. Insulate or cover exposed pipes where possible. If you have older galvanized or polybutylene pipes, they're more likely to crack or burst under storm stress. A <a href="/services/repiping">whole-home repipe</a> before hurricane season eliminates this risk entirely.</p>

<h2>Install Backflow Prevention</h2>
<p>Storm surges and heavy flooding can cause sewage to back up into your home through floor drains and toilets. A backflow prevention valve stops this reverse flow. If your home doesn't have one, now is the time to get one installed.</p>

<h2>Document Your Plumbing System</h2>
<p>Before hurricane season, take photos of your plumbing system — water heater, exposed pipes, shutoff valves, and any recent work. This documentation helps with insurance claims if your plumbing is damaged during the storm.</p>

<h2>After the Storm</h2>
<p>Once it's safe to return home, inspect your plumbing carefully before turning the water back on:</p>
<ul>
<li>Check for visible pipe damage, cracks, or displaced connections</li>
<li>Look for signs of sewage backup (odor, standing water near drains)</li>
<li>Turn the water on slowly and check for <a href="/services/leak-repair">leaks</a> at every fixture</li>
<li>Have your water tested if your area experienced flooding</li>
</ul>
<p>If you discover damage, call <a href="tel:8337586248">833-PLUMB-IT</a> for emergency plumbing service. We prioritize <a href="/areas/sanibel">Sanibel</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/cape-coral">Cape Coral</a>, and all SWFL communities after storms. <a href="/booking">Book an inspection</a> today to get ahead of hurricane season.</p>`,
  },
  {
    slug: "water-softener-vs-water-filter-lee-county",
    title: "Water Softener vs Water Filter: Which Does Your Lee County Home Need?",
    metaTitle: "Water Softener vs Water Filter — Which Does Your Home Need?",
    metaDescription:
      "Water softener or water filter? Learn the difference and which system your Lee County home needs. Expert advice from C&S Plumbing. Call 833-PLUMB-IT.",
    keywords: ["water softener vs water filter", "water softener Lee County", "water filter Cape Coral", "hard water Florida", "water treatment Fort Myers", "water quality SWFL"],
    excerpt:
      "Southwest Florida has some of the hardest water in the country. But do you need a water softener, a water filter, or both? Here's how to decide which system is right for your home.",
    category: "Water Quality",
    publishDate: "2026-03-17",
    readTime: "5 min read",
    content: `<h2>The Hard Water Problem in Southwest Florida</h2>
<p>If you live in <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/lehigh-acres">Lehigh Acres</a>, or anywhere in Lee County, your water is hard. Hard water contains high levels of dissolved calcium and magnesium, which cause white buildup on faucets, dry skin and hair, soap that doesn't lather well, and shortened appliance lifespans.</p>
<p>The question isn't whether you need water treatment — it's which type.</p>

<h2>What a Water Softener Does</h2>
<p>A <a href="/services/water-softeners">water softener</a> removes calcium and magnesium through a process called ion exchange. Salt-based softeners swap hardness minerals for sodium ions, producing "soft" water that:</p>
<ul>
<li>Eliminates scale buildup on fixtures, water heaters, and pipes</li>
<li>Makes soap and shampoo lather better</li>
<li>Extends the life of your <a href="/services/water-heaters">water heater</a> and appliances</li>
<li>Prevents mineral deposits inside your plumbing</li>
</ul>
<p><strong>Best for:</strong> Most Lee County homes on city water. Softeners address the primary water quality issue in our area — extreme hardness.</p>

<h2>What a Water Filter Does</h2>
<p>Water filters remove contaminants like chlorine, sediment, bacteria, and chemicals. Different filter types target different problems:</p>
<ul>
<li><strong>Carbon filters:</strong> Remove chlorine, taste, and odor</li>
<li><strong>Sediment filters:</strong> Trap sand, rust, and particles</li>
<li><strong>Reverse osmosis (RO):</strong> Remove nearly all dissolved contaminants</li>
<li><strong>UV filters:</strong> Kill bacteria and viruses</li>
</ul>
<p><strong>Best for:</strong> Homes on well water, homes wanting better-tasting drinking water, or as a complement to a water softener.</p>

<h2>Do You Need Both?</h2>
<p>For most Southwest Florida homes, we recommend a water softener as the primary system. If you also want purified drinking water, adding a reverse osmosis system under your kitchen sink gives you the best of both worlds — soft water throughout the house and purified drinking water at the tap.</p>
<p>Homes in <a href="/areas/lehigh-acres">Lehigh Acres</a> and eastern Lee County on well water often benefit from both a softener and a whole-home sediment filter.</p>

<h2>How Much Does Water Treatment Cost?</h2>
<p>In Southwest Florida, expect to pay:</p>
<ul>
<li><strong>Water softener:</strong> $1,500–$3,500 installed</li>
<li><strong>Whole-home carbon filter:</strong> $800–$2,000 installed</li>
<li><strong>Under-sink RO system:</strong> $300–$800 installed</li>
<li><strong>Softener + RO combo:</strong> $2,000–$4,000 installed</li>
</ul>

<h2>Get a Free Water Test</h2>
<p>Not sure what your water needs? C&S Plumbing offers free water testing and consultations. We'll test your water hardness and quality, then recommend the right system for your home and budget.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book a free water consultation</a> to find out what's in your water and how to fix it.</p>`,
  },
  {
    slug: "polybutylene-pipe-problems-cape-coral",
    title: "Why Cape Coral Homes Need Repiping: The Polybutylene Pipe Problem",
    metaTitle: "Polybutylene Pipe Problems in Cape Coral — Why You Need to Repipe",
    metaDescription:
      "Cape Coral homes built 1978-1995 likely have polybutylene pipes that are failing. Learn why repiping is urgent and how C&S Plumbing can help. Call 833-PLUMB-IT.",
    keywords: ["polybutylene pipes Cape Coral", "poly-b pipe replacement", "repiping Cape Coral", "polybutylene pipe failure", "Cape Coral plumbing problems", "PEX repiping Cape Coral"],
    excerpt:
      "Thousands of Cape Coral homes were built with polybutylene pipes between 1978 and 1995. These pipes are now failing at alarming rates, causing leaks, water damage, and insurance problems for homeowners.",
    category: "Repiping",
    publishDate: "2026-03-24",
    readTime: "6 min read",
    content: `<h2>What Are Polybutylene Pipes?</h2>
<p>Polybutylene (poly-B or PB) pipes are gray plastic water supply pipes that were widely used in residential construction from the late 1970s through the mid-1990s. They were marketed as a cheaper, easier-to-install alternative to copper. At the time, builders across <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, and <a href="/areas/north-fort-myers">North Fort Myers</a> embraced them for their low cost.</p>
<p>The problem? Polybutylene reacts with chlorine and other oxidants in treated water, causing the pipes to become brittle, flake, and eventually crack or burst from the inside out.</p>

<h2>How to Tell If Your Home Has Poly-B Pipes</h2>
<p>Polybutylene pipes are typically gray (sometimes white or blue) and are found in several locations:</p>
<ul>
<li><strong>Main water line:</strong> Running from the meter to your home</li>
<li><strong>Interior supply lines:</strong> Behind walls and under sinks</li>
<li><strong>At the water heater:</strong> Check connections going into your <a href="/services/water-heaters">water heater</a></li>
</ul>
<p>If your <a href="/areas/cape-coral">Cape Coral</a> home was built between 1978 and 1995, there's a high probability it has polybutylene plumbing. A quick visual inspection or a free assessment from C&S Plumbing can confirm.</p>

<h2>Why Polybutylene Pipes Fail</h2>
<p>Chlorine in the municipal water supply gradually breaks down the molecular structure of polybutylene. This degradation happens from the inside, so the pipes can look fine on the outside while crumbling internally. Common failure signs include:</p>
<ul>
<li>Pinhole leaks in walls, ceilings, or under slabs</li>
<li>Sudden pipe bursts without warning</li>
<li>Discolored water or reduced water pressure</li>
<li>Higher-than-normal water bills from hidden <a href="/services/leak-repair">leaks</a></li>
</ul>

<h2>Insurance and Real Estate Implications</h2>
<p>Many insurance companies in Florida are now refusing to write or renew homeowner's policies on homes with polybutylene pipes. If your insurance company finds out you have poly-B pipes, you may face:</p>
<ul>
<li>Policy non-renewal or cancellation</li>
<li>Dramatically higher premiums</li>
<li>Requirements to repipe before coverage is issued</li>
</ul>
<p>From a real estate perspective, poly-B pipes are a red flag for home inspectors and buyers. Homes with modern PEX or copper plumbing sell faster and for more money.</p>

<h2>The Solution: Whole-Home Repiping</h2>
<p>The only permanent fix for polybutylene is a <a href="/services/repiping">whole-home repipe</a>. At C&S Plumbing, we replace all polybutylene with modern PEX or copper piping. Our process:</p>
<ul>
<li>Free in-home assessment and estimate</li>
<li>Most homes completed in 1-2 days</li>
<li>Full permit and county inspection included</li>
<li>Minimal wall openings with drywall patching</li>
<li>1-year labor warranty + manufacturer warranty on PEX</li>
</ul>
<p>We've repiped thousands of <a href="/areas/cape-coral">Cape Coral</a> and <a href="/areas/fort-myers">Fort Myers</a> homes — we know the common layouts and can work efficiently to minimize disruption.</p>

<h2>Don't Wait for a Catastrophic Failure</h2>
<p>Every day you wait, your polybutylene pipes are deteriorating further. A proactive repipe on your schedule is far better than an emergency repair at 2 AM after a pipe bursts and floods your home.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">schedule a free repipe consultation</a> today. We'll inspect your pipes, explain your options, and provide an honest, upfront estimate.</p>`,
  },
  {
    slug: "slab-leak-detection-southwest-florida",
    title: "Slab Leaks in Southwest Florida: Warning Signs and What to Do",
    metaTitle: "Slab Leak Detection in Southwest Florida — Signs & Solutions",
    metaDescription:
      "Slab leaks are common in SWFL homes and can cause major structural damage if ignored. Learn the warning signs, detection methods, and repair options from C&S Plumbing.",
    keywords: ["slab leak detection", "slab leak Cape Coral", "slab leak Fort Myers", "slab leak repair SWFL", "underground leak detection", "slab leak signs", "slab leak repair cost Florida"],
    excerpt:
      "A slab leak — a water line break beneath your home's concrete foundation — is one of the most damaging and expensive plumbing problems a homeowner can face. Here's how to spot one early before it destroys your home.",
    category: "Leak Repair",
    publishDate: "2026-04-07",
    readTime: "6 min read",
    content: `<h2>What Is a Slab Leak?</h2>
<p>A slab leak is a break or pinhole leak in the water supply or drain lines that run beneath the concrete slab your home is built on. Because these pipes are buried under several inches of concrete and soil, even a small leak can go undetected for months — silently eroding your foundation, soaking your flooring, and fostering mold growth all the while.</p>
<p>Slab leaks are especially common in <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, and throughout Southwest Florida for several reasons: our sandy, shifting soil puts stress on buried pipes, our hard water accelerates pipe corrosion, and many homes in the area still have original copper or galvanized pipes from the 1970s–1990s that are nearing the end of their lifespan.</p>

<h2>Warning Signs You May Have a Slab Leak</h2>
<p>Because the leak is hidden underground, homeowners often dismiss the early warning signs as something minor. Know these red flags:</p>

<h3>Unexplained Spike in Your Water Bill</h3>
<p>If your water usage hasn't changed but your bill has jumped significantly, water is escaping somewhere in your system. A slab leak can waste hundreds of gallons per day. Compare your current bill to the same month last year — a 20% or greater increase warrants investigation.</p>

<h3>Sound of Running Water When Everything Is Off</h3>
<p>Turn off every fixture in your home — all faucets, appliances, showers, and irrigation — and listen near the floor or against interior walls. A faint hissing, rushing, or gurgling sound that continues with everything shut off is a classic indicator of an active slab leak.</p>

<h3>Warm or Hot Spots on the Floor</h3>
<p>If your hot water line is leaking under the slab, it can warm the concrete above it. Tile floors may feel noticeably warm in patches, or certain areas of carpet may feel damp and warm underfoot. This is one of the most reliable physical signs of a hot-water slab leak.</p>

<h3>Cracks in Walls or Flooring</h3>
<p>Water saturating the soil beneath your slab causes uneven settling. Over time, this creates visible cracks in drywall, tile grout, or even the concrete slab itself. If you notice new cracks forming — especially horizontal cracks along the base of walls — water damage to your foundation may already be underway.</p>

<h3>Damp or Discolored Flooring</h3>
<p>Wet patches on carpet, warped hardwood, or lifting tile without an obvious surface source are serious signs. Mold odors near the floor — musty, earthy smells — often accompany slab leaks that have been active for weeks or longer.</p>

<h3>Low Water Pressure</h3>
<p>A significant leak in your main water line beneath the slab will reduce pressure throughout the house. If you notice reduced flow at multiple fixtures simultaneously, it can indicate a substantial loss occurring underground. See our post on <a href="/blog/signs-you-need-a-repipe">signs your plumbing system is failing</a> for related warning signs.</p>

<h2>How Slab Leaks Are Detected</h2>
<p>At C&S Plumbing, we use non-invasive leak detection technology to pinpoint slab leaks without unnecessary demolition:</p>
<ul>
<li><strong>Electronic leak detection:</strong> Sensitive listening equipment amplifies the sound of water escaping under pressure, allowing our technicians to pinpoint the leak location to within inches</li>
<li><strong>Thermal imaging:</strong> Infrared cameras detect temperature variations in the floor caused by hot-water line leaks — no cutting or drilling required</li>
<li><strong>Pressure testing:</strong> We isolate sections of your plumbing and test them under pressure to confirm which line is compromised and where</li>
</ul>
<p>Accurate detection is critical — the goal is to expose and repair only what's necessary, minimizing disruption to your flooring and foundation.</p>

<h2>Slab Leak Repair Options</h2>
<p>Once the leak is located, there are several repair approaches depending on its severity and the condition of your overall plumbing system:</p>

<h3>Spot Repair</h3>
<p>For isolated leaks in otherwise good pipes, we can jackhammer a small opening in the slab, repair or replace the damaged section, and patch the concrete. This is the most cost-effective option when the rest of your plumbing is in good condition.</p>

<h3>Pipe Re-routing</h3>
<p>Rather than cutting into the slab, we can reroute the affected line through the walls, attic, or around the exterior of the home. This avoids slab demolition entirely and is a great solution when the compromised section is particularly deep or difficult to access.</p>

<h3>Whole-Home Repiping</h3>
<p>If your home has had multiple slab leaks — or your pipes are aged polybutylene, galvanized steel, or heavily corroded copper — a <a href="/services/repiping">whole-home repipe</a> is often the smartest long-term investment. Replacing all the plumbing at once eliminates future slab leaks and ongoing repair costs. Many SWFL homeowners who've dealt with two or more slab leaks find that repiping pays for itself within a few years compared to repeated spot repairs.</p>

<h2>Slab Leak Repair Costs in Southwest Florida</h2>
<p>Repair costs vary widely based on the leak's location, accessibility, and severity:</p>
<ul>
<li><strong>Leak detection service:</strong> $200–$500</li>
<li><strong>Spot repair (slab access):</strong> $1,500–$4,000</li>
<li><strong>Pipe re-routing:</strong> $1,500–$3,500</li>
<li><strong>Whole-home repipe:</strong> $4,500–$10,000+ (eliminates all future slab leak risk)</li>
</ul>
<p>Most homeowner's insurance policies in Florida cover slab leak repair, though coverage varies. Document the damage thoroughly before any repairs — photos and video of wet flooring, cracks, and water damage strengthen your claim significantly.</p>

<h2>Don't Wait — Slab Leaks Get Worse Quickly</h2>
<p>A small slab leak that costs $2,000 to repair today can become a $20,000+ foundation and mold remediation project in six months. The concrete and soil beneath your slab will erode faster than you expect once water starts flowing freely underground.</p>
<p>If you've noticed any of the warning signs above, call <a href="tel:8337586248">833-PLUMB-IT</a> immediately. C&S Plumbing provides expert <a href="/services/leak-repair">leak detection and repair</a> throughout <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/north-fort-myers">North Fort Myers</a>, <a href="/areas/bonita-springs">Bonita Springs</a>, and all of Lee County. <a href="/booking">Book a leak detection appointment</a> today — fast diagnosis is the difference between a minor repair and a major reconstruction.</p>`,
  },
  {
    slug: "low-water-pressure-causes-fixes-swfl",
    title: "Low Water Pressure in Your Southwest Florida Home? Here's Why and What to Do",
    metaTitle: "Low Water Pressure in Your SWFL Home — Causes and Fixes",
    metaDescription:
      "Struggling with low water pressure in Cape Coral or Fort Myers? Learn the 6 most common causes and how to fix them. Expert plumbing advice from C&S Plumbing.",
    keywords: ["low water pressure", "low water pressure Cape Coral", "water pressure problems Fort Myers", "low water pressure causes", "water pressure fix SWFL", "plumbing pressure issues Lee County"],
    excerpt:
      "A trickling shower or slow-filling faucet isn't just annoying — it's often a symptom of an underlying plumbing problem. Here are the six most common causes of low water pressure in Southwest Florida homes and exactly what to do about them.",
    category: "Tips",
    publishDate: "2026-03-11",
    readTime: "5 min read",
    content: `<h2>Why Low Water Pressure Is Such a Common Problem in Southwest Florida</h2>
<p>Few things are more frustrating than a trickling shower or a kitchen faucet that takes forever to fill a pot. Low water pressure is one of the most common complaints from homeowners in <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, and across Lee County — and it's rarely something you should ignore. Pressure problems often signal an underlying issue that, left unaddressed, can lead to much bigger repairs down the road.</p>
<p>Here's a breakdown of the most common causes of low water pressure in Southwest Florida homes and what you can do to fix them.</p>

<h2>1. Mineral Buildup from Hard Water</h2>
<p>Southwest Florida has some of the hardest water in the country. Over time, the dissolved calcium and magnesium in our water supply accumulates inside pipes, faucets, and showerheads — gradually narrowing the passage water flows through and reducing pressure at the fixture.</p>
<p>You can sometimes clear buildup from a showerhead by soaking it in vinegar overnight. But if mineral deposits have built up inside your supply pipes, no amount of vinegar will help. A professional inspection — and possibly <a href="/services/repiping">pipe replacement</a> — may be necessary.</p>
<p>The long-term solution for hard water damage is a <a href="/services/water-softeners">whole-home water softener</a>. By removing hardness minerals before they enter your plumbing, a softener protects your pipes, fixtures, and water-using appliances from future buildup and the pressure loss that follows.</p>

<h2>2. Corroded or Aging Pipes</h2>
<p>If your home was built before the mid-1990s and still has its original plumbing, corroded pipes may be the culprit. Galvanized steel pipes are particularly prone to internal rust and corrosion, which gradually narrows the pipe interior until water pressure drops noticeably throughout the house.</p>
<p>Polybutylene pipes — common in homes built from the late 1970s through the mid-1990s — can also develop internal flaking and restrictions that reduce flow. If low pressure is accompanied by discolored water, aging pipes are a likely cause. See our post on <a href="/blog/signs-you-need-a-repipe">5 signs you need a whole-home repipe</a> for more warning signs.</p>
<p>When corrosion is the issue, the only reliable fix is <a href="/services/repiping">repiping the home with modern PEX or copper</a>. New pipes restore full water pressure and won't corrode the way galvanized steel or polybutylene does.</p>

<h2>3. A Hidden Leak in Your Plumbing System</h2>
<p>A significant leak somewhere in your plumbing diverts water before it reaches your fixtures, reducing pressure throughout the house. The tricky part: many leaks are hidden inside walls, ceilings, or — in SWFL's slab-construction homes — beneath your concrete foundation.</p>
<p>Signs that a hidden leak may be causing your pressure drop include:</p>
<ul>
<li>A higher-than-normal water bill without increased usage</li>
<li>Damp spots on floors, walls, or ceilings</li>
<li>The sound of running water when all fixtures are off</li>
<li>Pressure loss that appeared suddenly rather than gradually</li>
</ul>
<p>If you suspect a hidden leak, don't wait. <a href="/services/leak-repair">C&S Plumbing's leak detection team</a> uses non-invasive electronic equipment and thermal imaging to locate leaks without unnecessary demolition. For a detailed look at under-slab leaks, read our guide to <a href="/blog/slab-leak-detection-southwest-florida">slab leak detection in Southwest Florida</a>.</p>

<h2>4. Partially Closed Shutoff Valves</h2>
<p>It sounds simple, but a partially closed water shutoff valve is a surprisingly common cause of sudden pressure drops — especially after any recent plumbing work. If a valve near your water meter or main supply line wasn't fully reopened after a repair, water flow to your entire home is restricted.</p>
<p>Check both the valve at your water meter and any main shutoff valve inside your home. Both should be fully open: ball valves should have the handle parallel to the pipe; gate valves should be turned fully counterclockwise. This is a free, two-minute check that's worth doing before you call anyone.</p>

<h2>5. A Failing Pressure Regulating Valve</h2>
<p>Most Southwest Florida homes have a pressure regulating valve (PRV) that limits incoming city water pressure to a safe level — typically 45–80 PSI. When the PRV fails, it can either allow pressure to surge dangerously high or drop it significantly, sometimes to nearly nothing.</p>
<p>You can test your water pressure with an inexpensive gauge that threads onto a hose bib (outdoor faucet). If you're consistently getting less than 40 PSI, or the readings fluctuate wildly from day to day, a failing PRV is a likely cause. PRV replacement is a straightforward job for a licensed plumber and restores normal pressure immediately.</p>

<h2>6. Municipal Supply Issues</h2>
<p>Occasionally, the issue isn't your plumbing at all — it's the city supply. Main breaks, high demand during peak hours, and infrastructure maintenance can temporarily reduce pressure to your home. The easiest way to rule this out: ask a neighbor whether they're experiencing the same thing. If the whole street is affected, contact your water utility to report it.</p>
<p>If your neighbors have normal pressure and you don't, the problem is inside your home — time to call a plumber.</p>

<h2>When to Call a Plumber</h2>
<p>A minor, isolated pressure problem at a single fixture is often a DIY fix — clean the aerator or showerhead and you're done. But when pressure is low throughout the house, developed suddenly, or is accompanied by other symptoms (discolored water, higher bills, wet spots on walls or floors), don't wait.</p>
<p>At C&S Plumbing, we diagnose water pressure problems throughout <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/bonita-springs">Bonita Springs</a>, <a href="/areas/north-fort-myers">North Fort Myers</a>, and all of Lee County. We identify the root cause quickly and provide upfront pricing before any work begins — no surprises.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book an appointment online</a> to get your water pressure back where it belongs.</p>`,
  },
  {
    slug: "clogged-drains-causes-fixes-swfl",
    title: "Why Your Drains Keep Clogging (and How to Fix It for Good)",
    metaTitle: "Why Your Drains Keep Clogging — Causes and Fixes in SWFL",
    metaDescription:
      "Dealing with slow or clogged drains in Cape Coral or Fort Myers? Learn the real causes, when to DIY, and when to call a pro. Expert drain advice from C&S Plumbing.",
    keywords: ["clogged drain Cape Coral", "slow drain Fort Myers", "drain cleaning SWFL", "clogged drain causes", "drain cleaning plumber Lee County", "drain cleaning near me"],
    excerpt:
      "A slow drain is easy to ignore — until it backs up completely at the worst possible moment. Here's why Southwest Florida drains clog more often than you might expect, and what it takes to actually fix the problem for good.",
    category: "Drain Cleaning",
    publishDate: "2026-04-08",
    readTime: "6 min read",
    content: `<h2>Why Drain Clogs Are So Common in Southwest Florida</h2>
<p>Clogged drains are one of the most frequent plumbing calls we receive across <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, and Lee County — and they're more common here than in most parts of the country. Southwest Florida's hard water leaves mineral deposits on pipe walls that gradually narrow the drain opening and trap grease, hair, and soap scum more aggressively than in areas with softer water. Older homes built before the 1990s often have original cast iron or galvanized drain lines that have accumulated decades of scale and buildup inside.</p>
<p>The result: drains that seem to clog for no obvious reason, clogs that come back weeks after you cleared them, and slow drains that never seem to fully resolve no matter what you pour down them.</p>

<h2>The Most Common Culprits by Drain Type</h2>

<h3>Kitchen Sink</h3>
<p>Kitchen drain clogs are almost always caused by grease, oil, and food particles. Even if you're careful about what goes down the drain, cooking oil and grease from dishes get rinsed off every day. In the pipe, this grease cools and solidifies on the pipe walls, building up layer by layer until water can barely pass. Dish soap breaks up some grease, but not all of it — a thin coating is left behind with every wash.</p>
<p>Coffee grounds, pasta, rice, and fibrous vegetables (celery, onion peels) are also notorious drain cloggers, even with a garbage disposal.</p>

<h3>Bathroom Sink and Shower</h3>
<p>Hair is the number-one cause of bathroom drain clogs, combined with soap scum and personal care products. A single shower doesn't cause a clog — but hair accumulates in the drain trap over weeks and months until water starts backing up. In Southwest Florida's hard water, soap scum is stickier and more tenacious than elsewhere, which makes hair clogs worse.</p>

<h3>Toilet</h3>
<p>Toilets are designed to handle human waste and toilet paper — nothing else. Wipes labeled "flushable," cotton balls, paper towels, and feminine products don't break down in water the way toilet paper does. They accumulate in the drain line and eventually cause a blockage. If your toilet clogs repeatedly without any obvious overuse, the issue may be further down the line in the main sewer pipe.</p>

<h3>Main Sewer Line</h3>
<p>When multiple drains in your home are slow or backing up at the same time, the problem usually isn't individual clogs — it's a blockage in the main sewer line that serves the whole house. In Southwest Florida, tree root intrusion is a significant cause: roots seek moisture and can infiltrate sewer pipes through small cracks, then grow until they block flow entirely. The sandy soil here also shifts over time, which can cause drain lines to belly (sag) and collect debris.</p>

<h2>DIY Fixes: When They Work and When They Don't</h2>
<p>A plunger is the first tool to reach for with a toilet or sink clog. Used correctly, a good plunger can dislodge a fresh, soft clog near the drain opening. For bathroom sinks and showers, a simple drain snake (also called a drain auger) can pull out hair clogs from the trap.</p>
<p>Liquid drain cleaners like Drano work on some light clogs, but we don't recommend them for regular use. They contain harsh chemicals (sodium hydroxide or sulfuric acid) that can damage older pipes, corrode metal fittings, and harm septic systems. More importantly, they don't actually remove the clog — they dissolve part of it, leaving residue that clogs again quickly. If a chemical cleaner doesn't clear the drain after one use, stop — repeated application increases the risk of pipe damage.</p>
<p><strong>When DIY fails:</strong> If a drain is still slow after plunging and snaking, if the clog keeps coming back, or if multiple drains are affected at once, it's time to call a professional.</p>

<h2>What Professional Drain Cleaning Actually Does</h2>
<p>Professional drain cleaning is a different category entirely from pouring a bottle of liquid drain cleaner down a pipe. There are two main methods:</p>

<h3>Drain Snaking (Mechanical Auger)</h3>
<p>A professional-grade drain snake uses a motorized cable with a cutting head that physically breaks through and removes blockages. It's faster and more effective than a hand auger and can reach deeper into the drain line. This is effective for most routine clogs — hair, grease, soft blockages.</p>

<h3>Hydrojetting</h3>
<p>Hydrojetting uses a high-pressure water stream (typically 3,000–4,000 PSI) to scour the inside of the pipe walls, removing grease, scale, mineral buildup, and debris. Unlike snaking, which punches a hole through a clog, hydrojetting cleans the entire pipe interior — which is why drains stay clear much longer after hydrojetting than after simple snaking.</p>
<p>Hydrojetting is particularly effective in <a href="/areas/cape-coral">Cape Coral</a> and <a href="/areas/fort-myers">Fort Myers</a> homes where hard water has left mineral scale inside drain lines, and for kitchen drains with years of accumulated grease.</p>

<h2>Recurring Clogs? The Problem May Be Your Pipes</h2>
<p>If you've had the same drain professionally cleaned multiple times and it keeps backing up, the drain line itself may be the problem. In older homes, cast iron drains corrode and roughen on the interior, trapping debris much more aggressively than smooth modern pipe. Offset joints and bellied sections created by soil movement collect waste and never fully drain.</p>
<p>In these cases, a <a href="/services/drain-cleaning">video camera drain inspection</a> is the right next step. We run a small waterproof camera through the drain line to see exactly what's happening inside — corrosion, root intrusion, offsets, or cracked pipe. Based on what we find, we can recommend targeted repairs or line replacement to solve the problem permanently rather than treating the symptom repeatedly.</p>

<h2>When to Call C&S Plumbing for Drain Cleaning</h2>
<ul>
<li>A drain is completely backed up and won't clear with a plunger</li>
<li>Multiple drains are slow or backing up at the same time</li>
<li>A drain you cleaned a month ago is clogging again</li>
<li>You notice sewage odor coming from drains</li>
<li>Water is backing up into a tub or floor drain when you run the dishwasher or washing machine</li>
</ul>
<p>C&S Plumbing provides professional drain cleaning throughout <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/bonita-springs">Bonita Springs</a>, <a href="/areas/north-fort-myers">North Fort Myers</a>, and all of Lee County. We use professional-grade equipment and provide upfront pricing before any work begins.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book a drain cleaning appointment online</a> today — we'll clear the clog and inspect the line so you know exactly what you're dealing with.</p>`,
  },
  {
    slug: "septic-to-sewer-conversion-swfl",
    title: "Septic to Sewer: What Southwest Florida Homeowners Need to Know",
    metaTitle: "Septic to Sewer Conversion — What SWFL Homeowners Need to Know",
    metaDescription:
      "Switching from septic to sewer in Cape Coral or SWFL? Learn about the process, costs, and requirements. C&S Plumbing handles UEP connections. Call 833-PLUMB-IT.",
    keywords: ["septic to sewer conversion", "septic to sewer Cape Coral", "UEP connection Cape Coral", "septic abandonment Florida", "sewer hookup cost SWFL", "septic to sewer cost"],
    excerpt:
      "As Cape Coral and other Southwest Florida communities expand their sewer systems, thousands of homeowners are transitioning from septic tanks to city sewer. Here's what you need to know about the process, costs, and requirements.",
    category: "UEP & Utilities",
    publishDate: "2026-03-31",
    readTime: "6 min read",
    content: `<h2>Why the Switch from Septic to Sewer?</h2>
<p>Many <a href="/areas/cape-coral">Cape Coral</a> homes were built on septic systems because city sewer wasn't available at the time. As the city's Utilities Extension Program (UEP) expands sewer infrastructure into more neighborhoods, homeowners are required or choosing to connect to the municipal sewer system.</p>
<p>Connecting to city sewer offers several advantages over septic:</p>
<ul>
<li>No more septic tank pump-outs or maintenance</li>
<li>Eliminates the risk of septic system failure and yard flooding</li>
<li>Better for the environment and local waterways</li>
<li>Can increase property value</li>
<li>Required when your area is designated for sewer connection</li>
</ul>

<h2>The Septic to Sewer Process</h2>
<p>The conversion involves several steps, and <a href="/services/uep-utilities">C&S Plumbing handles the entire process</a>:</p>

<h3>1. Sewer Lateral Installation</h3>
<p>A new sewer line is trenched from your home to the city sewer main in the street. This involves excavation across your yard, installing new PVC sewer pipe at the proper grade, and connecting to the city main. Typical cost is $25-$33 per linear foot depending on depth and distance.</p>

<h3>2. Septic Tank Abandonment</h3>
<p>Your existing septic tank must be properly abandoned according to Lee County code. This involves pumping out the tank, collapsing or filling it with clean fill material, and obtaining a permit and inspection. We handle the entire abandonment process, including coordination with the county inspector.</p>

<h3>3. Interior Connection</h3>
<p>In most cases, the plumbing inside your home doesn't need to change — we simply redirect the existing sewer outlet from the septic tank to the new city sewer connection.</p>

<h3>4. Water and Irrigation Lines</h3>
<p>If you're also connecting to city water or irrigation as part of a UEP project, those lines are typically installed at the same time to minimize excavation and landscaping disruption.</p>

<h2>How Much Does Septic to Sewer Cost?</h2>
<p>Total project costs vary based on your property's specific situation, but typical ranges for <a href="/areas/cape-coral">Cape Coral</a> homeowners include:</p>
<ul>
<li><strong>Sewer lateral:</strong> $2,500–$5,000 (based on distance to main)</li>
<li><strong>Septic abandonment:</strong> $2,500–$3,500</li>
<li><strong>Water service line:</strong> $1,300–$2,500 (if needed)</li>
<li><strong>Irrigation line:</strong> $900–$1,500 (if needed)</li>
<li><strong>Total typical range:</strong> $5,000–$12,000</li>
</ul>
<p>The city may also charge assessment fees for the sewer infrastructure itself, which are separate from the plumbing connection costs.</p>

<h2>Timeline and What to Expect</h2>
<p>The physical plumbing work typically takes 2-3 days. However, the overall timeline depends on permitting, city inspection scheduling, and coordination with the UEP program. We recommend starting the process as soon as you receive notice that sewer is available in your area — delays can result in daily fines from the city.</p>

<h2>Choosing the Right Contractor</h2>
<p>Septic to sewer conversion requires a <a href="/blog/how-to-choose-a-plumber-cape-coral">licensed plumbing contractor</a> experienced with UEP projects. At C&S Plumbing, we've completed hundreds of UEP connections across Cape Coral and understand the specific requirements of the city's program. We handle all permitting, excavation, piping, septic abandonment, and final inspection.</p>

<h2>Get Started</h2>
<p>If you've received a UEP notice or are considering a voluntary septic to sewer conversion, call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book a free consultation</a>. We'll visit your property, assess the scope, and provide an upfront estimate with no hidden costs. See our <a href="/services/uep-utilities">UEP services page</a> for more details and photos of our recent projects.</p>`,
  },
  {
    slug: "spring-plumbing-maintenance-checklist-swfl",
    title: "Spring Plumbing Maintenance Checklist for Southwest Florida Homeowners",
    metaTitle: "Spring Plumbing Maintenance Checklist for Southwest Florida Homeowners",
    metaDescription:
      "Get your plumbing ready for SWFL's hot summer and rainy season with this complete spring maintenance checklist. Expert tips from C&S Plumbing in Cape Coral & Fort Myers.",
    keywords: [
      "spring plumbing maintenance",
      "plumbing maintenance checklist Florida",
      "plumbing maintenance Cape Coral",
      "seasonal plumbing tips SWFL",
      "plumbing inspection Fort Myers",
      "summer plumbing preparation Florida",
    ],
    excerpt:
      "Spring is the ideal time to inspect and tune up your home's plumbing before Southwest Florida's brutal summer heat and rainy season arrive. This complete checklist covers everything from water heaters to outdoor fixtures.",
    category: "Tips",
    publishDate: "2026-04-15",
    readTime: "6 min read",
    content: `<h2>Why Spring Plumbing Maintenance Matters in Southwest Florida</h2>
<p>In most parts of the country, spring plumbing maintenance focuses on thawing pipes after winter. In <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, and across Southwest Florida, the concern is the opposite: preparing for the heat, humidity, and heavy rainfall of summer. From May through October, we see temperatures regularly topping 90°F, daily afternoon thunderstorms, and the ongoing threat of tropical storms and hurricanes.</p>
<p>A plumbing system that's already stressed from a year of hard water buildup, heat exposure, and normal wear is much more likely to fail when summer demands peak. A few hours of proactive maintenance now can prevent a plumbing emergency at the worst possible time. Here's your complete spring checklist.</p>

<h2>1. Inspect Every Faucet and Fixture for Leaks</h2>
<p>Walk through every bathroom and your kitchen with fresh eyes. Check under sinks for moisture, drips, or water stains inside the cabinet. Look at the base of toilets for soft flooring or discoloration that indicates a slow leak at the wax ring. Check showerheads and tub spouts for drips — a faucet that drips once per second wastes more than 3,000 gallons per year.</p>
<p>Even small leaks get worse in summer heat as water pressure fluctuates and materials expand. Fixing a minor drip now prevents a bigger repair later. If you find leaks at multiple fixtures, it may indicate a broader pressure problem — read our guide on <a href="/blog/low-water-pressure-causes-fixes-swfl">low water pressure causes and fixes</a> for more context.</p>

<h2>2. Service Your Water Heater</h2>
<p>Your <a href="/services/water-heaters">water heater</a> works year-round in Florida, but spring is the right time to give it attention before summer demand increases. Check these items:</p>
<ul>
<li><strong>Flush the tank:</strong> Mineral sediment from our hard water settles at the bottom of the tank, reducing efficiency and accelerating corrosion. Flushing 1-2 gallons from the drain valve removes loose sediment and extends the unit's life.</li>
<li><strong>Test the T&amp;P relief valve:</strong> The temperature and pressure relief valve is a critical safety device. Lift the lever briefly to confirm it opens and reseats properly. If it drips continuously afterward, it needs replacement.</li>
<li><strong>Check the anode rod:</strong> This sacrificial metal rod inside the tank prevents corrosion. In Lee County's hard water, anode rods deplete faster than in softer-water areas — typically every 2-3 years rather than the national average of 4-5. A depleted anode rod allows the tank walls to corrode directly.</li>
<li><strong>Look for rust or corrosion:</strong> Check the connections at the top and bottom of the tank. Early signs of rust mean the unit is nearing the end of its life.</li>
</ul>
<p>If your water heater is more than 10 years old and shows any of these signs, spring is a smart time to replace it before it fails mid-summer. A cold shower after a hot Florida day might seem appealing — but a flooded garage is not.</p>

<h2>3. Check for Hidden Leaks with a Meter Test</h2>
<p>Southwest Florida's slab-construction homes make hidden leaks particularly tricky — a <a href="/blog/slab-leak-detection-southwest-florida">slab leak</a> can go undetected for months while slowly eroding your foundation. Once a year, perform this simple check:</p>
<ol>
<li>Turn off every water-using fixture and appliance in the home (including the ice maker and any irrigation systems).</li>
<li>Go to your water meter and note the reading (or look for the small triangular leak indicator dial, if your meter has one).</li>
<li>Wait 15-20 minutes without using any water.</li>
<li>Check the meter again. If the reading changed or the leak indicator is spinning, water is escaping somewhere in your system — and it's time to call a plumber for <a href="/services/leak-repair">leak detection</a>.</li>
</ol>

<h2>4. Test Your Toilets for Running or Silent Leaks</h2>
<p>A running toilet is one of the most common — and wasteful — plumbing problems in residential homes. A toilet that runs continuously can waste 200 gallons per day. The flapper valve is usually the culprit: it's a rubber seal that deteriorates over time, especially in Florida's chlorinated water.</p>
<p>To check for a silent toilet leak, put a few drops of food coloring or a dye tablet in the tank and wait 15 minutes without flushing. If color appears in the bowl, the flapper is leaking. Replacing a flapper costs about $10 and takes 10 minutes — one of the few plumbing repairs genuinely worth doing yourself before calling a plumber.</p>

<h2>5. Inspect and Clear All Drains</h2>
<p>Summer in Southwest Florida brings daily rainfall and heavy use of showers (everyone's sweating constantly). Make sure all drains are flowing freely before summer begins. Pour a bucket of water into floor drains in the garage, laundry room, and any utility areas — these drains sit unused for long periods and their water traps can evaporate, allowing sewer gas odors into the home.</p>
<p>If kitchen or bathroom drains are running slow, now is the time to address them before heavy use makes them worse. Professional <a href="/services/drain-cleaning">drain cleaning</a> — particularly hydrojetting — removes years of mineral scale and grease buildup that a bottle of Drano can't touch. See our guide on <a href="/blog/clogged-drains-causes-fixes-swfl">why drains keep clogging in Southwest Florida</a> for more detail.</p>

<h2>6. Check Outdoor Faucets and Irrigation Systems</h2>
<p>Outdoor plumbing takes a beating in Florida's climate — UV exposure degrades fittings and hoses faster than anywhere else in the country. Walk the exterior of your home and check:</p>
<ul>
<li><strong>Hose bibs (outdoor faucets):</strong> Turn each one on and off. Check for drips at the spout and around the packing nut behind the handle. A slow drip from a hose bib wastes thousands of gallons over the course of a summer.</li>
<li><strong>Irrigation system:</strong> Turn on each irrigation zone and watch for broken or misaligned heads, zones that won't turn off, or obvious leaks at the manifold. An irrigation system leak is easy to miss because it only runs at scheduled times — often at 3 AM — and the water soaks immediately into the lawn. A spike in your water bill is often the first sign.</li>
<li><strong>Backflow preventer:</strong> Your irrigation system's backflow preventer protects drinking water from contamination. Have a licensed plumber test it annually — it's often required by local code.</li>
</ul>

<h2>7. Test Your Shut-Off Valves</h2>
<p>Before hurricane season officially starts on June 1st, make sure every shutoff valve in your home actually works. Turn the main water shutoff valve fully off and back on to confirm it moves freely. Do the same for the individual valves under each sink and behind each toilet. Valves that sit untouched for years can seize or fail — you don't want to discover this when you're frantically trying to stop a flood.</p>
<p>While you're at it, make sure every adult in your household knows where the main water shutoff is and how to use it. In a plumbing emergency, those first 60 seconds matter enormously. For a full hurricane preparation plan, read our guide on <a href="/blog/hurricane-plumbing-preparation-swfl">how to prepare your plumbing for hurricane season</a>.</p>

<h2>8. Schedule a Professional Plumbing Inspection</h2>
<p>Even the most thorough DIY inspection can't replace a licensed plumber's eye. A professional plumbing inspection evaluates your water pressure, checks for hidden corrosion, inspects supply and drain lines, and assesses the overall condition of your system. For homes built before 1995 with original plumbing — particularly those with <a href="/blog/polybutylene-pipe-problems-cape-coral">polybutylene pipes</a> — a professional inspection before summer is especially valuable.</p>
<p>At C&S Plumbing, our technicians have inspected thousands of <a href="/areas/cape-coral">Cape Coral</a>, <a href="/areas/fort-myers">Fort Myers</a>, <a href="/areas/bonita-springs">Bonita Springs</a>, and <a href="/areas/north-fort-myers">North Fort Myers</a> homes. We know what to look for in Southwest Florida's specific conditions — hard water corrosion, slab movement, <a href="/services/repiping">poly-B deterioration</a> — and we provide honest assessments with no pressure to upsell.</p>

<h2>Get Your Plumbing Summer-Ready</h2>
<p>Don't wait until your water heater fails in August or a slab leak floods your home in the middle of rainy season. A spring plumbing checkup is the best investment you can make to avoid a summer emergency.</p>
<p>Call <a href="tel:8337586248">833-PLUMB-IT</a> or <a href="/booking">book a spring inspection online</a>. C&S Plumbing has been keeping Southwest Florida homes running smoothly for over 28 years — we'll make sure yours is ready for whatever summer throws at it.</p>`,
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

// ============================================
// COMPLETED PROJECTS
// ============================================

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    slug: "hansen-homes-cape-coral",
    name: "Hansen Homes — New Construction (Cape Coral)",
    client: "Hansen Homes",
    clientUrl: "https://www.hansenhomes.net",
    category: "New Construction",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "C&S Plumbing is the underground plumbing partner for Hansen Homes' newest Cape Coral build. Underground rough-in is complete — supply lines, drain/waste/vent piping, and stub-outs installed and inspected before the slab pour. We'll be back for the in-wall rough and trim phases as the build progresses. This page will be updated with photos from each phase as work continues.",
    location: "Cape Coral, FL",
    coverImage: "/images/projects/hansen-homes-cape-coral/underground/aerial-1.jpg",
    phases: [
      {
        name: "Underground",
        slug: "underground",
        description:
          "Below-slab drain, waste, vent, and supply piping installed and pressure-tested before the concrete pour. Drone aerials show the full lot and slab layout before pour.",
        images: [
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-1.jpg", alt: "Hansen Homes Cape Coral underground aerial 1" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-2.jpg", alt: "Hansen Homes Cape Coral underground aerial 2" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-3.jpg", alt: "Hansen Homes Cape Coral underground aerial 3" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-4.jpg", alt: "Hansen Homes Cape Coral underground aerial 4" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-5.jpg", alt: "Hansen Homes Cape Coral underground aerial 5" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-6.jpg", alt: "Hansen Homes Cape Coral underground aerial 6" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-7.jpg", alt: "Hansen Homes Cape Coral underground aerial 7" },
          { src: "/images/projects/hansen-homes-cape-coral/underground/aerial-8.jpg", alt: "Hansen Homes Cape Coral underground aerial 8" },
        ],
      },
    ],
    metaTitle: "Hansen Homes Cape Coral New Construction | Underground Plumbing",
    metaDescription: "C&S Plumbing partners with Hansen Homes on a Cape Coral new construction build. Underground rough-in complete; trim and finish phases coming soon.",
  },
  {
    slug: "306-seminal-way-fort-myers-beach",
    name: "306 Seminal Way — Fort Myers Beach New Construction",
    client: "Custom Home Build",
    category: "New Construction",
    timeline: "Completed",
    cost: "On Request",
    description:
      "Full residential new construction plumbing on Fort Myers Beach. C&S Plumbing handled every phase — underground supply and DWV, in-wall rough-in, water heater set, and final fixture trim — for a custom home built to current Florida Building Code with hurricane and salt-air considerations. Bath fixtures and water heater detail shots included below.",
    location: "Fort Myers Beach, FL",
    coverImage: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-1.webp",
    phases: [
      {
        name: "Build",
        slug: "build",
        description:
          "Underground rough-in through final trim-out. Photos cover supply and DWV piping, fixture rough, water heater installation, and finished bath fixtures.",
        images: [
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-1.webp", alt: "306 Seminal Way new construction plumbing 1" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-2.webp", alt: "306 Seminal Way new construction plumbing 2" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-3.webp", alt: "306 Seminal Way new construction plumbing 3" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-4.webp", alt: "306 Seminal Way new construction plumbing 4" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-5.webp", alt: "306 Seminal Way new construction plumbing 5" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/hero-6.webp", alt: "306 Seminal Way bathroom plumbing trim" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-1.jpeg", alt: "306 Seminal Way new construction plumbing 7" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-2.jpeg", alt: "306 Seminal Way new construction plumbing 8" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-3.jpeg", alt: "306 Seminal Way new construction plumbing 9" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-4.jpeg", alt: "306 Seminal Way new construction plumbing 10" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-5.jpeg", alt: "306 Seminal Way new construction plumbing 11" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-6.jpeg", alt: "306 Seminal Way new construction plumbing 12" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-7.jpeg", alt: "306 Seminal Way new construction plumbing 13" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-8.jpeg", alt: "306 Seminal Way new construction plumbing 14" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-9.jpeg", alt: "306 Seminal Way new construction plumbing 15" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-10.jpeg", alt: "306 Seminal Way new construction plumbing 16" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-11.jpeg", alt: "306 Seminal Way new construction plumbing 17" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-12.jpeg", alt: "306 Seminal Way new construction plumbing 18" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-13.jpeg", alt: "306 Seminal Way new construction plumbing 19" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-14.jpeg", alt: "306 Seminal Way new construction plumbing 20" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-15.jpeg", alt: "306 Seminal Way new construction plumbing 21" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-16.jpeg", alt: "306 Seminal Way new construction plumbing 22" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-17.jpeg", alt: "306 Seminal Way new construction plumbing 23" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-18.jpeg", alt: "306 Seminal Way new construction plumbing 24" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-19.jpeg", alt: "306 Seminal Way new construction plumbing 25" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-converted-1.jpeg", alt: "306 Seminal Way new construction plumbing 26" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-converted-2.jpeg", alt: "306 Seminal Way new construction plumbing 27" },
          { src: "/images/projects/306-seminal-way-fort-myers-beach/build/photo-converted-3.jpeg", alt: "306 Seminal Way new construction plumbing 28" },
        ],
      },
    ],
    metaTitle: "306 Seminal Way — Fort Myers Beach New Construction Plumbing",
    metaDescription: "Full new construction plumbing by C&S Plumbing of Lee on Fort Myers Beach. Underground rough-in through final trim-out for a custom Florida home.",
  },
  {
    slug: "ifha-community-center",
    name: "IFHA Community Center New Construction",
    client: "Heatherwood Construction",
    clientUrl: "https://heatherwoodconstruction.com",
    category: "New Construction",
    timeline: "7 months",
    cost: "$55K",
    description:
      "Full plumbing installation for the IFHA Community Center new construction project in Lee County. C&S Plumbing handled all phases from underground rough-in through final trim out, working alongside Heatherwood Construction to deliver a complete commercial plumbing system on schedule and within budget.",
    location: "Lee County, FL",
    coverImage: "/images/projects/ifha-community-center/underground/IMG_0723.jpeg",
    phases: [
      {
        name: "Underground",
        slug: "underground",
        description:
          "Below-slab drainage, water lines, and waste piping installed before the concrete pour.",
        images: [
          { src: "/images/projects/ifha-community-center/underground/IMG_0723.jpeg", alt: "IFHA underground plumbing 1" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0724.jpeg", alt: "IFHA underground plumbing 2" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0725.jpeg", alt: "IFHA underground plumbing 3" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0726.jpeg", alt: "IFHA underground plumbing 4" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0727.jpeg", alt: "IFHA underground plumbing 5" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0728.jpeg", alt: "IFHA underground plumbing 6" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0729.jpeg", alt: "IFHA underground plumbing 7" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0730.jpeg", alt: "IFHA underground plumbing 8" },
          { src: "/images/projects/ifha-community-center/underground/IMG_0737.jpeg", alt: "IFHA underground plumbing 9" },
        ],
      },
      {
        name: "2nd Rough",
        slug: "2nd-rough",
        description:
          "In-wall supply and drain lines roughed in after framing, before drywall.",
        images: [
          { src: "/images/projects/ifha-community-center/2nd-rough/IMG_0945.jpeg", alt: "IFHA 2nd rough plumbing 1" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-8.jpg", alt: "IFHA 2nd rough plumbing 2" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-9.jpg", alt: "IFHA 2nd rough plumbing 3" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-10.jpg", alt: "IFHA 2nd rough plumbing 4" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-11.jpg", alt: "IFHA 2nd rough plumbing 5" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-12.jpg", alt: "IFHA 2nd rough plumbing 6" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-13.jpg", alt: "IFHA 2nd rough plumbing 7" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-14.jpg", alt: "IFHA 2nd rough plumbing 8" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-15.jpg", alt: "IFHA 2nd rough plumbing 9" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-16.jpg", alt: "IFHA 2nd rough plumbing 10" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-17.jpg", alt: "IFHA 2nd rough plumbing 11" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-18.jpg", alt: "IFHA 2nd rough plumbing 12" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-19.jpg", alt: "IFHA 2nd rough plumbing 13" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-20.jpg", alt: "IFHA 2nd rough plumbing 14" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-21.jpg", alt: "IFHA 2nd rough plumbing 15" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-22.jpg", alt: "IFHA 2nd rough plumbing 16" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-23.jpg", alt: "IFHA 2nd rough plumbing 17" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-24.jpg", alt: "IFHA 2nd rough plumbing 18" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-25.jpg", alt: "IFHA 2nd rough plumbing 19" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-26.jpg", alt: "IFHA 2nd rough plumbing 20" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-27.jpg", alt: "IFHA 2nd rough plumbing 21" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-28.jpg", alt: "IFHA 2nd rough plumbing 22" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-29.jpg", alt: "IFHA 2nd rough plumbing 23" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-30.jpg", alt: "IFHA 2nd rough plumbing 24" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-31.jpg", alt: "IFHA 2nd rough plumbing 25" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-32.jpg", alt: "IFHA 2nd rough plumbing 26" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-33.jpg", alt: "IFHA 2nd rough plumbing 27" },
          { src: "/images/projects/ifha-community-center/2nd-rough/photo-34.jpg", alt: "IFHA 2nd rough plumbing 28" },
        ],
      },
      {
        name: "Trim Out",
        slug: "trim-out",
        description:
          "Final fixture installation including sinks, faucets, toilets, and water heater connections.",
        images: [
          { src: "/images/projects/ifha-community-center/trim-out/photo-0.jpg", alt: "IFHA trim out plumbing 1" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-1.jpg", alt: "IFHA trim out plumbing 2" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-2.jpg", alt: "IFHA trim out plumbing 3" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-3.jpg", alt: "IFHA trim out plumbing 4" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-4.jpg", alt: "IFHA trim out plumbing 5" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-5.jpg", alt: "IFHA trim out plumbing 6" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-6.jpg", alt: "IFHA trim out plumbing 7" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-7.jpg", alt: "IFHA trim out plumbing 8" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-35.jpg", alt: "IFHA trim out plumbing 9" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-36.jpg", alt: "IFHA trim out plumbing 10" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-37.jpg", alt: "IFHA trim out plumbing 11" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-38.jpg", alt: "IFHA trim out plumbing 12" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-39.jpg", alt: "IFHA trim out plumbing 13" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-40.jpg", alt: "IFHA trim out plumbing 14" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-41.jpg", alt: "IFHA trim out plumbing 15" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-42.jpg", alt: "IFHA trim out plumbing 16" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-43.jpg", alt: "IFHA trim out plumbing 17" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-44.jpg", alt: "IFHA trim out plumbing 18" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-45.jpg", alt: "IFHA trim out plumbing 19" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-46.jpg", alt: "IFHA trim out plumbing 20" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-47.jpg", alt: "IFHA trim out plumbing 21" },
          { src: "/images/projects/ifha-community-center/trim-out/photo-48.jpg", alt: "IFHA trim out plumbing 22" },
        ],
      },
    ],
    metaTitle: "IFHA Community Center Plumbing Project",
    metaDescription:
      "See our complete plumbing installation for the IFHA Community Center new construction — underground, rough-in, and trim out phases by C&S Plumbing of Lee.",
  },
  {
    slug: "mangos-bathroom-remodel",
    name: "Mangos Restaurant & Bar Commercial Bathroom Remodel",
    client: "Mangos Restaurant & Bar",
    category: "Commercial Remodel",
    timeline: "2 months",
    cost: "$20K\u2013$25K",
    description:
      "Complete commercial bathroom remodel for Mangos Restaurant & Bar on North Captiva Island. C&S Plumbing handled the full scope from demolition of the existing restroom facilities through rough-in of all new supply and drain lines to final trim and fixture installation, delivering a modern, code-compliant restroom for this popular island destination.",
    location: "North Captiva Island, FL",
    coverImage: "/images/projects/mangos-bathroom-remodel/final/IMG_3409.jpeg",
    phases: [
      {
        name: "Finished Result",
        slug: "final",
        description:
          "The completed commercial bathroom remodel — modern fixtures, new plumbing throughout, and a clean, code-compliant restroom.",
        images: [
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3409.jpeg", alt: "Mangos bathroom remodel finished 1" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3410.jpeg", alt: "Mangos bathroom remodel finished 2" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3416.jpeg", alt: "Mangos bathroom remodel finished 3" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3425.jpeg", alt: "Mangos bathroom remodel finished 4" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3435.jpeg", alt: "Mangos bathroom remodel finished 5" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3437.jpeg", alt: "Mangos bathroom remodel finished 6" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3445.jpeg", alt: "Mangos bathroom remodel finished 7" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3448.jpeg", alt: "Mangos bathroom remodel finished 8" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3450.jpeg", alt: "Mangos bathroom remodel finished 9" },
          { src: "/images/projects/mangos-bathroom-remodel/final/IMG_3451.jpeg", alt: "Mangos bathroom remodel finished 10" },
        ],
      },
    ],
    metaTitle: "Mangos Restaurant Bathroom Remodel",
    metaDescription:
      "Commercial bathroom remodel for Mangos Restaurant & Bar on North Captiva Island by C&S Plumbing of Lee.",
  },
  {
    slug: "hangar-97-punta-gorda-airport",
    name: "Hangar 97 — Punta Gorda Airport (Commercial New Construction)",
    client: "Stellar Development",
    category: "Commercial New Construction",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "C&S Plumbing is the commercial plumbing contractor for Hangar 97, a new-construction aviation hangar at Punta Gorda Airport (PGD) built by Stellar Development. Below-slab underground rough-in is complete — supply, drain, waste, and vent piping set and inspected before the pour — and the building is now through second rough. Trim and finish phases will follow as the build progresses.",
    location: "Punta Gorda, FL",
    coverImage: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-10.jpg",
    phases: [
      {
        name: "Underground",
        slug: "underground",
        description: "Below-slab supply, drain, waste, and vent piping installed and inspected ahead of the slab pour for the new hangar.",
        images: [
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-1.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 1" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-2.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 2" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-3.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 3" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-4.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 4" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-5.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 5" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-6.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 6" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-7.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 7" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-8.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 8" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-9.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 9" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-10.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 10" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-11.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 11" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-12.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 12" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-13.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 13" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-14.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 14" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-15.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 15" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-16.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 16" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-17.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 17" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/underground/photo-18.jpg", alt: "Hangar 97 Punta Gorda Airport underground plumbing 18" },
        ],
      },
      {
        name: "Second Rough",
        slug: "2nd-rough",
        description: "In-wall and overhead rough-in — water supply, DWV, and fixture stub-outs run throughout the commercial structure.",
        images: [
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-1.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 1" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-2.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 2" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-3.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 3" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-4.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 4" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-5.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 5" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-6.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 6" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-7.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 7" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-8.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 8" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-9.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 9" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-10.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 10" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-11.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 11" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-12.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 12" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-13.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 13" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-14.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 14" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-15.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 15" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-16.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 16" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-17.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 17" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-18.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 18" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-19.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 19" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-20.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 20" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-21.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 21" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-22.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 22" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-23.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 23" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-24.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 24" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-25.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 25" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-26.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 26" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-27.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 27" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-28.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 28" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-29.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 29" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-30.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 30" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-31.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 31" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-32.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 32" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-33.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 33" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-34.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 34" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-35.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 35" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-36.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 36" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-37.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 37" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-38.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 38" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-39.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 39" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-40.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 40" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-41.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 41" },
          { src: "/images/projects/hangar-97-punta-gorda-airport/2nd-rough/photo-42.jpg", alt: "Hangar 97 Punta Gorda Airport second rough plumbing 42" },
        ],
      },
    ],
    scopeDetails: ["Underground DWV and supply rough-in","Second rough-in","Commercial new construction"],
    metaTitle: "Hangar 97 Punta Gorda Airport — Commercial New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee handles commercial plumbing for Hangar 97 at Punta Gorda Airport — underground rough-in through second rough for builder Stellar Development.",
  },
  {
    slug: "usps-cape-coral-remodel",
    name: "USPS Cape Coral — Commercial Remodel",
    client: "Engelke Construction Solutions, LLC",
    category: "Commercial Remodel",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "C&S Plumbing is the plumbing contractor on a commercial remodel of a U.S. Postal Service facility in Cape Coral, built by Engelke Construction Solutions, LLC. Scope covers full plumbing demolition, a water repipe, new rough-in, and fixture trim. Phase photos below run from demo through trim as the remodel progresses.",
    location: "Cape Coral, FL",
    coverImage: "/images/projects/usps-cape-coral-remodel/trim-out/photo-1.jpg",
    phases: [
      {
        name: "Demolition",
        slug: "demo",
        description: "Existing plumbing demolished and removed to prep the facility for the remodel.",
        images: [
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-1.jpg", alt: "USPS Cape Coral remodel demolition 1" },
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-2.jpg", alt: "USPS Cape Coral remodel demolition 2" },
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-3.jpg", alt: "USPS Cape Coral remodel demolition 3" },
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-4.jpg", alt: "USPS Cape Coral remodel demolition 4" },
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-5.jpg", alt: "USPS Cape Coral remodel demolition 5" },
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-6.jpg", alt: "USPS Cape Coral remodel demolition 6" },
          { src: "/images/projects/usps-cape-coral-remodel/demo/photo-7.jpg", alt: "USPS Cape Coral remodel demolition 7" },
        ],
      },
      {
        name: "Water Repipe",
        slug: "water-repipe",
        description: "New water distribution piping run to replace the building's aging supply lines.",
        images: [
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-1.jpg", alt: "USPS Cape Coral remodel water repipe 1" },
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-2.jpg", alt: "USPS Cape Coral remodel water repipe 2" },
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-3.jpg", alt: "USPS Cape Coral remodel water repipe 3" },
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-4.jpg", alt: "USPS Cape Coral remodel water repipe 4" },
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-5.jpg", alt: "USPS Cape Coral remodel water repipe 5" },
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-6.jpg", alt: "USPS Cape Coral remodel water repipe 6" },
          { src: "/images/projects/usps-cape-coral-remodel/water-repipe/photo-7.jpg", alt: "USPS Cape Coral remodel water repipe 7" },
        ],
      },
      {
        name: "Rough-In",
        slug: "rough-in",
        description: "New drain, waste, vent, and supply rough-in for the remodeled layout.",
        images: [
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-1.jpg", alt: "USPS Cape Coral remodel rough-in 1" },
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-2.jpg", alt: "USPS Cape Coral remodel rough-in 2" },
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-3.jpg", alt: "USPS Cape Coral remodel rough-in 3" },
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-4.jpg", alt: "USPS Cape Coral remodel rough-in 4" },
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-5.jpg", alt: "USPS Cape Coral remodel rough-in 5" },
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-6.jpg", alt: "USPS Cape Coral remodel rough-in 6" },
          { src: "/images/projects/usps-cape-coral-remodel/rough-in/photo-7.jpg", alt: "USPS Cape Coral remodel rough-in 7" },
        ],
      },
      {
        name: "Trim-Out",
        slug: "trim-out",
        description: "Finish fixtures set and final connections made.",
        images: [
          { src: "/images/projects/usps-cape-coral-remodel/trim-out/photo-1.jpg", alt: "USPS Cape Coral remodel trim-out 1" },
          { src: "/images/projects/usps-cape-coral-remodel/trim-out/photo-2.jpg", alt: "USPS Cape Coral remodel trim-out 2" },
        ],
      },
    ],
    scopeDetails: ["Plumbing demolition","Whole-building water repipe","Rough-in","Fixture trim-out"],
    metaTitle: "USPS Cape Coral Commercial Remodel",
    metaDescription: "C&S Plumbing of Lee handles demolition, water repipe, rough-in, and trim on a USPS facility remodel in Cape Coral for Engelke Construction Solutions.",
  },
  {
    slug: "1119-harvest-ave-lehigh-acres",
    name: "1119 Harvest Ave — New Construction (Lehigh Acres)",
    client: "Douglas Brookes",
    category: "New Construction",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "Full residential new-construction plumbing at 1119 Harvest Ave in Lehigh Acres for builder Douglas Brookes. C&S Plumbing set the below-slab underground supply and DWV, then completed the in-wall second rough. Trim and finish phases follow as the home is built out.",
    location: "Lehigh Acres, FL",
    coverImage: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-1.jpg",
    phases: [
      {
        name: "Underground",
        slug: "underground",
        description: "Below-slab supply and drain/waste/vent piping installed and inspected before the slab pour.",
        images: [
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/underground/photo-1.jpg", alt: "1119 Harvest Ave Lehigh Acres underground plumbing 1" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/underground/photo-2.jpg", alt: "1119 Harvest Ave Lehigh Acres underground plumbing 2" },
        ],
      },
      {
        name: "Second Rough",
        slug: "2nd-rough",
        description: "In-wall water supply, DWV, and fixture stub-outs roughed in throughout the home.",
        images: [
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-1.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 1" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-2.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 2" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-3.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 3" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-4.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 4" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-5.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 5" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-6.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 6" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-7.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 7" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-8.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 8" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-9.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 9" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-10.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 10" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-11.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 11" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-12.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 12" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-13.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 13" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-14.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 14" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-15.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 15" },
          { src: "/images/projects/1119-harvest-ave-lehigh-acres/2nd-rough/photo-16.jpg", alt: "1119 Harvest Ave Lehigh Acres second rough plumbing 16" },
        ],
      },
    ],
    scopeDetails: ["Underground rough-in","Second rough-in","Residential new construction"],
    metaTitle: "1119 Harvest Ave Lehigh Acres New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee handles new-construction plumbing at 1119 Harvest Ave in Lehigh Acres — underground rough-in through second rough for builder Douglas Brookes.",
  },
  {
    slug: "1026-halby-ave-lehigh-acres",
    name: "1026 Halby Ave — New Construction (Lehigh Acres)",
    client: "Douglas Brookes",
    category: "New Construction",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "Residential new-construction plumbing at 1026 Halby Ave in Lehigh Acres for builder Douglas Brookes. C&S Plumbing set the below-slab underground and completed the in-wall second rough; trim and finish phases follow as the build progresses.",
    location: "Lehigh Acres, FL",
    coverImage: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-1.jpg",
    phases: [
      {
        name: "Underground",
        slug: "underground",
        description: "Below-slab supply and drain/waste/vent piping installed ahead of the slab pour.",
        images: [
          { src: "/images/projects/1026-halby-ave-lehigh-acres/underground/photo-1.jpg", alt: "1026 Halby Ave Lehigh Acres underground plumbing 1" },
        ],
      },
      {
        name: "Second Rough",
        slug: "2nd-rough",
        description: "In-wall water supply, DWV, and fixture stub-outs roughed in throughout the home.",
        images: [
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-1.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 1" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-2.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 2" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-3.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 3" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-4.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 4" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-5.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 5" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-6.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 6" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-7.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 7" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-8.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 8" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-9.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 9" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-10.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 10" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-11.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 11" },
          { src: "/images/projects/1026-halby-ave-lehigh-acres/2nd-rough/photo-12.jpg", alt: "1026 Halby Ave Lehigh Acres second rough plumbing 12" },
        ],
      },
    ],
    scopeDetails: ["Underground rough-in","Second rough-in","Residential new construction"],
    metaTitle: "1026 Halby Ave Lehigh Acres New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee handles new-construction plumbing at 1026 Halby Ave in Lehigh Acres — underground through second rough for builder Douglas Brookes.",
  },
  {
    slug: "fema-home-punta-gorda",
    name: "FEMA Home Rebuild — New Construction (Punta Gorda)",
    client: "Draft Construction LLC",
    clientUrl: "https://www.draftconstructionswfl.com",
    category: "New Construction",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "C&S Plumbing is the plumbing contractor on a FEMA-compliant new-construction home rebuild in Punta Gorda, built by Draft Construction LLC. Below-slab underground supply and drain/waste/vent piping is installed and inspected. In-wall rough and trim phases follow as the rebuild continues.",
    location: "Punta Gorda, FL",
    coverImage: "/images/projects/fema-home-punta-gorda/underground/photo-1.jpg",
    phases: [
      {
        name: "Underground",
        slug: "underground",
        description: "Below-slab supply and DWV piping installed and inspected before the slab pour for the FEMA rebuild.",
        images: [
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-1.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 1" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-2.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 2" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-3.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 3" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-4.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 4" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-5.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 5" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-6.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 6" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-7.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 7" },
          { src: "/images/projects/fema-home-punta-gorda/underground/photo-8.jpg", alt: "FEMA home rebuild Punta Gorda underground plumbing 8" },
        ],
      },
    ],
    scopeDetails: ["Underground rough-in","FEMA-compliant new construction"],
    metaTitle: "FEMA Home Rebuild Punta Gorda — New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee handles new-construction plumbing on a FEMA-compliant home rebuild in Punta Gorda for builder Draft Construction LLC.",
  },
  {
    slug: "south-florida-christian-academy-bathroom-remodel",
    name: "South Florida Christian Academy — K-1 Bathroom Remodel",
    client: "McDaniel Construction",
    category: "Commercial Remodel",
    timeline: "In Progress",
    cost: "On Request",
    description:
      "C&S Plumbing is the plumbing contractor on a K-1 bathroom remodel at South Florida Christian Academy in Fort Myers, built by McDaniel Construction. Demolition of the existing fixtures and piping is complete; rough-in and trim phases follow as the remodel progresses.",
    location: "Fort Myers, FL",
    coverImage: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-1.jpg",
    phases: [
      {
        name: "Demolition",
        slug: "demo",
        description: "Existing fixtures and plumbing demolished to prep the K-1 bathrooms for the remodel.",
        images: [
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-1.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 1" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-2.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 2" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-3.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 3" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-4.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 4" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-5.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 5" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-6.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 6" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-7.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 7" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-8.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 8" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-9.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 9" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-10.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 10" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-11.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 11" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-12.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 12" },
          { src: "/images/projects/south-florida-christian-academy-bathroom-remodel/demo/photo-13.jpg", alt: "South Florida Christian Academy bathroom remodel demolition 13" },
        ],
      },
    ],
    scopeDetails: ["Plumbing demolition","Commercial bathroom remodel"],
    metaTitle: "South Florida Christian Academy Bathroom Remodel",
    metaDescription: "C&S Plumbing of Lee handles a K-1 bathroom remodel at South Florida Christian Academy in Fort Myers for builder McDaniel Construction.",
  },
  {
    slug: "decker-homes-punta-gorda",
    name: "Decker Homes — New Construction (Punta Gorda)",
    client: "Decker Homes",
    category: "New Construction",
    timeline: "Completed",
    cost: "On Request",
    description:
      "C&S Plumbing is the plumbing partner for a Decker Homes new-construction build in Punta Gorda. Work is underway with underground and rough-in plumbing; this page will be updated with photos from each phase as the build progresses.",
    location: "Punta Gorda, FL",
    coverImage: "/images/projects/decker-homes-punta-gorda/new-construction/photo-1.jpg",
    phases: [
      {
        name: "New Construction",
        slug: "new-construction",
        description: "Residential new-construction plumbing for a Decker Homes build in Punta Gorda.",
        images: [
          { src: "/images/projects/decker-homes-punta-gorda/new-construction/photo-1.jpg", alt: "Decker Homes Punta Gorda new construction plumbing 1" },
          { src: "/images/projects/decker-homes-punta-gorda/new-construction/photo-2.jpg", alt: "Decker Homes Punta Gorda new construction plumbing 2" },
          { src: "/images/projects/decker-homes-punta-gorda/new-construction/photo-3.jpg", alt: "Decker Homes Punta Gorda new construction plumbing 3" },
          { src: "/images/projects/decker-homes-punta-gorda/new-construction/photo-4.jpg", alt: "Decker Homes Punta Gorda new construction plumbing 4" },
        ],
      },
    ],
    scopeDetails: ["Residential new construction plumbing"],
    metaTitle: "Decker Homes Punta Gorda New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee is the plumbing partner for a Decker Homes new-construction build in Punta Gorda, Florida.",
  },
  {
    slug: "hansen-homes-1210-cape-coral",
    name: "Hansen Homes — 1210 Trim-Out (Cape Coral)",
    client: "Hansen Homes",
    clientUrl: "https://www.hansenhomes.net",
    category: "New Construction",
    timeline: "Completed",
    cost: "On Request",
    description:
      "C&S Plumbing handled the trim-out phase on a Hansen Homes new-construction build (1210) in Cape Coral — finish fixtures, water heater, and final connections set after rough-in and inspection. C&S is the plumbing partner across multiple Hansen Homes Cape Coral builds.",
    location: "Cape Coral, FL",
    coverImage: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-1.jpg",
    phases: [
      {
        name: "Trim-Out",
        slug: "trim-out",
        description: "Finish fixtures, water heater, and final connections set on the new-construction home.",
        images: [
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-1.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 1" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-2.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 2" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-3.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 3" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-4.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 4" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-5.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 5" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-6.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 6" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-7.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 7" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-8.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 8" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-9.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 9" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-10.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 10" },
          { src: "/images/projects/hansen-homes-1210-cape-coral/trim-out/photo-11.jpg", alt: "Hansen Homes 1210 Cape Coral new construction trim-out 11" },
        ],
      },
    ],
    scopeDetails: ["Fixture trim-out","Water heater set","Residential new construction"],
    metaTitle: "Hansen Homes 1210 Cape Coral New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee handled trim-out on a Hansen Homes new-construction build in Cape Coral — finish fixtures and final connections.",
  },
  {
    slug: "hansen-homes-2210-cape-coral",
    name: "Hansen Homes — 2210 Trim-Out (Cape Coral)",
    client: "Hansen Homes",
    clientUrl: "https://www.hansenhomes.net",
    category: "New Construction",
    timeline: "Completed",
    cost: "On Request",
    description:
      "C&S Plumbing handled the trim-out phase on a Hansen Homes new-construction build (2210) in Cape Coral — finish fixtures and final connections set after rough-in and inspection. C&S is the plumbing partner across multiple Hansen Homes Cape Coral builds.",
    location: "Cape Coral, FL",
    coverImage: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-1.jpg",
    phases: [
      {
        name: "Trim-Out",
        slug: "trim-out",
        description: "Finish fixtures and final connections set on the new-construction home.",
        images: [
          { src: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-1.jpg", alt: "Hansen Homes 2210 Cape Coral new construction trim-out 1" },
          { src: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-2.jpg", alt: "Hansen Homes 2210 Cape Coral new construction trim-out 2" },
          { src: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-3.jpg", alt: "Hansen Homes 2210 Cape Coral new construction trim-out 3" },
          { src: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-4.jpg", alt: "Hansen Homes 2210 Cape Coral new construction trim-out 4" },
          { src: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-5.jpg", alt: "Hansen Homes 2210 Cape Coral new construction trim-out 5" },
          { src: "/images/projects/hansen-homes-2210-cape-coral/trim-out/photo-6.jpg", alt: "Hansen Homes 2210 Cape Coral new construction trim-out 6" },
        ],
      },
    ],
    scopeDetails: ["Fixture trim-out","Residential new construction"],
    metaTitle: "Hansen Homes 2210 Cape Coral New Construction Plumbing",
    metaDescription: "C&S Plumbing of Lee handled trim-out on a Hansen Homes new-construction build in Cape Coral — finish fixtures and final connections.",
  },
];

// ============================================
// RECOMMENDED PARTNERS
// ============================================

export const PARTNERS: Partner[] = [
  {
    id: "draft-construction",
    name: "Draft Construction LLC",
    category: "General Contractor",
    description:
      "Licensed and insured general contractor in Cape Coral specializing in home remodeling, additions, roofing, flooring, and new construction across Southwest Florida.",
    phone: "239-266-5921",
    website: "https://www.draftconstructionswfl.com",
    image: "/images/partners/draft-construction.png",
  },
  {
    id: "deep-blue-air",
    name: "Deep Blue Air & Water",
    category: "HVAC",
    description:
      "Family-owned AC and plumbing contractor serving Southwest Florida since 2013. Residential and commercial cooling, ductwork, and 24/7 emergency service. 4.9 stars with 500+ reviews.",
    phone: "239-465-2053",
    website: "https://www.calldeepblue.com",
    image: "/images/partners/deep-blue-air.jpg",
  },
  {
    id: "fabritech-screens",
    name: "Fabri-Tech Screen Enclosures",
    category: "Screen Enclosures",
    description:
      "Fort Myers\u2019 go-to for pool rescreening and aluminum fabrication. Quality screen enclosures, lanai builds, and rescreening services for residential properties.",
    phone: "239-722-5565",
    website: "https://www.fabritechscreens.com",
    image: "/images/partners/fabritech.png",
  },
  {
    id: "superior-plumbing",
    name: "Superior Plumbing Solutions",
    category: "Plumbing & Water Treatment",
    description:
      "Our go-to for well and water filtration work. Award-winning plumbing and water treatment authority serving Cape Coral and SWFL. 5.0 stars with 559+ reviews.",
    phone: "239-292-0651",
    website: "https://superiorplumbingflorida.com",
    image: "/images/partners/superior-plumbing.jpeg",
  },
  {
    id: "petros-construction",
    name: "Petros Construction Inc.",
    category: "Concrete",
    description:
      "Over 35 years of concrete expertise in Cape Coral. Foundations, driveways, pool decks, commercial slabs, home additions, and boom pump services built to last.",
    phone: "239-851-8401",
    website: "https://petrosconstructioninc.com",
    image: "/images/partners/petros.webp",
  },
  {
    id: "tonys-pest",
    name: "Tony\u2019s Pest Control",
    category: "Pest Control",
    description:
      "Locally-owned pest control with 42 years of experience in Cape Coral. Residential and commercial pest, termite, rodent, and lawn care services across Southwest Florida. 4.8 stars with 347+ reviews.",
    phone: "239-574-2847",
    website: "https://tonyspest.com",
    image: "/images/partners/tonys-pest.webp",
  },
  {
    id: "advanced-pest",
    name: "Advanced Pest Control of SWFL",
    category: "Pest Control",
    description:
      "Voted Best in Cape Coral since 1991. Full-service pest, rodent, termite, and lawn care for all of Lee County. Family-owned and operated with over 30 years of trusted service.",
    phone: "239-772-4444",
    website: "https://www.advancedpestfl.com",
    image: "/images/partners/advanced-pest.png",
  },
  {
    id: "randr-sprinkler",
    name: "R & R Sprinkler & Landscaping",
    category: "Irrigation & Landscaping",
    description:
      "Family-owned since 1972 with 50+ years serving Cape Coral and Fort Myers. Irrigation design, installation, and repair plus full landscaping, hardscaping, and backflow certification.",
    phone: "239-772-2607",
    website: "https://www.randrsprinkler.com",
    image: "/images/partners/randr-sprinkler.png",
  },
  {
    id: "barnes-pools",
    name: "Barnes Pools",
    category: "Pool Construction",
    description:
      "One of the largest and most respected pool builders in Lee and Collier Counties since 1982. Custom gunite pools, spas, renovations, and a dedicated repair department.",
    phone: "239-433-5575",
    website: "https://barnespools.net",
    image: "/images/partners/barnes-pools.jpg",
  },
];

// ============================================
// COASTAL COMEBACK PLAN (Snowbird Plumbing Protection)
// ============================================

export const COASTAL_COMEBACK_FAQS = [
  {
    question: "What's actually included in the pre-departure visit?",
    answer:
      "A licensed C&S technician walks your home before you leave: shuts off the main water supply, drains key fixtures, inspects exposed supply lines, tests every shut-off valve, checks the water heater for corrosion or leaks, flushes drain traps to prevent dry-out smells, and leaves you with a written report. The goal is a vacant home that won't leak, smell, or surprise you.",
  },
  {
    question: "Do you serve my city?",
    answer:
      "Yes — the Coastal Comeback Plan is available across our full SWFL service area: Cape Coral, Fort Myers, North Fort Myers, Naples, Bonita Springs, Estero, Lehigh Acres, and Sanibel. If you're in Lee or Collier County, we've got you covered.",
  },
  {
    question: "What if you find a problem while I'm gone?",
    answer:
      "We call you immediately with photos and a clear quote. Nothing happens without your approval — except a true emergency (active leak, burst pipe), where we'll shut things down to stop damage and call you within minutes. Coastal Shield and Smart members get priority dispatch and 10% off any repairs we make during the season.",
  },
  {
    question: "Can I add this to a property I rent on Airbnb?",
    answer:
      "Absolutely — short-term rental owners are a perfect fit. The Coastal Smart tier is built for multi-property and STR managers, with smart leak detector installation and monthly remote monitoring so you know about a problem before your guests do.",
  },
  {
    question: "Is this a contract? Can I cancel?",
    answer:
      "It's an annual plan, not a long-term contract. You can cancel any time and we'll refund the unused portion. No cancellation fees, no auto-renewal traps.",
  },
  {
    question: "How is this different from a home watch service?",
    answer:
      "Home watch services are great generalists — they look for obvious problems. We're licensed plumbers (CFC1432485 / CFC057076), so we actually shut down, drain, inspect, and fix the plumbing system. Many of our snowbird customers use both: a home watch service for general property checks, and the Coastal Comeback Plan specifically for plumbing.",
  },
];
