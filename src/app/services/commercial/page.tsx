import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceDetail from "@/components/services/ServiceDetail";
import CTASection from "@/components/home/CTASection";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const commercialFaqs = [
  {
    question: "Do you handle commercial tenant buildouts and tenant improvements in Lee County?",
    answer: "Yes. C&S Plumbing handles all plumbing work for commercial tenant buildouts and tenant improvements throughout Lee County and Southwest Florida. This includes space layout plumbing design, fixture relocation and installation, ADA compliance upgrades, code updates, and full coordination with general contractors.",
  },
  {
    question: "What types of commercial properties do you service?",
    answer: "We service all types of commercial properties including retail spaces, restaurants, medical offices, warehouses, office buildings, multi-family complexes, and light industrial facilities across Cape Coral, Fort Myers, and all of Southwest Florida.",
  },
  {
    question: "Do you work directly with general contractors on commercial projects?",
    answer: "Yes. We regularly partner with general contractors on commercial new construction, tenant buildouts, and renovation projects. We provide scope letters, coordinate with other trades, manage permits, and deliver documentation for project closeouts.",
  },
  {
    question: "Can you handle commercial plumbing permits in Lee County and Cape Coral?",
    answer: "Yes. We manage all commercial plumbing permits through Lee County and the City of Cape Coral. Our licensed plumbing contractors (CFC1432485, CFC057076) handle the full permitting process including plan review, inspections, and final certificate of occupancy sign-off.",
  },
  {
    question: "Do you offer preventive maintenance contracts for commercial properties?",
    answer: "Yes. We offer customized preventive maintenance plans for commercial properties including scheduled inspections, drain maintenance, water heater servicing, fixture tune-ups, and priority emergency response. Contact us to build a maintenance plan for your property.",
  },
  {
    question: "How fast do you respond to commercial plumbing emergencies?",
    answer: "Our commercial emergency team is available 24/7 and typically responds within 60 minutes in the Cape Coral and Fort Myers area. We understand that plumbing emergencies can shut down your business, so we prioritize speed and provide temporary solutions to keep you operating while permanent repairs are made.",
  },
  {
    question: "Do you service restaurants and food service businesses?",
    answer: "Yes. We specialize in grease trap installation, cleaning, and maintenance for restaurants and food service businesses throughout Southwest Florida. We also handle code compliance inspections and provide documentation for health department requirements.",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/services/commercial" },
  title: "Commercial Plumbing Services",
  description:
    "Commercial plumbing for businesses in Cape Coral, Fort Myers & Lee County — preventive maintenance, emergency repairs, grease traps, backflow prevention & tenant improvements.",
  keywords: [
    "commercial plumber Cape Coral",
    "commercial plumbing Fort Myers",
    "business plumbing Lee County",
    "grease trap service Cape Coral",
    "backflow prevention Fort Myers",
    "restaurant plumbing SWFL",
    "commercial emergency plumber",
    "tenant improvement plumbing",
    "property management plumbing Lee County",
  ],
  openGraph: {
    title: "Commercial Plumbing | C&S Plumbing of Lee County",
    description:
      "Reliable commercial plumbing across Lee County — maintenance, emergency repairs, grease traps, backflow prevention & tenant improvements for businesses.",
    url: "https://www.csplumbinglee.com/services/commercial",
  },
};

const commercialServices = [
  {
    id: "commercial-maintenance",
    title: "Preventive Maintenance",
    description:
      "Customized maintenance plans designed to prevent costly breakdowns, keep your business running, and extend the life of your plumbing systems.",
    icon: "Wrench",
    href: "/services/commercial",
    features: [
      "Scheduled inspections",
      "Drain maintenance",
      "Water heater servicing",
      "Fixture tune-ups",
      "Priority emergency response",
    ],
  },
  {
    id: "commercial-emergency",
    title: "Commercial Emergency Service",
    description:
      "Plumbing emergencies can shut down your business. Our 24/7 commercial emergency team responds fast to minimize downtime and protect your revenue.",
    icon: "Siren",
    href: "/services/commercial",
    features: [
      "24/7 availability",
      "Fast response times",
      "Temporary solutions to keep operating",
      "Full repairs and restoration",
      "Insurance documentation",
    ],
  },
  {
    id: "grease-trap",
    title: "Grease Trap Service",
    description:
      "Restaurants and food service businesses need properly maintained grease traps to stay code-compliant and avoid costly backups.",
    icon: "Waves",
    href: "/services/commercial",
    features: [
      "Cleaning & pumping",
      "Installation & replacement",
      "Code compliance inspections",
      "Scheduled maintenance",
      "Documentation for health department",
    ],
  },
  {
    id: "backflow",
    title: "Backflow Prevention",
    description:
      "Protect your water supply with certified backflow prevention testing, installation, and repair services.",
    icon: "Droplets",
    href: "/services/commercial",
    features: [
      "Annual testing & certification",
      "Device installation",
      "Repair & replacement",
      "Cross-connection surveys",
      "Compliance documentation",
    ],
  },
  {
    id: "tenant-improvement",
    title: "Tenant Improvements",
    description:
      "Retrofitting commercial spaces for new tenants? We handle all plumbing modifications to meet new layout and usage requirements.",
    icon: "Building2",
    href: "/services/commercial",
    features: [
      "Space layout plumbing design",
      "Fixture relocation & installation",
      "ADA compliance upgrades",
      "Code updates",
      "Coordination with contractors",
    ],
  },
  {
    id: "commercial-repiping",
    title: "Commercial Repiping",
    description:
      "Large-scale repiping for commercial properties with aging or compromised plumbing infrastructure. Minimal business disruption guaranteed.",
    icon: "Wrench",
    href: "/services/commercial",
    features: [
      "Phased installation",
      "Off-hours work available",
      "All pipe materials",
      "Full permit management",
      "Extended warranties",
    ],
  },
];

const highlights = [
  "Dedicated commercial team",
  "Minimal business disruption",
  "Code-compliant installations",
  "Emergency priority response",
  "Flexible scheduling (nights/weekends)",
  "Multi-location service contracts",
  "Complete permit management",
  "Detailed documentation & invoicing",
  "Trusted by property managers",
];

export default function CommercialPage() {
  return (
    <PageTransition>
      <ServiceDetail
        title="Commercial Services"
        heroText="Plumbing Solutions for Your Business"
        description="Businesses across Lee County rely on C&S Plumbing for efficient, code-compliant commercial plumbing services. From preventive maintenance to emergency repairs, we keep your operations flowing."
        services={commercialServices}
        highlights={highlights}
      />
      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-surface">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Commercial Plumbing Questions
            </h2>
          </div>
          <div className="space-y-4">
            {commercialFaqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-5 sm:px-6 py-4 sm:py-5 text-left text-base sm:text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
                  <span className="pr-4">{faq.question}</span>
                  <svg
                    className="w-5 h-5 shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: "Commercial", href: "/services/commercial" }]} />
      <FaqJsonLd faqs={commercialFaqs} />
      <CTASection />
    </PageTransition>
  );
}
