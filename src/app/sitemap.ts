import type { MetadataRoute } from "next";
import { AREA_LANDINGS, BLOG_POSTS, COMPLETED_PROJECTS } from "@/lib/constants";
import { SERVICE_CITY_LANDINGS } from "@/lib/service-city-landings";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.csplumbinglee.com";

  // Bump when a real content pass ships. A blanket `new Date()` told Google
  // the whole site changed on every deploy, which trains it to ignore lastmod.
  const LAST_CONTENT_PASS = new Date("2026-07-10");

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate ?? post.publishDate),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/residential`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/commercial`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/new-construction`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Service-specific landing pages
    {
      url: `${baseUrl}/services/repiping`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/water-heaters`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/drain-cleaning`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/leak-repair`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/water-softeners`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/plumbing-remodel`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/uep-utilities`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // City/area landing pages — driven by AREA_LANDINGS so new cities
    // appear automatically (each still needs its /areas/<slug> route files).
    ...AREA_LANDINGS.map((area) => ({
      url: `${baseUrl}/areas/${area.slug}`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // FAQ
    {
      url: `${baseUrl}/faq`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Quote Builder
    {
      url: `${baseUrl}/quote-builder`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Coastal Comeback Plan
    {
      url: `${baseUrl}/coastal-comeback-plan`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Service Map
    {
      url: `${baseUrl}/service-map`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Builder funnel page (SEO-targeted for builder/GC traffic)
    {
      url: `${baseUrl}/builders`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Builder Portal (plan upload form)
    {
      url: `${baseUrl}/builder-portal`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Legal
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // Partners
    {
      url: `${baseUrl}/partners`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Projects
    {
      url: `${baseUrl}/projects`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...COMPLETED_PROJECTS.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Blog
    {
      url: `${baseUrl}/blog`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogPages,
    // Service + City landing pages
    ...SERVICE_CITY_LANDINGS.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: LAST_CONTENT_PASS,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
