"use client";

import { MapPin, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import { AREA_LANDINGS } from "@/lib/constants";

export default function ServiceAreasSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionHeading
          overline="Service Areas"
          title="Serving All of Southwest Florida"
          subtitle="From Cape Coral to Naples, C&S Plumbing delivers fast, reliable plumbing services across Lee and Collier County."
        />

        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {AREA_LANDINGS.map((area) => (
            <motion.a
              key={area.slug}
              href={`/areas/${area.slug}`}
              variants={staggerItem}
              className="group flex items-center gap-2.5 p-4 sm:p-5 rounded-xl bg-[#F5F5F7] border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {area.city}, {area.state}
              </span>
            </motion.a>
          ))}
        </StaggerChildren>

        <ScrollReveal>
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Plus Fort Myers Beach, Captiva Island, Punta Gorda, Port Charlotte, Marco Island & more.
            </p>
            <a
              href="/booking"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all"
            >
              Book a Plumber in Your Area <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
