import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { TEAM_MEMBERS } from "@/lib/constants";
import { BUSINESS, OFFICE_CONTACTS } from "@/lib/business";
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

        {/* Who answers the office line, and what each of them handles. */}
        <div className="mt-10 grid grid-cols-1 gap-y-5 border-t border-rule pt-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <h3 className="text-display-sm text-fg">{ABOUT_TEAM.office.heading}</h3>
            <p className="mt-3 max-w-[40ch] text-body">{ABOUT_TEAM.office.lead}</p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <dl className="grid grid-cols-1 border-b border-rule sm:grid-cols-2 sm:gap-x-10">
              {OFFICE_CONTACTS.map((person) => (
                <div key={person.name} className="-mb-px border-y border-rule py-4">
                  <dt className="text-xl font-semibold text-fg">{person.name}</dt>
                  <dd className="mt-1 text-body">{person.handles}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-body">
              <a href={BUSINESS.phoneHref} className="font-semibold text-link underline underline-offset-[0.2em]">
                {BUSINESS.phone}
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`mailto:${BUSINESS.email}`} className="font-semibold text-link underline underline-offset-[0.2em] break-all">
                {BUSINESS.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
