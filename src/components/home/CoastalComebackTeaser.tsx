import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { ArrowRight, Phone, ShieldCheck } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { perYear } from "@/lib/pricing";
import { SEASON_COPY, type Season } from "@/lib/claims";
import { brands, coastal } from "@/content/home";

/**
 * Chapter 2, after the emergency band, on shell: the seasonal Coastal
 * Comeback row (one hairline-framed row: the teaser, then the three annual
 * plans as rows) and the brands we install as a quiet, static, wrapped row.
 * The teaser flips between arrival and departure wording by season.
 */
export default function CoastalComebackTeaser({
  season = "departure",
}: {
  season?: Season;
}) {
  const copy = SEASON_COPY[season];
  return (
    <>
      <Section
        tone="shell"
        spacing="none"
        labelledBy="home-coastal-title"
        className="pt-section-sm"
      >
        <Container>
          <Reveal className="grid grid-cols-1 gap-y-8 border-y border-rule py-8 lg:grid-cols-12 lg:gap-x-8 lg:py-14">
            <div className="lg:col-span-6">
              <Eyebrow className="mb-4">{copy.teaserEyebrow}</Eyebrow>
              <h2 id="home-coastal-title" className="text-display-md text-fg">
                {copy.teaserTitle}
              </h2>
              <p className="mt-5 max-w-[56ch] text-lead text-body">
                {copy.teaserBody}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href={coastal.plansLink.href}
                  size="lg"
                  icon={<ShieldCheck className="size-5" />}
                >
                  {coastal.plansLink.label}
                </Button>
                <Button
                  href={BUSINESS.phoneHref}
                  variant="secondary"
                  size="lg"
                  icon={<Phone className="size-5" />}
                >
                  {`Call ${BUSINESS.phone}`}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <p className="label-tech text-muted">{coastal.plansListLabel}</p>
              <ul className="mt-4 border-b border-rule">
                {coastal.tiers.map((tier) => (
                  <li key={tier.name} className="border-t border-rule">
                    <Link
                      href={coastal.plansHref}
                      className="group flex min-h-14 items-center justify-between gap-4 py-3"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-semibold text-fg group-hover:underline group-hover:underline-offset-4">
                          {tier.name}
                        </span>
                        {"featured" in tier && tier.featured && (
                          <span className="label-tech text-accent">
                            {coastal.featuredBadge}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-2 font-semibold text-fg tabular-nums">
                        {tier.price ? perYear(tier.price) : coastal.callPrice}
                        <ArrowRight className="size-4 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">{coastal.note}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section
        tone="shell"
        spacing="none"
        labelledBy="home-brands-title"
        className="pt-10 pb-section-sm lg:pt-14"
      >
        <Container>
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-4">
              <Eyebrow className="mb-4">{brands.overline}</Eyebrow>
              <h2
                id="home-brands-title"
                className="font-display text-display-sm font-bold text-fg [font-stretch:108%]"
              >
                {brands.title}
              </h2>
              <p className="mt-3 max-w-[48ch] text-body">{brands.subtitle}</p>
            </div>
            <ul className="grid grid-cols-4 items-center gap-x-6 gap-y-6 sm:gap-x-10 lg:col-span-7 lg:col-start-6 lg:self-center">
              {brands.items.map((brand) => (
                <li key={brand.name} className="relative h-7 w-full max-w-[104px] sm:h-8">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    sizes="104px"
                    className="object-contain"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
