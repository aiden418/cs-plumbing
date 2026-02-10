"use client";

import { Shield, Clock, Award, Users, ThumbsUp, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Family-Owned & Operated",
    description:
      "Three generations strong. We treat every home like it's our own because our reputation is our livelihood.",
  },
  {
    icon: <Award className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Top 4% in Florida",
    description:
      "Ranked in the top 4% of all 191,000+ licensed contractors in the state. That's not a claim — it's verified.",
  },
  {
    icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "24/7 Emergency Response",
    description:
      "Pipes don't wait for business hours. Neither do we. Call anytime, day or night, and we'll be there.",
  },
  {
    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Licensed & Insured",
    description:
      "Fully licensed (CFC1430355), bonded, and insured. Your property and your peace of mind are protected.",
  },
  {
    icon: <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Satisfaction Guaranteed",
    description:
      "We stand behind every job with a satisfaction guarantee. If you're not happy, we'll make it right.",
  },
  {
    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
    title: "Free Estimates",
    description:
      "Transparent pricing with no surprises. We assess your needs and provide clear, upfront estimates before any work begins.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-surface">
      <Container>
        <SectionHeading
          overline="Why C&S"
          title="Built on Trust, Backed by Results"
          subtitle="27+ years of keeping Southwest Florida flowing. Here's why thousands of homeowners and builders choose C&S."
        />

        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={staggerItem}
              className="group p-5 sm:p-6 lg:p-8 rounded-2xl border border-white/5 hover:border-primary/10 transition-all duration-500"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
