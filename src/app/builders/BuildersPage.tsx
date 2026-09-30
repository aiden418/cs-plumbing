"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
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
} from "@/lib/builders-data";
import {
  BUILDER_PROOF,
  CAPABILITY_STATEMENT_PDF,
  NEW_CONSTRUCTION_CITIES,
} from "@/lib/builder-program";
import BuilderBidForm from "@/components/builders/BuilderBidForm";
import NewConstructionBenefits from "@/components/builders/NewConstructionBenefits";
import {
  BuilderDesk,
  BuilderProofStory,
  ConstructionPhases,
  PrequalDocs,
  Qualifications,
  SchedulingPanel,
  SwflExpertise,
} from "@/components/builders/BuilderSections";
import { BUILDER_FAQS } from "./builder-faqs";

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
      <PageHero
        align="center"
        overline="For Builders & General Contractors"
        title={BUILDER_PROOF.headline.replace(/ since \d{4}$/, "")}
        accent="Since 1998"
        description={`New construction plumbing for builders and GCs across Lee and Charlotte counties, from slab layout to final. ${BUILDER_PROOF.subline}`}
        actions={
          <>
            <Button
              href="#bid"
              variant="gold"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Submit Plans for a Bid
            </Button>
            {/* Plain <a>: a PDF isn't a route, so next/link would try a client navigation first. */}
            <a
              href={CAPABILITY_STATEMENT_PDF}
              download
              className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 border border-white/40 text-white hover:bg-white/10 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg"
            >
              <Download className="w-5 h-5" />
              Capability Statement
            </a>
          </>
        }
      />

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

      <BuilderProofStory />

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
                  <BuilderLogoImage
                    builder={builder}
                    sizes="(max-width: 640px) 120px, 140px"
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

      <ConstructionPhases />
      <SwflExpertise />
      <Qualifications />
      <NewConstructionBenefits overline="What your buyers get" />
      <SchedulingPanel />

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
                    "min-h-11 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
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

      {/* Case Studies — entries flagged placeholder: true are unverified and must not render */}
      {BUILDER_CASE_STUDIES.some((study) => !study.placeholder) && (
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <SectionHeading
            overline="Results"
            title="How We Deliver for Builders"
            subtitle="Real challenges, real solutions. Here's what it looks like when your plumber is a partner, not just a sub."
          />
          <StaggerChildren className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {BUILDER_CASE_STUDIES.filter((study) => !study.placeholder).map((study) => (
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
      )}

      <PrequalDocs />

      {/* New construction by city */}
      <section className="py-16 sm:py-24 bg-[#F5F5F7]">
        <Container>
          <SectionHeading
            overline="Where we build"
            title="New construction plumbing by city"
            subtitle="Local permitting and site conditions for each market we plumb."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {NEW_CONSTRUCTION_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/new-construction-plumbing/${c.slug}`}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 hover:border-primary hover:text-primary transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {c.city}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <BuilderDesk />

      {/* Submit plans for a bid */}
      <section id="bid" className="py-16 sm:py-24 lg:py-32 scroll-mt-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <BuilderBidForm source="builders-hub" />
          </div>
        </Container>
      </section>

      {/* Builder FAQ */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="text-center mb-10 sm:mb-16">
              <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
                FAQ
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Questions from Builders &amp; GCs
              </h2>
            </div>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-4">
            {BUILDER_FAQS.map((faq, i) => (
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

    </>
  );
}
