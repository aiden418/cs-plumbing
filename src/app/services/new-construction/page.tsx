import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import CountUp from "@/components/animations/CountUp";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import { Check, Calendar, Phone, HardHat, Shield, Clock, Award } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "New Construction Plumbing",
  description:
    "8,500+ new construction homes plumbed across SWFL. C&S Plumbing is the trusted partner for builders who demand reliability, code-compliance, and precision.",
};

const process = [
  {
    step: "01",
    title: "Pre-Construction Planning",
    description:
      "We review blueprints, assess site conditions, and create a detailed plumbing plan that aligns with your construction timeline.",
  },
  {
    step: "02",
    title: "Underground & Rough-In",
    description:
      "Our team installs underground piping and completes rough-in work, coordinating with other trades for seamless progress.",
  },
  {
    step: "03",
    title: "Trim-Out & Fixtures",
    description:
      "Final fixture installation, connections, and system testing. Every faucet, toilet, and water line is carefully installed and tested.",
  },
  {
    step: "04",
    title: "Inspection & Turnover",
    description:
      "We handle all permit inspections and provide a final walkthrough. Your client gets a perfectly plumbed home, every time.",
  },
];

const advantages = [
  { icon: <HardHat className="w-4 h-4 sm:w-5 sm:h-5" />, text: "8,500+ homes completed" },
  { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, text: "On-time, every time" },
  { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Full code compliance" },
  { icon: <Award className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Top 4% FL contractor" },
];

export default function NewConstructionPage() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              New Construction
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              The Builder&apos;s Choice for{" "}
              <span className="text-gradient">New Construction</span> Plumbing
            </h1>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-6 sm:mb-8">
              With over 8,500 new homes completed across Southwest Florida, C&S
              Plumbing is the go-to partner for builders who demand reliability,
              code-compliance, and timeline precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                href="/contact"
                size="lg"
                icon={<Calendar className="w-5 h-5" />}
              >
                Partner With Us
              </Button>
              <Button
                href={`tel:${BUSINESS.phoneRaw}`}
                variant="secondary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
              >
                Call {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-16 border-y border-white/5">
        <Container>
          <ScrollReveal>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-6 sm:gap-8 lg:gap-12">
              {advantages.map((adv) => (
                <div
                  key={adv.text}
                  className="flex items-center gap-2 sm:gap-3 text-gray-300"
                >
                  <div className="text-primary">{adv.icon}</div>
                  <span className="text-xs sm:text-sm font-medium">{adv.text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Big Number */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center">
              <div className="text-5xl sm:text-7xl lg:text-9xl font-black text-white">
                <CountUp end={8500} suffix="+" duration={2.5} />
              </div>
              <p className="text-base sm:text-xl text-gray-400 mt-3 sm:mt-4">
                New Construction Homes Plumbed Across SWFL
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24 lg:py-32 bg-surface">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                Our Process
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                From Blueprint to Move-In
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {process.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 0.1}>
                <div className="relative">
                  <span className="text-5xl sm:text-6xl font-black text-primary/10">
                    {step.step}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </PageTransition>
  );
}
