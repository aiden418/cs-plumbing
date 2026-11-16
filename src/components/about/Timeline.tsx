import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import Stepper, { type StepItem } from "@/components/ui/Stepper";
import { TIMELINE_EVENTS } from "@/lib/constants";
import { image } from "@/lib/media";
import { ABOUT_TIMELINE } from "@/content/about";

/**
 * The company timeline as the connection line: a vertical Stepper whose
 * joints are the years, each with its text and its historical photo in a
 * small frame (some of these photos show an old phone number, so none is
 * shown larger than before).
 */
export default function Timeline() {
  const items: StepItem[] = TIMELINE_EVENTS.map((event) => {
    const media = event.image ? image(event.image, { alt: event.imageAlt ?? `C&S Plumbing — ${event.title}` }) : null;
    const portrait = media ? media.height > media.width : false;
    return {
      meta: event.year,
      label: <h3 className="text-xl leading-snug font-semibold text-fg">{event.title}</h3>,
      description: <span className="block max-w-[56ch] text-base text-body">{event.description}</span>,
      children: media ? (
        <Frame
          media={media}
          aspect={portrait ? "4/5" : "3/2"}
          sizes={portrait ? "(min-width: 1024px) 208px, (min-width: 640px) 224px, 60vw" : "(min-width: 1024px) 208px, (min-width: 640px) 352px, 85vw"}
          quality={70}
          className={portrait ? "w-[60%] max-w-56 lg:w-full lg:max-w-none" : "w-[85%] max-w-[22rem] lg:w-full lg:max-w-none"}
        />
      ) : undefined,
    };
  });

  return (
    <Section tone="white" labelledBy="about-timeline-title">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          <header className="lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:col-span-4 lg:self-start">
            <Eyebrow className="mb-4">{ABOUT_TIMELINE.overline}</Eyebrow>
            <h2 id="about-timeline-title" className="text-display-md text-fg">
              {ABOUT_TIMELINE.title}
            </h2>
            <p className="mt-5 max-w-[40ch] text-lead text-body">{ABOUT_TIMELINE.subtitle}</p>
          </header>

          <Stepper
            orientation="vertical"
            label={ABOUT_TIMELINE.label}
            items={items}
            current={items.length - 1}
            // From 1024 px each photo sits beside its text (a third column)
            // instead of under it, which halves the timeline's height.
            className="lg:col-span-7 lg:col-start-6 lg:[&_li]:grid-cols-[1.5rem_1fr_13rem] lg:[&_li]:gap-x-6 lg:[&_li>div]:col-start-3 lg:[&_li>div]:row-start-1 lg:[&_li>div]:mt-0"
          />
        </div>
      </Container>
    </Section>
  );
}
