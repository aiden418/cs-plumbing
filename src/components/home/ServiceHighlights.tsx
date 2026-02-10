"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Siren,
  Waves,
  Flame,
  Wrench,
  Building2,
  HardHat,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { SERVICES } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  Siren: <Siren className="w-5 h-5 sm:w-6 sm:h-6" />,
  Waves: <Waves className="w-5 h-5 sm:w-6 sm:h-6" />,
  Flame: <Flame className="w-5 h-5 sm:w-6 sm:h-6" />,
  Wrench: <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />,
  Building2: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />,
  HardHat: <HardHat className="w-5 h-5 sm:w-6 sm:h-6" />,
};

export default function ServiceHighlights() {
  const highlighted = SERVICES.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionHeading
          overline="What We Do"
          title="Expert Plumbing Services"
          subtitle="From emergency repairs to large-scale construction, our team delivers precision and reliability on every job."
        />

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {highlighted.map((service) => (
            <motion.div key={service.id} variants={staggerItem}>
              <Link href={service.href} className="group block h-full">
                <div className="relative h-full bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 lg:p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(0,153,255,0.08)] overflow-hidden">
                  {/* Glow effect on hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                      {iconMap[service.icon]}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
