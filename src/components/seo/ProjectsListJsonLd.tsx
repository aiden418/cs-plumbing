import type { CompletedProject } from "@/lib/types";

const BASE = "https://www.csplumbinglee.com";

/**
 * Structured data for the /projects index — a CollectionPage whose mainEntity
 * is an ordered ItemList of every completed project, so Google understands the
 * portfolio as a set and can surface it as a collection.
 */
export default function ProjectsListJsonLd({
  projects,
}: {
  projects: CompletedProject[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE}/projects#collection`,
    name: "Completed Plumbing Projects | C&S Plumbing of Lee",
    description:
      "New construction, commercial buildouts, and remodels completed by C&S Plumbing of Lee across Southwest Florida.",
    url: `${BASE}/projects`,
    inLanguage: "en-US",
    isPartOf: { "@id": `${BASE}/#website` },
    about: { "@id": `${BASE}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${BASE}/projects/${p.slug}`,
        name: p.name,
        ...(p.coverImage ? { image: `${BASE}${p.coverImage}` } : {}),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
