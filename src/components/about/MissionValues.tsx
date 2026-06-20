"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import {
  HandshakeIcon,
  BadgeDollarSign,
  HeartHandshake,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

const VALUES = [
  {
    icon: HandshakeIcon,
    title: "Honest Work",
    body: "No cut corners. Our paperwork is open to anyone who asks.",
  },
  {
    icon: BadgeDollarSign,
    title: "Fair Pricing",
    body: "Free estimates, no hidden fees, ever.",
  },
  {
    icon: HeartHandshake,
    title: "Family Treatment",
    body: "We live in the same neighborhoods we work in.",
  },
  {
    icon: CheckCircle2,
    title: "Done Right the First Time",
    body: "Every pipe, every connection, every time.",
  },
  {
    icon: GraduationCap,
    title: "Training the Trade",
    body: "We teach the next generation so it stays strong.",
  },
];

export default function MissionValues() {
  return (
    <section className="relative overflow-hidden bg-navy py-16 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
      <Container className="relative">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-gold">
              Our Mission
            </span>
            <p className="mt-4 text-xl sm:text-2xl lg:text-3xl font-bold leading-snug text-white">
              To carry forward three generations of plumbing craftsmanship across Southwest
              Florida — treating every home like our own, charging fairly, and standing behind
              every connection we make. We&apos;re not just installing plumbing.{" "}
              <span className="text-gold">
                We&apos;re protecting the homes our neighbors live in.
              </span>
            </p>
          </div>
        </ScrollReveal>

        <StaggerChildren className="mt-12 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-5">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                variants={staggerItem}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{v.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/60">{v.body}</p>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </Container>
    </section>
  );
}
