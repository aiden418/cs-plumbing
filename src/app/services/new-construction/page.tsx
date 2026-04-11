import type { Metadata } from "next";
import Image from "next/image";
import PageTransition from "@/components/layout/PageTransition";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import CountUp from "@/components/animations/CountUp";
import Button from "@/components/ui/Button";
import CTASection from "@/components/home/CTASection";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion } from "framer-motion";
import { Check, Calendar, Phone, HardHat, Shield, Clock, Award } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const newConstructionFaqs = [
  {
    question: "Who is the best plumber for new construction in Cape Coral and Fort Myers?",
    answer: "C&S Plumbing of Lee County is Southwest Florida's most experienced new construction plumber, with 8,500+ homes completed since 1998. We're ranked in the top 4% of all licensed contractors in Florida and are the go-to plumbing partner for residential and commercial builders across Lee and Collier County.",
  },
  {
    question: "Do you handle new construction plumbing for both residential and commercial builds?",
    answer: "Yes. We provide full new construction plumbing for single-family homes, multi-family developments, and light commercial buildings throughout Southwest Florida. Our services cover pre-construction planning, underground work, rough-in, trim-out, and final inspection.",
  },
  {
    question: "What is included in new construction plumbing rough-in?",
    answer: "Rough-in plumbing includes installing all supply and drain lines inside the walls and floors before drywall goes up. This covers water supply lines, DWV (drain, waste, and vent) piping, stub-outs for all fixtures, and any underground slab work. All rough-in work is permitted and inspected by Lee County.",
  },
  {
    question: "Do you pull permits for new construction plumbing in Lee County?",
    answer: "Yes. C&S Plumbing manages all permit applications, inspections, and final sign-offs for every new construction project. Our license numbers are CFC1432485 and CFC057076, both issued by the Florida Department of Business and Professional Regulation.",
  },
  {
    question: "How do I get C&S Plumbing on my new construction project as a builder?",
    answer: "Contact us directly at 833-PLUMB-IT or through the Partner With Us form on our website. We work with builders of all sizes — from custom home builders to large-scale residential developers. We'll review your blueprints, provide a detailed scope and quote, and coordinate directly with your project schedule.",
  },
  {
    question: "How far in advance should I schedule a plumber for new construction?",
    answer: "We recommend contacting us as early as possible in the planning phase — ideally before permits are submitted. Early coordination allows us to review blueprints, flag any plumbing layout issues, and ensure our schedule aligns with your construction timeline.",
  },
  {
    question: "Do you do new construction plumbing in Lehigh Acres, Bonita Springs, and Naples?",
    answer: "Yes. C&S Plumbing serves all of Southwest Florida for new construction, including Cape Coral, Fort Myers, Lehigh Acres, Bonita Springs, Estero, Naples, and surrounding areas in Lee and Collier County.",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/services/new-construction" },
  title: "New Construction Plumbing",
  description:
    "8,500+ new construction homes plumbed in Cape Coral, Fort Myers & SWFL. C&S Plumbing is the trusted builder's partner for reliability, code-compliance & precision.",
  keywords: [
    "new construction plumber Cape Coral",
    "new construction plumbing Fort Myers",
    "builder plumber Southwest Florida",
    "rough-in plumbing Lee County",
    "new home plumbing SWFL",
    "construction plumbing contractor",
    "underground plumbing Cape Coral",
    "trim-out plumbing Fort Myers",
  ],
  openGraph: {
    title: "New Construction Plumbing | C&S Plumbing of Lee County",
    description:
      "8,500+ homes built. The builder's choice for new construction plumbing in Cape Coral, Fort Myers & all of Southwest Florida.",
    url: "https://www.csplumbinglee.com/services/new-construction",
  },
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
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/services/cards/new-construction.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-white/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/20" />
        </div>
        <Container className="relative">
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              New Construction
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
              The Builder&apos;s Choice for{" "}
              <span className="text-gradient">New Construction</span> Plumbing
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
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
      <section className="py-10 sm:py-16 border-y border-gray-200">
        <Container>
          <ScrollReveal>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-6 sm:gap-8 lg:gap-12">
              {advantages.map((adv) => (
                <div
                  key={adv.text}
                  className="flex items-center gap-2 sm:gap-3 text-gray-600"
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
              <div className="text-5xl sm:text-7xl lg:text-9xl font-black text-gray-900">
                <CountUp end={8500} suffix="+" duration={2.5} />
              </div>
              <p className="text-base sm:text-xl text-gray-500 mt-3 sm:mt-4">
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1.5 sm:mt-2 mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                New Construction Plumbing Questions
              </h2>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-4">
            {newConstructionFaqs.map((faq, i) => (
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
        </Container>
      </section>

      <BreadcrumbJsonLd items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: "New Construction", href: "/services/new-construction" }]} />
      <FaqJsonLd faqs={newConstructionFaqs} />
      <CTASection />
    </PageTransition>
  );
}
