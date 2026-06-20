"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Award, Hammer } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { COMPLETED_PROJECTS } from "@/lib/constants";

interface CityProofBlockProps {
  cityName: string;
}

/**
 * Major-project proof for area pages. Pulls completed projects matching the
 * city (location field includes city name) and renders 2–4 project tiles.
 * Falls back to a generic stat tile when no project matches yet.
 */
export default function CityProofBlock({ cityName }: CityProofBlockProps) {
  const projects = COMPLETED_PROJECTS.filter((p) =>
    p.location?.toLowerCase().includes(cityName.toLowerCase())
  ).slice(0, 3);

  const hasProjects = projects.length > 0;

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-white">
      <Container>
        <ScrollReveal>
          <div className="max-w-3xl mb-8 sm:mb-12">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
              Local proof
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Major projects we&apos;ve done in and around {cityName}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              New construction, repipes, remodels, and commercial work — the
              kind of plumbing scope that defines a project, not a service call.
            </p>
          </div>
        </ScrollReveal>

        {hasProjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block h-full rounded-2xl overflow-hidden bg-[#F5F5F7] border border-gray-200 hover:border-primary/30 transition-all duration-500"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.coverImage}
                      alt={`${project.name} — completed C&S Plumbing project`}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-0 top-0 p-3">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] sm:text-xs font-semibold text-gray-900 uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-snug group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.location && (
                      <p className="text-xs text-gray-500 mb-3">
                        {project.location}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary">
                      See the project
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Stats tile pinned alongside projects */}
            <ScrollReveal delay={projects.length * 0.08}>
              <div className="h-full rounded-2xl overflow-hidden bg-primary text-white p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <Award className="w-7 h-7 mb-4 opacity-90" />
                  <p className="text-3xl sm:text-4xl font-black leading-none mb-2">
                    8,500+
                  </p>
                  <p className="text-sm sm:text-base font-medium text-white/90">
                    homes built across Lee County since 1997
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-white/90 hover:text-white mt-6"
                >
                  See all projects <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        ) : (
          // Fallback: no completed-project record yet for this city
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="md:col-span-2 rounded-2xl bg-[#F5F5F7] border border-gray-200 p-6 sm:p-8">
                <Hammer className="w-7 h-7 text-primary mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  We&apos;ve built across Lee County since 1997
                </h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed mb-4">
                  Cape Coral, Fort Myers, North Fort Myers, Bonita Springs,
                  Estero, Naples, Lehigh Acres, and Sanibel — over 8,500 homes
                  served by the same family-owned crew. New construction,
                  repipes, remodels, and commercial.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  See completed projects
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="rounded-2xl bg-primary text-white p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <Award className="w-7 h-7 mb-4 opacity-90" />
                  <p className="text-3xl sm:text-4xl font-black leading-none mb-2">
                    8,500+
                  </p>
                  <p className="text-sm sm:text-base font-medium text-white/90">
                    homes built across Lee County
                  </p>
                </div>
                <p className="text-xs text-white/80 mt-6">
                  CFC1432485 · CFC057076
                </p>
              </div>
            </div>
          </ScrollReveal>
        )}
      </Container>
    </section>
  );
}
