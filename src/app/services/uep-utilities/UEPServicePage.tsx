"use client";

import { useState, useCallback, useEffect } from "react";
import { Check, Phone, Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren, {
  staggerItem,
} from "@/components/animations/StaggerChildren";
import { motion, AnimatePresence } from "framer-motion";
import { BUSINESS } from "@/lib/constants";
import type { ServiceLanding } from "@/lib/types";

// ============================================
// UEP PROJECT IMAGES
// Add more images here as they come in
// ============================================
const UEP_IMAGES = [
  {
    src: "/images/services/uep-utilities/photo-1.jpg",
    alt: "Irrigation and water service line trenching along house foundation — purple irrigation pipe and white water line",
  },
  {
    src: "/images/services/uep-utilities/photo-2.jpg",
    alt: "Water meter box and irrigation valve box installed with caution tape — freshly completed UEP hookup",
  },
];

export default function UEPServicePage({
  landing,
}: {
  landing: ServiceLanding;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === 0 ? UEP_IMAGES.length - 1 : prev - 1
    );
  }, []);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === UEP_IMAGES.length - 1 ? 0 : prev + 1
    );
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, lightboxPrev, lightboxNext]);

  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-[#F5F5F7]">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              {landing.title}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6">
              {landing.heroText}
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8">
              {landing.description}
            </p>
            {landing.priceRange && (
              <p className="text-sm text-gray-500 mb-6">
                Typical price range:{" "}
                <span className="text-gray-900 font-semibold">
                  {landing.priceRange}
                </span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                href="/booking"
                size="lg"
                icon={<Calendar className="w-5 h-5" />}
              >
                Book This Service
              </Button>
              <Button
                href={`tel:${BUSINESS.phoneRaw}`}
                variant="secondary"
                size="lg"
                icon={<Phone className="w-5 h-5" />}
              >
                Call {BUSINESS.phone}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
              What We Offer
            </h2>
          </ScrollReveal>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {landing.features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="bg-[#F5F5F7] rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 hover:border-primary/30 transition-all duration-500"
              >
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* Gallery */}
      {UEP_IMAGES.length > 0 && (
        <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
          <Container>
            <ScrollReveal>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
                Our UEP Work
              </h2>
            </ScrollReveal>

            <StaggerChildren
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                UEP_IMAGES.length >= 3 ? "lg:grid-cols-3" : ""
              } gap-4 sm:gap-6`}
            >
              {UEP_IMAGES.map((image, index) => (
                <motion.div
                  key={image.src}
                  variants={staggerItem}
                  className="group cursor-pointer"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
          </Container>
        </section>
      )}

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
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {UEP_IMAGES.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
                className="absolute left-2 sm:left-6 p-2 text-gray-400 hover:text-white transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            <div
              className="max-w-4xl w-full mx-4 sm:mx-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-black/80 border border-white/10">
                <Image
                  src={UEP_IMAGES[lightboxIndex].src}
                  alt={UEP_IMAGES[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90vw, 60vw"
                />
              </div>
              <p className="text-center mt-3 text-white/70 text-sm sm:text-base">
                {lightboxIndex + 1} / {UEP_IMAGES.length}
              </p>
            </div>

            {UEP_IMAGES.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
                className="absolute right-2 sm:right-6 p-2 text-gray-400 hover:text-white transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlights */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12">
                Why Choose C&S for {landing.title}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {landing.highlights.map((highlight) => (
              <motion.div
                key={highlight}
                variants={staggerItem}
                className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                </div>
                <span className="text-gray-600 text-sm">{highlight}</span>
              </motion.div>
            ))}
          </StaggerChildren>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 lg:py-32 bg-[#F5F5F7]">
        <Container>
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {landing.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
                    >
                      <span className="text-sm sm:text-base font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-500 text-xs sm:text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
