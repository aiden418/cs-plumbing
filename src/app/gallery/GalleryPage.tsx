import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { Phone } from "@/components/ui/icons";
import type { GalleryGridItem } from "@/components/gallery/GalleryGrid";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { BUSINESS } from "@/lib/business";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { image, picture } from "@/lib/media";
import type { GalleryItem } from "@/lib/types";
import { GALLERY_PAGE, PROJECTS_ACTIONS } from "@/content/projects";
import GalleryCards from "./GalleryCards";

/**
 * /gallery (v2-bright.md "Inner pages"): the aerial job-site photograph the
 * current gallery header shows fills the hero behind the headline, then
 * every gallery photo as a card with its title under it, behind the
 * existing category chips. Each photo opens the
 * lightbox with its title as the caption. Server component: the pictures
 * are resolved here and handed to the grid as MediaRef props; without
 * JavaScript every photo shows and links to its file.
 */
export default function GalleryPage({ items }: { items: GalleryItem[] }) {
  const photos: GalleryGridItem[] = [];
  for (const item of items) {
    const media = image(item.src, { alt: item.alt, caption: item.title });
    if (media) photos.push({ media, category: item.category });
  }
  const categories = GALLERY_CATEGORIES.map(({ id, label }) => ({ id, label }));
  // The aerial job-site photograph the current gallery header shows.
  const hero = picture("home.hero") ?? photos[0]?.media ?? null;

  return (
    <>
      <PageHero
        layout="photo"
        frame={hero}
        overline={GALLERY_PAGE.overline}
        title={GALLERY_PAGE.title}
        accent={GALLERY_PAGE.accent}
        description={GALLERY_PAGE.description}
        actions={
          <>
            <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />}>
              {`${PROJECTS_ACTIONS.call} ${BUSINESS.phone}`}
            </Button>
            <Button href={PROJECTS_ACTIONS.book.href} variant="onPhoto" size="lg">
              {PROJECTS_ACTIONS.book.label}
            </Button>
          </>
        }
      />

      <Section tone="white" spacing="sm" labelledBy="gallery-heading">
        <Container>
          <h2 id="gallery-heading" className="sr-only">
            {GALLERY_PAGE.gridHeading}
          </h2>
          <LightboxProvider>
            <GalleryCards items={photos} categories={categories} title={GALLERY_PAGE.lightboxTitle} />
          </LightboxProvider>
        </Container>
      </Section>
    </>
  );
}
