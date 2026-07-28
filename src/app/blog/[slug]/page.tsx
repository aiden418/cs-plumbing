import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import BlogContent from "@/components/blog/BlogContent";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import CTASection from "@/components/home/CTASection";
import { BLOG_POSTS } from "@/lib/constants";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.csplumbinglee.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate ?? post.publishDate,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <PageTransition>
      <ArticleJsonLd post={post} />
      {post.faqs && post.faqs.length > 0 && <FaqJsonLd faqs={post.faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <BlogContent post={post} />
      <CTASection />
    </PageTransition>
  );
}
