import Link from "next/link";
import Container from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/icons";
import type { BlogPost } from "@/lib/types";
import { guides } from "@/content/home";
import HomeFaq from "./HomeFaq";
import { ArrowLink, HomeHeading } from "./HomeHeading";

/**
 * Guides and FAQ on shell: the three latest guides as rows (server-rendered,
 * so /blog and the posts have links in the HTML) beside the home FAQ, closed.
 */
export default function GuidesFaq({ posts }: { posts: BlogPost[] }) {
  return (
    <section data-tone="shell" aria-labelledby="related-posts-heading" className="relative bg-canvas py-12 text-body lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <HomeHeading
              id="related-posts-heading"
              eyebrow={guides.overline}
              title={guides.title}
              subtitle={guides.description} subtitleHidden="phone"
              size="sm"
            />
            <ul className="mt-6 border-b border-rule">
              {posts.map((post) => (
                <li key={post.slug} className="border-t border-rule">
                  <Link href={`/blog/${post.slug}`} className="group flex items-start justify-between gap-4 py-4">
                    <span>
                      <span className="block leading-snug font-semibold text-fg group-hover:text-link">{post.title}</span>
                      <span className="mt-1 block text-sm text-muted max-md:sr-only">{`${post.category} · ${post.readTime}`}</span>
                    </span>
                    <ArrowRight className="mt-0.5 size-5 shrink-0 text-link transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <ArrowLink href={guides.allLink.href} className="mt-4">
              {guides.allLink.label}
            </ArrowLink>
          </div>
          <div className="lg:col-span-7">
            <HomeFaq />
          </div>
        </div>
      </Container>
    </section>
  );
}
