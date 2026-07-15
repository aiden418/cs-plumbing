export interface FaqCategory {
  category: string;
  slug: string;
  link?: string;
  faqs: { question: string; answer: string }[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "General Plumbing",
    slug: "general",
    faqs: [
      {
        question: "What areas does C&S Plumbing serve?",
        answer:
          "We serve all of Lee County and Southwest Florida, including Cape Coral, Fort Myers, North Fort Myers, Naples, Bonita Springs, Lehigh Acres, Estero, Sanibel Island, Fort Myers Beach, and surrounding communities.",
      },
      {
        question: "Is C&S Plumbing licensed and insured?",
        answer:
          "Yes. C&S Plumbing holds a Florida Certified Plumbing Contractor license (CFC1432485) issued by the Florida Department of Business and Professional Regulation. We are fully insured and bonded.",
      },
      {
        question: "Do you offer free estimates?",
        answer:
          "Yes, we provide free estimates for all plumbing services. We believe in transparent, upfront pricing — you'll know exactly what a job costs before we start.",
      },
      {
        question: "Do you offer 24/7 emergency plumbing service?",
        answer:
          "Yes, we provide 24/7 emergency plumbing service for burst pipes, major leaks, sewage backups, and other plumbing emergencies. Call 833-PLUMB-IT any time, day or night.",
      },
      {
        question: "How do I schedule a plumbing appointment?",
        answer:
          "You can book online through our website, call us at 833-PLUMB-IT (833-758-6248), or use our instant quote builder to get a rough estimate before scheduling. We offer same-day and next-day appointments for most services.",
      },
      {
        question: "What forms of payment do you accept?",
        answer:
          "We accept cash, all major credit cards, checks, and offer financing options for larger projects like repiping and water heater installations.",
      },
    ],
  },
  {
    category: "Repiping",
    slug: "repiping",
    link: "/services/repiping",
    faqs: [
      {
        question: "How much does it cost to repipe a house in Cape Coral?",
        answer:
          "Whole-home repiping in Cape Coral typically costs between $4,000 and $15,000 depending on the size of your home, number of bathrooms, and pipe material (copper vs PEX). C&S Plumbing provides free estimates with upfront pricing — no hidden fees.",
      },
      {
        question: "How long does a whole-home repipe take?",
        answer:
          "Most homes can be fully repiped in 1–2 days. Larger homes or homes with complex layouts may take up to 3 days. We work to minimize disruption and keep you informed throughout the process.",
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
        question: "Does repiping increase my home's value?",
        answer:
          "Yes. A whole-home repipe is one of the best investments you can make. It eliminates the risk of pipe failure, can improve water pressure, and is often required by insurance companies and home inspectors during a sale.",
      },
    ],
  },
  {
    category: "Water Heaters",
    slug: "water-heaters",
    link: "/services/water-heaters",
    faqs: [
      {
        question: "How much does a water heater cost in Cape Coral?",
        answer:
          "Water heater costs in Cape Coral start at $195 for a basic repair. Traditional tank replacements typically run $995–$2,000 installed, and tankless installations start at $1,200. C&S Plumbing provides free estimates.",
      },
      {
        question: "Should I get a tankless or traditional water heater?",
        answer:
          "Tankless heaters cost more upfront but save money long-term with lower energy bills and a 20+ year lifespan. Traditional tanks are more affordable initially and work well for most homes. We'll help you decide based on your household size and usage.",
      },
      {
        question: "How long do water heaters last in Florida?",
        answer:
          "Traditional tank water heaters last 8–12 years in Florida's hard water conditions. Tankless units can last 20+ years with proper maintenance. Regular flushing and anode rod replacement extend the life of any water heater.",
      },
      {
        question: "Can you install a water heater the same day?",
        answer:
          "Yes, in most cases we can install a new water heater the same day you call. We stock the most popular models on our trucks for quick replacement when your water heater fails.",
      },
      {
        question: "What brands of water heaters do you install?",
        answer:
          "We install all major brands including Rinnai, Navien, Rheem, A.O. Smith, and Bradford White. We'll recommend the best brand and model for your home based on your hot water needs, energy goals, and budget.",
      },
    ],
  },
  {
    category: "Drain Cleaning",
    slug: "drain-cleaning",
    link: "/services/drain-cleaning",
    faqs: [
      {
        question: "How much does drain cleaning cost in Cape Coral?",
        answer:
          "Drain cleaning in Cape Coral typically costs between $150 and $500 depending on the type of drain, severity of the clog, and method required. Simple clogs start around $150, while main sewer line cleaning with hydro-jetting can be $300–$500.",
      },
      {
        question: "What causes recurring drain clogs?",
        answer:
          "Recurring clogs are usually caused by tree root intrusion, grease buildup, pipe scale, or damaged/bellied pipes. A camera inspection can identify the root cause so we can fix the problem permanently, not just temporarily clear it.",
      },
      {
        question: "What is hydro-jetting and how does it work?",
        answer:
          "Hydro-jetting uses a high-pressure stream of water (up to 4,000 PSI) to blast through grease, mineral scale, tree roots, and debris inside your pipes. It's the most thorough cleaning method available and restores pipes to near-new condition without chemicals.",
      },
      {
        question: "How often should I have my drains cleaned?",
        answer:
          "For preventive maintenance, we recommend professional drain cleaning every 1–2 years. Homes with large trees near sewer lines or older pipes may benefit from annual cleaning. Commercial kitchens should have grease lines cleaned quarterly.",
      },
    ],
  },
  {
    category: "Leak Detection & Repair",
    slug: "leak-repair",
    link: "/services/leak-repair",
    faqs: [
      {
        question: "How much does leak repair cost in Cape Coral?",
        answer:
          "Leak repair costs in Cape Coral range from $150 for a simple faucet leak to $800+ for slab leaks or pipe leaks behind walls. The cost depends on leak location and accessibility. We provide free estimates with transparent pricing.",
      },
      {
        question: "How do I know if I have a slab leak?",
        answer:
          "Signs of a slab leak include unexplained increases in your water bill, warm spots on your floor, the sound of running water when everything is off, cracks in your foundation, and damp or warm spots on carpet or flooring.",
      },
      {
        question: "Can you detect leaks without tearing up my walls?",
        answer:
          "Yes. We use advanced electronic leak detection equipment that can pinpoint leaks behind walls, under slabs, and underground without unnecessary demolition. This saves you time, money, and disruption.",
      },
    ],
  },
  {
    category: "Emergency Plumbing",
    slug: "emergency",
    faqs: [
      {
        question: "What should I do during a plumbing emergency?",
        answer:
          "First, locate and shut off your main water valve to stop water flow. Then call C&S Plumbing at 833-PLUMB-IT for 24/7 emergency service. While waiting, clean up standing water to prevent damage and avoid using any fixtures connected to the problem area.",
      },
      {
        question: "How fast can you respond to a plumbing emergency?",
        answer:
          "Our emergency team typically responds within 60 minutes for critical situations like burst pipes, sewage backups, and gas leaks in the Cape Coral and Fort Myers area. We're available 24/7, 365 days a year.",
      },
      {
        question: "Do you charge extra for emergency or after-hours calls?",
        answer:
          "We offer competitive emergency rates. While after-hours service may carry a small premium, we always provide upfront pricing before starting any work — no surprises. Call us and we'll quote you right away.",
      },
    ],
  },
];
