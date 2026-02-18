import type { BlogPost } from "@/lib/types";

export default function ArticleJsonLd({ post }: { post: BlogPost }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishDate,
    author: {
      "@type": "Organization",
      name: "C&S Plumbing of Lee County",
      url: "https://www.csplumbinglee.com",
    },
    publisher: {
      "@type": "Organization",
      name: "C&S Plumbing of Lee County",
      logo: {
        "@type": "ImageObject",
        url: "https://www.csplumbinglee.com/images/logos/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.csplumbinglee.com/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}
