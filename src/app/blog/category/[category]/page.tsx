import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import CTASection from "@/components/home/CTASection";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/seo/ItemListJsonLd";
import { Clock } from "lucide-react";
import {
  blogCategories,
  categoryFromSlug,
  categorySlug,
  postsInCategory,
} from "@/lib/blog";

export function generateStaticParams() {
  return blogCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) return {};

  const count = postsInCategory(category).length;
  return {
    title: `${category} Articles`,
    description: `${count} plumbing ${count === 1 ? "guide" : "guides"} on ${category.toLowerCase()} from C&S Plumbing of Lee — written for Southwest Florida homeowners.`,
    alternates: { canonical: `/blog/category/${slug}` },
    openGraph: {
      title: `${category} — Plumbing Guides | C&S Plumbing of Lee`,
      description: `Plumbing guides on ${category.toLowerCase()} for Cape Coral, Fort Myers, and Southwest Florida homeowners.`,
      url: `https://www.csplumbinglee.com/blog/category/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) notFound();

  const posts = postsInCategory(category);
  const categories = blogCategories();

  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: category, href: `/blog/category/${slug}` },
        ]}
      />
      <ItemListJsonLd
        itemListType="Blog"
        name={`${category} — Plumbing Guides`}
        description={`Plumbing guides on ${category.toLowerCase()} for Southwest Florida homeowners.`}
        url={`/blog/category/${slug}`}
        items={posts.map((post) => ({
          name: post.title,
          href: `/blog/${post.slug}`,
          description: post.excerpt,
        }))}
      />

      <PageHero
        overline="Blog & Tips"
        title={category}
        accent={posts.length === 1 ? "1 guide" : `${posts.length} guides`}
        description={`Everything we've written about ${category.toLowerCase()} for Southwest Florida homes.`}
      />

      <section className="py-16 sm:py-24">
        <Container>
          {/* Category nav */}
          <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-8 sm:mb-10">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary/40 hover:text-primary transition-colors"
            >
              All posts
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/category/${c.slug}`}
                aria-current={c.slug === slug ? "page" : undefined}
                className={
                  c.slug === slug
                    ? "px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold"
                    : "px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-primary/40 hover:text-primary transition-colors"
                }
              >
                {c.name} ({c.count})
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 lg:p-8 hover:border-primary/30 transition-colors block group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </PageTransition>
  );
}
