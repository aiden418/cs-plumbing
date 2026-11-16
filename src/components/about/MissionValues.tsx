import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { ABOUT_MISSION } from "@/content/about";

/** The mission statement as a large pull line, then the five values as a hairline row. */
export default function MissionValues() {
  return (
    <Section tone="navy">
      <Container>
        <Reveal className="max-w-[46rem]">
          <Eyebrow className="mb-6">{ABOUT_MISSION.overline}</Eyebrow>
          <p className="text-display-sm text-fg">
            {ABOUT_MISSION.statement} <span className="text-accent">{ABOUT_MISSION.emphasis}</span>
          </p>
        </Reveal>

        <ol className="mt-16 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5">
          {ABOUT_MISSION.values.map((v, i) => (
            <Reveal as="li" key={v.title} index={i} className="border-t border-rule pt-5 pb-6 lg:pb-0">
              <h3 className="flex items-center gap-2.5 text-base leading-snug font-semibold text-fg">
                <span aria-hidden="true" className="joint text-accent" />
                {v.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{v.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
