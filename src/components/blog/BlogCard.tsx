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
 * One post on the blog index as an editorial row: date, category and read
 * time on a label line, the title, the excerpt and a "Read More" line. The
 * whole row is one link. Server component.
 */
export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full transition-transform duration-150 ease-enter active:scale-[0.99] flex-col border-t border-rule py-8 sm:py-10"
    >
      <p className="label-tech flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
        <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
        <span aria-hidden="true">·</span>
        <span className="text-accent">{post.category}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </p>
      <h2 className="display-normal mt-4 max-w-[30ch] text-display-sm text-fg transition-colors duration-150 group-hover:text-link">
        {post.title}
      </h2>
      <p className="mt-3 max-w-[60ch] text-body">{post.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-5 font-semibold text-link underline-offset-[0.2em] group-hover:underline">
        {BLOG_INDEX.readMore}
        <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
