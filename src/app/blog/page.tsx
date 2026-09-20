import type { Metadata } from "next";
import PageTransition from "@/components/layout/PageTransition";
import BlogIndexPage from "./BlogIndexPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/seo/ItemListJsonLd";
import { BLOG_POSTS } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Plumbing Tips & Blog",
  description:
    "Expert plumbing tips, guides & advice from C&S Plumbing of Lee. Learn about repiping, water heaters, emergency plumbing, and more for Southwest Florida homes.",
  keywords: [
    "plumbing tips",
    "plumbing blog",
    "plumbing advice Cape Coral",
    "plumbing guide Fort Myers",
    "home plumbing tips SWFL",
  ],
  openGraph: {
    title: "Plumbing Tips & Blog | C&S Plumbing",
    description:
      "Expert plumbing tips and guides for Southwest Florida homeowners.",
    url: "https://www.csplumbinglee.com/blog",
  },
};

export default function Page() {
  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
      <ItemListJsonLd
        itemListType="Blog"
        name="Plumbing Tips & Blog"
        description="Expert plumbing guides for Southwest Florida homeowners."
        url="/blog"
        items={[...BLOG_POSTS]
          .sort((a, b) => b.publishDate.localeCompare(a.publishDate))
          .map((post) => ({
            name: post.title,
            href: `/blog/${post.slug}`,
            description: post.excerpt,
          }))}
      />
      <BlogIndexPage />
    </PageTransition>
  );
}
