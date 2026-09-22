import type { BlogPost } from "@/lib/types";

const CATEGORY_IMAGES: Record<string, string> = {
  Repiping: "/images/services/cards/repiping.jpg",
  "Water Heaters": "/images/services/cards/water-heaters.jpg",
  Emergency: "/images/services/cards/emergency.jpg",
  "Drain Cleaning": "/images/services/cards/drain-cleaning.jpg",
  "Water Quality": "/images/services/cards/water-softeners.jpg",
  "Leak Repair": "/images/services/cards/emergency.jpg",
  "UEP & Utilities": "/images/services/uep-utilities/photo-1.jpg",
};

export default function ArticleJsonLd({ post }: { post: BlogPost }) {
  const BASE = "https://www.csplumbinglee.com";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishDate,
    dateModified: post.updatedDate ?? post.publishDate,
    image: `${BASE}${CATEGORY_IMAGES[post.category] ?? "/images/hero/drone-construction.jpg"}`,
    url: `${BASE}/blog/${post.slug}`,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      "@id": `${BASE}/#operations-manager`,
      name: "Aiden Pellechio",
      url: `${BASE}/about`,
      image: `${BASE}/images/team/aiden.jpg`,
      // Must match the sitewide Person node in JsonLd.tsx (same @id) — AI
      // engines cross-check entities and a title that disagrees costs trust.
      jobTitle: "Project Manager & Estimator",
      worksFor: {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: "C&S Plumbing of Lee",
      },
      description:
        "Third-generation Pellechio working full-time as project manager and estimator at C&S Plumbing of Lee — also handling permitting and marketing — while earning a construction management degree at Florida Gulf Coast University (FGCU), Class of 2028.",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "C&S Plumbing of Lee",
      url: BASE,
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/images/logos/logo-512.png`,
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
