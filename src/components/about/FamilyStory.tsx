"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function FamilyStory() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-white/5">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-primary">C&S</span>
                  </div>
                  <p className="text-sm">Family Photo</p>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </ScrollReveal>

          {/* Story */}
          <ScrollReveal direction="right">
            <span className="inline-block text-primary text-sm font-semibold tracking-widest uppercase mb-4">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Three Generations
              <br />
              <span className="text-gradient">One Mission</span>
            </h2>
            <div className="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base leading-relaxed">
              <p>
                In 1997, two brothers made a bold decision. With the support of
                their father and a single work truck, they founded C&S Plumbing
                of Lee County — built on the belief that honest work, fair
                pricing, and treating customers like family would set them apart.
              </p>
              <p>
                Nearly three decades later, that belief hasn&apos;t just held up —
                it&apos;s become our legacy. Today, C&S Plumbing is proudly led
                by Samuel Pellechio Jr., who works alongside his son and daughter
                to continue what his family started.
              </p>
              <p>
                From a one-truck operation to one of Southwest Florida&apos;s
                most trusted plumbing companies, we&apos;ve grown by doing things
                the right way — every pipe, every connection, every time.
              </p>
            </div>
            <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">8,500+</div>
                <div className="text-xs sm:text-sm text-gray-500">Homes Built</div>
              </div>
              <div className="border-l border-white/10 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-white">27+</div>
                <div className="text-xs sm:text-sm text-gray-500">Years of Service</div>
              </div>
              <div className="border-l border-white/10 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-white">Top 4%</div>
                <div className="text-xs sm:text-sm text-gray-500">FL Contractors</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
