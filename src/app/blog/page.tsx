import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import CTASection from "@/components/home/CTASection";
import Container from "@/components/ui/Container";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { BLOG_INDEX } from "@/content/reading";
import { BLOG_POSTS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Plumbing Tips & Blog",
  description:
    "Plumbing tips, guides & advice from C&S Plumbing of Lee: repiping, water heaters, emergency plumbing and more for Southwest Florida homes.",
  keywords: [
    "plumbing tips",
    "plumbing blog",
    "plumbing advice Cape Coral",
    "plumbing guide Fort Myers",
    "home plumbing tips SWFL",
  ],
  openGraph: {
    siteName: "C&S Plumbing of Lee",
    title: "Plumbing Tips & Blog | C&S Plumbing",
    description:
      "Expert plumbing tips and guides for Southwest Florida homeowners.",
    url: "https://www.csplumbinglee.com/blog",
  },
};

export default function Page() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
      <PageHero
        layout="plain"
        overline={BLOG_INDEX.overline}
        title={BLOG_INDEX.title}
        accent={BLOG_INDEX.accent}
        description={BLOG_INDEX.description}
      />

      <Section tone="white" spacing="none" className="pb-12 sm:pb-16">
        <Container>
          {/* Hairline rows: one column on phones, two from lg, three from xl.
              The first rows' line sits on the hero's bottom line (-mt-px). */}
          <ul
            aria-label={BLOG_INDEX.listLabel}
            className="-mt-px grid grid-cols-1 gap-x-10 lg:grid-cols-2 xl:grid-cols-3"
          >
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CTASection />
    </>
  );
}
