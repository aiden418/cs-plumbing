import { BLOG_POSTS } from "./constants";
import type { BlogPost } from "./types";

/** Newest first. */
export function sortedPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    b.publishDate.localeCompare(a.publishDate),
  );
}

/** Every category that has at least one post, with its post count. */
export function blogCategories(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of BLOG_POSTS) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: categorySlug(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** "UEP & Utilities" -> "uep-utilities" */
export function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function categoryFromSlug(slug: string): string | undefined {
  return BLOG_POSTS.find((p) => categorySlug(p.category) === slug)?.category;
}

export function postsInCategory(category: string): BlogPost[] {
  return sortedPosts().filter((p) => p.category === category);
}

/**
 * Related posts for the end of an article: same category first (newest first),
 * topped up with the most recent posts from elsewhere so the module is never
 * short — a single-post category would otherwise render nothing.
 */
export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const others = sortedPosts().filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
