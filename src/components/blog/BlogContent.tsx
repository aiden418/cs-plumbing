import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import FaqAccordion from "@/components/ui/FaqAccordion";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import { ArrowLeft, ArrowRight, Calendar, Phone } from "@/components/ui/icons";
import { formatPostDate } from "@/components/blog/BlogCard";
import { BLOG_POST } from "@/content/reading";
import { BUSINESS } from "@/lib/business";
import { landingsForPost } from "@/lib/internal-links";
import type { BlogPost } from "@/lib/types";

const rowLink =
  "group flex min-h-14 items-center justify-between gap-4 py-3 underline-offset-4";

/** A short list of links as hairline rows (label, then a small second line). */
function LinkRows({ links }: { links: { href: string; label: string; meta: string }[] }) {
  return (
    <ul className="mt-4 border-b border-rule">
      {links.map((link) => (
        <li key={link.href} className="border-t border-rule">
          <Link href={link.href} className={rowLink}>
            <span className="min-w-0">
              <span className="block leading-snug font-semibold text-fg group-hover:underline">
                {link.label}
              </span>
              <span className="mt-0.5 block text-sm text-muted">{link.meta}</span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * A blog post: a plain white header (category, title, date, read time and
 * byline), then the article in an 18 px reading column with its FAQ. Beside
 * it from lg (under it on phones): the help note with Call and Book, the
 * local service pages the post points to and other guides. Server
 * component: the article HTML, every link and every answer are in the first
 * response.
 */
export default function BlogContent({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const hasFaqs = Boolean(post.faqs && post.faqs.length > 0);
  const landings = landingsForPost(post);
  return (
    <>
      <PageHero layout="plain" size="sm" overline={post.category} title={post.title}>
        <div className="mt-5 text-sm text-muted sm:text-base">
          <p className="flex flex-wrap items-center gap-x-2">
            <time dateTime={post.publishDate}>{formatPostDate(post.publishDate)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </p>
          {/* Visible byline: the Article schema names the author, and a
              reader (or an AI engine) should see the same person on the page. */}
          <p className="mt-1">
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

      <Section tone="white" className="pt-8 pb-12 sm:pt-10 sm:pb-16">
        <Container>
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-x-14 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-x-20">
            <div className="min-w-0">
              <article
                className="rich-text post-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {hasFaqs && (
                <section aria-labelledby="post-faq-heading" className="mt-12 max-w-[68ch]">
                  <h2 id="post-faq-heading" className="mb-4 text-display-sm text-fg">
                    {BLOG_POST.faqHeading}
                  </h2>
                  <FaqAccordion faqs={post.faqs ?? []} />
                </section>
              )}
            </div>

            <div className="space-y-9 lg:space-y-10">
              {/* Desktop only: on phones the dock's Call / Text / Book bar and the
                  closing band right under the article carry the same two actions,
                  so the card would only repeat them. It stays in the HTML. */}
              <aside
                aria-labelledby="post-help-heading"
                className="hidden rounded-frame border border-rule bg-shell p-6 lg:block"
              >
                <h2 id="post-help-heading" className="font-sans text-xl font-bold tracking-normal text-fg">
                  {BLOG_POST.help.heading}
                </h2>
                <p className="mt-2 text-body">{BLOG_POST.help.body}</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Button href={BUSINESS.phoneHref} icon={<Phone className="size-5" />} fullWidth>
                    {BUSINESS.phone}
                  </Button>
                  <Button
                    href={BLOG_POST.help.bookHref}
                    variant="secondary"
                    icon={<Calendar className="size-5" />}
                    fullWidth
                  >
                    {BLOG_POST.help.book}
                  </Button>
                </div>
              </aside>

              {landings.length > 0 && (
                <section aria-labelledby="blog-related-landings-heading">
                  <Eyebrow className="mb-2">{BLOG_POST.landings.overline}</Eyebrow>
                  <h2
                    id="blog-related-landings-heading"
                    className="font-sans text-xl font-bold tracking-normal text-fg"
                  >
                    {BLOG_POST.landings.heading}
                  </h2>
                  {/* On phones the line is for screen readers and search engines only, to keep the page short. */}
                  <p className="sr-only lg:not-sr-only lg:mt-2 lg:text-body">{BLOG_POST.landings.description}</p>
                  <LinkRows
                    links={landings.map((l) => ({
                      href: `/${l.slug}`,
                      label: l.h1,
                      meta: l.priceRange
                        ? `${BLOG_POST.landings.rangePrefix} ${l.priceRange}`
                        : `${l.city}, ${l.state}`,
                    }))}
                  />
                </section>
              )}

              {related.length > 0 && (
                <section aria-labelledby="related-posts-heading">
                  <Eyebrow className="mb-2">{BLOG_POST.related.overline}</Eyebrow>
                  <h2
                    id="related-posts-heading"
                    className="font-sans text-xl font-bold tracking-normal text-fg"
                  >
                    {BLOG_POST.related.heading}
                  </h2>
                  <LinkRows
                    links={related.map((p) => ({
                      href: `/blog/${p.slug}`,
                      label: p.title,
                      meta: `${p.category} · ${p.readTime}`,
                    }))}
                  />
                  <p className="mt-4">
                    <Link
                      href="/blog"
                      className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
                    >
                      {BLOG_POST.related.all}
                      <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </Link>
                  </p>
                </section>
              )}

              <p>
                <Link
                  href="/blog"
                  className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
                >
                  <ArrowLeft className="size-5 transition-transform duration-150 group-hover:-translate-x-0.5" />
                  {BLOG_POST.backToBlog}
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
