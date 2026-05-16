"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { TESTIMONIALS } from "@/lib/constants";

const teamMembers = [
  { name: "Samuel", src: "/images/team/samuel.jpeg" },
  { name: "Aiden", src: "/images/team/aiden.jpg" },
  { name: "Dylan", src: "/images/team/dylan.jpeg" },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/gallery/freestanding-tub-accent-tile.jpg"
          alt="Freestanding soaking tub with accent tile installed by C&S Plumbing"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-white/90" />
      </div>
      <Container className="relative z-10">
        <SectionHeading
          overline="Testimonials"
          title="What Our Customers Say"
          subtitle="Real reviews from real customers across Southwest Florida."
        />

        {/* Team strip */}
        <div className="flex items-center justify-center gap-4 mb-8 sm:mb-12">
          <div className="flex -space-x-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white overflow-hidden relative"
              >
                <Image
                  src={member.src}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            Meet the C&S Team
          </span>
        </div>

        <ScrollReveal>
          <div className="relative">
            {/* Carousel */}
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4 sm:gap-6">
                {TESTIMONIALS.map((testimonial, i) => (
                  <div
                    key={i}
                    className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
                  >
                    <div className="h-full bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 flex flex-col">
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30 mb-3 sm:mb-4" />

                      <div className="flex gap-1 mb-3 sm:mb-4">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, j) => (
                            <Star
                              key={j}
                              className="w-4 h-4 fill-primary text-primary"
                            />
                          )
                        )}
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4 sm:mb-6">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      <div className="border-t border-gray-200 pt-3 sm:pt-4">
                        <div className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
              <button
                onClick={scrollPrev}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-primary/30 transition-all duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2.5 sm:gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-2.5 sm:h-2 rounded-full transition-all duration-300 ${
                      i === selectedIndex ? "bg-primary w-7 sm:w-6" : "bg-gray-300 w-2.5 sm:w-2"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={scrollNext}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-primary/30 transition-all duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
