"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Phone, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";
import { registerGSAP, gsap } from "@/lib/gsap";

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * 10}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    if (!heroRef.current) return;

    const bg = heroRef.current.querySelector(".hero-bg");
    if (bg) {
      gsap.to(bg, {
        y: 150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="hero-bg absolute inset-0">
        <Image
          src="/images/hero/drone-construction.jpg"
          alt="C&S Plumbing new construction site aerial view"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,153,255,0.08)_0%,transparent_70%)]" />
        <Particles />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block text-primary text-xs sm:text-sm lg:text-base font-semibold tracking-[0.2em] uppercase mb-4 sm:mb-6 lg:mb-8">
            Family-Owned Since 1997
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight"
        >
          Southwest Florida&apos;s
          <br />
          <span className="text-gradient">Most Trusted</span>
          <br />
          Plumbing Team
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-8 lg:mt-10 text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          From emergency repairs to new construction, we&apos;ve built our
          reputation one home at a time.{" "}
          <span className="text-white font-medium">8,500+ homes</span> and
          counting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Button
            href="/booking"
            size="lg"
            icon={<Calendar className="w-5 h-5" />}
          >
            Book a Service
          </Button>
          <Button
            href={`tel:${BUSINESS.phoneRaw}`}
            variant="secondary"
            size="lg"
            icon={<Phone className="w-5 h-5" />}
          >
            Call {BUSINESS.phone}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 sm:mt-16 lg:mt-20 flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10 text-xs sm:text-sm lg:text-base text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            24/7 Emergency Service
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Free Estimates
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            Licensed & Insured
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
