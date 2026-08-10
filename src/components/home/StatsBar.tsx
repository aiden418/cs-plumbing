"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "@/components/animations/CountUp";
import Container from "@/components/ui/Container";
import { STATS } from "@/lib/constants";

export default function StatsBar() {
  return (
    <section
      data-pipe-node="stats"
      className="relative py-20 sm:py-28 lg:py-36 border-y border-gray-200 bg-[#F5F5F7] overflow-hidden"
    >
      {/* Gold tick where the pipeline crosses into the section */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[3px] bg-gold rounded-full hidden lg:block"
      />
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/gallery/aerial-underground-layout.jpg"
          alt="Drone view of a C&S Plumbing new construction jobsite in Lee County"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={75}
        />
        {/* Flat overlay — a full-bleed backdrop-blur here repainted the whole
            band on every scrolled frame */}
        <div className="absolute inset-0 bg-white/65" />
      </div>
      <Container className="relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-160px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-center"
            >
              <div
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-1 sm:mb-2 tabular-nums"
                style={{ textShadow: "0 0 32px rgba(0,119,204,0.15)" }}
              >
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  duration={2 + i * 0.2}
                />
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
