import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { BLOG_INDEX } from "@/content/reading";
import type { BlogPost } from "@/lib/types";

/** "2026-03-10" → "March 10, 2026" (the calendar date as written in the data). */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * One post on the blog index as a plain row with a hairline above it: the
 * category (blue), date and read time, the title, the excerpt and "Read
 * More". The whole row is one link. On phones the excerpt shows three lines
 * (the full text stays in the HTML). Server component.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col border-t border-rule py-6 sm:py-8"
    >
      <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        <span className="font-semibold text-accent">{post.category}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </p>
      <h2 className="mt-2 text-[1.375rem] leading-tight font-bold text-fg group-hover:text-link sm:text-2xl">
        {post.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-body sm:line-clamp-none">{post.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-3 font-semibold text-link underline-offset-[0.2em] group-hover:underline">
        {BLOG_INDEX.readMore}
        <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
