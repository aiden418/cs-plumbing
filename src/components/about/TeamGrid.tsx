"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { TEAM_MEMBERS } from "@/lib/constants";

export default function TeamGrid() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <SectionHeading
          overline="Our Team"
          title="Meet the Family"
          subtitle="The people behind every perfectly plumbed home in Southwest Florida."
        />

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {TEAM_MEMBERS.map((member) => (
            <motion.div
              key={member.name}
              variants={staggerItem}
              className="group text-center"
            >
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 sm:mb-6 rounded-2xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/20 transition-all duration-500">
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg sm:text-xl">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{member.name}</h3>
              <p className="text-primary text-sm font-medium mt-1">
                {member.role}
              </p>
              {member.bio && (
                <p className="text-gray-400 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed px-2 sm:px-0">
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
