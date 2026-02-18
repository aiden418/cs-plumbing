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

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
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

export default function Page({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <PageTransition>
      <ArticleJsonLd post={post} />
      <BlogContent post={post} />
      <CTASection />
    </PageTransition>
  );
}
