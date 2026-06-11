import type { ServiceCityLanding } from "./types";

const TRUST_BADGES = [
  "Licensed & Insured (CFC1432485)",
  "Best of Cape Coral 2025",
  "Top 4% FL Contractor",
  "5-Star Rated",
];

const CAPE_CORAL_NEIGHBORHOODS = [
  "SW Cape Coral",
  "NW Cape Coral",
  "SE Cape Coral",
  "Pelican",
  "Cape Harbour",
  "Burnt Store",
  "Yacht Club",
  "Tarpon Point",
];

const FORT_MYERS_NEIGHBORHOODS = [
  "Downtown Fort Myers",
  "River District",
  "Gateway",
  "Iona",
  "McGregor",
  "Whiskey Creek",
  "Villas",
  "Page Park",
];

const PUNTA_GORDA_NEIGHBORHOODS = [
  "Punta Gorda Isles",
  "Burnt Store Isles",
  "Historic District",
  "Burnt Store Meadows",
  "Seminole Lakes",
  "Charlotte Park",
  "Solana",
  "Charlotte Harbor",
];

const PORT_CHARLOTTE_NEIGHBORHOODS = [
  "Murdock",
  "Parkside",
  "Deep Creek",
  "Harbour Heights",
  "Gulf Cove",
  "El Jobean",
  "Charlotte Harbor",
  "Midway",
];

export const SERVICE_CITY_LANDINGS: ServiceCityLanding[] = [
  // ============================================
  // 1. EMERGENCY PLUMBER - CAPE CORAL
  // ============================================
  {
    slug: "emergency-plumber-cape-coral",
    metaTitle: "Emergency Plumber Cape Coral | 24/7 Service",
    metaDescription:
      "24/7 emergency plumber in Cape Coral, FL. Burst pipes, slab leaks & flooding repair. Licensed CFC1432485, 5-star rated. Call 833-PLUMB-IT now for fast response.",
    keywords: [
      "emergency plumber Cape Coral",
      "24 hour plumber Cape Coral FL",
      "burst pipe repair Cape Coral",
      "slab leak emergency Cape Coral",
      "after hours plumber Cape Coral",
      "emergency plumbing service Cape Coral",
      "flood damage plumber Cape Coral",
      "Cape Coral plumbing emergency",
      "weekend plumber Cape Coral",
      "hurricane plumbing repair Cape Coral",
    ],
    h1: "Emergency Plumber in Cape Coral, FL",
    sectionHeading: "How we handle plumbing emergencies in Cape Coral",
    heroSubtext:
      "Water damage doubles every hour. C&S Plumbing responds to Cape Coral emergencies 24/7 with licensed master plumbers who know your canal-lot home inside and out.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Cape Coral's 400+ miles of navigable canals make it one of the most unique cities in Florida — and one of the most challenging for residential plumbing. Canal-lot homes sit on sandy, water-saturated soil that shifts with the tides and seasonal rains, placing constant stress on underground supply lines and drain pipes. When a pipe fails at 2 AM, the damage compounds fast.\n\nC&S Plumbing of Lee has been the emergency plumber Cape Coral homeowners trust since 1998. Our dispatch team is available around the clock, and because we're based right here in Lee County, our trucks reach most Cape Coral neighborhoods in under 45 minutes — whether you're in SW Cape Coral near Surfside or up by Burnt Store Road.\n\nSaltwater intrusion and high chloride levels in Cape Coral's soil accelerate corrosion on copper supply lines, especially in homes built between 1978 and 1995 that may also have polybutylene pipes. These failures don't wait for business hours. A pinhole leak behind a wall can dump hundreds of gallons before you notice the stain on your drywall. Our emergency crews arrive equipped with electronic leak detection, pipe cameras, and the materials to perform same-night repairs.\n\nHurricane season brings its own set of emergencies — from shifting soil that cracks underground lines to storm surge forcing debris into drain systems. C&S has responded to every major storm event in Lee County since Hurricane Charley in 2004, and our crews are trained in post-storm plumbing triage that prioritizes safety and prevents secondary water damage.\n\nWhen you call 833-PLUMB-IT, you're not getting a call center. You're reaching a family-owned company with two active state licenses (CFC057076 and CFC1432485) and a 5.0 Google rating from 75+ Cape Coral and Fort Myers homeowners. We quote before we start — even at midnight.`,
    features: [
      {
        title: "45-Minute Average Response",
        description:
          "Our Cape Coral trucks are staged across the city so we reach your home fast, day or night.",
      },
      {
        title: "Electronic Leak Detection",
        description:
          "Pinpoint slab leaks and hidden pipe failures without tearing up your floors using acoustic and thermal imaging technology.",
      },
      {
        title: "Burst Pipe Isolation & Repair",
        description:
          "We isolate the break, stop the water, and complete permanent repairs the same visit — no temporary patches.",
      },
      {
        title: "Upfront Emergency Pricing",
        description:
          "Written quotes before work begins, even on after-hours calls. No surprise overtime charges.",
      },
      {
        title: "Hurricane & Storm Damage Response",
        description:
          "Trained in post-storm plumbing triage including backflow prevention, sewer line clearing, and flood shutoff.",
      },
    ],
    city: "Cape Coral",
    state: "FL",
    neighborhoods: CAPE_CORAL_NEIGHBORHOODS,
    faqs: [
      {
        question: "How fast can an emergency plumber get to my Cape Coral home?",
        answer:
          "C&S Plumbing averages 30–45 minutes for emergency calls within Cape Coral city limits. We stage trucks in both the SW and NW quadrants of the city to minimize response times, and our dispatch line at 833-PLUMB-IT is staffed 24/7/365.",
      },
      {
        question: "What counts as a plumbing emergency in Cape Coral?",
        answer:
          "Any situation causing active water damage or posing a health risk qualifies: burst pipes, slab leaks flooding your home, sewage backups, gas line leaks, no hot water in winter, or a main water line break. If you're unsure, call us — we'll help you assess the situation over the phone at no charge.",
      },
      {
        question: "Do you charge extra for nights and weekends in Cape Coral?",
        answer:
          "We provide a flat diagnostic fee for emergency calls regardless of the time or day. All repair costs are quoted upfront before we begin any work. There are no hidden overtime surcharges — the price we quote is the price you pay.",
      },
      {
        question: "Why do Cape Coral homes have so many pipe emergencies?",
        answer:
          "Cape Coral's unique geography creates several plumbing risk factors: high chloride content in the soil corrodes copper pipes, the sandy canal-adjacent soil shifts and stresses underground lines, and many homes built in the 1980s–1990s still have polybutylene supply lines that are prone to sudden failure. These factors combine to make Cape Coral one of the highest-demand markets for emergency plumbing in Southwest Florida.",
      },
      {
        question: "Can you help with water damage after a pipe burst in Cape Coral?",
        answer:
          "Yes. We stop the leak and perform the plumbing repair, and we also offer water damage restoration services for plumbing-caused damage. We can extract standing water, dry the affected area, and coordinate with your insurance company. For extensive damage, we partner with trusted local restoration contractors to get your home back to normal.",
      },
      {
        question: "Are you licensed for emergency plumbing work in Cape Coral?",
        answer:
          "Absolutely. C&S Plumbing holds two active Florida state plumbing contractor licenses: CFC057076 and CFC1432485. We are fully insured and bonded, and we've been serving Cape Coral since 1998. You can verify our licenses on the Florida DBPR website.",
      },
    ],
    relatedPages: [
      { label: "Repiping in Cape Coral", href: "/repiping-cape-coral" },
      { label: "Water Damage Repair in Cape Coral", href: "/water-damage-repair-cape-coral" },
      { label: "Cape Coral Service Area", href: "/areas/cape-coral" },
    ],
  },

  // ============================================
  // 2. EMERGENCY PLUMBER - FORT MYERS
  // ============================================
  {
    slug: "emergency-plumber-fort-myers",
    metaTitle: "Emergency Plumber Fort Myers | 24/7 Repairs",
    metaDescription:
      "24/7 emergency plumber in Fort Myers, FL. Fast response for burst pipes, sewer backups & slab leaks. Licensed, 5-star rated. Call 833-PLUMB-IT for immediate help.",
    keywords: [
      "emergency plumber Fort Myers",
      "24 hour plumber Fort Myers FL",
      "burst pipe repair Fort Myers",
      "slab leak emergency Fort Myers",
      "after hours plumber Fort Myers",
      "emergency plumbing Fort Myers Florida",
      "sewage backup Fort Myers",
      "Fort Myers plumbing emergency",
      "weekend plumber Fort Myers FL",
      "night plumber Fort Myers",
    ],
    h1: "Emergency Plumber in Fort Myers, FL",
    sectionHeading: "How we handle plumbing emergencies in Fort Myers",
    heroSubtext:
      "Every minute of delay means more water damage. C&S Plumbing's licensed emergency crews are dispatched across Fort Myers 24/7 — call 833-PLUMB-IT now.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Fort Myers presents a diverse plumbing landscape that keeps our emergency team busy year-round. The historic River District and downtown neighborhoods feature homes dating back to the early 1900s with original galvanized steel and cast iron plumbing that can fail without warning. Meanwhile, newer developments in Gateway and along Daniels Parkway have their own issues — builder-grade CPVC connections that crack under Florida's heat cycling and expansive clay soil that shifts during the wet season.\n\nC&S Plumbing of Lee has been Fort Myers' emergency plumbing lifeline since 1998. Our North Fort Myers headquarters puts us within a short drive of every Fort Myers neighborhood, from the bungalows along McGregor Boulevard to the townhomes in Whiskey Creek. When a cast iron drain line collapses under a 1960s ranch home in Villas at 3 AM, we have the equipment and expertise to diagnose, excavate, and replace the failed section before sunrise.\n\nThe Caloosahatchee River corridor brings its own challenges. Homes along the river and in the Iona area deal with high water tables that put constant hydrostatic pressure on foundation slabs, leading to slab leak emergencies that require specialized detection equipment. Our crews use acoustic leak detection and thermal imaging to find the exact failure point without unnecessary demolition.\n\nFort Myers also faces unique storm risks. The city's low elevation and proximity to the Caloosahatchee mean that heavy rain events can overwhelm drainage systems and force sewage backups into homes. C&S maintains emergency pumping equipment and backflow prevention devices on every truck so we can protect your home even during active weather events.\n\nWith 8,500+ homes built and serviced across Lee County, our plumbers have firsthand knowledge of the piping systems, soil conditions, and construction methods specific to every Fort Myers subdivision. That experience means faster diagnoses and permanent fixes — not temporary patches that fail again next month.`,
    features: [
      {
        title: "Rapid Fort Myers Dispatch",
        description:
          "Trucks staged across Fort Myers for fast response to Downtown, Gateway, McGregor, Iona, and surrounding neighborhoods.",
      },
      {
        title: "Cast Iron & Galvanized Pipe Experts",
        description:
          "Specialized in the older piping systems found throughout Fort Myers' historic neighborhoods and mid-century homes.",
      },
      {
        title: "Slab Leak Detection & Repair",
        description:
          "Non-invasive acoustic and thermal detection technology locates leaks under your foundation without unnecessary demolition.",
      },
      {
        title: "Sewer Backup Emergency Service",
        description:
          "Emergency pumping, drain clearing, and backflow prevention to protect your home during heavy rain events and system failures.",
      },
      {
        title: "Insurance Documentation",
        description:
          "We photograph all damage, provide detailed invoices, and work directly with your insurance adjuster to streamline claims.",
      },
    ],
    city: "Fort Myers",
    state: "FL",
    neighborhoods: FORT_MYERS_NEIGHBORHOODS,
    faqs: [
      {
        question: "How quickly can you reach a plumbing emergency in Fort Myers?",
        answer:
          "Our average response time in Fort Myers is 30–45 minutes. We're headquartered in North Fort Myers and maintain trucks positioned throughout the Fort Myers metro area. Call 833-PLUMB-IT and our dispatcher will give you an accurate ETA based on current crew locations.",
      },
      {
        question: "Do older Fort Myers homes need different emergency plumbing care?",
        answer:
          "Yes. Homes in the River District, McGregor corridor, and other historic Fort Myers neighborhoods often have galvanized steel supply lines and cast iron drain pipes that require specialized repair techniques. Our plumbers carry transition fittings, no-hub couplings, and other materials specific to older plumbing systems so we can make permanent repairs on the first visit.",
      },
      {
        question: "What should I do while waiting for an emergency plumber in Fort Myers?",
        answer:
          "Turn off the main water shutoff valve (usually near the front of the house at ground level or by the water meter). If the emergency involves a sewer backup, avoid using any fixtures. If water is near electrical outlets or appliances, turn off the breaker to that area. Our dispatcher will walk you through these steps when you call 833-PLUMB-IT.",
      },
      {
        question: "Can you handle sewer backups caused by Fort Myers flooding?",
        answer:
          "Absolutely. Fort Myers' low elevation makes sewer backups during heavy rain events a common emergency. Our trucks carry portable pumping equipment and we can install backflow prevention valves to protect your home. We also clear root intrusion and debris blockages that cause backups unrelated to weather.",
      },
      {
        question: "Do you work with Fort Myers homeowner insurance for emergency repairs?",
        answer:
          "Yes. We document all emergency work with photos, provide detailed repair invoices, and can communicate directly with your insurance adjuster. Most homeowner policies cover sudden plumbing failures like burst pipes and slab leaks. We help you file correctly to maximize your coverage.",
      },
      {
        question: "What emergency plumbing services do you offer in Fort Myers?",
        answer:
          "Our Fort Myers emergency services include burst pipe repair, slab leak detection and repair, sewer line backups, water heater failures, gas line leaks, main water line breaks, toilet overflows, and post-storm plumbing damage. If water is going where it shouldn't, call 833-PLUMB-IT.",
      },
    ],
    relatedPages: [
      { label: "Repiping in Fort Myers", href: "/repiping-fort-myers" },
      { label: "Water Damage Repair in Fort Myers", href: "/water-damage-repair-fort-myers" },
      { label: "Fort Myers Service Area", href: "/areas/fort-myers" },
    ],
  },

  // ============================================
  // 3. REPIPING - CAPE CORAL
  // ============================================
  {
    slug: "repiping-cape-coral",
    metaTitle: "Repiping Cape Coral | Whole-Home Pipe Replacement",
    metaDescription:
      "Cape Coral whole-home repiping from $4,000. Replace polybutylene & corroded copper pipes. 8,500+ homes completed. Licensed CFC1432485. Free estimates — call today.",
    keywords: [
      "repiping Cape Coral",
      "whole house repiping Cape Coral FL",
      "polybutylene pipe replacement Cape Coral",
      "copper repiping Cape Coral",
      "Cape Coral repipe cost",
      "CPVC repiping Cape Coral",
      "pipe replacement Cape Coral Florida",
      "repipe specialist Cape Coral",
      "Cape Coral plumber repiping",
      "home repiping service Cape Coral",
    ],
    h1: "Whole-Home Repiping in Cape Coral, FL",
    sectionHeading: "What whole-home repiping looks like in Cape Coral",
    heroSubtext:
      "Cape Coral's soil eats copper pipes. C&S Plumbing has repiped thousands of canal-lot homes since 1998 — get a free estimate on modern, corrosion-proof piping today.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Cape Coral has a repiping problem that most mainland Florida cities don't face. The combination of high chloride content in the soil, calcium-heavy municipal water, and the sandy, shifting ground around the canal system creates a uniquely hostile environment for residential plumbing. If your home was built between 1978 and 1995, there's a strong chance it has polybutylene (poly-B) supply lines — a material that the industry has since abandoned because it becomes brittle and cracks from the inside out when exposed to chlorinated water over time.\n\nEven homes with copper pipes aren't immune. Cape Coral's soil chloride levels cause pinhole corrosion that starts from the outside in, slowly weakening pipes until they fail. CPVC, commonly used in homes built from the late 1990s through the 2010s, is also showing premature failures in Cape Coral — the combination of heat exposure in uninsulated attic runs and chemical interaction with certain fittings leads to cracking at joints.\n\nC&S Plumbing of Lee has repiped more Cape Coral homes than we can count across our 28 years in business. We've completed over 8,500 home builds and countless repipe projects, giving us unmatched knowledge of how plumbing systems behave in Cape Coral's specific conditions. Our repipe process uses PEX-A tubing for supply lines — a flexible, corrosion-proof material with a 25-year warranty that handles Cape Coral's water chemistry without degradation.\n\nA typical Cape Coral whole-home repipe takes 1–2 days for a standard 3/2 home. We protect your floors and walls with drop cloths, patch all access points, and pressure-test the new system before turning your water back on. Our price range of $4,000–$12,000 depends on home size, number of fixtures, and whether we're replacing drain lines as well as supply lines.\n\nMany Cape Coral homeowners don't realize they need a repipe until the symptoms pile up: discolored water, low pressure at multiple fixtures, recurring pinhole leaks, or a spike in their water bill from hidden leaks. If you're seeing any of these signs, a free C&S inspection can tell you exactly what's going on inside your walls.`,
    features: [
      {
        title: "PEX-A Supply Lines",
        description:
          "We install expansion-style PEX-A tubing that resists Cape Coral's chloride-heavy water and provides superior flow rates over copper or CPVC.",
      },
      {
        title: "1–2 Day Completion",
        description:
          "Most Cape Coral 3/2 homes are fully repiped in one to two days with minimal disruption to your daily routine.",
      },
      {
        title: "Polybutylene Replacement Specialists",
        description:
          "We've replaced poly-B pipes in thousands of Cape Coral homes built in the 1980s and 1990s. We know exactly where these systems fail first.",
      },
      {
        title: "Full Drywall & Paint Restoration",
        description:
          "All wall and ceiling access points are patched, textured, and painted to match your existing finish — included in our repipe price.",
      },
      {
        title: "25-Year Pipe Warranty",
        description:
          "PEX-A manufacturer warranty plus C&S workmanship guarantee covers your new plumbing system for decades.",
      },
      {
        title: "Free Repipe Inspection",
        description:
          "We'll inspect your current piping, identify material types, and provide a detailed written estimate at no charge.",
      },
    ],
    city: "Cape Coral",
    state: "FL",
    neighborhoods: CAPE_CORAL_NEIGHBORHOODS,
    faqs: [
      {
        question: "How much does it cost to repipe a house in Cape Coral?",
        answer:
          "A whole-home repipe in Cape Coral typically costs between $4,000 and $12,000 depending on the size of your home, number of bathrooms, and whether you're replacing supply lines only or both supply and drain lines. A standard 3-bedroom, 2-bathroom Cape Coral home with supply-only repipe usually falls in the $4,500–$7,000 range. We provide free in-home estimates with exact pricing.",
      },
      {
        question: "How do I know if my Cape Coral home needs repiping?",
        answer:
          "Common signs include: discolored or rusty water, recurring pinhole leaks (especially if you've had more than two in the past year), low water pressure at multiple fixtures, visible corrosion on exposed pipes, unexplained increases in your water bill, and if your home was built between 1978 and 1995 with polybutylene pipes. Any of these warrants a free inspection from C&S Plumbing.",
      },
      {
        question: "What type of pipes do you use for repiping in Cape Coral?",
        answer:
          "We primarily use PEX-A (cross-linked polyethylene) for supply lines because it's the best material for Cape Coral's water conditions. PEX-A is immune to the chloride corrosion that destroys copper in Cape Coral soil, it's flexible enough to handle ground movement near canals, and it doesn't suffer from the brittleness issues that affect CPVC. For drain lines, we use Schedule 40 PVC.",
      },
      {
        question: "How long does a whole-home repipe take in Cape Coral?",
        answer:
          "Most Cape Coral homes (up to 2,500 sq ft) are completed in 1–2 days. Larger homes or those requiring drain line replacement may take 2–3 days. We'll give you an exact timeline during your free estimate. Your water is typically off for 4–6 hours during the main installation day, and we coordinate with you to minimize inconvenience.",
      },
      {
        question: "Do I need a permit to repipe my Cape Coral home?",
        answer:
          "Yes. The City of Cape Coral requires a plumbing permit for whole-home repiping. C&S Plumbing handles all permit applications and inspections as part of our repipe service — there's no extra charge and no hassle on your end. We have strong working relationships with Cape Coral building inspectors and know exactly what they require for approval.",
      },
      {
        question: "Will repiping damage my walls and floors?",
        answer:
          "We make small, strategic access openings in walls and ceilings to route new pipes. All access points are patched, textured, and painted to match your existing finish as part of our standard repipe package. We protect your floors with drop cloths and shoe covers throughout the project. Most homeowners are surprised at how minimal the disruption is.",
      },
      {
        question: "Why is polybutylene piping so common in Cape Coral?",
        answer:
          "Cape Coral experienced a massive building boom in the 1980s and early 1990s, which coincided with the peak use of polybutylene piping nationwide. Tens of thousands of Cape Coral homes were built with poly-B supply lines during this period. The material was later found to degrade from the inside out when exposed to chlorinated water, and it's no longer manufactured or accepted by building codes. If your Cape Coral home was built between 1978 and 1995, a free pipe inspection from C&S can determine if you have poly-B.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Cape Coral", href: "/emergency-plumber-cape-coral" },
      { label: "Cape Coral Service Area", href: "/areas/cape-coral" },
      { label: "Repiping Services", href: "/services/repiping" },
    ],
    priceRange: "$4,000–$12,000",
  },

  // ============================================
  // 4. NORTH FORT MYERS PLUMBER
  // ============================================
  {
    slug: "north-fort-myers-plumber",
    metaTitle: "North Fort Myers Plumber | Local & Licensed",
    metaDescription:
      "Trusted plumber in North Fort Myers, FL. Well water systems, septic-to-sewer, repiping & repairs. Family-owned since 1998. Call 833-PLUMB-IT for a free estimate.",
    keywords: [
      "plumber North Fort Myers",
      "North Fort Myers plumber",
      "plumbing service North Fort Myers FL",
      "well water plumber North Fort Myers",
      "septic to sewer North Fort Myers",
      "North Fort Myers plumbing repair",
      "licensed plumber North Fort Myers",
      "plumbing company North Fort Myers",
      "affordable plumber North Fort Myers FL",
      "residential plumber North Fort Myers",
    ],
    h1: "Your Trusted Plumber in North Fort Myers, FL",
    sectionHeading: "Licensed plumbing service across North Fort Myers",
    heroSubtext:
      "C&S Plumbing is headquartered right here in North Fort Myers. We know your well water, your soil, and your pipes — because we live here too. Call 833-PLUMB-IT.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `North Fort Myers is home — literally. C&S Plumbing of Lee is headquartered at 951 Pondella Road, and our team has been serving North Fort Myers neighbors since 1998. We know this community's plumbing inside and out because we drive these streets every day, and we've worked on homes in every neighborhood from Bayshore to Del Tura to the rural properties along Pine Island Road.\n\nPlumbing in North Fort Myers is different from Cape Coral or Fort Myers proper. Many homes here rely on private well water systems rather than municipal supply, which means dealing with high iron content, sulfur smell, hard water scaling, and the specialized filtration and treatment systems that well water requires. Our plumbers are experienced with well pump connections, pressure tank adjustments, and whole-home water treatment installations specific to the water quality in unincorporated Lee County.\n\nNorth Fort Myers is also in the midst of a long-running septic-to-sewer conversion program. Connecting from a septic system to Lee County Utilities sewer requires a licensed plumber to properly abandon the old septic tank, run new sewer lateral lines, and connect to the county's system — all while meeting strict inspection requirements. C&S has completed dozens of these conversions and handles the entire process, including permit applications and final inspection coordination.\n\nThe housing stock in North Fort Myers ranges from 1960s–70s block homes in neighborhoods like Bayshore and Hancock Bridge to manufactured homes in communities like Del Tura and Lochmoor Waterway Estates. Older block homes often have galvanized supply lines and cast iron drains that are well past their service life. Manufactured homes present their own challenges — flexible water lines that degrade in Florida's heat, under-home crawl space access, and plastic drain fittings that become brittle over time.\n\nWhether you need a simple faucet repair, a complete repipe, a water heater replacement, or a septic-to-sewer conversion, C&S Plumbing is your neighbor and your plumber. No travel fees — we're already here.`,
    features: [
      {
        title: "Local Headquarters",
        description:
          "Our office is on Pondella Road in North Fort Myers — no travel fees and the fastest response times in the area.",
      },
      {
        title: "Well Water Specialists",
        description:
          "Expert installation and repair of well pumps, pressure tanks, water treatment systems, and filtration for North Fort Myers well water.",
      },
      {
        title: "Septic-to-Sewer Conversions",
        description:
          "Full-service septic tank abandonment and sewer lateral connection, including all permits and inspections required by Lee County.",
      },
      {
        title: "Manufactured Home Plumbing",
        description:
          "Experienced with the unique plumbing systems in manufactured and mobile homes found throughout North Fort Myers communities.",
      },
      {
        title: "Galvanized & Cast Iron Replacement",
        description:
          "Upgrade aging galvanized supply lines and deteriorating cast iron drains in North Fort Myers' older block homes.",
      },
    ],
    city: "North Fort Myers",
    state: "FL",
    neighborhoods: [
      "North Fort Myers",
      "Bayshore",
      "Pine Island Road",
      "Hancock Bridge",
      "Del Tura",
      "Lochmoor Waterway Estates",
      "Slater",
    ],
    faqs: [
      {
        question: "Do you service well water systems in North Fort Myers?",
        answer:
          "Yes. A large portion of North Fort Myers homes use private wells rather than municipal water. Our plumbers install and repair well pumps, pressure tanks, UV sterilization systems, iron filters, water softeners, and whole-home filtration systems. We understand the specific water quality challenges in unincorporated Lee County, including high iron and sulfur content.",
      },
      {
        question: "How much does a septic-to-sewer conversion cost in North Fort Myers?",
        answer:
          "Septic-to-sewer conversions in North Fort Myers typically run between $3,500 and $8,000 depending on the distance from your home to the sewer connection point, the depth of the sewer main, and soil conditions on your property. Lee County also charges a connection fee. C&S handles the entire process — permits, installation, inspections, and septic tank abandonment.",
      },
      {
        question: "Is C&S Plumbing actually located in North Fort Myers?",
        answer:
          "Yes — our office is at 951 Pondella Road in North Fort Myers, FL 33903. We've been headquartered here since 1998. Being local means zero travel fees for North Fort Myers customers and the fastest response times in the area.",
      },
      {
        question: "Can you work on manufactured homes in North Fort Myers?",
        answer:
          "Absolutely. North Fort Myers has many manufactured home communities, and our plumbers are experienced with the specific plumbing systems used in manufactured and mobile homes — including flexible water lines, under-home access through belly boards, and plastic drain fittings. We handle everything from leak repairs to complete replumbs.",
      },
      {
        question: "What plumbing services do you offer in North Fort Myers?",
        answer:
          "We offer the full range: emergency repairs, whole-home repiping, water heater installation and repair, drain cleaning, slab leak detection, septic-to-sewer conversions, well water system service, water softener and filtration installation, fixture replacements, bathroom and kitchen remodels, and new construction plumbing. Call 833-PLUMB-IT for any plumbing need.",
      },
      {
        question: "Do older North Fort Myers homes need repiping?",
        answer:
          "Many do. Homes built in the 1960s and 1970s in neighborhoods like Bayshore and Hancock Bridge often have galvanized steel supply lines that have corroded internally, restricting water flow and discoloring water. Cast iron drain lines from this era are also reaching the end of their lifespan. A free C&S inspection can assess your pipe condition and let you know if a repipe would benefit your home.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Fort Myers", href: "/emergency-plumber-fort-myers" },
      { label: "North Fort Myers Service Area", href: "/areas/north-fort-myers" },
      { label: "Repiping Services", href: "/services/repiping" },
    ],
  },

  // ============================================
  // 5. WATER DAMAGE REPAIR - CAPE CORAL
  // ============================================
  {
    slug: "water-damage-repair-cape-coral",
    metaTitle: "Water Damage Repair Cape Coral | Plumbing Experts",
    metaDescription:
      "Plumbing-caused water damage repair in Cape Coral, FL. Slab leaks, burst pipes & pipe corrosion fixed at the source. Licensed CFC1432485. Call 833-PLUMB-IT now.",
    keywords: [
      "water damage repair Cape Coral",
      "plumbing water damage Cape Coral FL",
      "slab leak water damage Cape Coral",
      "burst pipe damage repair Cape Coral",
      "pipe leak damage Cape Coral",
      "water damage plumber Cape Coral",
      "Cape Coral water damage restoration plumbing",
      "plumbing leak damage repair Cape Coral",
      "water damage from pipe Cape Coral",
      "Cape Coral pipe burst water damage",
    ],
    h1: "Water Damage Repair in Cape Coral, FL",
    sectionHeading: "Water damage repair for Cape Coral homes",
    heroSubtext:
      "Most Cape Coral water damage starts with a plumbing failure. C&S fixes the source, stops the damage, and restores your home — one call handles it all.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Water damage is the most common homeowner insurance claim in Cape Coral, and the majority of it traces back to plumbing failures. The city's unique combination of shifting sandy soil, high chloride groundwater, and aging pipe materials creates a perfect storm for the kind of slow leaks and sudden bursts that cause devastating interior damage. When water damage strikes, you need a plumber who can fix the cause — not just mop up the result.\n\nC&S Plumbing of Lee specializes in identifying and repairing the plumbing failures that cause water damage in Cape Coral homes. Slab leaks are the number one culprit. Cape Coral sits on compacted sand fill, and as that soil shifts — from tidal fluctuation near the canals, from heavy rains during wet season, or simply from settling over decades — it puts stress on the copper or CPVC pipes running beneath your concrete foundation. A pinhole leak under the slab can run for weeks, saturating your foundation and buckling your flooring before you notice any visible signs.\n\nPipe corrosion is the second major cause. Cape Coral's soil chloride levels are among the highest in Florida, and that chloride attacks copper pipes from the outside in. What starts as a tiny green spot on a pipe in your wall becomes a trickle, then a stream, then a soaked wall cavity full of mold. Our technicians use electronic leak detection and pipe cameras to find these failures before they become catastrophic.\n\nPost-hurricane water intrusion is another reality of Cape Coral homeownership. Storm surge and heavy rain can shift underground pipes, crack joints, and force contaminated water back through drain lines. C&S responded to widespread plumbing-related water damage after both Hurricane Irma and Hurricane Ian, and our crews are trained in the specific triage procedures that minimize secondary damage.\n\nOur water damage response includes emergency shutoff, leak identification and plumbing repair, water extraction, structural drying, and coordination with your insurance company. We document everything with photos and detailed reports to support your claim. For extensive restoration work beyond plumbing, we partner with trusted Cape Coral restoration contractors to handle drywall, flooring, and mold remediation.`,
    features: [
      {
        title: "Source-First Approach",
        description:
          "We find and fix the plumbing failure causing the damage before any restoration begins, preventing repeat incidents.",
      },
      {
        title: "Slab Leak Detection",
        description:
          "Non-invasive acoustic and thermal detection pinpoints leaks beneath your Cape Coral home's foundation without unnecessary demolition.",
      },
      {
        title: "Emergency Water Extraction",
        description:
          "Rapid water removal using commercial-grade extraction equipment to minimize damage to flooring, cabinets, and drywall.",
      },
      {
        title: "Insurance Claim Support",
        description:
          "Detailed photo documentation, written repair reports, and direct communication with your adjuster to maximize your claim.",
      },
      {
        title: "Mold Prevention",
        description:
          "Structural drying and dehumidification within the critical 24–48 hour window to prevent mold growth in Cape Coral's humid climate.",
      },
    ],
    city: "Cape Coral",
    state: "FL",
    neighborhoods: CAPE_CORAL_NEIGHBORHOODS,
    faqs: [
      {
        question: "What causes most water damage in Cape Coral homes?",
        answer:
          "Slab leaks are the leading cause, driven by Cape Coral's shifting sandy soil stressing pipes beneath foundations. Pipe corrosion from high chloride levels in the soil is the second most common cause, followed by polybutylene pipe failures in homes built between 1978 and 1995. Post-hurricane pipe damage and water heater failures also contribute significantly.",
      },
      {
        question: "Does insurance cover plumbing water damage in Cape Coral?",
        answer:
          "Most homeowner insurance policies cover sudden and accidental plumbing failures — burst pipes, slab leaks, and appliance line failures. Gradual leaks that could have been detected and prevented may have limited coverage. C&S Plumbing documents all damage with photos and detailed reports, and we communicate directly with your insurance adjuster to support your claim.",
      },
      {
        question: "How quickly should I act on water damage in Cape Coral?",
        answer:
          "Immediately. In Cape Coral's humid subtropical climate, mold can begin growing within 24–48 hours of water exposure. Water damage also doubles in cost for every hour it goes unaddressed — soaked drywall, warped flooring, and damaged cabinets that could have been saved with fast action may need full replacement if left wet. Call 833-PLUMB-IT the moment you notice signs of water damage.",
      },
      {
        question: "Can you detect a slab leak without tearing up my floor?",
        answer:
          "Yes. We use electronic acoustic detection equipment that listens for the sound of pressurized water escaping beneath your slab, combined with thermal imaging that identifies temperature differences caused by leaking hot or cold water lines. These non-invasive methods allow us to pinpoint the leak location accurately before making any access openings.",
      },
      {
        question: "Do you handle the full restoration or just the plumbing?",
        answer:
          "C&S handles all plumbing repairs, water extraction, and initial structural drying. For extensive restoration — drywall replacement, flooring, painting, and mold remediation — we coordinate with trusted Cape Coral restoration contractors that we've worked alongside for years. This ensures a seamless process where the plumbing fix and the restoration work are properly coordinated.",
      },
      {
        question: "How do I prevent future water damage in my Cape Coral home?",
        answer:
          "Schedule a plumbing inspection to assess your pipe material and condition. If you have polybutylene or corroded copper, proactive repiping eliminates the most common failure points. Install water leak detection sensors near water heaters, under sinks, and near washing machine connections. Consider a whole-home water shutoff system that automatically stops flow when a leak is detected. C&S can install all of these preventive measures.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Cape Coral", href: "/emergency-plumber-cape-coral" },
      { label: "Repiping in Cape Coral", href: "/repiping-cape-coral" },
      { label: "Leak Repair Services", href: "/services/leak-repair" },
    ],
  },

  // ============================================
  // 6. REPIPING - FORT MYERS
  // ============================================
  {
    slug: "repiping-fort-myers",
    metaTitle: "Repiping Fort Myers | Pipe Replacement Experts",
    metaDescription:
      "Fort Myers whole-home repiping from $4,000. Galvanized, cast iron & poly-B replacement. 28 years experience, 5-star rated. Call 833-PLUMB-IT for a free estimate.",
    keywords: [
      "repiping Fort Myers",
      "whole house repiping Fort Myers FL",
      "galvanized pipe replacement Fort Myers",
      "cast iron pipe replacement Fort Myers",
      "Fort Myers repipe cost",
      "pipe replacement Fort Myers Florida",
      "repipe specialist Fort Myers",
      "Fort Myers plumber repiping",
      "copper repiping Fort Myers FL",
      "home repiping Fort Myers",
    ],
    h1: "Whole-Home Repiping in Fort Myers, FL",
    sectionHeading: "What whole-home repiping looks like in Fort Myers",
    heroSubtext:
      "Fort Myers' oldest homes have the oldest pipes. C&S Plumbing replaces failing galvanized, cast iron, and poly-B systems with modern piping built to last. Free estimates.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Fort Myers' housing stock spans nearly a century, and that means the plumbing running through its walls and under its foundations represents every pipe material ever used in Florida construction. From the galvanized steel supply lines in 1950s River District bungalows to the polybutylene pipes in 1980s Gateway subdivisions to the CPVC in 2000s-era tract homes along Daniels Parkway, each material brings its own failure mode — and each one eventually needs replacement.\n\nGalvanized steel pipes are the most urgent concern in Fort Myers' older neighborhoods. These pipes corrode from the inside out, gradually narrowing the internal diameter until water flow slows to a trickle. If you live in a pre-1970 Fort Myers home and your water pressure has been declining, the inside of your galvanized pipes may be nearly solid with rust and mineral buildup. The only permanent solution is a full repipe.\n\nCast iron drain lines are the other critical issue in older Fort Myers homes. Cast iron was the standard for drain, waste, and vent (DWV) systems through the 1970s. After 40–50 years in Florida's humid environment, these pipes corrode, develop holes, and eventually collapse. Signs include slow drains throughout the house, sewage odors, and — in worst cases — sinkholes forming in the yard where a collapsed drain line has been eroding soil. C&S replaces failed cast iron with Schedule 40 PVC, which will outlast the house.\n\nFort Myers also has a significant number of homes with polybutylene supply lines from the 1980s–1990s building boom. While less concentrated than in Cape Coral, poly-B is present throughout Gateway, Whiskey Creek, and Villas neighborhoods. These pipes are a ticking time bomb — they degrade internally from chlorinated water exposure and can fail suddenly, flooding your home.\n\nC&S Plumbing uses PEX-A for supply line replacements, which offers superior flexibility, corrosion resistance, and a 25-year manufacturer warranty. Our Fort Myers repipe projects typically complete in 1–2 days, and our crews handle all permitting, inspections, and wall/ceiling restoration as part of the project price.`,
    features: [
      {
        title: "Multi-Material Expertise",
        description:
          "Experienced replacing galvanized steel, cast iron, polybutylene, copper, and CPVC — every pipe type found in Fort Myers homes.",
      },
      {
        title: "Cast Iron Drain Replacement",
        description:
          "Full drain, waste, and vent system upgrades from deteriorating cast iron to long-lasting Schedule 40 PVC.",
      },
      {
        title: "PEX-A Supply Lines",
        description:
          "Modern cross-linked polyethylene tubing that's corrosion-proof, flexible, and backed by a 25-year manufacturer warranty.",
      },
      {
        title: "Historic Home Specialists",
        description:
          "Careful repipe techniques for Fort Myers' older homes that preserve the structure while modernizing the plumbing system.",
      },
      {
        title: "Permits & Inspections Included",
        description:
          "We handle all City of Fort Myers permit applications and building inspections as part of every repipe project.",
      },
      {
        title: "Complete Wall Restoration",
        description:
          "All access openings are patched, textured, and painted to match — included in your repipe price.",
      },
    ],
    city: "Fort Myers",
    state: "FL",
    neighborhoods: FORT_MYERS_NEIGHBORHOODS,
    faqs: [
      {
        question: "How much does repiping cost in Fort Myers?",
        answer:
          "Fort Myers whole-home repiping typically ranges from $4,000 to $12,000. The price depends on your home's size, number of fixtures, pipe material being replaced, and whether you need supply lines only or both supply and drain lines. Galvanized-to-PEX supply repipes for a 3/2 home usually fall between $4,500 and $7,500. Cast iron drain replacement adds $3,000–$6,000 depending on scope. We provide free in-home estimates.",
      },
      {
        question: "How do I know if my Fort Myers home has galvanized pipes?",
        answer:
          "Look at exposed pipes in your garage, under sinks, or near your water heater. Galvanized pipes are dull gray and magnetic (a refrigerator magnet will stick to them). Copper is reddish-brown, CPVC is cream/yellow plastic, and PEX is flexible colored tubing (red/blue/white). If your Fort Myers home was built before 1970, galvanized supply lines are very likely. We offer free pipe inspections to identify your materials.",
      },
      {
        question: "Is cast iron drain pipe replacement necessary in Fort Myers?",
        answer:
          "If your Fort Myers home has cast iron drain pipes and was built before 1975, replacement is likely necessary or will be soon. Cast iron corrodes from the inside in Florida's humid environment, and after 40–50 years most pipes have significant wall thinning or active holes. Signs include persistent slow drains, sewage odors, wet spots in the yard, and fruit flies near drains. A camera inspection can confirm the pipe's condition.",
      },
      {
        question: "How long does a Fort Myers repipe take?",
        answer:
          "Supply-line-only repipes typically take 1–2 days. Combined supply and drain line replacement may take 2–4 days depending on home size and the extent of cast iron removal required. Your water is off for 4–8 hours during the main installation, and we coordinate the schedule to minimize disruption. We provide a detailed timeline during your free estimate.",
      },
      {
        question: "Do you need to tear up the slab for repiping in Fort Myers?",
        answer:
          "In most cases, no. We reroute supply lines through walls and attic space, avoiding the slab entirely. For drain line replacement, we may need to access under-slab pipes in limited areas, but we use minimally invasive techniques and restore all affected flooring. Many Fort Myers homes can be fully repiped using overhead rerouting without any slab work.",
      },
      {
        question: "Will my water pressure improve after repiping?",
        answer:
          "Almost certainly, especially if you're replacing galvanized pipes. Galvanized steel corrodes internally and reduces pipe diameter over decades — it's common for a 3/4-inch galvanized pipe to have less than 1/4 inch of usable opening after 40 years. Replacing with PEX-A restores full flow capacity and typically results in a dramatic improvement in water pressure throughout the home.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Fort Myers", href: "/emergency-plumber-fort-myers" },
      { label: "Fort Myers Service Area", href: "/areas/fort-myers" },
      { label: "Repiping Services", href: "/services/repiping" },
    ],
    priceRange: "$4,000–$12,000",
  },

  // ============================================
  // 7. DRAIN CLEANING - CAPE CORAL
  // ============================================
  {
    slug: "drain-cleaning-cape-coral",
    metaTitle: "Drain Cleaning Cape Coral | Fast & Affordable",
    metaDescription:
      "Professional drain cleaning in Cape Coral, FL. Root removal, hydro jetting & camera inspections. Same-day service available. Call 833-PLUMB-IT — licensed & insured.",
    keywords: [
      "drain cleaning Cape Coral",
      "Cape Coral drain cleaning service",
      "clogged drain Cape Coral FL",
      "root removal drain Cape Coral",
      "hydro jetting Cape Coral",
      "sewer cleaning Cape Coral",
      "drain camera inspection Cape Coral",
      "slow drain repair Cape Coral",
      "kitchen drain clog Cape Coral",
      "Cape Coral plumber drain service",
    ],
    h1: "Drain Cleaning Services in Cape Coral, FL",
    sectionHeading: "How we clear stubborn drains in Cape Coral",
    heroSubtext:
      "Cape Coral's tropical roots and sandy soil create stubborn clogs that store-bought solutions can't fix. C&S Plumbing clears drains right the first time — guaranteed.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Drain problems in Cape Coral are rarely as simple as a hair clog. The city's lush tropical landscaping, sandy soil composition, and flat terrain create a unique set of drainage challenges that require professional equipment and local knowledge to resolve properly.\n\nRoot intrusion is the most common serious drain issue in Cape Coral. Ficus trees, banyans, and tropical fruit trees are everywhere in Cape Coral yards, and their aggressive root systems seek out the moisture inside drain lines. Roots enter through tiny cracks or loose joints, then expand until they completely block the pipe. Store-bought drain cleaners don't touch root blockages — they require mechanical cutting with a drain machine or removal with hydro jetting.\n\nSand and sediment buildup is another Cape Coral-specific problem. The city's soil is primarily fine sand, and during heavy rains, that sand can work its way into drain lines through compromised joints or ground-level cleanouts. Over time, sand accumulates in low spots in the drain line, creating persistent slow drains that chemical cleaners can't dissolve. Our hydro jetting service uses high-pressure water (up to 4,000 PSI) to scour the inside of drain pipes clean, removing sand, scale, and grease buildup.\n\nCape Coral's outdoor lifestyle also contributes to drain issues. Many homes have elaborate outdoor kitchens with grills, deep fryers, and prep sinks that send grease and food waste into the drainage system. Without proper grease traps, this residue coats the inside of drain pipes and creates progressively worse blockages.\n\nC&S Plumbing provides complete drain cleaning services for Cape Coral homes and businesses. Every drain service begins with a camera inspection so we can see exactly what's causing the problem — root intrusion, sand, grease, a broken pipe, or a bellied section where the pipe has settled and created a permanent low spot. We show you the camera footage, explain the issue, and recommend the most effective and cost-efficient solution.\n\nFor recurring drain issues, we offer maintenance plans that include annual camera inspections and preventive jetting to keep your drains flowing freely year-round.`,
    features: [
      {
        title: "HD Camera Inspection",
        description:
          "Every drain service starts with a camera inspection so you can see exactly what's causing the problem before any work begins.",
      },
      {
        title: "Hydro Jetting",
        description:
          "High-pressure water jetting (up to 4,000 PSI) scours pipe walls clean, removing roots, sand, grease, and scale buildup completely.",
      },
      {
        title: "Root Cutting & Removal",
        description:
          "Mechanical root cutting removes tree root intrusion from drain lines, and we can recommend root barriers to prevent regrowth.",
      },
      {
        title: "Same-Day Service",
        description:
          "Most Cape Coral drain cleaning calls are completed the same day. Call before noon for same-day availability.",
      },
      {
        title: "Preventive Maintenance Plans",
        description:
          "Annual camera inspections and preventive jetting keep Cape Coral drains clear year-round and catch problems before they become emergencies.",
      },
    ],
    city: "Cape Coral",
    state: "FL",
    neighborhoods: CAPE_CORAL_NEIGHBORHOODS,
    faqs: [
      {
        question: "Why do Cape Coral drains clog so often?",
        answer:
          "Three main factors: tree root intrusion from Cape Coral's abundant tropical trees seeking moisture in drain lines, sand and sediment infiltration through compromised pipe joints in the sandy soil, and grease accumulation from outdoor kitchens that many Cape Coral homes feature. The flat terrain also means drain lines have minimal slope, so debris settles more easily than in hilly areas.",
      },
      {
        question: "How much does drain cleaning cost in Cape Coral?",
        answer:
          "A standard drain cleaning with cable machine starts at $175–$250 for a single drain line. Hydro jetting for more stubborn blockages or full-system cleaning ranges from $350–$600. Camera inspections are $150–$250 as a standalone service but are included with most drain cleaning appointments. We provide exact pricing before beginning any work.",
      },
      {
        question: "Will drain cleaner from the store fix my Cape Coral drain problem?",
        answer:
          "Chemical drain cleaners are ineffective against the most common Cape Coral drain issues — tree roots, sand buildup, and bellied pipes. They also damage older pipes by accelerating corrosion of cast iron and weakening PVC joints. We strongly recommend professional drain cleaning over chemical solutions, especially for recurring problems or slow drains that affect multiple fixtures.",
      },
      {
        question: "What is hydro jetting and do I need it?",
        answer:
          "Hydro jetting uses a specialized nozzle that sprays high-pressure water (up to 4,000 PSI) inside your drain pipes, scouring the walls clean of roots, grease, sand, and mineral scale. It's the most effective method for restoring full pipe capacity. You likely need hydro jetting if you have recurring clogs, multiple slow drains, or root intrusion — common issues in Cape Coral homes.",
      },
      {
        question: "How do I know if tree roots are in my Cape Coral drain line?",
        answer:
          "Signs include recurring clogs in the same drain (especially floor drains and toilets), gurgling sounds from drains, slow drainage in multiple fixtures simultaneously, and unexplained wet areas in your yard. If you have mature trees within 20 feet of your sewer line, root intrusion is very likely. A camera inspection provides definitive confirmation and shows exactly where roots have entered.",
      },
      {
        question: "Do you offer drain maintenance plans in Cape Coral?",
        answer:
          "Yes. Given Cape Coral's ongoing root and sand issues, we offer annual maintenance plans that include a camera inspection of your main drain line and preventive hydro jetting. This proactive approach catches developing problems before they cause backups and extends the life of your drain system. Regular maintenance customers also receive priority scheduling and discounted service rates.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Cape Coral", href: "/emergency-plumber-cape-coral" },
      { label: "Cape Coral Service Area", href: "/areas/cape-coral" },
      { label: "Drain Cleaning Services", href: "/services/drain-cleaning" },
    ],
  },

  // ============================================
  // 8. WATER HEATER REPAIR - CAPE CORAL
  // ============================================
  {
    slug: "water-heater-repair-cape-coral",
    metaTitle: "Water Heater Repair Cape Coral | Same-Day Service",
    metaDescription:
      "Water heater repair & replacement in Cape Coral, FL from $1,200. Tank & tankless options. Same-day service, licensed CFC1432485. Call 833-PLUMB-IT for fast help.",
    keywords: [
      "water heater repair Cape Coral",
      "water heater replacement Cape Coral FL",
      "tankless water heater Cape Coral",
      "hot water heater Cape Coral",
      "water heater installation Cape Coral",
      "Cape Coral water heater service",
      "no hot water Cape Coral",
      "water heater cost Cape Coral FL",
      "electric water heater Cape Coral",
      "water heater plumber Cape Coral",
    ],
    h1: "Water Heater Repair & Replacement in Cape Coral, FL",
    sectionHeading: "Water heater problems we fix across Cape Coral",
    heroSubtext:
      "No hot water? Cape Coral's hard water destroys water heaters faster than anywhere else. C&S Plumbing repairs or replaces your unit today — call 833-PLUMB-IT.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Water heaters in Cape Coral have a shorter lifespan than the national average, and the reason is simple: Cape Coral's water is exceptionally hard. The high calcium and magnesium content in the municipal supply coats heating elements and tank linings with scale buildup that reduces efficiency, increases energy bills, and eventually causes premature tank failure. A water heater that might last 12–15 years in a soft-water city often fails in 6–8 years in Cape Coral without proper maintenance.\n\nC&S Plumbing of Lee has been installing and repairing water heaters in Cape Coral since 1998, and we've seen firsthand how the local water conditions affect every brand and model. We offer same-day repair service for most common failures — bad heating elements, faulty thermostats, leaking temperature and pressure relief valves, and corroded anode rods. When repair isn't cost-effective, we provide same-day replacement with a range of tank and tankless options.\n\nTankless water heaters have become increasingly popular in Cape Coral for good reason. They eliminate the risk of tank corrosion, provide endless hot water for the large master bathrooms common in Cape Coral homes, and use 30–40% less energy than traditional tanks. However, Cape Coral's hard water requires that tankless units be flushed with descaling solution annually to maintain performance — a service C&S provides as part of our maintenance plans.\n\nFor homeowners who prefer traditional tank water heaters, we install high-efficiency models with enhanced anode rod systems designed for hard water environments. We always recommend and install a sediment trap and, when budget allows, a point-of-use water softener on the cold water supply to the heater — a small investment that can double the unit's lifespan in Cape Coral's water conditions.\n\nCape Coral's hurricane exposure also matters for water heater installation. We secure all units with approved strapping, install flood-resistant connections, and position new water heaters to minimize storm damage risk. Every installation includes proper expansion tank installation, code-compliant disconnect, and a full system pressure test.`,
    features: [
      {
        title: "Same-Day Repair & Replacement",
        description:
          "Most water heater repairs are completed the same day. We stock common parts and popular water heater models on our trucks.",
      },
      {
        title: "Tankless Water Heater Experts",
        description:
          "Professional installation and annual maintenance of tankless units, including hard water descaling critical for Cape Coral's water quality.",
      },
      {
        title: "Hard Water Protection",
        description:
          "We install sediment traps, enhanced anode rods, and point-of-use softeners to extend water heater life in Cape Coral's harsh water.",
      },
      {
        title: "Hurricane-Secure Installation",
        description:
          "Every water heater is properly strapped, connected with flood-resistant fittings, and positioned to minimize storm damage risk.",
      },
      {
        title: "Energy Efficiency Upgrades",
        description:
          "Upgrade from an old tank to a high-efficiency or tankless unit and reduce your water heating costs by 30–40%.",
      },
    ],
    city: "Cape Coral",
    state: "FL",
    neighborhoods: CAPE_CORAL_NEIGHBORHOODS,
    faqs: [
      {
        question: "How much does water heater replacement cost in Cape Coral?",
        answer:
          "Water heater replacement in Cape Coral ranges from $1,200 to $4,500 depending on the type and size. A standard 50-gallon electric tank water heater installed runs $1,200–$2,000. High-efficiency tank models are $1,800–$2,800. Tankless water heaters range from $2,500–$4,500 installed, depending on capacity and whether gas line work is needed. All prices include removal of the old unit, installation, and code-required components.",
      },
      {
        question: "Why do water heaters fail faster in Cape Coral?",
        answer:
          "Cape Coral's municipal water has very high calcium and magnesium content (hard water). This mineral content creates scale buildup on heating elements and tank walls, reducing efficiency and causing premature corrosion. Without annual flushing and anode rod maintenance, a tank water heater in Cape Coral may last only 6–8 years compared to the 12–15 year national average.",
      },
      {
        question: "Should I get a tankless water heater in Cape Coral?",
        answer:
          "Tankless units are an excellent choice for Cape Coral homes — they eliminate tank corrosion, provide unlimited hot water, and use 30–40% less energy. However, they require annual descaling due to Cape Coral's hard water, and upfront costs are higher. The best fit depends on your hot water demand, budget, and whether you plan to stay in the home long-term. C&S can help you evaluate both options during a free consultation.",
      },
      {
        question: "How often should I flush my water heater in Cape Coral?",
        answer:
          "In Cape Coral, we recommend flushing tank water heaters every 6–12 months due to the hard water conditions. Tankless units should be descaled annually. Regular flushing removes sediment buildup that reduces efficiency and shortens the unit's life. C&S offers maintenance plans that include annual flushing and inspection for both tank and tankless water heaters.",
      },
      {
        question: "Can you repair my water heater the same day I call?",
        answer:
          "In most cases, yes. Our trucks carry common replacement parts including heating elements, thermostats, anode rods, T&P valves, and thermocouples. If your unit needs replacement rather than repair, we stock the most popular water heater models and can often complete a full replacement the same day. Call 833-PLUMB-IT in the morning for the best same-day availability.",
      },
      {
        question: "What size water heater do I need for my Cape Coral home?",
        answer:
          "For tank water heaters: a 40-gallon unit typically serves 1–2 people, 50-gallon serves 2–4 people, and 75-gallon or dual units serve 4+ people or homes with large soaking tubs. For tankless units, sizing is based on flow rate (GPM) rather than gallons. Most Cape Coral homes need a unit rated at 8–10 GPM to handle simultaneous shower and appliance use. We'll size the right unit during your free in-home estimate.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Cape Coral", href: "/emergency-plumber-cape-coral" },
      { label: "Cape Coral Service Area", href: "/areas/cape-coral" },
      { label: "Water Heater Services", href: "/services/water-heaters" },
    ],
    priceRange: "$1,200–$4,500",
  },

  // ============================================
  // 9. PLUMBER - LEHIGH ACRES
  // ============================================
  {
    slug: "plumber-lehigh-acres",
    metaTitle: "Plumber Lehigh Acres FL | Reliable & Affordable",
    metaDescription:
      "Licensed plumber serving Lehigh Acres, FL. Repairs, repiping, water heaters & new construction. Family-owned since 1998. Call 833-PLUMB-IT for a free estimate.",
    keywords: [
      "plumber Lehigh Acres",
      "Lehigh Acres plumber",
      "plumbing service Lehigh Acres FL",
      "licensed plumber Lehigh Acres",
      "affordable plumber Lehigh Acres",
      "Lehigh Acres plumbing repair",
      "plumbing company Lehigh Acres Florida",
      "residential plumber Lehigh Acres",
      "Lehigh Acres FL plumbing service",
      "best plumber Lehigh Acres",
    ],
    h1: "Licensed Plumber in Lehigh Acres, FL",
    sectionHeading: "Licensed plumbing service across Lehigh Acres",
    heroSubtext:
      "Lehigh Acres is growing fast, and its plumbing needs are growing with it. C&S Plumbing has served Lee County since 1998 — call 833-PLUMB-IT for honest, reliable service.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Lehigh Acres is one of the fastest-growing communities in Southwest Florida, and that rapid growth brings a unique set of plumbing challenges. The community spans over 90 square miles of former agricultural land, and its development has come in waves — from the original 1950s subdivisions platted by Lee Ratner to the massive building boom of the mid-2000s to the current surge of new construction filling in empty lots throughout the community.\n\nFor homeowners in Lehigh Acres' older neighborhoods along Lee Boulevard and Homestead Road, the plumbing concerns are similar to aging systems across Lee County: galvanized supply lines losing flow, water heaters failing from hard water abuse, and drain lines compromised by root intrusion from mature landscaping. C&S Plumbing has been servicing these homes since 1998 and knows the common failure points in every era of Lehigh Acres construction.\n\nThe homes built during the 2004–2007 boom present different challenges. These homes went up fast, and many used builder-grade plumbing fixtures, economy water heaters, and CPVC supply lines that are now showing their age. We frequently see CPVC failures at fittings in Lehigh Acres homes from this era — the combination of Florida attic heat and certain glue compounds causes the plastic to become brittle and crack at joints. If your home was built between 2004 and 2008, a plumbing inspection can identify vulnerable connections before they fail.\n\nLehigh Acres also has a mix of municipal water and private well systems, depending on the neighborhood. Properties along the eastern and southern edges of the community often rely on wells, which means dealing with iron staining, sulfur odor, and hard water that's even more aggressive than the municipal supply. C&S installs and services well water treatment systems, including iron filters, water softeners, and UV purification.\n\nNew construction continues at a rapid pace in Lehigh Acres, and C&S Plumbing is an active new construction plumber in the community. We work with local builders to install code-compliant plumbing systems in the single-family homes going up on previously vacant lots throughout Lehigh Acres, bringing the same quality we've delivered across 8,500+ home builds in Lee County.`,
    features: [
      {
        title: "Full-Service Plumbing",
        description:
          "Repairs, repiping, water heaters, drain cleaning, fixture installation, and new construction — everything your Lehigh Acres home needs.",
      },
      {
        title: "Well Water Systems",
        description:
          "Installation and repair of well pumps, iron filters, water softeners, and UV purification for Lehigh Acres properties on well water.",
      },
      {
        title: "Builder-Grade Upgrades",
        description:
          "Replace the economy plumbing fixtures and CPVC connections in mid-2000s Lehigh Acres homes with quality materials built to last.",
      },
      {
        title: "New Construction Plumbing",
        description:
          "8,500+ homes built across Lee County. We bring the same quality to new Lehigh Acres subdivisions.",
      },
      {
        title: "Honest Flat-Rate Pricing",
        description:
          "Upfront quotes before any work begins. No hourly billing surprises — you know the price before we start.",
      },
    ],
    city: "Lehigh Acres",
    state: "FL",
    neighborhoods: [
      "Lehigh Acres",
      "Mirror Lakes",
      "Sunshine Blvd",
      "Lee Blvd",
      "Homestead Road",
      "Joel Blvd",
      "Gunnery Road",
      "Veterans Park",
    ],
    faqs: [
      {
        question: "Do you serve all of Lehigh Acres?",
        answer:
          "Yes. C&S Plumbing serves the entire Lehigh Acres community, from the older neighborhoods along Lee Boulevard and Homestead Road to the newer developments off Joel Boulevard and Gunnery Road. Lehigh Acres is within our standard Lee County service area with no additional travel charges.",
      },
      {
        question: "Why do newer Lehigh Acres homes have plumbing problems?",
        answer:
          "Many Lehigh Acres homes built during the 2004–2008 building boom used builder-grade plumbing materials to keep construction costs low. CPVC supply lines, economy water heaters, and basic fixtures from this era are now failing as they approach 20 years of age. The CPVC in particular becomes brittle in Florida's heat and cracks at fittings. A plumbing inspection can identify at-risk components before they fail.",
      },
      {
        question: "Do you handle well water systems in Lehigh Acres?",
        answer:
          "Yes. Parts of Lehigh Acres rely on private well water, which comes with challenges including high iron content, sulfur smell, and extreme hardness. We install and service well pumps, pressure tanks, iron filtration systems, water softeners, and UV purification units. We can also test your well water and recommend the right treatment system for your specific water chemistry.",
      },
      {
        question: "How much does a plumber cost in Lehigh Acres?",
        answer:
          "Service call and diagnostic fees start at $89. Common repairs like faucet replacement ($150–$350), toilet repair ($125–$300), and water heater repair ($150–$500) are priced upfront before work begins. Larger projects like repiping ($4,000–$12,000) and water heater replacement ($1,200–$4,500) include free in-home estimates. We provide transparent flat-rate pricing with no hourly surprises.",
      },
      {
        question: "Can you help with new construction plumbing in Lehigh Acres?",
        answer:
          "Absolutely. C&S Plumbing is an experienced new construction plumber with over 8,500 homes built across Lee County. We work with Lehigh Acres builders and general contractors to install complete plumbing systems for new single-family homes, including rough-in, top-out, and trim phases. We also handle permit coordination and inspections.",
      },
      {
        question: "What areas of Lehigh Acres do you reach fastest?",
        answer:
          "Our trucks access Lehigh Acres primarily via SR-82 and Joel Boulevard. Neighborhoods near Veterans Park, Mirror Lakes, and the Lee/Joel intersection are typically a 20–30 minute response. Properties in the southern and eastern portions of Lehigh Acres may take slightly longer but are still within our standard service area with no extra travel charges.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Cape Coral", href: "/emergency-plumber-cape-coral" },
      { label: "Lehigh Acres Service Area", href: "/areas/lehigh-acres" },
      { label: "Repiping Services", href: "/services/repiping" },
    ],
  },

  // ============================================
  // 10. COMMERCIAL PLUMBING - FORT MYERS
  // ============================================
  {
    slug: "commercial-plumbing-fort-myers",
    metaTitle: "Commercial Plumber Fort Myers | Licensed Contractor",
    metaDescription:
      "Commercial plumbing in Fort Myers, FL. Restaurants, retail, offices & multi-story. Backflow testing, grease traps, buildouts. Licensed CFC1432485. Call 833-PLUMB-IT.",
    keywords: [
      "commercial plumber Fort Myers",
      "commercial plumbing Fort Myers FL",
      "restaurant plumber Fort Myers",
      "backflow testing Fort Myers",
      "grease trap service Fort Myers",
      "tenant buildout plumber Fort Myers",
      "commercial plumbing contractor Fort Myers",
      "Fort Myers commercial plumbing service",
      "office plumbing Fort Myers FL",
      "multi-story plumbing Fort Myers",
    ],
    h1: "Commercial Plumbing Services in Fort Myers, FL",
    sectionHeading: "Commercial plumbing for Fort Myers businesses",
    heroSubtext:
      "From restaurant buildouts to backflow certification, C&S Plumbing keeps Fort Myers businesses running. Licensed commercial contractor since 1998 — call 833-PLUMB-IT.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Fort Myers' commercial corridors — Colonial Boulevard, Metro Parkway, Daniels Parkway, and the revitalized Downtown/River District — are home to thousands of businesses that depend on reliable plumbing to serve customers and employees every day. When a restaurant's grease trap overflows during a Friday dinner rush or an office building's backflow preventer fails its annual test, the consequences are immediate: lost revenue, health code violations, and unhappy tenants.\n\nC&S Plumbing of Lee has been serving Fort Myers commercial clients since 1998, operating as a division of Draft Construction LLC. Our dual state licenses (CFC057076 and CFC1432485) qualify us for commercial plumbing projects of all sizes, from a single-suite tenant buildout in a strip mall to complete plumbing installations in multi-story mixed-use buildings.\n\nRestaurant and food service plumbing is a major part of our Fort Myers commercial work. We install, repair, and maintain grease traps and interceptors to keep your business compliant with Lee County pretreatment ordinances. We handle floor drain systems, commercial water heaters, three-compartment sink installations, and the high-volume drainage systems that food service operations demand. When a drain backs up during service hours, our commercial emergency response team can be on-site quickly to minimize business interruption.\n\nBackflow prevention is another critical commercial service. Fort Myers requires annual backflow preventer testing and certification for all commercial properties connected to the municipal water system. Our licensed backflow technicians perform testing, repair, and replacement of RPZ (Reduced Pressure Zone) and DC (Double Check) assemblies, and we file all required documentation with Lee County Utilities on your behalf.\n\nTenant buildouts and commercial renovations require a plumber who understands building codes, ADA requirements, and the coordination between trades that commercial construction demands. C&S works alongside general contractors, architects, and property managers to deliver plumbing installations that pass inspection the first time and perform reliably for years.\n\nWe also provide commercial maintenance contracts that include scheduled inspections, preventive drain cleaning, water heater maintenance, and priority emergency response — keeping your Fort Myers business running without unexpected plumbing disruptions.`,
    features: [
      {
        title: "Restaurant & Food Service Plumbing",
        description:
          "Grease trap installation and maintenance, commercial water heaters, floor drains, and high-volume drainage systems for Fort Myers restaurants.",
      },
      {
        title: "Backflow Testing & Certification",
        description:
          "Licensed annual backflow preventer testing, repair, and replacement with all documentation filed directly with Lee County Utilities.",
      },
      {
        title: "Tenant Buildout Plumbing",
        description:
          "Complete plumbing installation for new commercial tenant spaces — from permit to final inspection, coordinated with your GC and other trades.",
      },
      {
        title: "Commercial Emergency Response",
        description:
          "Priority emergency service for Fort Myers businesses to minimize downtime and revenue loss from plumbing failures.",
      },
      {
        title: "Preventive Maintenance Contracts",
        description:
          "Scheduled inspections, drain cleaning, and water heater maintenance to prevent costly emergency calls and code violations.",
      },
      {
        title: "Multi-Story & Mixed-Use",
        description:
          "Experienced with the riser systems, booster pumps, and multi-floor drainage requirements of Fort Myers' growing inventory of mixed-use buildings.",
      },
    ],
    city: "Fort Myers",
    state: "FL",
    neighborhoods: [
      "Downtown Fort Myers",
      "Colonial Blvd Corridor",
      "Metro Pkwy",
      "Gateway",
      "Daniels Pkwy",
      "Page Field area",
    ],
    faqs: [
      {
        question: "Do you handle commercial plumbing emergencies in Fort Myers?",
        answer:
          "Yes. We provide priority emergency service for commercial clients in Fort Myers. A plumbing failure during business hours means lost revenue, potential health code issues, and unhappy customers or tenants. Our commercial emergency team responds quickly with the equipment and parts to resolve most issues in a single visit. Call 833-PLUMB-IT for immediate commercial dispatch.",
      },
      {
        question: "How often does a Fort Myers restaurant need grease trap service?",
        answer:
          "Lee County requires grease traps to be cleaned before they reach 25% capacity with fats, oils, and grease. For most Fort Myers restaurants, this means professional cleaning every 1–3 months depending on volume. C&S provides scheduled grease trap maintenance on a frequency tailored to your operation, keeping you compliant with pretreatment ordinances and preventing drain backups.",
      },
      {
        question: "Do you provide backflow testing in Fort Myers?",
        answer:
          "Yes. Our licensed backflow technicians perform annual testing and certification of RPZ and Double Check assemblies as required by Fort Myers and Lee County Utilities. We handle the complete process — testing, any needed repairs or replacements, and filing the certification paperwork with the utility. We also send reminders when your annual test is due.",
      },
      {
        question: "Can you handle tenant buildout plumbing for Fort Myers commercial spaces?",
        answer:
          "Absolutely. We regularly work on tenant buildouts in Fort Myers commercial plazas, strip malls, and office buildings. Our scope includes design-assist for plumbing layouts, permit applications, rough-in, top-out, and trim plumbing, fixture installation, and inspection coordination. We work seamlessly with general contractors and other trades to keep your buildout on schedule.",
      },
      {
        question: "Do you offer commercial plumbing maintenance contracts?",
        answer:
          "Yes. Our commercial maintenance contracts include quarterly or semi-annual inspections, preventive drain cleaning, water heater maintenance, backflow testing, and priority emergency response. Maintenance contract clients receive discounted service rates and guaranteed response times. The contract pays for itself by preventing emergency calls and extending equipment life.",
      },
      {
        question: "Are you licensed for commercial plumbing in Fort Myers?",
        answer:
          "Yes. C&S Plumbing holds two active Florida state plumbing contractor licenses: CFC057076 and CFC1432485. We operate as a division of Draft Construction LLC and are fully licensed, insured, and bonded for commercial plumbing work throughout Lee County and Southwest Florida. We've been a licensed commercial contractor since 1998.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Fort Myers", href: "/emergency-plumber-fort-myers" },
      { label: "Fort Myers Service Area", href: "/areas/fort-myers" },
      { label: "Commercial Plumbing Services", href: "/services/commercial" },
    ],
  },

  // ============================================
  // 11. NEW CONSTRUCTION PLUMBING - CAPE CORAL
  // ============================================
  {
    slug: "new-construction-plumbing-cape-coral",
    metaTitle: "New Construction Plumber Cape Coral | 8,500+ Homes",
    metaDescription:
      "Cape Coral new construction plumbing by the team that's built 8,500+ homes. Canal-lot experts, builder partnerships. Licensed CFC1432485. Call 833-PLUMB-IT today.",
    keywords: [
      "new construction plumbing Cape Coral",
      "Cape Coral new construction plumber",
      "new home plumbing Cape Coral FL",
      "builder plumber Cape Coral",
      "Cape Coral construction plumbing contractor",
      "rough in plumbing Cape Coral",
      "new build plumbing Cape Coral Florida",
      "Cape Coral plumbing contractor new homes",
      "canal lot plumbing Cape Coral",
      "residential construction plumber Cape Coral",
    ],
    h1: "New Construction Plumbing in Cape Coral, FL",
    sectionHeading: "New construction plumbing for Cape Coral builders",
    heroSubtext:
      "8,500+ homes built. C&S Plumbing is the new construction partner Cape Coral builders trust for canal-lot expertise, code compliance, and on-schedule delivery.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Cape Coral is building again. With thousands of vacant lots still available across the city and a steady stream of new residents moving to Southwest Florida, new home construction in Cape Coral has returned to levels not seen since the mid-2000s boom. And just like during that boom, C&S Plumbing of Lee is on the job — bringing more than 28 years of new construction experience and over 8,500 completed homes to every project.\n\nNew construction plumbing in Cape Coral is not the same as building a home in Orlando, Tampa, or anywhere else in Florida. Cape Coral's canal-lot homes require specialized knowledge that only comes from decades of experience building in this specific environment. The high water table means slab elevations must account for hydrostatic pressure on below-slab drain lines. Sandy soil requires careful compaction around underground pipes to prevent settling. Saltwater proximity demands corrosion-resistant materials and connections. And the City of Cape Coral's building department has specific plumbing code requirements that differ from other Lee County municipalities.\n\nC&S Plumbing handles every phase of new construction plumbing in Cape Coral. During the underground rough-in phase, we install drain, waste, and vent lines beneath the slab with proper slope and bedding to ensure long-term performance in Cape Coral's sandy soil. Our top-out phase routes supply lines and completes the DWV system through walls and the roof. The trim phase installs all fixtures, connects appliances, and completes the final pressure test before occupancy.\n\nWe've built long-standing partnerships with Cape Coral's most active builders because we deliver what matters most to them: quality work that passes inspection the first time, on-schedule completion that doesn't hold up other trades, and competitive pricing that helps keep new homes affordable. Our project managers coordinate directly with builder superintendents to ensure seamless scheduling across multi-lot subdivisions.\n\nEvery C&S new construction project uses PEX-A supply lines with home-run manifold systems for optimal water pressure and easy future maintenance, Schedule 40 PVC drain lines sized for Cape Coral's code requirements, and quality fixtures from brands we trust. We also install water heaters, hose bibbs, irrigation connections, and any specialty plumbing — outdoor kitchens, pool baths, summer kitchens — that Cape Coral's resort-style homes demand.`,
    features: [
      {
        title: "8,500+ Homes Built",
        description:
          "More new construction plumbing experience in Lee County than virtually any other plumbing contractor. We've seen every challenge Cape Coral can throw at a builder.",
      },
      {
        title: "Canal-Lot Expertise",
        description:
          "Specialized knowledge of the high water table, sandy soil, and saltwater proximity conditions unique to Cape Coral canal-lot home construction.",
      },
      {
        title: "Builder Partnership Model",
        description:
          "Dedicated project managers coordinate with your superintendent for multi-lot scheduling, first-pass inspections, and competitive volume pricing.",
      },
      {
        title: "PEX-A Manifold Systems",
        description:
          "Modern home-run supply systems that maximize water pressure, minimize joints, and allow easy future maintenance or repair.",
      },
      {
        title: "Full Phase Coverage",
        description:
          "Underground rough-in, top-out, and trim — we handle every plumbing phase so builders have a single point of contact from slab to CO.",
      },
      {
        title: "First-Pass Inspection Record",
        description:
          "Our crews know what Cape Coral inspectors look for, and our work is built to pass the first time — keeping your project on schedule.",
      },
    ],
    city: "Cape Coral",
    state: "FL",
    neighborhoods: CAPE_CORAL_NEIGHBORHOODS,
    faqs: [
      {
        question: "How many new homes has C&S Plumbing built in Cape Coral?",
        answer:
          "C&S Plumbing has completed plumbing installations in over 8,500 new homes across Lee County since 1998, with a significant portion in Cape Coral. We've worked with dozens of local builders through Cape Coral's building booms and continue to be one of the most active new construction plumbers in the city.",
      },
      {
        question: "What makes Cape Coral new construction plumbing different?",
        answer:
          "Cape Coral's canal-lot environment creates unique requirements: high water tables require careful consideration of below-slab pipe routing and hydrostatic pressure, sandy soil demands proper compaction and bedding around underground pipes, and saltwater proximity necessitates corrosion-resistant materials. The City of Cape Coral also has specific plumbing code requirements that differ from other municipalities. Experience building in these conditions is critical to long-term plumbing performance.",
      },
      {
        question: "Do you work with builders or only homeowners?",
        answer:
          "Both. A large part of our business is builder partnerships — we provide new construction plumbing for production builders, custom home builders, and general contractors throughout Cape Coral. We also work directly with homeowners building custom homes on their own lots. Our project managers handle scheduling and coordination regardless of the project structure.",
      },
      {
        question: "What pipe materials do you use for new construction in Cape Coral?",
        answer:
          "We use PEX-A (cross-linked polyethylene) for supply lines, configured in a home-run manifold system that maximizes water pressure and minimizes potential failure points. Drain, waste, and vent lines are Schedule 40 PVC, properly sized for Cape Coral's code requirements. All materials are selected for long-term performance in Cape Coral's specific water and soil conditions.",
      },
      {
        question: "How do you handle scheduling for multi-lot Cape Coral subdivisions?",
        answer:
          "Our dedicated project managers create a phased schedule that coordinates with your construction timeline across multiple lots. We stage crews to complete underground rough-ins in sequence, then follow with top-out and trim phases as each home progresses. This approach keeps your project flowing without plumbing delays and allows us to maintain consistent quality across every unit.",
      },
      {
        question: "Does C&S handle Cape Coral plumbing permits for new construction?",
        answer:
          "Yes. We handle all plumbing permit applications with the City of Cape Coral building department and coordinate inspections for each phase — underground, top-out, and final. Our strong working relationship with Cape Coral inspectors and our knowledge of current code requirements help ensure first-pass inspections that keep your project on schedule.",
      },
      {
        question: "Can you install specialty plumbing for Cape Coral custom homes?",
        answer:
          "Absolutely. Cape Coral custom homes often include outdoor kitchens, summer kitchens, pool baths, wine rooms with wet bars, and elaborate master bathroom suites. We handle all specialty plumbing including gas line rough-ins for outdoor grills, pot filler installations, freestanding tub connections, multiple shower head systems, and irrigation tie-ins. Our experience with 8,500+ homes means we've installed virtually every specialty fixture and configuration imaginable.",
      },
    ],
    relatedPages: [
      { label: "Repiping in Cape Coral", href: "/repiping-cape-coral" },
      { label: "Cape Coral Service Area", href: "/areas/cape-coral" },
      { label: "New Construction Services", href: "/services/new-construction" },
    ],
  },

  // ============================================
  // 12. WATER DAMAGE REPAIR - FORT MYERS
  // ============================================
  {
    slug: "water-damage-repair-fort-myers",
    metaTitle: "Water Damage Repair Fort Myers | Plumbing Experts",
    metaDescription:
      "Plumbing-caused water damage repair in Fort Myers, FL. Slab leaks, pipe bursts & cast iron failures fixed at the source. Licensed CFC1432485. Call 833-PLUMB-IT now.",
    keywords: [
      "water damage repair Fort Myers",
      "plumbing water damage Fort Myers FL",
      "slab leak water damage Fort Myers",
      "burst pipe damage Fort Myers",
      "pipe leak damage repair Fort Myers",
      "water damage plumber Fort Myers",
      "Fort Myers water damage restoration plumbing",
      "cast iron pipe failure Fort Myers",
      "water damage from pipes Fort Myers",
      "Fort Myers plumbing leak damage",
    ],
    h1: "Water Damage Repair in Fort Myers, FL",
    sectionHeading: "Water damage repair for Fort Myers homes",
    heroSubtext:
      "When pipes fail in Fort Myers homes, water damage follows fast. C&S Plumbing finds the source, makes the repair, and restores what was damaged — call 833-PLUMB-IT.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Water damage from plumbing failures is one of the most stressful experiences a Fort Myers homeowner can face. A pipe bursts inside a wall, a slab leak saturates your foundation, or a cast iron drain line collapses under the house — and suddenly your home is a construction zone. The key to minimizing damage and cost is having a plumber who can find and fix the plumbing source quickly, then help coordinate the restoration that follows.\n\nFort Myers' housing stock creates distinct water damage risks depending on the age and construction of your home. In older neighborhoods like the River District, McGregor Boulevard corridor, and Whiskey Creek, the primary threats are galvanized steel supply lines that corrode and burst, and cast iron drain pipes that develop holes and leak sewage under or inside the home. These failures can be catastrophic — a galvanized pipe that's been slowly thinning for decades can suddenly split, dumping water at full municipal pressure into your walls.\n\nCast iron drain failures are particularly damaging in Fort Myers' pre-1975 homes. When a horizontal cast iron drain line under the slab corrodes through, sewage leaks into the soil beneath your foundation. By the time you notice signs — persistent sewage odor, slow drains, or wet spots on the floor — the damage may have been accumulating for months. Our camera inspection and electronic detection equipment identifies the exact failure point so we can make a targeted repair rather than replacing the entire drain system.\n\nSlab leaks in Fort Myers are driven by soil conditions and pipe stress. The Caloosahatchee River corridor and low-lying areas near Iona and the Villas experience soil settlement and high water tables that put constant pressure on below-slab pipes. Copper supply lines develop pinhole leaks from electrolysis and soil contact, and CPVC connections crack from thermal cycling. Our non-invasive detection methods find these leaks without tearing up your floor.\n\nPost-storm pipe damage adds another layer. Hurricanes and tropical storms can shift foundations, crack underground pipes, and force debris into drain systems. C&S has responded to plumbing-related water damage after every major storm in Fort Myers since Hurricane Charley, and our crews know how to triage storm damage efficiently.\n\nOur water damage response includes immediate leak isolation, plumbing repair, water extraction and structural drying, and full insurance documentation. We work with your insurance company and coordinate with restoration partners for any work beyond the plumbing scope.`,
    features: [
      {
        title: "Plumbing Source Identification",
        description:
          "We find the exact pipe failure causing the damage using cameras and electronic detection before beginning any repair work.",
      },
      {
        title: "Cast Iron Pipe Replacement",
        description:
          "Expert replacement of failing cast iron drain lines in Fort Myers' older homes — the most common hidden cause of sewage-related water damage.",
      },
      {
        title: "Non-Invasive Slab Leak Repair",
        description:
          "Acoustic and thermal detection locates under-slab leaks precisely, minimizing demolition and reducing restoration costs.",
      },
      {
        title: "Emergency Water Extraction",
        description:
          "Commercial-grade water removal equipment deployed immediately to minimize damage to your Fort Myers home's structure and finishes.",
      },
      {
        title: "Insurance Documentation & Coordination",
        description:
          "Detailed photo documentation, written damage reports, and direct communication with your adjuster to support your claim.",
      },
    ],
    city: "Fort Myers",
    state: "FL",
    neighborhoods: FORT_MYERS_NEIGHBORHOODS,
    faqs: [
      {
        question: "What causes water damage in older Fort Myers homes?",
        answer:
          "The most common causes in Fort Myers' older homes are galvanized steel supply pipes that corrode internally and eventually burst, cast iron drain lines that develop holes after 40–50 years, and slab leaks from copper pipe corrosion beneath the foundation. Homes built before 1975 are at the highest risk for these failures. Even one previous leak is a strong indicator that more failures are likely without proactive repiping.",
      },
      {
        question: "How do you find hidden water leaks in Fort Myers homes?",
        answer:
          "We use a combination of electronic acoustic detection (which listens for the sound of pressurized water escaping from pipes), thermal imaging (which identifies temperature differences caused by leaking water), and HD camera inspections of drain lines. These non-invasive methods allow us to pinpoint the failure point without exploratory demolition, saving you time and money on the repair.",
      },
      {
        question: "Will my Fort Myers homeowner insurance cover pipe-related water damage?",
        answer:
          "Most policies cover sudden and accidental water damage from plumbing failures — burst pipes, slab leaks, and water heater failures. Gradual damage from a slow leak that went unnoticed may have limited coverage. C&S documents every repair with photos, measurements, and detailed reports specifically formatted for insurance claims. We can also communicate directly with your adjuster.",
      },
      {
        question: "How long does water damage repair take in Fort Myers?",
        answer:
          "The plumbing repair itself typically takes 1 day for most pipe bursts and slab leaks. Structural drying takes 3–5 days depending on the extent of saturation. Full restoration (drywall, flooring, painting) varies by scope — minor damage may take a few additional days, while extensive damage requiring mold remediation and major reconstruction can take 2–4 weeks. We coordinate the entire timeline with you.",
      },
      {
        question: "Is cast iron pipe failure common in Fort Myers?",
        answer:
          "Very common. Cast iron was the standard drain pipe material through the mid-1970s, and Fort Myers has thousands of homes from that era. After 40–50 years in Florida's humid environment with acidic soil conditions, cast iron corrodes, develops holes, and eventually collapses. Signs include persistent sewage odor, slow drains, fruit flies near floor drains, and wet spots in the yard. A camera inspection can confirm the condition of your cast iron pipes.",
      },
      {
        question: "Can water damage lead to mold in Fort Myers homes?",
        answer:
          "Yes, and quickly. Fort Myers' subtropical humidity means mold can begin colonizing wet building materials within 24–48 hours of water exposure. This is why rapid response is critical — the sooner the water source is stopped and structural drying begins, the lower the risk of mold growth. C&S deploys water extraction and drying equipment as part of our water damage response to minimize this risk.",
      },
    ],
    relatedPages: [
      { label: "Emergency Plumber Fort Myers", href: "/emergency-plumber-fort-myers" },
      { label: "Repiping in Fort Myers", href: "/repiping-fort-myers" },
      { label: "Leak Repair Services", href: "/services/leak-repair" },
    ],
  },

  // ============================================
  // 13. WATER HEATER REPAIR - FORT MYERS
  // ============================================
  {
    slug: "water-heater-repair-fort-myers",
    metaTitle: "Water Heater Repair Fort Myers | Same-Day Service",
    metaDescription:
      "Water heater repair in Fort Myers, FL. Tank, tankless & hybrid units fixed fast — often same day. Licensed CFC1432485, family-owned since 1998. Call 833-PLUMB-IT.",
    keywords: [
      "water heater repair Fort Myers",
      "water heater repair Fort Myers FL",
      "water heater replacement Fort Myers",
      "tankless water heater Fort Myers",
      "no hot water Fort Myers",
      "water heater leaking Fort Myers",
      "hot water heater service Fort Myers",
      "same day water heater repair Fort Myers",
      "water heater installation Fort Myers",
    ],
    h1: "Water Heater Repair in Fort Myers, FL",
    sectionHeading: "Why Fort Myers water heaters fail early",
    heroSubtext:
      "No hot water is not a tomorrow problem. C&S Plumbing repairs and replaces tank, tankless, and hybrid water heaters across Fort Myers — often the same day you call.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Fort Myers water heaters work harder than the labels suggest. Lee County's hard water leaves mineral scale on heating elements and tank bottoms, which is why a unit rated for 10–12 years often starts failing at year seven or eight here. If your showers run lukewarm, your tank pops and rumbles as it heats, or you've found rust-tinted water at the tap, the scale has likely already done its work.\n\nC&S Plumbing has repaired and replaced water heaters across Fort Myers since 1998 — from older homes along McGregor Boulevard with units tucked in garages and utility closets, to newer Gateway and Daniels Corridor homes with attic installations where a slow leak can soak a ceiling before anyone notices. We diagnose first and quote before any work begins: sometimes the fix is a heating element, a thermostat, or a relief valve, not a whole new unit.\n\nWhen replacement is the right call, we'll size the new unit to how your household actually uses hot water. We install standard tank, tankless, and hybrid heat-pump water heaters, and we'll give you a straight comparison of operating costs instead of pushing the most expensive option. Tankless conversions are popular in Fort Myers for good reason — endless hot water and less floor space — but they're not right for every home, and we'll tell you when they're not.\n\nEvery installation includes the Lee County permit, pan and expansion tank where code requires, and haul-away of the old unit. With two active Florida licenses (CFC057076 and CFC1432485) and a 5.0 Google rating, C&S is the water heater crew Fort Myers homeowners call when they want it done once and done right.`,
    features: [
      {
        title: "Same-Day Repair & Replacement",
        description:
          "Common 40- and 50-gallon tanks are stocked and ready. Morning calls are usually back in hot water by dinner.",
      },
      {
        title: "Repair-First Diagnosis",
        description:
          "Elements, thermostats, and valves get fixed when fixing makes sense — we don't sell you a new tank you don't need.",
      },
      {
        title: "Tank, Tankless & Hybrid",
        description:
          "Honest sizing and cost comparison across all three options, matched to your home's gas or electric supply.",
      },
      {
        title: "Permitted & Inspected",
        description:
          "Lee County permit and inspection handled on every replacement, with pan and expansion tank installed where code requires.",
      },
      {
        title: "Hard-Water Protection",
        description:
          "Anode rod checks and softener recommendations that extend the life of the next unit, not just this one.",
      },
    ],
    city: "Fort Myers",
    state: "FL",
    neighborhoods: FORT_MYERS_NEIGHBORHOODS,
    faqs: [
      {
        question: "How fast can you repair a water heater in Fort Myers?",
        answer:
          "Most Fort Myers water heater calls are handled same day. We stock common replacement parts and standard tank sizes on our trucks, and our North Fort Myers shop is minutes from most Fort Myers neighborhoods. Call 833-PLUMB-IT in the morning and you're usually back in hot water that evening.",
      },
      {
        question: "Should I repair or replace my water heater?",
        answer:
          "As a rule of thumb: if the tank itself is leaking, replacement is the only fix. If the unit is under 8 years old and the problem is an element, thermostat, or valve, repair usually makes sense. We diagnose first, explain what failed, and quote both paths when both are realistic — the choice is yours.",
      },
      {
        question: "Why do water heaters fail faster in Fort Myers?",
        answer:
          "Hard water. Lee County water carries enough dissolved minerals that scale builds up on heating elements and tank bottoms years ahead of the national average. Scale makes the unit work harder, raises your electric bill, and eventually burns out elements or corrodes the tank. Annual flushes and a healthy anode rod buy years of extra life.",
      },
      {
        question: "Do you install tankless water heaters in Fort Myers?",
        answer:
          "Yes — we install gas and electric tankless units, including the upgraded gas line or electrical circuit most conversions require. Tankless works well for many Fort Myers homes, but we'll assess your usage and infrastructure first and tell you honestly whether the conversion cost pays off for your household.",
      },
      {
        question: "Is a permit required to replace a water heater in Fort Myers?",
        answer:
          "Yes. Lee County requires a permit for water heater replacement, and unpermitted installs can cause problems with insurance claims and home sales. C&S pulls the permit and schedules the inspection on every job — it's included, not an upsell. Our licenses are CFC057076 and CFC1432485.",
      },
      {
        question: "My water heater is leaking — what should I do right now?",
        answer:
          "Shut off the cold-water supply valve on top of the unit, and if it's electric, flip the breaker (gas: turn the dial to OFF). Then call 833-PLUMB-IT — we answer 24/7. A leaking tank won't fix itself, and water damage gets more expensive by the hour.",
      },
    ],
    relatedPages: [
      { label: "Water Heater Services", href: "/services/water-heaters" },
      { label: "Emergency Plumber in Fort Myers", href: "/emergency-plumber-fort-myers" },
      { label: "Fort Myers Service Area", href: "/areas/fort-myers" },
    ],
  },

  // ============================================
  // 14. DRAIN CLEANING - FORT MYERS
  // ============================================
  {
    slug: "drain-cleaning-fort-myers",
    metaTitle: "Drain Cleaning Fort Myers | Camera Inspection & Jetting",
    metaDescription:
      "Professional drain cleaning in Fort Myers, FL. Hydro-jetting, camera inspection & root removal for slow or backed-up drains. 5-star rated. Call 833-PLUMB-IT.",
    keywords: [
      "drain cleaning Fort Myers",
      "drain cleaning Fort Myers FL",
      "clogged drain Fort Myers",
      "sewer backup Fort Myers",
      "hydro jetting Fort Myers",
      "drain camera inspection Fort Myers",
      "root removal drains Fort Myers",
      "main line clog Fort Myers",
      "slow drain repair Fort Myers",
    ],
    h1: "Drain Cleaning in Fort Myers, FL",
    sectionHeading: "Clearing Fort Myers drains the right way",
    heroSubtext:
      "A drain that keeps clogging is telling you something. C&S Plumbing clears Fort Myers drains and then shows you why they clogged — with a camera, not a guess.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Fort Myers is a tale of two drain systems. The established neighborhoods — McGregor, the River District, Whiskey Creek — were largely plumbed with cast iron drain lines that are now fifty-plus years old, rusting rough on the inside and narrowing a little more every year. The newer communities east of I-75 run PVC, but sit among some of the most aggressively rooted landscaping in Florida. Either way, the result lands in the same place: drains that slow down, back up, and keep coming back no matter how much store-bought chemical gets poured at them.\n\nC&S Plumbing clears drains across Fort Myers with the equipment the problem actually calls for. Cable machines handle everyday kitchen, tub, and toilet clogs. For main lines, recurring backups, and grease-bound pipe, we hydro-jet — high-pressure water that scours the pipe wall clean instead of just punching a hole through the blockage. And before we recommend anything beyond a basic clearing, we run a camera down the line so you can see exactly what we see.\n\nThat camera matters in Fort Myers more than most places. In older neighborhoods, what looks like a simple clog is often a bellied or root-invaded section of original cast iron — and clearing it monthly is more expensive than fixing it once. Mature ficus and oak roots around McGregor-area homes find their way into pipe joints with remarkable persistence. We'll show you the footage, explain the options, and quote spot repair, lining, or replacement honestly. Sometimes the answer really is just a good jetting and an annual maintenance schedule.\n\nFamily-owned since 1998, licensed under CFC057076 and CFC1432485, and rated 5.0 on Google — C&S is the drain crew Fort Myers homeowners call when they're tired of renting the same clog twice.`,
    features: [
      {
        title: "Camera Inspection Included",
        description:
          "On main-line and recurring clogs we scope the pipe and show you the footage — you see the problem before you pay to fix it.",
      },
      {
        title: "Hydro-Jetting",
        description:
          "High-pressure water scours grease, scale, and roots off the full pipe wall — the clog doesn't grow back next month.",
      },
      {
        title: "Root Intrusion Removal",
        description:
          "Mechanical cutting and jetting for the tree roots that work into older Fort Myers drain joints.",
      },
      {
        title: "Cast Iron Specialists",
        description:
          "Honest assessment of aging cast iron lines — cleaning, spot repair, or replacement, quoted straight.",
      },
      {
        title: "24/7 Backup Response",
        description:
          "Sewage backups don't keep office hours. Emergency drain calls are answered around the clock at 833-PLUMB-IT.",
      },
    ],
    city: "Fort Myers",
    state: "FL",
    neighborhoods: FORT_MYERS_NEIGHBORHOODS,
    faqs: [
      {
        question: "Why does my Fort Myers drain keep clogging after I clear it?",
        answer:
          "A clog that returns is almost always a pipe problem, not a usage problem. In older Fort Myers neighborhoods the usual culprits are corroded cast iron with a rough interior that catches debris, a bellied (sagging) section that holds water, or tree roots at a joint. A camera inspection identifies which one you have — then you can fix the cause instead of re-renting the symptom.",
      },
      {
        question: "What is hydro-jetting and do I need it?",
        answer:
          "Hydro-jetting uses high-pressure water to scrub the entire inside wall of the pipe, removing grease, scale, and root fragments that a cable machine just pokes through. It's the right call for recurring main-line clogs and grease-heavy kitchen lines. For a one-off hair clog in a bathroom sink, a standard cable clearing is cheaper and perfectly adequate — we'll tell you which you need.",
      },
      {
        question: "Can tree roots really get inside drain pipes?",
        answer:
          "Constantly — it's one of the most common drain problems in established Fort Myers neighborhoods like McGregor and Whiskey Creek. Roots are drawn to the moisture at pipe joints, work in through tiny gaps, and grow into a net that catches everything. We cut and jet the roots out, then show you on camera whether the pipe joint needs a permanent repair.",
      },
      {
        question: "Do you handle sewage backups in Fort Myers?",
        answer:
          "Yes, 24/7. A sewage backup is a health hazard and qualifies as an emergency — call 833-PLUMB-IT any hour. We clear the main line, camera it to find the cause, and document the condition, which helps if an insurance claim is involved.",
      },
      {
        question: "How much does drain cleaning cost in Fort Myers?",
        answer:
          "It depends on the drain and the blockage, so we quote upfront before work begins rather than publishing a teaser price that doubles on site. Simple fixture clearings cost less; main-line jetting with camera inspection costs more. The price we quote is the price you pay — that's been C&S policy since 1998.",
      },
    ],
    relatedPages: [
      { label: "Drain Cleaning Services", href: "/services/drain-cleaning" },
      { label: "Drain Cleaning in Cape Coral", href: "/drain-cleaning-cape-coral" },
      { label: "Fort Myers Service Area", href: "/areas/fort-myers" },
    ],
  },

  // ============================================
  // 15. EMERGENCY PLUMBER - PUNTA GORDA
  // ============================================
  {
    slug: "emergency-plumber-punta-gorda",
    metaTitle: "Emergency Plumber Punta Gorda | 24/7 Service",
    metaDescription:
      "24/7 emergency plumber serving Punta Gorda, FL. Burst pipes, water heater failures & backups. Licensed CFC1432485, family-owned since 1998. Call 833-PLUMB-IT.",
    keywords: [
      "emergency plumber Punta Gorda",
      "24 hour plumber Punta Gorda FL",
      "burst pipe repair Punta Gorda",
      "after hours plumber Punta Gorda",
      "emergency plumbing Punta Gorda",
      "weekend plumber Punta Gorda",
      "water heater emergency Punta Gorda",
      "Charlotte County emergency plumber",
    ],
    h1: "Emergency Plumber Serving Punta Gorda, FL",
    sectionHeading: "When a Punta Gorda pipe fails at 2 AM",
    heroSubtext:
      "Burst pipe, failed water heater, sewage backup — the emergency line at 833-PLUMB-IT is answered 24/7, and a licensed plumber rolls to Punta Gorda, not an answering service promise.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Plumbing emergencies in Punta Gorda have a way of finding the worst possible moment — the supply line that lets go while you're at dinner on Marion Avenue, the water heater that dumps forty gallons into the garage on a Sunday morning, the main drain that backs up with a house full of guests. When it happens, you need two things: someone who answers the phone, and someone who actually shows up.\n\nC&S Plumbing of Lee covers Punta Gorda and Charlotte County 24 hours a day from our shop in North Fort Myers — a straight run up US-41 or I-75 that puts us at most Punta Gorda addresses in 25 to 35 minutes. The person who answers 833-PLUMB-IT dispatches a licensed plumber with a stocked truck, and we quote before work begins, even at midnight. No call-center runaround, no surprise overtime math.\n\nPunta Gorda's housing mix shapes the emergencies we see. Canal-front homes in Punta Gorda Isles and Burnt Store Isles carry salt-air-exposed exterior plumbing and water heaters that fail with less warning than their inland counterparts. Older homes around the Historic District still run original supply lines reaching the end of their service life. And homes rebuilt after Hurricane Charley are now twenty years on — old enough that the water heaters and fixtures installed in the rebuild wave are failing in batches.\n\nC&S has worked Southwest Florida storm recoveries since Charley in 2004, holds two active Florida licenses (CFC057076 and CFC1432485), and carries a 5.0 Google rating. When Punta Gorda needs a plumber right now, this is the number that gets answered.`,
    features: [
      {
        title: "True 24/7 Dispatch",
        description:
          "The emergency line is answered around the clock, every day of the year — nights, weekends, and holidays included.",
      },
      {
        title: "25–35 Minute Run from Our Shop",
        description:
          "North Fort Myers to Punta Gorda is a straight shot up US-41 or I-75 — Charlotte County calls get real response, not next-day promises.",
      },
      {
        title: "Quote Before Work Begins",
        description:
          "Written pricing before we start, even on after-hours calls. No surprise overtime surcharges.",
      },
      {
        title: "Stocked Emergency Trucks",
        description:
          "Common water heaters, supply line fittings, and shutoff valves ride on the truck — most emergencies are fixed in one visit.",
      },
      {
        title: "Storm & Hurricane Response",
        description:
          "Post-storm plumbing triage experience in every major Southwest Florida storm since Hurricane Charley in 2004.",
      },
    ],
    city: "Punta Gorda",
    state: "FL",
    neighborhoods: PUNTA_GORDA_NEIGHBORHOODS,
    faqs: [
      {
        question: "How fast can an emergency plumber reach Punta Gorda?",
        answer:
          "Our shop is at 951 Pondella Rd in North Fort Myers, about 25–35 minutes from most Punta Gorda neighborhoods via US-41 or I-75. Emergency calls are dispatched immediately, 24/7 — call 833-PLUMB-IT and a licensed plumber is on the way.",
      },
      {
        question: "What should I do while I wait for the plumber?",
        answer:
          "Shut off the water at the main valve — in most Punta Gorda homes it's near the water meter at the street or where the supply line enters the house. For a leaking water heater, close the cold-water valve on top of the unit and kill the breaker. Stopping the water buys time and limits damage; we'll walk you through it on the phone if you can't find the valve.",
      },
      {
        question: "Do you charge extra for night and weekend calls in Punta Gorda?",
        answer:
          "We charge a flat diagnostic fee for emergency calls regardless of the hour, and every repair is quoted in writing before work begins. The price we quote is the price you pay — no hidden overtime multipliers.",
      },
      {
        question: "Do you handle emergencies in Punta Gorda Isles canal homes?",
        answer:
          "Yes. PGI and Burnt Store Isles homes have their own failure patterns — salt-air-corroded exterior fixtures, garage water heaters past their prime, and slab-on-grade supply lines where leaks hide until the floor feels warm. We've worked Southwest Florida waterfront homes since 1998.",
      },
      {
        question: "Are you licensed to work in Charlotte County?",
        answer:
          "Yes. C&S Plumbing holds two active Florida state plumbing contractor licenses — CFC057076 and CFC1432485 — valid throughout Florida, including Charlotte County. Where follow-up permitted work is needed after an emergency repair, we pull the Charlotte County permit and handle the inspection.",
      },
    ],
    relatedPages: [
      { label: "Punta Gorda Service Area", href: "/areas/punta-gorda" },
      { label: "Water Heater Replacement in Punta Gorda", href: "/water-heater-replacement-punta-gorda" },
      { label: "Leak Repair Services", href: "/services/leak-repair" },
    ],
  },

  // ============================================
  // 16. WATER HEATER REPLACEMENT - PUNTA GORDA
  // ============================================
  {
    slug: "water-heater-replacement-punta-gorda",
    metaTitle: "Water Heater Replacement Punta Gorda | Tank & Tankless",
    metaDescription:
      "Water heater replacement in Punta Gorda, FL. Tank, tankless & hybrid installs with Charlotte County permits handled. Family-owned since 1998. Call 833-PLUMB-IT.",
    keywords: [
      "water heater replacement Punta Gorda",
      "water heater Punta Gorda FL",
      "water heater installation Punta Gorda",
      "tankless water heater Punta Gorda",
      "water heater repair Punta Gorda",
      "new water heater Punta Gorda",
      "hot water heater Punta Gorda",
      "Charlotte County water heater",
    ],
    h1: "Water Heater Replacement in Punta Gorda, FL",
    sectionHeading: "Replacing Punta Gorda's aging water heaters",
    heroSubtext:
      "If your water heater went in during the post-Charley rebuild, it's living on borrowed time. C&S replaces tank, tankless, and hybrid units across Punta Gorda — permits and haul-away included.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Punta Gorda is quietly working through a water heater replacement wave. Thousands of homes here were rebuilt or substantially renovated after Hurricane Charley in 2004, and the water heaters installed in that era are now well past the 10–12 years a unit is built to deliver. Add Ian-era repairs on top, and a large share of the city's water heaters are either due or overdue. The warning signs are familiar: lukewarm showers, rumbling and popping as the tank heats, rusty water at the hot tap, or moisture in the pan that wasn't there last month.\n\nC&S Plumbing replaces water heaters across Punta Gorda with the job done completely — Charlotte County permit pulled, pan and expansion tank installed where code requires, inspection scheduled, old unit hauled away. We stock common 40- and 50-gallon tanks, so a morning call is usually a same-day swap. For canal homes in Punta Gorda Isles and Burnt Store Isles, where garage units live with salt air year-round, we'll also talk frankly about placement and corrosion protection so the next unit lasts longer than the last one.\n\nThinking about going tankless? It's a genuinely good fit for many Punta Gorda homes — seasonal residents especially like not keeping fifty gallons hot for an empty house. But a tankless conversion needs the right gas or electrical supply, and the install cost is meaningfully higher. We'll size your usage, quote both options, and give you the honest math instead of a sales pitch.\n\nFamily-owned since 1998, two active Florida licenses (CFC057076 and CFC1432485), 8,500+ homes completed across Southwest Florida, and a 5.0 Google rating. When the water runs cold in Punta Gorda, call 833-PLUMB-IT.`,
    features: [
      {
        title: "Same-Day Tank Swaps",
        description:
          "Common tank sizes are in stock — call in the morning and you're usually back in hot water the same evening.",
      },
      {
        title: "Charlotte County Permits Handled",
        description:
          "Permit and final inspection included on every replacement, with pan and expansion tank installed where code requires.",
      },
      {
        title: "Tank, Tankless & Hybrid Options",
        description:
          "Honest sizing and operating-cost comparison — including whether tankless actually pays off for your household.",
      },
      {
        title: "Salt-Air Smart Installations",
        description:
          "Placement and corrosion-protection guidance for PGI and Burnt Store Isles garage units exposed to canal air.",
      },
      {
        title: "Old Unit Haul-Away",
        description:
          "The failed unit leaves with us — disposal is part of the job, not an extra line item.",
      },
    ],
    city: "Punta Gorda",
    state: "FL",
    neighborhoods: PUNTA_GORDA_NEIGHBORHOODS,
    faqs: [
      {
        question: "How long does a water heater replacement take in Punta Gorda?",
        answer:
          "A like-for-like tank replacement typically takes 2–3 hours on site, and with common sizes stocked we can usually do it the same day you call. Tankless conversions take 1–2 days because of the gas line or electrical upgrades most homes need.",
      },
      {
        question: "Do I need a permit to replace a water heater in Charlotte County?",
        answer:
          "Yes — Charlotte County requires a permit for water heater replacement, and an unpermitted install can complicate insurance claims and home sales later. C&S pulls the permit and schedules the inspection on every job. Our Florida licenses are CFC057076 and CFC1432485.",
      },
      {
        question: "My water heater was installed after Hurricane Charley — should I replace it?",
        answer:
          "If it's original to the post-Charley rebuild, it's roughly twenty years old — nearly double a typical service life. At that age, failure isn't a question of if but when, and tanks tend to fail by leaking. Replacing on your schedule beats replacing during a flooded-garage emergency, and a new unit will heat noticeably more efficiently.",
      },
      {
        question: "Is a tankless water heater worth it in Punta Gorda?",
        answer:
          "Often, yes — especially for seasonal residents who don't want a tank holding fifty hot gallons for an empty house half the year. The trade-off is a higher install cost and possible gas or electrical upgrades. We'll quote tank and tankless side by side with honest operating-cost math so you can decide with real numbers.",
      },
      {
        question: "Can you also fix my water heater instead of replacing it?",
        answer:
          "Yes. If the tank itself isn't leaking and the unit has reasonable life left, repairing an element, thermostat, or valve is often the smarter spend. We diagnose first and quote repair and replacement honestly whenever both are realistic options.",
      },
    ],
    relatedPages: [
      { label: "Punta Gorda Service Area", href: "/areas/punta-gorda" },
      { label: "Emergency Plumber in Punta Gorda", href: "/emergency-plumber-punta-gorda" },
      { label: "Water Heater Services", href: "/services/water-heaters" },
    ],
  },

  // ============================================
  // 17. DRAIN CLEANING - PORT CHARLOTTE
  // ============================================
  {
    slug: "drain-cleaning-port-charlotte",
    metaTitle: "Drain Cleaning Port Charlotte | Cast Iron Specialists",
    metaDescription:
      "Drain cleaning in Port Charlotte, FL. Camera inspection, hydro-jetting & cast iron drain solutions for 1970s–80s homes. 5-star rated. Call 833-PLUMB-IT.",
    keywords: [
      "drain cleaning Port Charlotte",
      "drain cleaning Port Charlotte FL",
      "clogged drain Port Charlotte",
      "sewer backup Port Charlotte",
      "cast iron drain repair Port Charlotte",
      "hydro jetting Port Charlotte",
      "drain camera inspection Port Charlotte",
      "main line clog Port Charlotte",
      "Charlotte County drain cleaning",
    ],
    h1: "Drain Cleaning in Port Charlotte, FL",
    sectionHeading: "Port Charlotte's forty-year-old drain problem",
    heroSubtext:
      "Most Port Charlotte homes still drain through original 1970s–80s cast iron. C&S clears the clog, cameras the line, and tells you the truth about what's down there.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Port Charlotte was platted and built out in a hurry — most of its housing stock went up in the 1970s and 1980s, and the majority of those homes still drain through their original cast iron pipe. Four decades in Florida's soil and humidity is a hard life for cast iron. The pipe interior rusts rough and scaly, the diameter narrows year over year, and eventually every shower drains slow, the toilets gurgle, and a backup becomes a quarterly event instead of a freak occurrence.\n\nC&S Plumbing approaches Port Charlotte drains with a simple rule: diagnose before prescribing. A cable machine handles the everyday clogs. For main lines and repeat offenders, we hydro-jet — high-pressure water that scours rust scale and grease off the full pipe wall rather than punching a temporary hole through the blockage. And on any recurring or main-line problem, we run a camera so you can see exactly what your pipe looks like from the inside before spending another dollar.\n\nThat footage drives an honest conversation. Sometimes the cast iron has years of life left and a jetting plus annual maintenance is genuinely the right answer. Sometimes there's a collapsed or channel-rotted section where spot repair or replacement stops the backup cycle for good. Around Gulf Cove, El Jobean, and the outlying sections, we also check the septic side of the equation — a "drain problem" in a well-and-septic home is sometimes a tank or drainfield problem wearing a disguise, and you deserve to know which before paying for the wrong fix.\n\nFamily-owned since 1998, licensed CFC057076 and CFC1432485, rated 5.0 on Google. When Port Charlotte drains slow down, call 833-PLUMB-IT.`,
    features: [
      {
        title: "Cast Iron Assessment",
        description:
          "Camera inspection shows the real condition of original 1970s–80s drain lines — clean, repair, or replace, quoted straight.",
      },
      {
        title: "Hydro-Jetting",
        description:
          "High-pressure scouring removes rust scale and grease from the full pipe wall, not just a hole through the clog.",
      },
      {
        title: "Main Line & Sewer Backups",
        description:
          "24/7 response for sewage backups, with the cause documented on camera for your records and insurance.",
      },
      {
        title: "Septic-Aware Diagnosis",
        description:
          "In well-and-septic areas like Gulf Cove and El Jobean, we rule out tank and drainfield issues before treating pipe symptoms.",
      },
      {
        title: "Upfront Pricing",
        description:
          "Quoted before work begins — the price we give is the price you pay, day or night.",
      },
    ],
    city: "Port Charlotte",
    state: "FL",
    neighborhoods: PORT_CHARLOTTE_NEIGHBORHOODS,
    faqs: [
      {
        question: "Why do drains clog so often in Port Charlotte homes?",
        answer:
          "Age. Most Port Charlotte homes were built in the 1970s and 1980s with cast iron drain lines that are now past forty years old. The pipe interior rusts rough and narrow, catching grease, paper, and debris that smooth pipe would pass. Cleaning helps, but once the pipe wall itself is the problem, a camera inspection tells you whether repair or replacement is the permanent fix.",
      },
      {
        question: "What does a drain camera inspection show?",
        answer:
          "Everything we can't see from the surface: rust scale and channel rot in cast iron, bellied sections that hold water, root intrusion at joints, and any collapsed pipe. We show you the footage and explain it in plain English — you see the evidence before you approve any work beyond the clearing.",
      },
      {
        question: "Is hydro-jetting safe for old cast iron pipes?",
        answer:
          "When the pipe is sound, yes — we camera the line first and adjust pressure to the pipe's condition. If the cast iron is too far gone for jetting, that's important information by itself, and we'll show you why and quote the repair options instead of jetting a pipe that can't take it.",
      },
      {
        question: "I'm on a septic system — can you still help with my drains?",
        answer:
          "Yes. Plenty of Port Charlotte homes in Gulf Cove, El Jobean, and the outlying sections run on septic. Slow drains in a septic home are sometimes a full tank or saturated drainfield rather than a pipe clog, and we diagnose which it is before recommending anything. We handle the house-side plumbing and coordinate with septic services when the tank is the issue.",
      },
      {
        question: "Do you respond to sewage backups in Port Charlotte after hours?",
        answer:
          "Yes — a sewage backup is a health hazard and gets emergency response 24/7. Our North Fort Myers shop reaches most of Port Charlotte in 30–40 minutes via US-41 or I-75. Call 833-PLUMB-IT any hour.",
      },
    ],
    relatedPages: [
      { label: "Port Charlotte Service Area", href: "/areas/port-charlotte" },
      { label: "Drain Cleaning Services", href: "/services/drain-cleaning" },
      { label: "Water Softeners & Treatment", href: "/services/water-softeners" },
    ],
  },

  // ============================================
  // 18. SEPTIC TO SEWER - NORTH FORT MYERS
  // ============================================
  {
    slug: "septic-to-sewer-north-fort-myers",
    metaTitle: "Septic to Sewer Conversion North Fort Myers | C&S Plumbing",
    metaDescription:
      "Septic-to-sewer conversion in North Fort Myers, FL by your hometown plumber. Permits, connection & septic decommissioning handled. Call 833-PLUMB-IT.",
    keywords: [
      "septic to sewer North Fort Myers",
      "septic to sewer conversion North Fort Myers",
      "sewer connection North Fort Myers",
      "sewer hookup North Fort Myers FL",
      "septic abandonment North Fort Myers",
      "Lee County sewer connection",
      "connect to sewer North Fort Myers",
      "septic tank decommissioning North Fort Myers",
    ],
    h1: "Septic-to-Sewer Conversion in North Fort Myers, FL",
    sectionHeading: "Converting our own hometown, one street at a time",
    heroSubtext:
      "When sewer service reaches your North Fort Myers street, the connection clock starts. C&S is headquartered right here on Pondella Rd — we handle the permit, the connection, and the septic decommissioning.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `North Fort Myers is C&S Plumbing's hometown — our shop has been at 951 Pondella Rd since the beginning — and a lot of our hometown still runs on septic tanks installed decades ago. As utility sewer service extends into more North Fort Myers neighborhoods, homeowners face a project most have never dealt with before: disconnecting from the septic tank, connecting the home to the new sewer line, and decommissioning the old tank to code. Done right, it's a few days of orderly work. Done wrong, it's torn-up yards, failed inspections, and change orders.\n\nC&S handles the homeowner's side of the conversion start to finish. We pull the Lee County plumbing permit, excavate and run the new sewer lateral from your house to the utility connection point, reroute the home's drain line, and properly abandon the septic tank — pumped, crushed or filled per code, and inspected. You get one contractor, one schedule, and one number to call, instead of coordinating an excavator, a plumber, and a septic hauler yourself.\n\nBecause we're local, we also give straight answers to the questions that actually matter: what the conversion does and doesn't include, how to plan for the utility's connection and capacity fees (those are billed by the utility, not the plumber), what happens to your yard and driveway, and whether your home's existing drain plumbing is ready for the switch. Older North Fort Myers homes sometimes need a section of aging drain line addressed at the same time — better to know before the trench is open than after it's closed.\n\nFamily-owned since 1998, two active Florida licenses (CFC057076 and CFC1432485), and thousands of jobs in Lee County soil. If your street is on the sewer map, call 833-PLUMB-IT and we'll walk the project with you before you commit to anything.`,
    features: [
      {
        title: "Complete Conversion, One Contractor",
        description:
          "Permit, excavation, sewer lateral, drain reroute, and septic decommissioning — handled end to end by one licensed crew.",
      },
      {
        title: "Code-Compliant Septic Abandonment",
        description:
          "Tank pumped and properly abandoned per Lee County requirements, with the inspection scheduled and passed.",
      },
      {
        title: "Hometown Response",
        description:
          "Our shop is on Pondella Rd — site visits, questions, and follow-ups happen fast because we're already here.",
      },
      {
        title: "Honest Project Scoping",
        description:
          "Clear breakdown of what the plumber's scope covers versus utility connection fees, so there are no surprise bills.",
      },
      {
        title: "Yard-Conscious Excavation",
        description:
          "Trench routes planned around driveways, trees, and irrigation — and the yard put back the way we found it.",
      },
    ],
    city: "North Fort Myers",
    state: "FL",
    neighborhoods: [
      "North Fort Myers",
      "Bayshore",
      "Pine Island Rd",
      "Pondella",
      "Hancock Bridge",
      "Tropicana",
      "Lochmoor",
      "Del Prado",
    ],
    faqs: [
      {
        question: "Do I have to connect to sewer when it reaches my North Fort Myers street?",
        answer:
          "Generally, yes — when utility sewer service becomes available, Florida law and local ordinance require connection within a set timeframe, and the utility will notify you of your deadline. The specifics vary by program and area, so check your notice or call us and we'll help you read it. Converting on your own schedule, early in the window, usually beats a deadline scramble.",
      },
      {
        question: "What does a septic-to-sewer conversion actually involve?",
        answer:
          "Three main pieces: running a new sewer lateral from your home to the utility's connection point at the property line, rerouting your home's drain line from the septic tank to that lateral, and decommissioning the old tank — pumped and crushed or filled per code. C&S handles all three under one Lee County permit, including the inspections.",
      },
      {
        question: "How much of the cost is plumbing versus utility fees?",
        answer:
          "They're separate bills, and it's important to know which is which. The utility charges its own connection and capacity fees directly. C&S quotes the plumbing side — lateral, reroute, tank abandonment, permit — upfront and in writing before any digging starts, so the total picture is clear before you commit.",
      },
      {
        question: "How long does the conversion take and what happens to my yard?",
        answer:
          "Most single-family conversions take a few days of on-site work. We plan the trench route around driveways, mature trees, and irrigation before we dig, and we backfill and rough-grade when we're done. Where the lateral has to cross a driveway or planted bed, we'll tell you exactly what to expect before work begins.",
      },
      {
        question: "Can you check my home's old drain lines during the conversion?",
        answer:
          "Yes, and it's smart to ask. Many North Fort Myers homes old enough to be on septic also have original cast iron drain pipe. We can camera the line while the system is exposed — if a section needs attention, fixing it during the conversion is far cheaper than opening the ground twice.",
      },
    ],
    relatedPages: [
      { label: "North Fort Myers Service Area", href: "/areas/north-fort-myers" },
      { label: "Your North Fort Myers Plumber", href: "/north-fort-myers-plumber" },
      { label: "UEP & Utility Connections", href: "/services/uep-utilities" },
    ],
  },

  // ============================================
  // 19. REMODEL PLUMBING - NAPLES
  // ============================================
  {
    slug: "remodel-plumbing-naples",
    metaTitle: "Remodel Plumbing Naples | Kitchen & Bath Specialists",
    metaDescription:
      "Remodel plumbing in Naples, FL. Kitchen & bathroom relocations, high-end fixtures & slab work for luxury renovations. Licensed CFC1432485. Call 833-PLUMB-IT.",
    keywords: [
      "remodel plumbing Naples",
      "bathroom remodel plumber Naples",
      "kitchen remodel plumbing Naples FL",
      "plumbing relocation Naples",
      "luxury bathroom plumbing Naples",
      "renovation plumber Naples",
      "master bath remodel Naples",
      "high end plumbing Naples",
    ],
    h1: "Remodel Plumbing in Naples, FL",
    sectionHeading: "Plumbing Naples renovations to the finish level they deserve",
    heroSubtext:
      "A Naples remodel lives or dies on what's behind the walls. C&S brings 8,500 homes' worth of rough-in experience to kitchen and bath renovations from Old Naples to Pelican Bay.",
    trustBadges: TRUST_BADGES,
    serviceDescription:
      `Naples renovations operate at a different standard. The fixtures are specified months in advance, the stone is already ordered, and the schedule has a designer, a cabinet maker, and a GC all stacked behind the plumbing rough-in. There is no slack for a plumber who measures a drain location twice and still misses it. This is exactly the work C&S Plumbing has built its reputation on — we've roughed in over 8,500 homes across Southwest Florida, and remodel plumbing is where that repetition pays off.\n\nWe handle the full plumbing scope of Naples kitchen and bath renovations: relocating supply and drain lines for new layouts, slab cuts and re-routes when an island sink or freestanding tub moves across the room, new rough-ins for steam showers, body sprays, and pot fillers, and the careful finish work that high-end fixtures demand. Wall-hung toilets, thermostatic shower valves, and imported fixtures arrive with unforgiving tolerances — we set them right the first time, because re-doing tile is nobody's change order.\n\nOlder homes in Old Naples, Park Shore, and along Gulf Shore Boulevard add their own layer: original galvanized or copper supply lines and cast iron drains that should be evaluated — and often replaced — while the walls are already open. We'll camera and assess what's exposed and give you a straight recommendation, because finding out about a failing drain line after the new marble is installed is the most expensive way to learn.\n\nC&S is licensed (CFC057076 and CFC1432485), insured, accustomed to working alongside GCs, designers, and HOA rules, and rated 5.0 on Google. For Collier County remodels where the finish level matters, call 833-PLUMB-IT.`,
    features: [
      {
        title: "Layout Relocations & Slab Work",
        description:
          "Supply and drain re-routes, slab cuts, and under-slab work for island sinks, freestanding tubs, and moved walls.",
      },
      {
        title: "High-End Fixture Expertise",
        description:
          "Thermostatic valves, wall-hung toilets, steam showers, and imported fixtures set to spec the first time.",
      },
      {
        title: "Open-Wall Pipe Assessment",
        description:
          "Aging supply and drain lines evaluated while walls are open — repipe recommendations made before the tile goes up, not after.",
      },
      {
        title: "GC & Designer Coordination",
        description:
          "Rough-in delivered on the construction schedule, inspections passed, and finish dates protected.",
      },
      {
        title: "Collier County Permitting",
        description:
          "Plumbing permits and inspections handled for remodel scopes, including HOA-sensitive communities.",
      },
    ],
    city: "Naples",
    state: "FL",
    neighborhoods: [
      "Old Naples",
      "Park Shore",
      "Pelican Bay",
      "Vanderbilt Beach",
      "North Naples",
      "Golden Gate",
      "Lely Resort",
      "East Naples",
    ],
    faqs: [
      {
        question: "Can you move my kitchen sink or tub to a new location?",
        answer:
          "Yes — relocations are the heart of remodel plumbing. Moving a sink, tub, or toilet means re-routing supply and drain lines, and in Naples' slab-on-grade homes that usually involves cutting the slab and running new lines beneath it. We've done it thousands of times, we quote it upfront, and we coordinate the timing with your GC so the slab work lands before flooring, not after.",
      },
      {
        question: "Do you work with general contractors and designers?",
        answer:
          "Constantly — coordinating with GCs is the core of our business, with 20+ builder partnerships across Southwest Florida. We work from your designer's fixture schedule, hit the rough-in dates on the construction calendar, and handle the inspection milestones so the project keeps moving.",
      },
      {
        question: "Should I replace old pipes during my Naples remodel?",
        answer:
          "If your home has original galvanized supply lines or aging cast iron drains, the remodel is by far the cheapest moment to address them — the walls are already open. We assess what's exposed, camera the drains if warranted, and give you a straight recommendation. Skipping it and discovering a pipe failure behind new marble is the outcome we're trying to save you from.",
      },
      {
        question: "Can you install high-end and imported fixtures?",
        answer:
          "Yes. Wall-hung toilets, thermostatic shower systems, body sprays, steam units, pot fillers, and European fixtures all have tight rough-in tolerances — the valve placement has to be right before tile. We set rough-ins to the fixture's spec sheet and return for precise trim-out after finishes are complete.",
      },
      {
        question: "Do you handle permits for remodel plumbing in Collier County?",
        answer:
          "Yes. Remodel plumbing scopes in Naples require Collier County permits, and we pull them and schedule the inspections as part of the job. C&S holds two active Florida licenses, CFC057076 and CFC1432485, and we're experienced with the documentation HOA communities require.",
      },
    ],
    relatedPages: [
      { label: "Naples Service Area", href: "/areas/naples" },
      { label: "Plumbing Remodel Services", href: "/services/plumbing-remodel" },
      { label: "Whole-Home Repiping", href: "/services/repiping" },
    ],
  },
];
