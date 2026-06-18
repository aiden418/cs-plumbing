"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Camera, Layers, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import ProjectCard, { projectPhotoCount } from "@/components/projects/ProjectCard";
import CountUp from "@/components/animations/CountUp";
import CTASection from "@/components/home/CTASection";
import { COMPLETED_PROJECTS } from "@/lib/constants";

export default function ProjectsIndexPage() {
  const totalPhotos = useMemo(
    () => COMPLETED_PROJECTS.reduce((n, p) => n + projectPhotoCount(p), 0),
    []
  );
  const cityCount = useMemo(
    () => new Set(COMPLETED_PROJECTS.map((p) => p.location).filter(Boolean)).size,
    []
  );
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(COMPLETED_PROJECTS.map((p) => p.category)))],
    []
  );
  const featured = useMemo(
    () =>
      [...COMPLETED_PROJECTS].sort(
        (a, b) => projectPhotoCount(b) - projectPhotoCount(a)
      )[0],
    []
  );

  const [filter, setFilter] = useState("All");

  const visible = useMemo(() => {
    if (filter === "All")
      return COMPLETED_PROJECTS.filter((p) => p.slug !== featured.slug);
    return COMPLETED_PROJECTS.filter((p) => p.category === filter);
  }, [filter, featured.slug]);

  const featuredPhotos = projectPhotoCount(featured);

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-navy pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />
        <Container className="relative">
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold sm:text-sm">
            Our Work
          </span>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl">
            Real jobs.{" "}
            <span className="bg-gradient-to-r from-gold to-[#F6C453] bg-clip-text text-transparent">
              Real craftsmanship.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            From below-slab underground to final trim — new construction, commercial
            buildouts, and remodels across Southwest Florida. Tap any project to walk
            it phase by phase.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 sm:gap-6">
            {[
              { value: 8500, label: "Projects" },
              { value: totalPhotos, label: "Site photos" },
              { value: cityCount, label: "Cities" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
              >
                <div className="text-3xl font-black tabular-nums text-white sm:text-4xl">
                  <CountUp end={s.value} />
                  <span className="text-gold">+</span>
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/50">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== Spotlight (only on "All") ===== */}
      <section className="bg-surface pt-12 sm:pt-16">
        <Container>
          <AnimatePresence mode="popLayout">
            {filter === "All" && (
              <motion.a
                key="spotlight"
                href={`/projects/${featured.slug}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative mb-8 block overflow-hidden rounded-[2rem] border border-gray-200 bg-navy sm:mb-10"
              >
                <div className="relative aspect-[16/10] sm:aspect-[21/9]">
                  <Image
                    src={featured.coverImage}
                    alt={featured.name}
                    fill
                    priority
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent sm:bg-gradient-to-r sm:from-navy sm:via-navy/40 sm:to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:max-w-2xl sm:justify-center sm:p-12">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy">
                      Featured
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    {featured.name}
                  </h2>
                  <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/70 sm:line-clamp-3 sm:block">
                    {featured.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-white/80">
                    {featured.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-gold" />
                        {featured.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-gold" />
                      {featuredPhotos} photos
                    </span>
                    {featured.phases.length > 1 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-gold" />
                        {featured.phases.length} phases
                      </span>
                    )}
                  </div>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy transition-all group-hover:gap-3">
                    Explore project <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.a>
            )}
          </AnimatePresence>
        </Container>
      </section>

      {/* ===== Filter + Grid ===== */}
      <section className="bg-surface pb-16 sm:pb-24">
        <Container>
          <div className="mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-navy text-white shadow-lg shadow-navy/20"
                      : "border border-gray-300 bg-white text-gray-700 hover:border-navy hover:text-navy"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && (
            <p className="py-16 text-center text-gray-500">
              No projects in this category yet — check back soon.
            </p>
          )}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
