"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren from "@/components/animations/StaggerChildren";
import BlogCard from "@/components/blog/BlogCard";
import CTASection from "@/components/home/CTASection";
import { BLOG_POSTS } from "@/lib/constants";
import { blogCategories } from "@/lib/blog";

export default function BlogIndexPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        overline="Blog & Tips"
        title="Plumbing Tips"
        accent="from the Pros"
        description="Expert advice, how-to guides, and insider tips to help you take care of your home's plumbing — from Southwest Florida's most trusted plumbing team."
      />

      {/* Posts */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          {/* Category nav — 19 posts across 8 categories previously had no
              browsing affordance at all. */}
          <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-8 sm:mb-10">
            <span className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">
              All posts
            </span>
            {blogCategories().map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </nav>
          <ScrollReveal>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[...BLOG_POSTS]
                .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
                .map((post) => (
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
