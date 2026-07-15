"use client";

import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerChildren from "@/components/animations/StaggerChildren";
import BlogCard from "@/components/blog/BlogCard";
import CTASection from "@/components/home/CTASection";
import { BLOG_POSTS } from "@/lib/constants";

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
