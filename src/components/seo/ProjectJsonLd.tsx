import type { CompletedProject } from "@/lib/types";

const BASE = "https://www.csplumbinglee.com";

/**
 * Structured data for a single completed project.
 *
 * Models the job as a CreativeWork performed by C&S (linked to #organization),
 * tied to its city via locationCreated, with every jobsite photo emitted as an
 * ImageObject so Google can index the gallery with captions + local context.
 */
export default function ProjectJsonLd({ project }: { project: CompletedProject }) {
  const url = `${BASE}/projects/${project.slug}`;

  const images = project.phases.flatMap((phase) =>
    phase.images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: `${BASE}${img.src}`,
      url: `${BASE}${img.src}`,
      caption: img.alt,
      representativeOfPage: img.src === project.coverImage,
      creator: { "@id": `${BASE}/#organization` },
      copyrightHolder: { "@id": `${BASE}/#organization` },
    }))
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.name,
    description: project.description,
    url,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    keywords: [
      project.name,
      `${project.category} plumbing`,
      ...(project.location ? [`plumbing project ${project.location}`] : []),
      "C&S Plumbing of Lee",
      "Southwest Florida plumbing contractor",
    ].join(", "),
    about: {
      "@type": "Service",
      name: `${project.category} Plumbing`,
      provider: { "@id": `${BASE}/#organization` },
    },
    creator: { "@id": `${BASE}/#organization` },
    provider: { "@id": `${BASE}/#organization` },
    ...(project.location
      ? {
          locationCreated: {
            "@type": "Place",
            name: project.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: project.location.replace(/,?\s*FL$/i, ""),
              addressRegion: "FL",
              addressCountry: "US",
            },
          },
        }
      : {}),
    image: images,
    thumbnailUrl: project.coverImage ? `${BASE}${project.coverImage}` : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
