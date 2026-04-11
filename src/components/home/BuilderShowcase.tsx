"use client";

import { motion } from "framer-motion";
import { Building2, Home } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";

const RESIDENTIAL_BUILDERS = [
  { name: "Draft Construction LLC", logo: "/images/builders/draft-construction.png" },
  { name: "Poseidon Homes", logo: "/images/builders/poseidon-homes.webp" },
  { name: "Alair Homes", logo: "/images/builders/alair-homes.jpg" },
  { name: "Red Key Builders", logo: "/images/builders/red-key-builders.png" },
  { name: "Baywood Homes" },
  { name: "Friga Tyme Construction" },
  { name: "Decker Homes", logo: "/images/builders/decker-homes.png" },
];

const COMMERCIAL_BUILDERS = [
  { name: "Draft Construction LLC", logo: "/images/builders/draft-construction.png" },
  { name: "Heather Wood Construction", logo: "/images/builders/heather-wood.webp" },
  { name: "Stellar Development", logo: "/images/builders/stellar-development.png" },
  { name: "Engelke Construction Solutions", logo: "/images/builders/engelke.png" },
  { name: "Itasca Construction Associates, Inc", logo: "/images/builders/itasca.png" },
  { name: "McDowell Construction", logo: "/images/builders/mcdowell.png" },
];

function BuilderCard({
  name,
  logo,
  type,
}: {
  name: string;
  logo?: string;
  type: "residential" | "commercial";
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-primary/30 hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={logo}
              alt={name}
              className="w-full h-full object-contain p-1"
            />
          ) : type === "residential" ? (
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          ) : (
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          )}
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-gray-900">
            {name}
          </p>
          <span className="text-xs text-gray-500 capitalize">{type}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BuilderShowcase() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <ScrollReveal>
          <SectionHeading
            overline="Our Partners"
            title="Builders Who Trust C&S"
            subtitle="From custom homes to commercial developments, builders across Southwest Florida choose C&S Plumbing for reliability and quality."
          />
        </ScrollReveal>

        {/* Residential */}
        <div className="mb-10 sm:mb-14">
          <ScrollReveal>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Residential Builders
            </h3>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {RESIDENTIAL_BUILDERS.map((builder) => (
              <BuilderCard key={builder.name} name={builder.name} logo={builder.logo} type="residential" />
            ))}
          </StaggerChildren>
        </div>

        {/* Commercial */}
        <div>
          <ScrollReveal>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Commercial Builders
            </h3>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {COMMERCIAL_BUILDERS.map((builder) => (
              <BuilderCard key={builder.name} name={builder.name} logo={builder.logo} type="commercial" />
            ))}
          </StaggerChildren>
        </div>
      </Container>
    </section>
  );
}
