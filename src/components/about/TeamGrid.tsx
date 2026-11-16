import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { TEAM_MEMBERS } from "@/lib/constants";
import { image } from "@/lib/media";
import { ABOUT_TEAM } from "@/content/about";

/** The team: three portrait frames with name, role and bio below. Keeps the #team anchor. */
export default function TeamGrid() {
  return (
    <Section tone="white" id="team" labelledBy="about-team-title">
      <Container>
        <SectionHeading
          id="about-team-title"
          align="left"
          overline={ABOUT_TEAM.overline}
          title={ABOUT_TEAM.title}
          subtitle={ABOUT_TEAM.subtitle}
        />

        <ul className="grid grid-cols-1 gap-y-14 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-3">
          {TEAM_MEMBERS.map((member, i) => {
            const media = member.image ? image(member.image, { alt: member.name }) : null;
            return (
              <Reveal as="li" key={member.name} index={i}>
                <Frame
                  media={media}
                  aspect="4/5"
                  position={member.imagePosition ?? "50% 0%"}
                  sizes="(min-width: 1280px) 400px, (min-width: 768px) 31vw, (min-width: 640px) 46vw, 100vw"
                  quality={75}
                  className="max-w-[26rem]"
                />
                <h3 className="mt-6 text-xl leading-snug font-semibold text-fg">{member.name}</h3>
                <p className="mt-1 font-medium text-accent">{member.role}</p>
                {member.bio && <p className="mt-4 max-w-[60ch] text-body">{member.bio}</p>}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
