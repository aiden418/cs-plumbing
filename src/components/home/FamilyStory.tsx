import Link from "next/link";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { picture } from "@/lib/media";
import { family } from "@/content/home";

/**
 * Chapter 4 on shell: the family photograph (with the early-2000s job-site
 * inset) beside the why-choose-us heading, "Built on Trust" as a numbered
 * editorial list, and the link to the story.
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
    <Section tone="shell" spacing="none" className="py-section-sm lg:py-section" labelledBy="home-family-title">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          {main && (
            <div className="relative max-lg:order-2 max-lg:mr-[42%] sm:max-lg:mr-[50%] lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:col-span-5 lg:self-start lg:pb-16">
              <Frame media={main} aspect="4/5" sizes="(min-width: 80rem) 500px, (min-width: 64rem) 40vw, 90vw" />
              {inset && (
                <Frame
                  media={inset}
                  aspect="3/2"
                  sizes="(min-width: 64rem) 240px, 50vw"
                  className="absolute bottom-0 -right-[calc(65%+1rem)] w-[65%] sm:-right-[calc(80%+1.5rem)] sm:w-[80%] lg:-right-10 lg:w-[48%] lg:rounded-[calc(var(--radius-frame)+6px)] lg:border-[6px] lg:border-canvas"
                />
              )}
            </div>
          )}

          <div className={main ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8"}>
            <SectionHeading
              id="home-family-title"
              align="left"
              overline={family.overline}
              title={family.title}
              subtitle={family.subtitle}
              className="mb-8 lg:mb-10"
            />
            <ol className="border-b border-rule">
              {reasons.map((reason, i) => (
                <Reveal as="li" index={i} key={reason.title} className="grid grid-cols-[2rem_1fr] gap-x-3 border-t border-rule py-4 sm:grid-cols-[2.5rem_1fr] sm:gap-x-4 sm:py-5">
                  <span className="label-tech pt-1 text-accent tabular-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg leading-snug font-semibold text-fg">{reason.title}</h3>
                    <p className="mt-1.5 max-w-[60ch] text-sm text-body sm:text-base">{reason.description}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
            <p className="mt-8">
              <Link
                href={family.aboutLink.href}
                className="group inline-flex min-h-11 items-center gap-2 font-semibold text-link underline-offset-[0.2em] hover:underline"
              >
                {family.aboutLink.label}
                <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
