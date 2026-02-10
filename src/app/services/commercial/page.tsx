import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import ServiceDetail from "@/components/services/ServiceDetail";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Commercial Plumbing Services",
  description:
    "Commercial plumbing for businesses across Lee County — preventive maintenance, emergency repairs, grease traps, backflow prevention, and tenant improvements.",
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
      <CTASection />
    </PageTransition>
  );
}
