import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import GalleryGrid, { type GalleryGridItem } from "@/components/gallery/GalleryGrid";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { image } from "@/lib/media";
import type { GalleryItem } from "@/lib/types";
import { GALLERY_PAGE } from "@/content/projects";

/**
 * /gallery (pages.md "Gallery"): a compact hero on ink, then every gallery
 * photo in justified rows with the existing category filters. Each photo
 * opens the lightbox with its title as the caption. Server component: the
 * pictures are resolved here and handed to the grid as MediaRef props;
 * without JavaScript every photo shows and links to its file.
 */
export default function GalleryPage({ items }: { items: GalleryItem[] }) {
  const photos: GalleryGridItem[] = [];
  for (const item of items) {
    const media = image(item.src, { alt: item.alt, caption: item.title });
    if (media) photos.push({ media, category: item.category });
  }
  const categories = GALLERY_CATEGORIES.map(({ id, label }) => ({ id, label }));

  return (
    <>
      <PageHero
        layout="compact"
        overline={GALLERY_PAGE.overline}
        title={GALLERY_PAGE.title}
        accent={GALLERY_PAGE.accent}
        description={GALLERY_PAGE.description}
      />

      <Section tone="white" spacing="sm" labelledBy="gallery-heading">
        <Container>
          <h2 id="gallery-heading" className="sr-only">
            {GALLERY_PAGE.gridHeading}
          </h2>
          <LightboxProvider>
            <GalleryGrid items={photos} categories={categories} title={GALLERY_PAGE.lightboxTitle} eager={4} />
          </LightboxProvider>
        </Container>
      </Section>
    </>
  );
}
