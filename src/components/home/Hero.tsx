"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Phone, Calendar, Star } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { BUSINESS } from "@/lib/constants";
import { registerGSAP, gsap } from "@/lib/gsap";

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
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <div className="hero-bg absolute inset-0">
        <Image
          src="/images/hero/drone-construction.jpg"
          alt="C&S Plumbing new construction site aerial view"
          fill
          className="object-cover object-center"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-gray-900/30" />
      </div>

      <Container className="relative z-10 pt-28 sm:pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Trust pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 sm:mb-8"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                5.0 Stars · 75+ Reviews
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight"
            >
              Southwest Florida&apos;s
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Most Trusted
              </span>
              <br />
              Plumbing Team
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 sm:mt-6 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed"
            >
              Family-owned since 1998. 8,500+ homes built. Licensed, insured,
              and ready 24/7 for Cape Coral, Fort Myers, and all of Lee County.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4"
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
                className="!bg-white/10 !border-white/30 !text-white hover:!bg-white/20"
              >
                Call {BUSINESS.phone}
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 sm:mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/50"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                24/7 Emergency Service
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Free Estimates
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Licensed & Insured
              </div>
            </motion.div>
          </div>

          {/* Right: Logo + Award */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            <div className="relative w-72 h-72 xl:w-80 xl:h-80">
              <Image
                src="/images/logos/logo-new.png"
                alt="C&S Plumbing of Lee"
                fill
                className="object-contain drop-shadow-[0_0_60px_rgba(0,119,204,0.3)]"
                sizes="320px"
                quality={90}
              />
            </div>
            <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15">
              <Image
                src="/images/awards/best-of-cape-coral-2025.png"
                alt="Best of Cape Coral 2025 Award"
                width={50}
                height={38}
              />
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-tight">
                  Best of Cape Coral 2025
                </p>
                <p className="text-xs text-white/60">
                  Award-Winning Plumbing
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile award badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex justify-center lg:hidden"
        >
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15">
            <Image
              src="/images/awards/best-of-cape-coral-2025.png"
              alt="Best of Cape Coral 2025 Award"
              width={50}
              height={38}
            />
            <div className="text-left">
              <p className="text-sm font-bold text-white leading-tight">
                Best of Cape Coral 2025
              </p>
              <p className="text-xs text-white/60">
                Award-Winning Plumbing
              </p>
            </div>
          </div>
        </motion.div>
      </Container>

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
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
