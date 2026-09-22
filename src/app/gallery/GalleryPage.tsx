"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { GALLERY_ITEMS } from "@/lib/gallery-data";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeFilter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const lightboxPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === 0 ? filtered.length - 1 : lightboxIndex - 1
    );
  };
  const lightboxNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      lightboxIndex === filtered.length - 1 ? 0 : lightboxIndex + 1
    );
  };

  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        align="center"
        overline="Our Work"
        title="Project"
        accent="Gallery"
        description="Browse our portfolio of residential, commercial, and new construction plumbing projects across Southwest Florida."
      />

      {/* Filter + Grid */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          {/* The hero <h1> carries this visually; the grid still needs a
              section heading so the outline doesn't jump h1 -> h3. */}
          <h2 className="sr-only">Project gallery</h2>
          {/* Filter Buttons */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              {GALLERY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`min-h-11 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeFilter === cat.id
                      ? "bg-gold text-navy font-bold"
                      : "bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => openLightbox(i)}
                    className="group cursor-pointer"
                  >
                    <div className="pressable relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-primary/30">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 sm:p-6">
                        <div>
                          <p className="text-white font-semibold text-xs sm:text-sm">
                            {item.title}
                          </p>
                          <p className="text-primary text-[10px] sm:text-xs capitalize mt-0.5 sm:mt-1">
                            {item.category.replace("-", " ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </Container>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 text-white/80 hover:text-white active:text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxPrev();
              }}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 text-white/80 hover:text-white active:text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div
              className="max-w-4xl w-full mx-4 sm:mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-black/80 border border-white/10">
                <Image
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90vw, 60vw"
                />
              </div>
              <p className="text-center mt-3 text-white font-semibold text-sm sm:text-base">
                {filtered[lightboxIndex].title}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                lightboxNext();
              }}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 text-white/80 hover:text-white active:text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="absolute bottom-4 sm:bottom-6 text-xs sm:text-sm text-gray-500">
              {lightboxIndex + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
