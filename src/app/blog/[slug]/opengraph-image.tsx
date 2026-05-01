import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { BLOG_POSTS } from "@/lib/constants";

export const runtime = "edge";
export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "C&S Plumbing — Blog";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  return [{ id: "default", alt: post?.title ?? alt }];
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return createOgImage({
      eyebrow: "Blog",
      title: "C&S Plumbing — Insights",
      subtitle: "Plumbing tips, repipe guides & SWFL homeowner advice.",
    });
  }
  return createOgImage({
    variant: "blog",
    eyebrow: post.category ?? "Blog",
    title: post.title,
    subtitle: post.excerpt?.slice(0, 140),
  });
}
