import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { picture } from "@/lib/media";
import { family } from "@/content/home";
import { ArrowLink, HomeHeading } from "./HomeHeading";

/**
 * Why C&S, on shell: the family photograph beside a short list of six
 * reasons in two columns (on phones the titles; each description stays in
 * the HTML and is shown from 768 px), and the link to
 * the story. The early-2000s job-site inset joins the photograph from 1024 px.
 */
export default function FamilyStory() {
  const main = picture("home.family");
  const inset = picture("home.family.inset");
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
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <HomeHeading id="home-family-title" eyebrow={family.overline} title={family.title} subtitle={family.subtitle} subtitleHidden="phone" />
            {main && (
              <div className="relative mt-8 max-md:hidden lg:mt-10 lg:mr-10 lg:mb-10">
                <Frame
                  media={main}
                  aspect="16/9"
                  sizes="(min-width: 80rem) 460px, (min-width: 64rem) 36vw, 92vw"
                  className="max-md:aspect-[2/1] lg:aspect-[4/3]"
                />
                {inset && (
                  <Frame
                    media={inset}
                    aspect="3/2"
                    sizes="220px"
                    className="absolute -right-10 -bottom-10 w-[52%] rounded-[calc(var(--radius-frame)+6px)] border-[6px] border-canvas max-lg:hidden"
                  />
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 lg:pt-2">
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
