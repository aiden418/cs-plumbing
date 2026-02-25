"use client";

import { motion } from "framer-motion";
import { staggerItem } from "@/components/animations/StaggerChildren";
import { Clock, DollarSign, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { CompletedProject } from "@/lib/types";

export default function ProjectCard({ project }: { project: CompletedProject }) {
  return (
    <motion.a
      href={`/projects/${project.slug}`}
      variants={staggerItem}
      className="bg-surface rounded-2xl border border-white/5 overflow-hidden hover:border-primary/20 transition-all duration-500 block group"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] bg-surface">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-600 text-sm">Cover photo coming soon</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-background/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {project.clientUrl ? (
              <a href={project.clientUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                {project.client}
              </a>
            ) : (
              project.client
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {project.timeline}
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            {project.cost}
          </span>
        </div>

        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>

        <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2.5 transition-all">
          View Project <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </motion.a>
  );
}
