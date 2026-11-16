import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { ArrowLeft, Calendar, Phone } from "@/components/ui/icons";
import { formatPostDate } from "@/components/blog/BlogCard";
import { BLOG_POST } from "@/content/reading";
import { BUSINESS } from "@/lib/business";
import type { BlogPost } from "@/lib/types";

/**
 * A blog post: the editorial header (category, title, date, read time and
 * byline), then the article in the rich-text column, its FAQ, the help note
 * and the way back to the blog. Server component: the article HTML, every
 * link and every answer are in the first response.
 */
export default function BlogContent({ post }: { post: BlogPost }) {
  const hasFaqs = Boolean(post.faqs && post.faqs.length > 0);
  return (
    <>
      <PageHero layout="editorial" overline={post.category} title={post.title}>
        <div className="mt-7 border-t border-rule pt-5 text-sm text-muted">
          <p className="label-tech flex flex-wrap items-center gap-x-3 gap-y-1">
            <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </p>
          {/* Visible byline: the Article schema names the author, and a
              reader (or an AI engine) should see the same person on the page. */}
          <p className="mt-2">
            {BLOG_POST.bylineBy}{" "}
            <Link
              href={BLOG_POST.authorHref}
              className="font-semibold text-fg underline-offset-4 hover:underline"
            >
              {BLOG_POST.author}
            </Link>
            {BLOG_POST.authorRole}
            {post.updatedDate && (
              <>
                {" "}· {BLOG_POST.updated}{" "}
                <time dateTime={post.updatedDate}>{formatPostDate(post.updatedDate)}</time>
              </>
            )}
          </p>
        </div>
      </PageHero>

      <Section tone="white" spacing="sm">
        <Container>
          <div className="mx-auto max-w-[46rem]">
            <article className="rich-text" dangerouslySetInnerHTML={{ __html: post.content }} />

            {hasFaqs && (
              <section aria-labelledby="post-faq-heading" className="mt-16 sm:mt-20">
                <h2 id="post-faq-heading" className="mb-6 text-display-sm text-fg">
                  {BLOG_POST.faqHeading}
                </h2>
                <FaqAccordion faqs={post.faqs ?? []} />
              </section>
            )}

            <aside
              aria-labelledby="post-help-heading"
              className="mt-16 grid gap-6 border-t border-rule pt-8 sm:mt-20 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <h3 id="post-help-heading" className="text-xl text-fg">
                  {BLOG_POST.help.heading}
                </h3>
                <p className="mt-2 max-w-[44ch] text-body">{BLOG_POST.help.body}</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  href={BUSINESS.phoneHref}
                  variant="secondary"
                  icon={<Phone className="size-5" />}
                  fullWidth
                >
                  {BUSINESS.phone}
                </Button>
                <Button href={BLOG_POST.help.bookHref} icon={<Calendar className="size-5" />} fullWidth>
                  {BLOG_POST.help.book}
                </Button>
              </div>
            </aside>

            <p className="mt-10">
              <Link
                href="/blog"
                className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
              >
                <ArrowLeft className="size-5 transition-transform duration-250 ease-settle group-hover:-translate-x-0.5" />
                {BLOG_POST.backToBlog}
              </Link>
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
