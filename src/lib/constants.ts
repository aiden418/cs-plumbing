import type { Service, TeamMember, Testimonial, TimelineEvent, NavLink, Stat, ServiceLanding, AreaLanding } from "./types";

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
      { label: "Repiping", href: "/services/repiping" },
      { label: "Water Heaters", href: "/services/water-heaters" },
      { label: "Drain Cleaning", href: "/services/drain-cleaning" },
      { label: "Leak Repair", href: "/services/leak-repair" },
      { label: "Water Softeners", href: "/services/water-softeners" },
      { label: "Plumbing Remodels", href: "/services/plumbing-remodel" },
    ],
  },
  {
    label: "Service Areas",
    href: "/areas/cape-coral",
    children: [
      { label: "Cape Coral", href: "/areas/cape-coral" },
      { label: "Fort Myers", href: "/areas/fort-myers" },
      { label: "North Fort Myers", href: "/areas/north-fort-myers" },
      { label: "Naples", href: "/areas/naples" },
      { label: "Bonita Springs", href: "/areas/bonita-springs" },
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
    image: "/images/team/samuel.jpeg",
    bio: "Leading C&S Plumbing with the same dedication and family values his father instilled since 1997.",
  },
  {
    name: "Aiden Pellechio",
    role: "Operations Manager",
    image: "/images/team/aiden.jpg",
    bio: "Keeping the family legacy running smoothly with expert operations management and a construction management background from FGCU.",
  },
  {
    name: "Dylan Redecker",
    role: "Lead Plumber",
    image: "/images/team/dylan.jpeg",
    bio: "Bringing hands-on expertise and dedication to every job site across Southwest Florida.",
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
// SERVICE LANDING PAGES
// ============================================

export const SERVICE_LANDINGS: ServiceLanding[] = [
  {
    slug: "repiping",
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
          "PEX piping comes with a manufacturer's lifetime warranty. Combined with our workmanship guarantee, your investment is fully protected.",
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
          "Yes, every C&S Plumbing repipe job includes full permitting and final inspection by Lee County. This ensures your repiping is code-compliant and protects your home's value. Our license number is CFC1430355.",
      },
    ],
    priceRange: "$4,000 – $15,000",
    highlights: [
      "8,500+ homes repiped & plumbed",
      "1-2 day completion for most homes",
      "Copper & PEX options available",
      "Full permit & inspection included",
      "Minimal wall damage guaranteed",
      "Licensed & insured (CFC1430355)",
      "Free estimates with upfront pricing",
      "Lifetime warranty on PEX piping",
      "Serving all of Southwest Florida",
    ],
  },
  {
    slug: "water-heaters",
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
          "Water heater costs in Cape Coral range from $800 for a basic repair to $3,500+ for a tankless installation. Traditional tank replacements typically run $1,200-$2,000 installed. C&S Plumbing provides free estimates.",
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
    ],
    priceRange: "$800 – $3,500+",
    highlights: [
      "Same-day service available",
      "All brands installed & serviced",
      "Tankless, tank & hybrid options",
      "Energy efficiency upgrades",
      "Upfront pricing, no surprises",
      "Licensed & insured (CFC1430355)",
      "Free estimates",
      "Warranty on all installations",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
  },
  {
    slug: "drain-cleaning",
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
    ],
    priceRange: "$150 – $500",
    highlights: [
      "Same-day service available",
      "Hydro-jetting technology",
      "Camera inspection included",
      "Root intrusion specialists",
      "All drain types serviced",
      "Licensed & insured (CFC1430355)",
      "Upfront pricing",
      "Preventive maintenance plans",
      "24/7 emergency service",
    ],
  },
  {
    slug: "leak-repair",
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
    ],
    priceRange: "$150 – $800+",
    highlights: [
      "24/7 emergency response",
      "Electronic leak detection",
      "Slab leak specialists",
      "Non-destructive methods",
      "Fast, same-day service",
      "Licensed & insured (CFC1430355)",
      "Free estimates",
      "All pipe types repaired",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
  },
  {
    slug: "water-softeners",
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
      "Licensed & insured (CFC1430355)",
      "Maintenance plans available",
      "Upfront pricing",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
  },
  {
    slug: "plumbing-remodel",
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
      "Licensed & insured (CFC1430355)",
      "Coordinates with contractors",
      "Free estimates",
      "Serving Cape Coral, Fort Myers & SWFL",
    ],
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
    metaTitle: "Plumber in Cape Coral, FL | C&S Plumbing of Lee County",
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
    localContext:
      "Cape Coral's unique canal system and waterfront properties require plumbers who understand the area's specific challenges. From salt-air corrosion on outdoor plumbing to the hard water that's common throughout the Cape, C&S Plumbing has the local expertise to keep your home's plumbing running smoothly. We've repiped thousands of Cape Coral homes built in the 1970s-1990s that still have original polybutylene or galvanized pipes.",
  },
  {
    slug: "fort-myers",
    city: "Fort Myers",
    state: "FL",
    metaTitle: "Plumber in Fort Myers, FL | C&S Plumbing of Lee County",
    metaDescription:
      "Expert plumber in Fort Myers, FL. Residential & commercial plumbing, emergency service, repiping, water heaters. 27+ years serving SWFL. Call 833-PLUMB-IT.",
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
    localContext:
      "Fort Myers is the commercial hub of Lee County, and C&S Plumbing serves both its residential neighborhoods and thriving business community. Whether you're a homeowner in McGregor needing a water heater replacement or a restaurant on Cleveland Avenue needing grease trap service, we have the team and equipment to handle it. Our proximity to Fort Myers means fast response times for emergencies.",
  },
  {
    slug: "north-fort-myers",
    city: "North Fort Myers",
    state: "FL",
    metaTitle: "Plumber in North Fort Myers, FL | C&S Plumbing — Our Hometown",
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
    localContext:
      "North Fort Myers is our home. C&S Plumbing's office is located at 951 Pondella Rd, and many of our team members live right here in the community. That means the fastest response times in the area — often under 30 minutes for emergencies. We've plumbed hundreds of homes in North Fort Myers and understand the specific needs of properties in this area, from older homes near the river to newer construction east of I-75.",
  },
  {
    slug: "naples",
    city: "Naples",
    state: "FL",
    metaTitle: "Plumber in Naples, FL | C&S Plumbing of Lee County",
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
      "C&S Plumbing extends our 27+ years of expertise to Naples and Collier County. From luxury home plumbing to emergency repairs, we deliver the same quality and reliability that's made us Southwest Florida's most trusted plumber.",
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
    localContext:
      "Naples homeowners expect the highest quality — and C&S Plumbing delivers. We have extensive experience with Naples' luxury homes, including custom plumbing installations, high-end fixture work, and whole-home repiping for older properties in neighborhoods like Old Naples and Park Shore. Our licensed team handles everything from routine maintenance to complex renovations with the attention to detail Naples residents deserve.",
  },
  {
    slug: "bonita-springs",
    city: "Bonita Springs",
    state: "FL",
    metaTitle: "Plumber in Bonita Springs, FL | C&S Plumbing of Lee County",
    metaDescription:
      "Reliable plumber in Bonita Springs, FL. Repiping, water heaters, drain cleaning, emergency service. 27+ years in SWFL. Call 833-PLUMB-IT.",
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
    localContext:
      "Bonita Springs sits at the crossroads of Lee and Collier County, and C&S Plumbing is ideally located to serve this growing community quickly. Many Bonita Springs homes, especially in established communities like Bonita Bay and Pelican Landing, are reaching the age where repiping and water heater replacement become necessary. We understand the HOA requirements and community standards that come with working in these neighborhoods.",
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
