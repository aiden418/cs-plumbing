"use client";

import Container from "@/components/ui/Container";
import StaggerChildren from "@/components/animations/StaggerChildren";
import ProjectCard from "@/components/projects/ProjectCard";
import CTASection from "@/components/home/CTASection";
import { COMPLETED_PROJECTS } from "@/lib/constants";

export default function ProjectsIndexPage() {
  return (
    <>
      {/* Compact hero + grid in one section so projects are above the fold */}
      <section className="pt-24 sm:pt-28 pb-16 sm:pb-24 bg-surface">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8 sm:mb-10">
            <div className="max-w-2xl">
              <span className="inline-block text-primary text-xs font-semibold tracking-widest uppercase mb-2">
                Our Work
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Completed <span className="text-gradient">Projects</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed">
                New construction, commercial buildouts, and remodels across
                Southwest Florida.
              </p>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {COMPLETED_PROJECTS.length} project
              {COMPLETED_PROJECTS.length === 1 ? "" : "s"}
            </div>
          </div>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {COMPLETED_PROJECTS.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </StaggerChildren>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
