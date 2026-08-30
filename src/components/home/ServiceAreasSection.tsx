"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { registerGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { AREA_LANDINGS } from "@/lib/constants";

// Per-city response copy. Falls back to "Same-day service" for any slug
// not listed. Move into AREA_LANDINGS in Phase 2 once we verify per-city.
const RESPONSE_TIMES: Record<string, string> = {
  "north-fort-myers": "15 min response", // shop is here
  "cape-coral": "30 min response",
  "fort-myers": "30 min response",
  "lehigh-acres": "45 min response",
  "estero": "45 min response",
  "bonita-springs": "60 min response",
  "naples": "60 min response",
  "sanibel": "60 min response",
  "punta-gorda": "45 min response",
  "port-charlotte": "60 min response",
};

// Per-city imagery sourced from Unsplash (free for commercial use).
// Stored locally in /public/images/areas/<slug>.jpg so card load doesn't
// depend on an external CDN.
const AREA_IMAGES: Record<string, string> = {
  "cape-coral": "/images/areas/cape-coral.jpg",
  "fort-myers": "/images/areas/fort-myers.jpg",
  "north-fort-myers": "/images/areas/north-fort-myers.jpg",
  "naples": "/images/areas/naples.jpg",
  "bonita-springs": "/images/areas/bonita-springs.jpg",
  "lehigh-acres": "/images/areas/lehigh-acres.jpg",
  "estero": "/images/areas/estero.jpg",
  "sanibel": "/images/areas/sanibel.jpg",
  "punta-gorda": "/images/areas/punta-gorda.jpg",
  "port-charlotte": "/images/areas/port-charlotte.jpg",
};

// Soft fallback for any future slug that doesn't have an image yet
const FALLBACK_IMAGE = "/images/gallery/aerial-waterfront-newbuild.jpg";

export default function ServiceAreasSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    if (!sectionRef.current || !trackRef.current || !railRef.current) return;

    const section = sectionRef.current;
    const rail = railRef.current;
    const track = trackRef.current;
    let cancelled = false;

    // matchMedia (instead of a one-shot matches check) so resizing across
    // the lg boundary cleanly creates/destroys the pin — the old version
    // left a stale pin behind.
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        // While pinned, the rail covers most of the viewport. With
        // data-lenis-prevent set, wheel events over it escaped Lenis and
        // raw-scrolled the page against the scrubbed pin — the source of
        // the "buggy" scroll feel. Desktop hands the wheel back to Lenis.
        rail.removeAttribute("data-lenis-prevent");

        const watermarks = Array.from(
          section.querySelectorAll<HTMLElement>(".area-watermark"),
        );
        const counter = section.querySelector<HTMLElement>(".area-counter");
        const progressFill =
          section.querySelector<HTMLElement>(".progress-fill");
        const cardImages = track.querySelectorAll<HTMLElement>(
          ".card-img-inner",
        );
        const total = watermarks.length;
        let activeIdx = -1;

        const setActive = (idx: number) => {
          if (idx === activeIdx) return;
          activeIdx = idx;
          watermarks.forEach((el, i) => {
            gsap.to(el, {
              opacity: i === idx ? 1 : 0,
              duration: 0.35,
              ease: "power2.out",
              overwrite: true,
            });
          });
          if (counter) {
            counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
          }
        };

        // Slide the track until the LAST card's left edge sits at the
        // parent's left edge (24px nudge). offsetLeft is transform-immune.
        const getDistance = () => {
          const lastCard = track.lastElementChild as HTMLElement | null;
          if (!lastCard) return 0;
          return Math.max(0, lastCard.offsetLeft - 24);
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              setActive(
                Math.min(total - 1, Math.round(self.progress * (total - 1))),
              );
            },
          },
        });
        tl.to(track, { x: () => -getDistance() }, 0);
        if (progressFill) tl.to(progressFill, { scaleX: 1 }, 0);
        if (cardImages.length) tl.fromTo(cardImages, { xPercent: 0 }, { xPercent: -6 }, 0);

        setActive(0);

        return () => {
          rail.setAttribute("data-lenis-prevent", "");
          tl.kill();
        };
      },
    );

    // One refresh after every card image has actually decoded — replaces
    // the old per-load debounce that could still fire mid-scroll.
    Promise.all(
      Array.from(track.querySelectorAll("img")).map((img) =>
        img.decode().catch(() => {}),
      ),
    ).then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="service-areas"
      className="relative bg-[#F5F5F7] overflow-hidden py-20 sm:py-28 motion-safe:lg:py-0 motion-safe:lg:h-screen motion-safe:lg:flex motion-safe:lg:items-center"
      aria-label="Service areas"
    >
      {/* Giant city-name watermark — crossfades as the rail traverses SWFL.
          Decorative duplicate of the card headings; desktop pin only. */}
      <div
        aria-hidden
        className="hidden motion-safe:lg:flex absolute inset-0 items-center justify-center overflow-hidden pointer-events-none select-none"
      >
        {AREA_LANDINGS.map((area) => (
          <span
            key={area.slug}
            className="area-watermark absolute font-display font-black text-[10rem] xl:text-[13rem] leading-none tracking-tighter text-navy/[0.06] whitespace-nowrap opacity-0"
          >
            {area.city}
          </span>
        ))}
      </div>

      {/* Headline column — visible at all sizes; pinned on lg (motion-safe only).
          Reduced-motion users get the static stacked layout instead. */}
      <Container className="motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:flex motion-safe:lg:flex-col motion-safe:lg:justify-center motion-safe:lg:pointer-events-none motion-safe:lg:z-20">
        <div className="motion-safe:lg:max-w-md motion-safe:lg:pointer-events-auto">
          <SectionHeading
            overline="Service Areas"
            title="Serving All of Southwest Florida"
            subtitle="From Cape Coral to Naples — fast, reliable plumbing across Lee and Collier County."
          />
        </div>
      </Container>

      {/* Horizontal track. Desktop motion-safe: GSAP translates `x`. Mobile +
          reduced-motion: native overflow-x scroll-snap rail (data-lenis-prevent
          keeps Lenis from hijacking the native touch scroll). */}
      <div
        ref={railRef}
        data-lenis-prevent
        className="
          relative w-full motion-safe:lg:absolute motion-safe:lg:inset-y-0 motion-safe:lg:right-0 motion-safe:lg:left-[35%] motion-safe:lg:flex motion-safe:lg:items-center
          overflow-x-auto motion-safe:lg:overflow-visible snap-x snap-mandatory
          [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div
          ref={trackRef}
          className="flex gap-4 sm:gap-6 px-6 lg:px-12 lg:will-change-transform"
        >
          {AREA_LANDINGS.map((area) => {
            const imageSrc = AREA_IMAGES[area.slug] ?? FALLBACK_IMAGE;
            return (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="
                  group relative shrink-0 snap-center
                  w-[78vw] sm:w-[420px] lg:w-[460px]
                  h-[420px] sm:h-[460px] lg:h-[520px]
                  rounded-3xl overflow-hidden
                  border border-gray-200
                  bg-gradient-to-br from-primary/20 via-primary/10 to-surface
                  card-lift card-lift-hover
                "
                aria-label={`Plumber in ${area.city}, ${area.state}`}
              >
                {/* City image — eager so all 8 are decoded before pin-scroll
                    starts. The inner wrapper is 16% wider than the card and
                    pans (transform-only) as the rail scrubs for depth. */}
                <div className="card-img-inner absolute inset-y-0 -left-[8%] -right-[8%] will-change-transform">
                  <Image
                    src={imageSrc}
                    alt={`Aerial view of ${area.city}, ${area.state}`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 488px, 534px"
                    className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)]"
                    quality={70}
                    loading="eager"
                  />
                </div>

                {/* Apple-style gradient overlay — readable text bottom, image breathes top */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)",
                  }}
                />

                {/* Big city name as graphic — now in white over the photo */}
                <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/40">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold text-gray-800">
                        {RESPONSE_TIMES[area.slug] ?? "Same-day service"}
                      </span>
                    </div>
                    <h3
                      className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight"
                      style={{ textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
                    >
                      {area.city}
                    </h3>
                    <p
                      className="text-sm text-white/80 mt-1 font-medium"
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}
                    >
                      {area.state}
                    </p>
                  </div>
                </div>

                {/* Hover arrow disc */}
                <div
                  className="
                    absolute top-6 right-6 w-11 h-11 rounded-full
                    bg-white/95 backdrop-blur-sm text-primary flex items-center justify-center
                    opacity-0 translate-x-2
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-400
                  "
                  style={{ transitionTimingFunction: "var(--ease-out-expo)" }}
                >
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Progress line + counter — desktop pin only */}
      <div
        aria-hidden
        className="hidden motion-safe:lg:flex absolute bottom-10 left-[35%] right-12 z-20 items-center gap-5 pointer-events-none"
      >
        <span className="area-counter text-sm font-bold text-gray-700 tabular-nums tracking-[0.2em]">
          01 / 08
        </span>
        <div className="relative flex-1 h-[2px] bg-gray-300/80 rounded-full overflow-hidden">
          <div className="progress-fill absolute inset-0 bg-gold origin-left scale-x-0 will-change-transform rounded-full" />
        </div>
      </div>

      {/* Closing copy — only renders below lg so the pinned section stays clean */}
      <Container className="relative z-10 mt-10 lg:hidden">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              Plus Fort Myers Beach, Captiva Island, Punta Gorda, Port Charlotte, Marco Island & more.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all"
            >
              Book a Plumber in Your Area <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
