import Link from "next/link";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { SERVICES } from "@/lib/constants";
import { picture } from "@/lib/media";
import { services } from "@/content/home";
import ServicesRail from "./ServicesRail";

/** "/services/plumbing-remodel" → "plumbing-remodel": the key of the tile's named photograph. */
function slugOf(href: string) {
  return href.split("/").filter(Boolean).pop() ?? href;
}

/**
 * Chapter 2: the nine services as tiles, a 3 × 3 grid from 1024 px and a
 * snap rail below. A service without a named photograph is a type-led tile
 * (hairline, title, line) instead of a placeholder.
 */
export default function Services() {
  return (
    <Section tone="shell" spacing="none" className="py-section-sm lg:py-section" labelledBy="home-services-title">
      <Container>
        <SectionHeading
          id="home-services-title"
          align="left"
          overline={services.overline}
          title={services.title}
          subtitle={services.subtitle}
          className="mb-8 lg:mb-12"
        />
        <ServicesRail
          label={services.title}
          previousLabel={services.previousLabel}
          nextLabel={services.nextLabel}
          after={
            <Link
              href={services.allLink.href}
              className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
            >
              {services.allLink.label}
              <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
            </Link>
          }
        >
          <ul className="home-services">
            {SERVICES.map((service) => {
              const media = picture(`home.service.${slugOf(service.href)}`);
              return (
                <li key={service.id} className={media ? "home-service" : "home-service home-service--type"}>
                  <Link href={service.href} className={media ? "group block h-full rounded-frame" : "group block h-full"}>
                    {media && (
                      <Frame
                        media={media}
                        alt=""
                        aspect="4/5"
                        sizes="(min-width: 80rem) 400px, (min-width: 64rem) 30vw, (min-width: 48rem) 42vw, 72vw"
                        frameClassName="transition-transform duration-250 ease-settle group-hover:-translate-y-0.5"
                      />
                    )}
                    <span className="home-service-text">
                      <h3 className="home-service-title text-fg group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                        {service.title}
                      </h3>
                      <span className="mt-2 block text-sm text-muted">{service.description}</span>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-link">
                        {services.tileCta}
                        <ArrowRight className="size-4 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </ServicesRail>
      </Container>
    </Section>
  );
}
