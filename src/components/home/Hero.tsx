"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, HardHat, Home, Phone, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import HeroVideo from "@/components/home/HeroVideo";
import { BUSINESS, LATEST_AWARD } from "@/lib/constants";
import { registerGSAP, gsap } from "@/lib/gsap";
import { breakpoints } from "@/hooks/useMediaQuery";

// Three lines, kept as semantic arrays so the per-word clip-path reveal
// stays readable. Real DOM text remains literal — SEO/screen-readers see
// the full sentence.
const HEADLINE_LINES: string[][] = [
  ["Southwest", "Florida's"],
  ["Most", "Trusted"],
  ["Plumbing", "Team"],
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax + scale on background — driven by GSAP ScrollTrigger.
  useEffect(() => {
    registerGSAP();
    if (!heroRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;
    // Scrubbed parallax is per-frame scroll work — skip it on touch devices
    if (window.matchMedia(breakpoints.coarse).matches) return;

    const ctx = gsap.context(() => {
      const bg = heroRef.current!.querySelector(".hero-bg");
      if (!bg) return;
      gsap.to(bg, {
        y: 240,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  let wordIndex = 0;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden flex flex-col"
    >
      {/* Background — single dim + radial vignette */}
      <div className="hero-bg absolute inset-0 lg:will-change-transform">
        <Image
          src="/images/hero/drone-construction.jpg"
          alt="C&S Plumbing new construction site aerial view"
          fill
          className="object-cover object-center"
          priority
          // 75 is visually identical on a drone photo and ~30% smaller at the
          // mobile widths where this is the LCP image.
          quality={75}
        />
        <HeroVideo />
        <div className="absolute inset-0 bg-gray-900/40" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>

      <Container className="relative z-10 pt-28 sm:pt-32 pb-24 sm:pb-28 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-12 items-center">
          {/* Left: Text */}
          <div>
            {/* Trust pill. Entrance animations in this hero are CSS-only
                (animate-hero-in) so the text paints before hydration —
                framer's opacity:0 initial state made the hero paragraph the
                LCP element and pushed LCP past 10s on mobile. */}
            <div className="animate-hero-in inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 mb-6 sm:mb-8">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                {BUSINESS.rating.toFixed(1)} Stars · {BUSINESS.reviewCount}+ Reviews
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] font-black text-white leading-[0.95] tracking-tight">
              {HEADLINE_LINES.map((line, lineIdx) => {
                const isAccentLine = lineIdx === 1;
                return (
                  <span
                    key={lineIdx}
                    className={isAccentLine ? "relative block" : "block"}
                  >
                    {line.map((word) => {
                      const i = wordIndex++;
                      return (
                        <span
                          key={`${lineIdx}-${word}-${i}`}
                          className="word-mask mr-[0.18em]"
                        >
                          {/* CSS keyframe reveal (see word-mask-inner in
                              globals.css): runs from first paint instead of
                              waiting on a post-hydration state flip. */}
                          <span
                            className="word-mask-inner"
                            style={{ animationDelay: `${i * 60}ms` }}
                          >
                            {word}
                          </span>
                        </span>
                      );
                    })}
                    {isAccentLine && (
                      <span
                        aria-hidden
                        className="animate-underline-in absolute left-0 -bottom-1 h-[5px] sm:h-[6px] lg:h-[8px] w-full bg-gold origin-left rounded-full"
                      />
                    )}
                  </span>
                );
              })}
            </h1>

            <p
              className="animate-hero-in mt-6 sm:mt-8 text-base sm:text-lg text-white/70 max-w-lg leading-relaxed"
              style={{ animationDelay: "320ms" }}
            >
              Family owned and operated since 1998, with 9,500+ homes plumbed. New
              construction for builders, and repairs, repipes and remodels
              for homeowners across Cape Coral, Fort Myers and Southwest
              Florida.
            </p>

            {/* Two doors: builders/GCs and homeowners/service. Emergency is a
                line under them, not the headline identity. */}
            <div
              data-pipe-node="hero-cta"
              className="animate-hero-in mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl"
              style={{ animationDelay: "440ms" }}
            >
              <Link
                href="/builders"
                className="group rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 transition-all duration-300 hover:bg-white/15 hover:border-gold/60"
              >
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
                  <HardHat className="w-4 h-4" /> Builders &amp; GCs
                </span>
                <span className="mt-2 block text-lg font-bold text-white leading-snug">
                  New construction, slab to final
                </span>
                <span className="mt-1 block text-sm text-white/65">
                  Scope by phase, prequal packet, submit plans for a bid.
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Builder services
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/booking"
                className="group rounded-2xl border border-white/20 bg-primary/90 p-5 transition-all duration-300 hover:bg-primary"
              >
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80">
                  <Home className="w-4 h-4" /> Homeowners / Service
                </span>
                <span className="mt-2 block text-lg font-bold text-white leading-snug">
                  Repairs, repipes &amp; remodels
                </span>
                <span className="mt-1 block text-sm text-white/75">
                  Water heaters, leaks, drains, fixtures, whole-home repipes.
                </span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Book a service
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            <p
              className="animate-hero-in mt-4 text-sm text-white/60"
              style={{ animationDelay: "520ms" }}
            >
              Plumbing emergency?{" "}
              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center gap-1 font-semibold text-white hover:text-gold"
              >
                <Phone className="w-3.5 h-3.5" />
                {BUSINESS.phone}
              </a>{" "}
              · <Link href="/emergency" className="underline-offset-2 hover:underline">24/7 service</Link>
            </p>

            {/* Trust indicators */}
            <div
              className="animate-hero-in mt-8 sm:mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-white/50"
              style={{ animationDelay: "600ms" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Licensed & Insured
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                9,500+ Homes Plumbed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Free Estimates
              </div>
            </div>
          </div>

          {/* Right: Logo + Award (desktop only) */}
          <div
            className="animate-hero-in hidden lg:flex flex-col items-center justify-center"
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative w-72 h-72 xl:w-80 xl:h-80">
              {/* Radial primary-tinted aura behind the logo */}
              <div
                aria-hidden
                className="absolute inset-[-25%] logo-aura rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,119,204,0.35) 0%, rgba(0,119,204,0) 70%)",
                }}
              />
              {/* No `priority`: this column is display:none below lg, and a
                  preloaded image is still fetched on phones that never show
                  it. Lazy loading skips hidden images and, on desktop, the
                  logo is in the viewport so it loads immediately anyway. */}
              <Image
                src="/images/logos/logo-new.png"
                alt="C&S Plumbing of Lee"
                fill
                className="relative object-contain"
                sizes="320px"
                quality={85}
              />
            </div>
            <Link
              href="/awards"
              className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/15 transition-colors"
            >
              <Image
                src={LATEST_AWARD.badge}
                alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
                // Display size, not the file's 2215x1561: the attribute ratio then
                // matches the rendered box (the hidden twin is measured by attributes).
                width={54}
                height={38}
                sizes="54px"
                className="h-[38px] w-[54px]"
              />
              <div className="text-left">
                <p className="text-sm font-bold text-white leading-tight">
                  {LATEST_AWARD.title}
                </p>
                <p className="text-xs text-white/60">
                  Voted {LATEST_AWARD.category}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile award badge */}
        <div
          className="animate-hero-in mt-10 flex justify-center lg:hidden"
          style={{ animationDelay: "520ms" }}
        >
          <Link
            href="/awards"
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/15"
          >
            <Image
              src={LATEST_AWARD.badge}
              alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
              width={54}
              height={38}
              sizes="54px"
              className="h-[38px] w-[54px]"
              priority
            />
            <div className="text-left">
              <p className="text-sm font-bold text-white leading-tight">
                {LATEST_AWARD.title}
              </p>
              <p className="text-xs text-white/60">
                Voted {LATEST_AWARD.category}
              </p>
            </div>
          </Link>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
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
