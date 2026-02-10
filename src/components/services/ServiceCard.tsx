"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Siren,
  Waves,
  Flame,
  Wrench,
  Building2,
  HardHat,
  Droplets,
  PaintBucket,
  ArrowRight,
} from "lucide-react";
import type { Service } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  Siren: <Siren className="w-6 h-6 sm:w-7 sm:h-7" />,
  Waves: <Waves className="w-6 h-6 sm:w-7 sm:h-7" />,
  Flame: <Flame className="w-6 h-6 sm:w-7 sm:h-7" />,
  Wrench: <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />,
  Building2: <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />,
  HardHat: <HardHat className="w-6 h-6 sm:w-7 sm:h-7" />,
  Droplets: <Droplets className="w-6 h-6 sm:w-7 sm:h-7" />,
  PaintBucket: <PaintBucket className="w-6 h-6 sm:w-7 sm:h-7" />,
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={service.href} className="group block h-full">
        <div className="h-full bg-surface rounded-2xl border border-white/5 p-5 sm:p-6 lg:p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_0_40px_rgba(0,153,255,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              {iconMap[service.icon]}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
              {service.title}
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
              {service.description}
            </p>

            {service.features && (
              <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                {service.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs sm:text-sm text-gray-500"
                  >
                    <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all duration-300">
              Learn more <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
