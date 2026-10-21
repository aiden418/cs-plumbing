import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkGrid, LinkSection } from "@/components/links/LinkGrid";
import type { BlogPost } from "@/lib/types";

/**
 * Server-rendered list of blog posts for a hub or the homepage, always with
 * an "all guides" link to /blog. Until this existed /blog and every post
 * were reachable only from the hover-rendered nav dropdown, i.e. had no
 * inbound links in the HTML at all.
 */
export default function RelatedPosts({
  posts,
  overline = "From the blog",
  heading,
  description,
  tone = "surface",
}: {
  posts: BlogPost[];
  overline?: string;
  heading: string;
  description?: string;
  tone?: "white" | "surface";
}) {
  if (posts.length === 0) return null;

  return (
    <LinkSection
      overline={overline}
      heading={heading}
      description={description}
      tone={tone}
      headingId="related-posts-heading"
    >
      <LinkGrid
        links={posts.map((p) => ({
          href: `/blog/${p.slug}`,
          label: p.title,
          meta: `${p.category} · ${p.readTime}`,
        }))}
        columns={posts.length >= 4 ? 4 : 3}
      />
      <p className="mt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5"
        >
          All plumbing guides &amp; tips
          <ArrowRight className="w-4 h-4" />
        </Link>
      </p>
    </LinkSection>
  );
}
