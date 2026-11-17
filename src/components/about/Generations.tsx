import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { image } from "@/lib/media";
import { ABOUT_GENERATIONS } from "@/content/about";

/** Three generations: a card each (photo, who they are, their story); side by side from 1024 px. */
export default function Generations() {
  return (
    <Section tone="shell" spacing="sm" labelledBy="about-generations-title">
      <Container>
        <SectionHeading
          id="about-generations-title"
          align="left"
          overline={ABOUT_GENERATIONS.overline}
          title={ABOUT_GENERATIONS.title}
          subtitle={ABOUT_GENERATIONS.subtitle}
          className="mb-8 sm:mb-10"
        />

        <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {ABOUT_GENERATIONS.items.map((g) => {
            const media = g.image ? image(g.image, { alt: g.name }) : null;
            return (
              <li key={g.name} className="overflow-hidden rounded-2xl border border-steel-200 bg-white">
                <Frame
                  media={media}
                  aspect="3/2"
                  position={g.imagePosition ?? "50% 20%"}
                  sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw"
                  quality={75}
                  frameClassName="rounded-none"
                />
                <div className="p-5 sm:p-6">
                  <p className="meta text-accent">
                    {g.tag}
                    <span aria-hidden="true"> · </span>
                    {g.gen}
                  </p>
                  <h3 className="mt-2 font-display text-display-sm font-bold text-fg [font-stretch:108%]">{g.name}</h3>
                  <p className="mt-1 font-semibold text-fg">{g.label}</p>
                  {g.note && <p className="mt-0.5 text-[0.9375rem] text-body italic">{g.note}</p>}
                  <p className="mt-3 text-body">{g.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
