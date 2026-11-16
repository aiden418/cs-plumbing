import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { image } from "@/lib/media";
import { ABOUT_GENERATIONS } from "@/content/about";

/** Three generations side by side: a framed photo with the words below it. */
export default function Generations() {
  return (
    <Section tone="shell" labelledBy="about-generations-title">
      <Container>
        <SectionHeading
          id="about-generations-title"
          align="left"
          overline={ABOUT_GENERATIONS.overline}
          title={ABOUT_GENERATIONS.title}
          subtitle={ABOUT_GENERATIONS.subtitle}
        />

        {/* One hairline row per generation: photo, then who they are, then their story. */}
        <ol className="border-b border-rule">
          {ABOUT_GENERATIONS.items.map((g, i) => {
            const media = g.image ? image(g.image, { alt: g.name }) : null;
            return (
              <Reveal
                as="li"
                key={g.name}
                index={i}
                className="grid grid-cols-1 gap-y-6 border-t border-rule py-10 sm:grid-cols-12 sm:gap-x-8"
              >
                <Frame
                  media={media}
                  aspect="4/3"
                  position={g.imagePosition ?? "50% 0%"}
                  sizes="(min-width: 1280px) 400px, (min-width: 640px) 40vw, 100vw"
                  quality={75}
                  className="sm:col-span-5 lg:col-span-4"
                />
                <div className="sm:col-span-7 lg:col-span-4">
                  <p className="label-tech flex flex-wrap items-center gap-x-2 text-accent">
                    <span>{g.tag}</span>
                    <span aria-hidden="true" className="joint" />
                    <span>{g.gen}</span>
                  </p>
                  <h3 className="mt-3 font-display text-display-sm font-bold text-fg [font-stretch:108%]">{g.name}</h3>
                  <p className="mt-2 font-medium text-body">{g.label}</p>
                  {g.note && <p className="mt-1 text-sm text-muted">{g.note}</p>}
                </div>
                <p className="max-w-[60ch] text-body sm:col-span-7 sm:col-start-6 lg:col-span-4 lg:col-start-9">{g.body}</p>
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
