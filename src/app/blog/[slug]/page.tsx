import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/layout/PageTransition";
import BlogContent from "@/components/blog/BlogContent";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
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
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://www.csplumbinglee.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishDate,
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
      <BlogContent post={post} />
      <CTASection />
    </PageTransition>
  );
}
