import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { ArrowRight } from "@/components/ui/icons";
import type { BlogPost } from "@/lib/types";
import { guides } from "@/content/home";
import HomeFaq from "./HomeFaq";

const linkClass =
  "group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline";

/**
 * Chapter 7 on shell: the latest guides as hairline rows (server-rendered,
 * so /blog and the posts have links in the HTML) beside the home FAQ.
 */
export default function GuidesFaq({ posts }: { posts: BlogPost[] }) {
  return (
    <Section tone="shell" spacing="none" className="py-section-sm lg:py-section" labelledBy="related-posts-heading">
      <Container>
        <div className="grid grid-cols-1 gap-y-section-sm lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-5">
            <Eyebrow className="mb-4">{guides.overline}</Eyebrow>
            <h2 id="related-posts-heading" className="font-display text-display-sm font-bold text-fg [font-stretch:108%]">
              {guides.title}
            </h2>
            <p className="mt-4 max-w-[48ch] text-body">{guides.description}</p>
            <ul className="mt-8 border-b border-rule">
              {posts.map((post) => (
                <li key={post.slug} className="border-t border-rule">
                  <Link href={`/blog/${post.slug}`} className="group flex items-start justify-between gap-4 py-4 lg:py-5">
                    <span>
                      <span className="block leading-snug font-semibold text-fg group-hover:underline group-hover:underline-offset-4">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted">{`${post.category} · ${post.readTime}`}</span>
                    </span>
                    <ArrowRight className="mt-0.5 size-5 shrink-0 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link href={guides.allLink.href} className={linkClass}>
                {guides.allLink.label}
                <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
              </Link>
            </p>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <HomeFaq />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
