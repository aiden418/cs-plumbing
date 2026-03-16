import type { BlogPost } from "@/lib/types";

export default function ArticleJsonLd({ post }: { post: BlogPost }) {
  const BASE = "https://www.csplumbinglee.com";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    image: `${BASE}/images/hero/drone-construction.jpg`,
    url: `${BASE}/blog/${post.slug}`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      "@id": `${BASE}/#owner`,
      name: "Samuel Pellechio Jr.",
      url: `${BASE}/about`,
      jobTitle: "Owner & President",
      worksFor: {
        "@type": "Plumber",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee County",
      },
      description:
        "Licensed Florida plumbing contractor (CFC1432485) with decades of hands-on experience in residential, commercial, and new construction plumbing across Southwest Florida.",
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Professional License",
        name: "Certified Plumbing Contractor — CFC1432485",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Florida Department of Business and Professional Regulation",
          url: "https://www.myfloridalicense.com",
        },
      },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "C&S Plumbing of Lee County",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/images/logos/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}/blog/${post.slug}`,
    },
    about: {
      "@type": "Thing",
      name: "Plumbing",
      sameAs: "https://en.wikipedia.org/wiki/Plumbing",
    },
    citation: [
      {
        "@type": "CreativeWork",
        name: "Florida Building Code 8th Edition (2023) — Plumbing",
        url: "https://floridabuilding.org/fbc/thecode/code-resources.aspx",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}
