import Link from "next/link";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import { ArrowRight } from "@/components/ui/icons";
import { SERVICES } from "@/lib/constants";
import { picture } from "@/lib/media";
import { services } from "@/content/home";
import { ArrowLink, HomeHeading } from "./HomeHeading";

/** "/services/plumbing-remodel" → "plumbing-remodel": the key of the tile's named photograph. */
function slugOf(href: string) {
  return href.split("/").filter(Boolean).pop() ?? href;
}

/**
 * The services on shell: a tidy grid of photo tiles (2 columns on phones, 3
 * from 768 px) showing the photograph and the name; the services without a
 * named photograph follow as plain rows. Each one-line description stays in
 * the HTML and is shown from 768 px.
 */
export default function Services() {
  const tiles = SERVICES.map((service) => ({ service, media: picture(`home.service.${slugOf(service.href)}`) }));
  const withPhoto = tiles.filter((t) => t.media);
  const rows = tiles.filter((t) => !t.media);

  return (
    <section data-tone="shell" aria-labelledby="home-services-title" className="relative bg-canvas py-12 text-body lg:py-20">
      <Container>
        <HomeHeading
          id="home-services-title"
          eyebrow={services.overline}
          title={services.title}
          subtitle={services.subtitle} subtitleHidden="phone"
          className="mb-8 lg:mb-12"
        />

        <ul className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-8">
          {withPhoto.map(({ service, media }) => (
            <li key={service.id}>
              <Link href={service.href} className="group block rounded-frame">
                <Frame
                  media={media}
                  alt=""
                  aspect="4/3"
                  sizes="(min-width: 80rem) 400px, (min-width: 48rem) 31vw, 46vw"
                  className="max-md:aspect-[3/2] lg:aspect-[16/10]"
                />
                <h3 className="home-service-title group-hover:text-link">{service.title}</h3>
                <p className="home-service-text">
                  {service.description} <span className="sr-only">{services.tileCta}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {rows.length > 0 && (
          <ul className="mt-8 grid grid-cols-1 border-b border-rule md:mt-12 md:grid-cols-3 md:gap-x-6 md:border-b-0">
            {rows.map(({ service }) => (
              <li key={service.id} className="border-t border-rule md:border-t-2">
                <Link href={service.href} className="group flex min-h-12 items-start justify-between gap-4 py-3 md:py-4">
                  <span>
                    <h3 className="text-[1.0625rem] leading-snug font-semibold text-fg group-hover:text-link md:text-lg">{service.title}</h3>
                    <span className="home-service-text block">
                      {service.description} <span className="sr-only">{services.tileCta}</span>
                    </span>
                  </span>
                  <ArrowRight className="mt-0.5 size-5 shrink-0 text-link transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <ArrowLink href={services.allLink.href} className="mt-6 md:mt-8">
          {services.allLink.label}
        </ArrowLink>
      </Container>
    </section>
  );
}
