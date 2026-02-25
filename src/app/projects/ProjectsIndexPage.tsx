"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren from "@/components/animations/StaggerChildren";
import ProjectCard from "@/components/projects/ProjectCard";
import CTASection from "@/components/home/CTASection";
import { COMPLETED_PROJECTS } from "@/lib/constants";

export default function ProjectsIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Our Work
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
              Completed <span className="text-gradient">Projects</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              Explore our completed plumbing projects across Southwest Florida —
              from new construction to full remodels. Each project showcases the
              quality and craftsmanship that defines C&amp;S Plumbing.
            </p>
          </div>
        </Container>
      </section>

      {/* Projects Grid */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {COMPLETED_PROJECTS.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </StaggerChildren>
          </ScrollReveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
