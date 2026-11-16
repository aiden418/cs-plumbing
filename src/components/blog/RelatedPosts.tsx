import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { LinkGrid } from "@/components/links/LinkGrid";
import LinkBlock from "@/components/links/LinkBlock";
import type { Tone } from "@/components/ui/Section";
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
  /** "surface" is the legacy name of shell. */
  tone?: Tone | "surface";
}) {
  if (posts.length === 0) return null;

  return (
    <LinkBlock
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
          className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
        >
          All plumbing guides &amp; tips
          <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
        </Link>
      </p>
    </LinkBlock>
  );
}
