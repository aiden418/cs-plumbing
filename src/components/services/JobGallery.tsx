import Container from "@/components/ui/Container";
import Section, { type Tone } from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Filmstrip from "@/components/explorer/Filmstrip";
import LightboxProvider from "@/components/lightbox/LightboxProvider";
import { image } from "@/lib/media";
import type { MediaRef } from "@/lib/media-types";
import { DEFAULT_JOB_PHOTOS, SERVICE_PAGE } from "@/content/services";

const COPY = SERVICE_PAGE.gallery;

type JobPhoto = { src: string; caption?: string; alt?: string };

/**
 * Resolve a service's job photos on the server. A photo that is missing or
 * marked hidden drops out (image() returns null), so nothing broken shows.
 * Fewer than three left: the crew's default set, as before.
 */
export function resolveJobPhotos(photos: readonly JobPhoto[] | undefined, serviceTitle?: string, fallback = true): MediaRef[] {
  const resolve = (list: readonly JobPhoto[]) =>
    list
      .map((p, i) =>
        image(p.src, {
          alt: p.alt ?? p.caption ?? `${serviceTitle ?? "Plumbing"} job photo ${i + 1}`,
          caption: p.caption,
        }),
      )
      .filter((m): m is MediaRef => m !== null);
  const own = resolve(photos ?? []);
  if (!fallback || own.length >= 3) return own.slice(0, fallback ? 6 : undefined);
  return resolve(DEFAULT_JOB_PHOTOS).slice(0, 6);
}

interface Props {
  /** Collection id, unique on the page. */
  id: string;
  photos?: readonly JobPhoto[];
  serviceTitle?: string;
  /** Heading override (UEP: "Our UEP Work"); the eyebrow and line are then left out. */
  title?: string;
  /** false: show every listed photo, no default set. */
  fallback?: boolean;
  /** The section surface (white or shell, alternating with its neighbours). */
  tone?: Tone;
}

/**
 * Real job photos as a compact filmstrip with the lightbox, on a light
 * section. Each photo's caption is its alt text and the lightbox title; the
 * caption list stays in the page for search engines and screen readers.
 */
export default function JobGallery({ id, photos, serviceTitle, title, fallback = true, tone = "white" }: Props) {
  const items = resolveJobPhotos(photos, serviceTitle, fallback);
  if (items.length === 0) return null;
  const captions = items.map((m) => m.caption).filter(Boolean);
  const headingId = `${id}-heading`;
  const heading = title ?? (serviceTitle ? `${COPY.titleBefore}${serviceTitle}${COPY.titleAfter}` : COPY.titleFallback);

  return (
    <Section tone={tone} spacing="sm" labelledBy={headingId}>
      <Container>
        <div className="mb-6 max-w-3xl sm:mb-8">
          {!title && <Eyebrow className="mb-3">{COPY.overline}</Eyebrow>}
          <h2 id={headingId} className="text-display-md text-fg">
            {heading}
          </h2>
          {!title && <p className="mt-3 max-w-[60ch] text-body">{COPY.description}</p>}
        </div>
      </Container>
      <LightboxProvider>
        <Filmstrip id={id} items={items} name={heading} showName={false} className="job-filmstrip" />
      </LightboxProvider>
      {captions.length > 0 && (
        <ol className="sr-only">
          {items.map((m) => (
            <li key={m.path}>{m.caption ?? m.alt}</li>
          ))}
        </ol>
      )}
    </Section>
  );
}
