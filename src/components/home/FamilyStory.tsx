import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { picture } from "@/lib/media";
import { family } from "@/content/home";
import { ArrowLink, HomeHeading } from "./HomeHeading";

/**
 * Why C&S, on shell: the family portrait, a short list of six reasons in two
 * columns (on phones the titles; each description stays in the HTML and is
 * shown from 768 px), and the link to the story.
 *
 * The portrait is always shown whole, in its own 4:5 shape: it is a picture
 * of two people, and any wider frame cuts through their faces. On phones it
 * sits under the heading; from 640 px beside the heading; from 1024 px the
 * heading runs across the top with the portrait and the list side by side.
 */
export default function FamilyStory() {
  const portrait = picture("home.family");
  const r = family.reasons;
  const reasons = [
    r.family,
    {
      title: LATEST_AWARD.title,
      description: r.award(LATEST_AWARD, BUSINESS.rating.toFixed(1), BUSINESS.reviewCount),
    },
    r.emergency,
    { title: r.licensed.title, description: `${r.licensed.licenseLead} (${BUSINESS.license}), ${r.licensed.descriptionAfterLicense}` },
    r.guarantee,
    r.estimates,
  ];

  return (
    <section data-tone="shell" aria-labelledby="home-family-title" className="relative bg-canvas py-10 text-body md:py-14 lg:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-12 sm:items-center sm:gap-x-8 lg:items-start lg:gap-x-12 lg:gap-y-10">
          <HomeHeading
            id="home-family-title"
            eyebrow={family.overline}
            title={family.title}
            subtitle={family.subtitle}
            subtitleHidden="phone"
            className={portrait ? "sm:col-span-7 sm:col-start-6 sm:row-start-1 lg:col-span-12 lg:col-start-1" : "sm:col-span-12"}
          />
          <Frame
            media={portrait}
            aspect="4/5"
            sizes="(min-width: 80rem) 465px, (min-width: 40rem) 38vw, min(92vw, 416px)"
            className="max-w-[26rem] sm:col-span-5 sm:col-start-1 sm:row-start-1 sm:max-w-none lg:row-start-2"
          />
          <div className={portrait ? "sm:col-span-12 lg:col-span-7 lg:col-start-6 lg:row-start-2" : "sm:col-span-12"}>
            <ul className="grid grid-cols-2 gap-x-4 md:gap-x-10">
              {reasons.map((reason) => (
                <li key={reason.title} className="border-t border-rule py-3 md:py-5">
                  <h3 className="text-lg leading-snug font-semibold text-fg">{reason.title}</h3>
                  <p className="mt-1 text-base leading-normal text-body max-md:sr-only">{reason.description}</p>
                </li>
              ))}
            </ul>
            <ArrowLink href={family.aboutLink.href} className="mt-6 md:mt-4">
              {family.aboutLink.label}
            </ArrowLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
