"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function FamilyStory() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src="/images/team/family.jpeg"
                alt="The Pellechio family — the people behind C&S Plumbing of Lee"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/15 rounded-full blur-3xl" />
            </div>
          </ScrollReveal>

          {/* Story */}
          <ScrollReveal direction="right">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-gold mb-4">
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-5 sm:mb-6 leading-tight">
              A Family Trade,
              <br />
              <span className="text-gradient">Passed Down by Hand</span>
            </h2>
            <div className="space-y-4 text-gray-500 text-sm sm:text-base leading-relaxed">
              <p className="text-gray-700 font-semibold">
                Some companies sell plumbing. We inherited it.
              </p>
              <p>
                Before C&S, there was <strong className="text-gray-900">Samuel Pellechio
                Sr.</strong> — a mason and general contractor in Philadelphia who built thousands
                of homes and lived by one rule: a job isn&apos;t finished until it&apos;s done
                right. In 1984 he moved the family to Cape Coral, his two sons in tow.
              </p>
              <p>
                Both boys grew up in the trades and graduated from Cape Coral High.{" "}
                <strong className="text-gray-900">Sam</strong> earned his plumbing license in
                December 1997 and — with his brother <strong className="text-gray-900">Chris</strong>{" "}
                and their father behind them — founded{" "}
                <strong className="text-gray-900">C&S Plumbing of Lee</strong>. The name says it
                plainly: <strong className="text-gray-900">C&S — for Chris and Sam.</strong>{" "}
                Samuel Jr. has led it ever since, on one promise: honest work, fair pricing, and
                treating every customer like family. Nearly three decades and 8,500+ homes later,
                that promise became our legacy.
              </p>
              <p>
                Today the third generation is on the job.{" "}
                <strong className="text-gray-900">Aiden Pellechio</strong> — born in 2005, a 2023
                North Fort Myers High grad — works full-time for C&S as a project manager and
                estimator, wearing a dozen hats from permitting to marketing, while earning his
                construction-management degree at FGCU (Class of 2028). His plan from there: a GC
                license, then his own plumbing license. Same name on the truck. Same standard on
                every pipe.
              </p>
            </div>
            <div className="mt-7 sm:mt-8 grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">8,500+</div>
                <div className="text-xs sm:text-sm text-gray-500">Homes Plumbed</div>
              </div>
              <div className="border-l border-gray-200 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">28+</div>
                <div className="text-xs sm:text-sm text-gray-500">Years of Service</div>
              </div>
              <div className="border-l border-gray-200 pl-4 sm:pl-6">
                <div className="text-2xl sm:text-3xl font-black text-gray-900">5.0★</div>
                <div className="text-xs sm:text-sm text-gray-500">46 Google Reviews</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
