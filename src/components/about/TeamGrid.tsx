import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { TEAM_MEMBERS } from "@/lib/constants";
import { image } from "@/lib/media";
import { ABOUT_TEAM } from "@/content/about";

/**
 * The team: a portrait with name, role and bio for each person. On phones
 * the portrait sits beside the name; from 768 px three portrait cards.
 * Keeps the #team anchor.
 */
export default function TeamGrid() {
  return (
    <Section tone="white" spacing="sm" id="team" labelledBy="about-team-title">
      <Container>
        <SectionHeading
          id="about-team-title"
          align="left"
          overline={ABOUT_TEAM.overline}
          title={ABOUT_TEAM.title}
          subtitle={ABOUT_TEAM.subtitle}
          className="mb-8 sm:mb-10"
        />

        <ul className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-6">
          {TEAM_MEMBERS.map((member) => {
            const media = member.image ? image(member.image, { alt: member.name }) : null;
            return (
              <li key={member.name} className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-5 md:block">
                <Frame
                  media={media}
                  aspect="4/5"
                  position={member.imagePosition ?? "50% 25%"}
                  sizes="(min-width: 1280px) 400px, (min-width: 768px) 31vw, 120px"
                  quality={75}
                  className="self-start"
                />
                <div className="self-center md:mt-5">
                  <h3 className="text-xl leading-snug font-semibold text-fg">{member.name}</h3>
                  <p className="mt-1 font-semibold text-primary-dark">{member.role}</p>
                </div>
                {member.bio && <p className="col-span-2 mt-4 max-w-[60ch] text-body md:mt-3">{member.bio}</p>}
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
