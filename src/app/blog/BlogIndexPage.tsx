"use client";

import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren from "@/components/animations/StaggerChildren";
import BlogCard from "@/components/blog/BlogCard";
import CTASection from "@/components/home/CTASection";
import { BLOG_POSTS } from "@/lib/constants";

export default function BlogIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-surface">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-primary text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
              Blog & Tips
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
              Plumbing Tips from the Pros
            </h1>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              Expert advice, how-to guides, and insider tips to help you take
              care of your home&apos;s plumbing — from Southwest Florida&apos;s
              most trusted plumbing team.
            </p>
          </div>
        </Container>
      </section>

      {/* Posts */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <ScrollReveal>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {BLOG_POSTS.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </StaggerChildren>
          </ScrollReveal>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
