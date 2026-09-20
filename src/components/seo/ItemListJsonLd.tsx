const BASE = "https://www.csplumbinglee.com";

interface ItemListEntry {
  name: string;
  href: string;
  description?: string;
}

/**
 * CollectionPage + ItemList for hub pages (/services, /blog).
 *
 * Hub pages previously shipped no structured data at all, so search engines
 * had no signal that they index a set of child pages.
 */
export default function ItemListJsonLd({
  name,
  description,
  url,
  items,
  itemListType = "CollectionPage",
}: {
  name: string;
  description: string;
  url: string;
  items: ItemListEntry[];
  itemListType?: "CollectionPage" | "Blog";
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": itemListType,
    name,
    description,
    url: `${BASE}${url}`,
    isPartOf: { "@type": "WebSite", "@id": `${BASE}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        ...(item.description ? { description: item.description } : {}),
        url: `${BASE}${item.href}`,
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
