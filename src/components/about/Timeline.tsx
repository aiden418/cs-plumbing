import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import { TIMELINE_EVENTS } from "@/lib/constants";
import { image } from "@/lib/media";
import { ABOUT_TIMELINE } from "@/content/about";

/**
 * The company timeline: one row per year, words beside a small photo on
 * phones, five columns on desktop. Some of these historical photos show an
 * old phone number, so none is shown larger than before (13rem at most).
 */
export default function Timeline() {
  return (
    <Section tone="white" spacing="sm" labelledBy="about-timeline-title">
      <Container>
        <header className="max-w-3xl">
          <Eyebrow className="mb-3">{ABOUT_TIMELINE.overline}</Eyebrow>
          <h2 id="about-timeline-title" className="text-display-md text-fg">
            {ABOUT_TIMELINE.title}
          </h2>
          <p className="mt-4 max-w-[48ch] text-lead text-body">{ABOUT_TIMELINE.subtitle}</p>
        </header>

        <ol
          aria-label={ABOUT_TIMELINE.label}
          className="mt-8 border-b border-rule sm:mt-10 lg:grid lg:grid-cols-5 lg:gap-x-6 lg:border-b-0"
        >
          {TIMELINE_EVENTS.map((event) => {
            const media = event.image
              ? image(event.image, { alt: event.imageAlt ?? `C&S Plumbing — ${event.title}` })
              : null;
            return (
              <li
                key={event.year}
                className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-x-4 border-t border-rule py-6 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-x-6 lg:flex lg:flex-col-reverse lg:justify-end lg:gap-y-4 lg:pt-5 lg:pb-0"
              >
                <div>
                  <p className="font-display text-xl font-bold text-primary-dark tabular-nums">{event.year}</p>
                  <h3 className="mt-1 text-xl leading-snug font-semibold text-fg">{event.title}</h3>
                  <p className="mt-2 text-body">{event.description}</p>
                </div>
                <Frame
                  media={media}
                  aspect="4/3"
                  sizes="(min-width: 1024px) 208px, (min-width: 640px) 144px, 104px"
                  quality={70}
                  className="w-full lg:max-w-[13rem]"
                  frameClassName="rounded-xl"
                />
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
