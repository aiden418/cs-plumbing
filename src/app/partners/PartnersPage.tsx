"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Phone, ExternalLink, Building2 } from "lucide-react";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { PARTNERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(PARTNERS.map((p) => p.category)))];

export default function PartnersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? PARTNERS
      : PARTNERS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Hero */}
      <PageHero
        align="center"
        overline="Recommended Companies"
        title="Local Businesses"
        accent="We Trust"
        description="We believe in supporting our community. These are local, family-owned companies we've worked alongside and trust to deliver quality work for our customers."
      />

      {/* SEO Content + Filter + Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          {/* The hero <h1> carries this visually; the grid still needs a
              section heading so the outline doesn't jump h1 -> h3. */}
          <h2 className="sr-only">Trusted contractor partners</h2>
          {/* SEO-rich intro paragraph */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                As a{" "}
                <Link href="/about" className="text-primary hover:underline">
                  family-owned plumbing company
                </Link>{" "}
                serving Cape Coral and Southwest Florida since 1998, we know the value of working with
                contractors who share our commitment to quality and customer service. Whether you need a{" "}
                <Link href="/services/residential" className="text-primary hover:underline">
                  residential plumbing
                </Link>{" "}
                partner, HVAC service, roofing, or concrete work, these are the companies we personally
                recommend to our customers.
              </p>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === cat
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-900"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Cards Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((partner) => (
                <motion.div
                  key={partner.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 card-lift card-lift-hover-subtle hover:border-primary/30 flex flex-col"
                >
                  {/* Category Badge */}
                  <span className="inline-block self-start text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-4">
                    {partner.category}
                  </span>

                  {/* Logo */}
                  <div className="w-full h-16 sm:h-20 relative mb-4">
                    {partner.image ? (
                      <Image
                        src={partner.image}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain object-left"
                        sizes="(max-width: 640px) 280px, 320px"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F5F5F7] border border-gray-200 flex items-center justify-center">
                        <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Name + Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">
                    {partner.description}
                  </p>

                  {/* Contact Links */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <a
                      href={`tel:${partner.phone.replace(/[^0-9]/g, "")}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {partner.phone}
                    </a>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 mt-12">
              No companies listed in this category yet.
            </p>
          )}

          {/* SEO bottom text */}
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mt-12 sm:mt-16">
              <p className="text-sm text-gray-400 leading-relaxed">
                Looking for a plumber instead? C&amp;S Plumbing of Lee County offers{" "}
                <Link href="/services" className="text-primary hover:underline">
                  full-service plumbing
                </Link>
                {" "}including{" "}
                <Link href="/services/repiping" className="text-primary hover:underline">
                  repiping
                </Link>
                ,{" "}
                <Link href="/services/water-heaters" className="text-primary hover:underline">
                  water heaters
                </Link>
                ,{" "}
                <Link href="/services/drain-cleaning" className="text-primary hover:underline">
                  drain cleaning
                </Link>
                , and{" "}
                <Link href="/emergency" className="text-primary hover:underline">
                  24/7 emergency service
                </Link>
                {" "}across Cape Coral, Fort Myers, and all of Southwest Florida.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
