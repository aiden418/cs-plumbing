"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Camera, Layers } from "lucide-react";
import Image from "next/image";
import type { CompletedProject } from "@/lib/types";

export function projectPhotoCount(project: CompletedProject) {
  return project.phases.reduce((n, p) => n + p.images.length, 0);
}

export default function ProjectCard({ project }: { project: CompletedProject }) {
  const photoCount = projectPhotoCount(project);
  const phaseCount = project.phases.length;
  const live = /progress|underground|rough|trim|to /i.test(project.timeline);

  return (
    <motion.a
      href={`/projects/${project.slug}`}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 card-lift card-lift-hover"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gray-500 text-sm">
            Cover photo coming soon
          </div>
        )}

        {/* Readability gradient (navy) */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />

        {/* Top row: category + live */}
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy backdrop-blur">
            {project.category}
          </span>
          {live && (
            <span className="flex items-center gap-1.5 rounded-full bg-gold/95 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-navy" />
              </span>
              Live
            </span>
          )}
        </div>

        {/* Bottom overlay: title + chips */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h2 className="font-extrabold leading-tight text-white text-lg sm:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            {project.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-white/90">
            {project.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gold" />
                {project.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Camera className="h-3 w-3 text-gold" />
              {photoCount} photos
            </span>
            {phaseCount > 1 && (
              <span className="inline-flex items-center gap-1">
                <Layers className="h-3 w-3 text-gold" />
                {phaseCount} phases
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5">
        <span className="truncate pr-3 text-sm font-semibold text-navy">
          {project.client}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-primary transition-all group-hover:gap-2">
          View <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      {/* Gold accent grows on hover */}
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
    </motion.a>
  );
}
