"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  Hammer,
  ArrowUpFromLine,
  Wrench,
  Building2,
  Check,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import CountUp from "@/components/animations/CountUp";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  BUILDERS,
  BUILDER_STATS,
  BUILDER_GALLERY,
  BUILDER_CASE_STUDIES,
  BUILDER_SPEC_SHEETS,
  AIDEN_CONTACT,
} from "@/lib/builders-data";

const ICON_MAP: Record<string, React.ReactNode> = {
  Hammer: <Hammer className="w-6 h-6" />,
  ArrowUpFromLine: <ArrowUpFromLine className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
};

const GALLERY_CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Custom Residential", value: "custom-residential" },
  { label: "Production", value: "production" },
  { label: "Light Commercial", value: "light-commercial" },
  { label: "Remodel", value: "remodel" },
];

export default function BuildersPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredGallery =
    activeCategory === "all"
      ? BUILDER_GALLERY
      : BUILDER_GALLERY.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-[#F5F5F7]">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              For Builders &amp; General Contractors
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight">
              Your Plumbing Partner for{" "}
              <span className="text-gradient">New Construction</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              8,500+ homes completed across Lee, Collier, and Charlotte counties
              since 1997. Two active CFC licenses. 5.0 stars across 46 Google
              reviews. The plumber builders call back.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                href="/builder-portal"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Request Prequalification
              </Button>
              <Button
                href={`tel:${AIDEN_CONTACT.phoneRaw}`}
                variant="secondary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
              >
                Call {AIDEN_CONTACT.phone}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="py-10 sm:py-16 border-y border-gray-200">
        <Container>
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
              {BUILDER_STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl sm:text-5xl font-black text-gray-900">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Builder Logo Grid */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <SectionHeading
            overline="Trusted By"
            title="Builders Who Choose C&S"
            subtitle="From custom waterfront homes to large-scale production builds, these builders trust C&S Plumbing to deliver on time and on code."
          />
          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {BUILDERS.map((builder) => (
              <motion.div
                key={builder.name}
                variants={staggerItem}
                className="flex flex-col items-center justify-center gap-3 p-5 sm:p-6 bg-white border border-gray-200 rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="h-10 sm:h-12 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={builder.logo}
                    alt={builder.name}
                    className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[140px] object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-500 text-center">
                  {builder.name}
                </span>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Project Gallery */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <SectionHeading
            overline="Our Work"
            title="Project Gallery"
            subtitle="New construction, commercial, and remodel plumbing across Southwest Florida."
          />

          {/* Category Filter */}
          <ScrollReveal className="mb-0">
            <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === cat.value
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full mb-2">
                      {GALLERY_CATEGORIES.find(
                        (c) => c.value === item.category
                      )?.label ?? item.category}
                    </span>
                    <p className="text-sm sm:text-base font-medium text-white">
                      {item.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredGallery.length === 0 && (
            <p className="text-center text-gray-400 mt-12">
              No projects in this category yet.
            </p>
          )}

          <ScrollReveal className="mb-0">
            <div className="text-center mt-8 sm:mt-12">
              <Button
                href="/projects"
                variant="secondary"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View All Projects
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Case Studies */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <SectionHeading
            overline="Results"
            title="How We Deliver for Builders"
            subtitle="Real challenges, real solutions. Here's what it looks like when your plumber is a partner, not just a sub."
          />
          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {BUILDER_CASE_STUDIES.map((study) => (
              <motion.div
                key={study.id}
                variants={staggerItem}
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
                  {study.title}
                </h3>

                <div className="space-y-4 flex-1">
                  <div>
                    <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full mb-2">
                      Challenge
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {study.challenge}
                    </p>
                  </div>

                  <div>
                    <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">
                      Action
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {study.action}
                    </p>
                  </div>

                  <div>
                    <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-full mb-2">
                      Outcome
                    </span>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {study.outcome}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Capabilities / Spec Sheets */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <SectionHeading
            overline="Capabilities"
            title="Full-Scope New Construction Plumbing"
            subtitle="From underground to final inspection — every phase, every trade, every time."
          />
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {BUILDER_SPEC_SHEETS.map((spec) => (
              <motion.div
                key={spec.id}
                variants={staggerItem}
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {ICON_MAP[spec.icon]}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {spec.title}
                    </h3>
                    <p className="text-sm text-gray-500">{spec.description}</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {spec.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-gray-600"
                    >
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {spec.href && (
                  <Link
                    href={spec.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark mt-5 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Prequalification CTA */}
      <section className="py-16 sm:py-24 lg:py-32 bg-primary">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <ArrowRight className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Get Prequalified?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/70 leading-relaxed">
                Submit your project details through our Builder Portal and
                we&apos;ll send you everything you need — CFC licenses,
                insurance certificates, W-9, EMR letter, safety program,
                and bonding capacity. Fast turnaround, no runaround.
              </p>
              <Link
                href="/builder-portal"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 cursor-pointer bg-white text-primary hover:bg-gray-100 shadow-sm hover:shadow-md active:scale-[0.98] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg mt-8"
              >
                <ArrowRight className="w-5 h-5" />
                Request Prequalification
              </Link>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Direct Contact — Aiden CTA */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="bg-[#F5F5F7] rounded-3xl p-8 sm:p-12 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div>
                    <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                      Direct Line to Our Team
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      One call to get started.
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">
                      No call centers, no dispatchers, no runaround. When you
                      partner with C&S, you work directly with our operations
                      and estimating team on every bid, every schedule, and
                      every punch list. That&apos;s how we&apos;ve kept builder
                      relationships for 25+ years.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {AIDEN_CONTACT.name}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {AIDEN_CONTACT.title}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <a
                        href={`tel:${AIDEN_CONTACT.phoneRaw}`}
                        className="flex items-center gap-3 text-base sm:text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        {AIDEN_CONTACT.phone}
                      </a>
                      <a
                        href={`mailto:${AIDEN_CONTACT.email}`}
                        className="flex items-center gap-3 text-base sm:text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        {AIDEN_CONTACT.email}
                      </a>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        href={`tel:${AIDEN_CONTACT.phoneRaw}`}
                        size="md"
                        icon={<Phone className="w-4 h-4" />}
                      >
                        Call {AIDEN_CONTACT.phone}
                      </Button>
                      <Button
                        href={`mailto:${AIDEN_CONTACT.email}`}
                        variant="secondary"
                        size="md"
                        icon={<Mail className="w-4 h-4" />}
                      >
                        Email Aiden
                      </Button>

                    </div>
                  </div>
                </div>

                {/* Builder Portal Link */}
                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Have blueprints ready?{" "}
                    <Link
                      href="/builder-portal"
                      className="text-primary font-medium hover:underline"
                    >
                      Upload plans directly through our Builder Portal
                    </Link>{" "}
                    for a faster quote.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  );
}
