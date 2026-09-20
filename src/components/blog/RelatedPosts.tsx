import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { relatedPosts, categorySlug } from "@/lib/blog";
import type { BlogPost } from "@/lib/types";

/**
 * Related-posts module for the end of an article.
 *
 * The blog previously had no internal linking between posts beyond whatever
 * links were hand-written into the HTML bodies, which left 19 posts almost
 * entirely unconnected. Server component — no client JS.
 */
export default function RelatedPosts({ post }: { post: BlogPost }) {
  const related = relatedPosts(post, 3);
  if (related.length === 0) return null;

  return (
    <section className="pb-16 sm:pb-24 border-t border-gray-200 pt-12 sm:pt-16">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Keep reading
          </h2>
          <Link
            href={`/blog/category/${categorySlug(post.category)}`}
            className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:gap-2.5 transition-all"
          >
            More on {post.category} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:border-primary/30 transition-colors block group"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock className="w-3 h-3" />
                  {item.readTime}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
