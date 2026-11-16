import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import { ABOUT_MISSION } from "@/content/about";

/** The mission statement in large type, then the five values as simple rows (five columns on desktop). */
export default function MissionValues() {
  return (
    <Section tone="shell" spacing="sm">
      <Container>
        <div className="max-w-[48rem]">
          <Eyebrow className="mb-3">{ABOUT_MISSION.overline}</Eyebrow>
          <p className="text-display-sm leading-snug font-medium text-fg">
            {ABOUT_MISSION.statement} <span className="text-primary-dark">{ABOUT_MISSION.emphasis}</span>
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-x-6 border-b border-rule sm:grid-cols-2 lg:mt-12 lg:grid-cols-5 lg:border-b-0">
          {ABOUT_MISSION.values.map((v) => (
            <li key={v.title} className="border-t border-rule py-4 lg:pt-5 lg:pb-0">
              <h3 className="text-lg leading-snug font-semibold text-fg">{v.title}</h3>
              <p className="mt-1 text-body">{v.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
