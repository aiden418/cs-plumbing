import Image from "next/image";
import Link from "next/link";
import BuilderLogoImage from "@/components/ui/BuilderLogoImage";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { ArrowRight, Phone, ShieldCheck } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { BUILDERS } from "@/lib/builders-data";
import { imageMeta } from "@/lib/media";
import { perYear } from "@/lib/pricing";
import { SEASON_COPY, type Season } from "@/lib/claims";
import { brands, builders, coastal } from "@/content/home";
import { ArrowLink, HomeHeading } from "./HomeHeading";

/**
 * A see-through logo drawn in white (its dominant colour is pure white)
 * would vanish on a white cell: that one is set on a navy chip instead.
 */
function whiteLogo(path: string) {
  const meta = imageMeta(path);
  return Boolean(meta?.alpha && meta.color?.toLowerCase() === "#ffffff");
}

/**
 * On white: the seasonal Coastal Comeback plan as one compact card (the
 * teaser beside the three annual plans), then the brands we install and the
 * builders who trust C&S as one logo strip each. The teaser flips between
 * arrival and departure wording by season.
 */
export default function CoastalComebackTeaser({ season = "departure" }: { season?: Season }) {
  const copy = SEASON_COPY[season];
  return (
    <section data-tone="white" aria-labelledby="home-coastal-title" className="relative bg-canvas py-14 text-body lg:py-20">
      <Container>
        <div className="home-card grid grid-cols-1 gap-y-6 p-5 sm:p-8 lg:grid-cols-12 lg:gap-x-10 lg:p-10">
          <div className="lg:col-span-7">
            <p className="home-eyebrow">{copy.teaserEyebrow}</p>
            <h2 id="home-coastal-title" className="home-h2-sm">
              {copy.teaserTitle}
            </h2>
            <p className="mt-3 max-w-[56ch]">{copy.teaserBody}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Button href={coastal.plansLink.href} size="lg" icon={<ShieldCheck className="size-5" />} className="max-sm:w-full">
                {coastal.plansLink.label}
              </Button>
              <a href={BUSINESS.phoneHref} className="inline-flex min-h-11 items-center gap-2 font-semibold text-fg hover:text-link">
                <Phone className="size-5 text-link" />
                {`Call ${BUSINESS.phone}`}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 lg:self-center">
            <p className="text-sm font-semibold text-muted">{coastal.plansListLabel}</p>
            <ul className="mt-2 border-b border-rule">
              {coastal.tiers.map((tier) => (
                <li key={tier.name} className="border-t border-rule">
                  <Link href={coastal.plansHref} className="group flex min-h-13 items-center justify-between gap-4 py-2.5">
                    <span className="flex items-baseline gap-2.5">
                      <span className="font-semibold text-fg group-hover:text-link">{tier.name}</span>
                      {"featured" in tier && tier.featured && (
                        <span className="rounded-chip bg-primary/10 px-2 py-0.5 text-sm font-semibold text-link">{coastal.featuredBadge}</span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 font-semibold text-fg tabular-nums">
                      {tier.price ? perYear(tier.price) : coastal.callPrice}
                      <ArrowRight className="size-4 text-link transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted max-md:sr-only">{coastal.note}</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 lg:mt-14">
          <div aria-labelledby="home-brands-title" role="group" className="home-strip">
            <HomeHeading
              id="home-brands-title"
              eyebrow={brands.overline}
              title={brands.title}
              subtitle={brands.subtitle}
              subtitleHidden="always"
              size="sm"
              className="home-strip-head"
            />
            <ul className="home-brands">
              {brands.items.map((brand) => (
                <li key={brand.name}>
                  <Image src={brand.logo} alt={`${brand.name} logo`} fill sizes="112px" className="object-contain" />
                </li>
              ))}
            </ul>
          </div>

          <div aria-labelledby="home-builders-title" role="group" className="home-strip">
            <div className="home-strip-head">
              <HomeHeading
                id="home-builders-title"
                eyebrow={builders.overline}
                title={builders.title}
                subtitle={builders.subtitle}
                subtitleHidden="always"
                size="sm"
              />
              <ArrowLink href={builders.link.href} className="mt-2">
                {builders.link.label}
              </ArrowLink>
            </div>
            <ul className="home-builders">
              {BUILDERS.map((builder) => (
                <li key={builder.name} data-tone={whiteLogo(builder.logo) ? "navy" : undefined}>
                  <BuilderLogoImage builder={builder} sizes="140px" className="h-9 w-auto max-w-full object-contain lg:h-10" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
