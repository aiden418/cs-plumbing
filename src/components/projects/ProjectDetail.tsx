"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Clock, DollarSign, Users, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import type { CompletedProject, ProjectImage } from "@/lib/types";

export default function ProjectDetail({ project }: { project: CompletedProject }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Flatten all phase images into one array for lightbox navigation
  const allImages: (ProjectImage & { phaseName: string })[] = project.phases.flatMap(
    (phase) => phase.images.map((img) => ({ ...img, phaseName: phase.name }))
  );

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

  // Track a running index offset so we can map grid clicks → lightbox index
  let imageOffset = 0;

  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              {project.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              {project.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
              {project.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-gray-500">Client:</span>{" "}
                {project.clientUrl ? (
                  <a href={project.clientUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {project.client}
                  </a>
                ) : (
                  project.client
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-gray-500">Timeline:</span> {project.timeline}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-gray-500">Cost:</span> {project.cost}
              </div>
              {project.location && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-gray-500">Location:</span> {project.location}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Phase Sections */}
      {project.phases.map((phase) => {
        const phaseStartIndex = imageOffset;
        imageOffset += phase.images.length;

        return (
          <section key={phase.slug} className="py-12 sm:py-16 lg:py-20">
            <Container>
              <ScrollReveal>
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {phase.name}
                  </h2>
                  {phase.description && (
                    <p className="text-gray-500 text-sm sm:text-base max-w-2xl">
                      {phase.description}
                    </p>
                  )}
                </div>
              </ScrollReveal>

              {phase.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {phase.images.map((image, i) => (
                    <motion.div
                      key={image.src}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      onClick={() => setLightboxIndex(phaseStartIndex + i)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-surface border border-gray-200 group-hover:border-primary/20 transition-all duration-500">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-sm">Photos coming soon</p>
                </div>
              )}
            </Container>
          </section>
        );
      })}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-500 hover:text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxPrev();
              }}
              className="absolute left-2 sm:left-6 p-2 text-gray-500 hover:text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div
              className="max-w-4xl w-full mx-4 sm:mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-surface border border-white/10">
                <Image
                  src={allImages[lightboxIndex].src}
                  alt={allImages[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90vw, 60vw"
                />
              </div>
              <p className="text-center mt-3 text-white font-semibold text-sm sm:text-base">
                {allImages[lightboxIndex].phaseName}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxNext();
              }}
              className="absolute right-2 sm:right-6 p-2 text-gray-500 hover:text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="absolute bottom-4 sm:bottom-6 text-xs sm:text-sm text-gray-500">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
