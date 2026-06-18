"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Users,
  MapPin,
  Camera,
  ArrowDown,
} from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { CompletedProject, ProjectImage } from "@/lib/types";

export default function ProjectDetail({ project }: { project: CompletedProject }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Flatten all phase images into one array for lightbox navigation
  const allImages: (ProjectImage & { phaseName: string })[] = project.phases.flatMap(
    (phase) => phase.images.map((img) => ({ ...img, phaseName: phase.name }))
  );
  const totalPhotos = allImages.length;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === 0 ? allImages.length - 1 : prev - 1
    );
  }, [allImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === allImages.length - 1 ? 0 : prev + 1
    );
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, lightboxPrev, lightboxNext]);

  const hasCaseStudy =
    project.challenge ||
    project.solution ||
    (project.scopeDetails && project.scopeDetails.length > 0) ||
    (project.permits && project.permits.length > 0) ||
    (project.materials && project.materials.length > 0);

  const multiPhase = project.phases.length > 1;

  // Precompute each phase's starting index in the flattened image list so
  // grid clicks map to the right lightbox index (no render-time mutation).
  const phaseStartIndices = project.phases.reduce<number[]>((acc, phase, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + project.phases[i - 1].images.length);
    return acc;
  }, []);

  return (
    <>
      {/* ===== Full-bleed hero ===== */}
      <section className="relative min-h-[78vh] w-full overflow-hidden bg-navy">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />

        <Container className="relative flex min-h-[78vh] flex-col justify-end pb-12 pt-32 sm:pb-16">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy">
              {project.category}
            </span>
            <h1 className="text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl">
              {project.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
              {project.description}
            </p>

            {/* Glass stat chips */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <StatChip icon={<Users className="h-4 w-4 text-gold" />} label="Client">
                {project.clientUrl ? (
                  <a
                    href={project.clientUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold"
                  >
                    {project.client}
                  </a>
                ) : (
                  project.client
                )}
              </StatChip>
              <StatChip icon={<Clock className="h-4 w-4 text-gold" />} label="Timeline">
                {project.timeline}
              </StatChip>
              <StatChip icon={<DollarSign className="h-4 w-4 text-gold" />} label="Cost">
                {project.cost}
              </StatChip>
              {project.location && (
                <StatChip icon={<MapPin className="h-4 w-4 text-gold" />} label="Location">
                  {project.location}
                </StatChip>
              )}
              <StatChip icon={<Camera className="h-4 w-4 text-gold" />} label="Photos">
                {totalPhotos}
              </StatChip>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
            <ArrowDown className="h-4 w-4 animate-bounce" />
            Scroll to walk the build
          </div>
        </Container>
      </section>

      {/* ===== Sticky phase nav ===== */}
      {multiPhase && (
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur">
          <Container className="flex gap-2 overflow-x-auto py-3">
            {project.phases.map((phase) => (
              <a
                key={phase.slug}
                href={`#phase-${phase.slug}`}
                className="shrink-0 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-gray-700 transition-all hover:border-navy hover:bg-navy hover:text-white"
              >
                {phase.name}
                <span className="ml-1.5 text-xs text-gray-400">{phase.images.length}</span>
              </a>
            ))}
          </Container>
        </div>
      )}

      {/* ===== Case study ===== */}
      {hasCaseStudy && (
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <Container>
            <ScrollReveal>
              <div className="mb-8 max-w-3xl sm:mb-10">
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
                  Case study
                </span>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
                  How we approached this project
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
              {project.challenge && (
                <ScrollReveal>
                  <div className="rounded-2xl border border-gray-200 bg-[#F5F5F7] p-6 sm:p-7">
                    <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
                      The challenge
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
                      {project.challenge}
                    </p>
                  </div>
                </ScrollReveal>
              )}
              {project.solution && (
                <ScrollReveal delay={0.08}>
                  <div className="rounded-2xl border border-gray-200 bg-[#F5F5F7] p-6 sm:p-7">
                    <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
                      Our solution
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
                      {project.solution}
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>

            {(project.scopeDetails || project.permits || project.materials) && (
              <div className="mt-6 grid max-w-5xl grid-cols-1 gap-6 sm:mt-8 sm:gap-8 md:grid-cols-3">
                {project.scopeDetails && project.scopeDetails.length > 0 && (
                  <ScrollReveal>
                    <BulletList title="Scope of work" items={project.scopeDetails} />
                  </ScrollReveal>
                )}
                {project.permits && project.permits.length > 0 && (
                  <ScrollReveal delay={0.05}>
                    <BulletList title="Permits & inspections" items={project.permits} />
                  </ScrollReveal>
                )}
                {project.materials && project.materials.length > 0 && (
                  <ScrollReveal delay={0.1}>
                    <BulletList title="Materials installed" items={project.materials} />
                  </ScrollReveal>
                )}
              </div>
            )}
          </Container>
        </section>
      )}

      {/* ===== Phase galleries ===== */}
      {project.phases.map((phase, phaseIdx) => {
        const phaseStartIndex = phaseStartIndices[phaseIdx];

        return (
          <section
            key={phase.slug}
            id={`phase-${phase.slug}`}
            className={`scroll-mt-20 py-12 sm:py-16 lg:py-20 ${
              phaseIdx % 2 === 1 ? "bg-surface" : "bg-white"
            }`}
          >
            <Container>
              <ScrollReveal>
                <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
                  <div>
                    {multiPhase && (
                      <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-primary">
                        Phase {phaseIdx + 1} of {project.phases.length}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {phase.name}
                    </h2>
                    {phase.description && (
                      <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
                        {phase.description}
                      </p>
                    )}
                  </div>
                  <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy sm:inline-flex">
                    <Camera className="h-3.5 w-3.5 text-gold" />
                    {phase.images.length}
                  </span>
                </div>
              </ScrollReveal>

              {phase.images.length > 0 ? (
                <div className="grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 lg:grid-cols-4">
                  {phase.images.map((image, i) => {
                    // First image of each phase gets a large bento tile.
                    const big = i === 0;
                    return (
                      <motion.button
                        key={image.src}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.05 }}
                        onClick={() => setLightboxIndex(phaseStartIndex + i)}
                        className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-surface transition-colors hover:border-gold ${
                          big ? "col-span-2 row-span-2" : ""
                        }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                          sizes={big ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                        />
                        <div className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/20" />
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-surface p-12 text-center">
                  <p className="text-sm text-gray-500">Photos coming soon</p>
                </div>
              )}
            </Container>
          </section>
        );
      })}

      {/* ===== Lightbox ===== */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/95 backdrop-blur-xl"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6 sm:top-6"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxPrev();
              }}
              className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>

            <div
              className="mx-4 w-full max-w-5xl sm:mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/40 sm:aspect-[16/10]">
                <Image
                  src={allImages[lightboxIndex].src}
                  alt={allImages[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90vw, 70vw"
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-3 text-sm">
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
                  {allImages[lightboxIndex].phaseName}
                </span>
                <span className="font-semibold tabular-nums text-white/60">
                  {lightboxIndex + 1} / {allImages.length}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxNext();
              }}
              className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function StatChip({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-sm text-white backdrop-blur">
      {icon}
      <span className="text-white/50">{label}:</span>
      <span className="font-semibold">{children}</span>
    </span>
  );
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">
        {title}
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 leading-relaxed">
            <span className="mt-0.5 text-gold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
