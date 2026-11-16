import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import { ArrowRight, ArrowUpRight, Phone } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { CONTRACTOR_RANKING, LATEST_AWARD, STATS } from "@/lib/constants";
import { fetchPlaceData } from "@/lib/google-reviews";
import { picture } from "@/lib/media";
import { doors, proof } from "@/content/home";

/** "9500" + "+" → "9,500+": the final number as text (no counting). */
function statValue(value: number, suffix: string) {
  return `${value.toLocaleString("en-US")}${suffix}`;
}

/**
 * Chapter 1, still on ink under the hero: the two doors (builders, home
 * owners) and the proof strip. Server component.
 */
export default async function HomeIntro() {
  const live = await fetchPlaceData();
  const rating = live?.rating ?? BUSINESS.rating;
  const total = live?.total ?? BUSINESS.reviewCount;
  const [homes, years, ranking, emergency] = STATS;

  return (
    <section data-tone="ink" aria-label={proof.label} className="relative bg-canvas pb-section-sm text-body">
      <Container>
        <ul className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {doors.map((door) => {
            const media = picture(door.slot);
            return (
              <li key={door.href}>
                <Link href={door.href} className="home-door group">
                  {media && (
                    <Frame
                      media={media}
                      alt=""
                      aspect="4/5"
                      sizes="(min-width: 80rem) 230px, (min-width: 48rem) 17vw, 34vw"
                      className="home-door-frame"
                    />
                  )}
                  <span className="home-door-head">
                    <span className="label-tech block text-accent">{door.label}</span>
                    <span className="mt-3 block font-display text-display-sm font-bold text-fg [font-stretch:108%]">
                      {door.title}
                    </span>
                  </span>
                  <span className="home-door-text">
                    <span className="block text-sm text-body sm:text-base">{door.body}</span>
                    <span className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-fg">
                      {door.cta}
                      <ArrowRight className="size-5 text-accent transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <dl className="home-proof mt-section-sm">
          <div className="home-proof-cell">
            <dt className="label-tech text-muted">{homes.label}</dt>
            <dd className="home-proof-value">{statValue(homes.value, homes.suffix)}</dd>
          </div>
          <div className="home-proof-cell">
            <dt className="label-tech text-muted">{years.label}</dt>
            <dd className="home-proof-value">{statValue(years.value, years.suffix)}</dd>
          </div>
          <div className="home-proof-cell">
            <dt className="label-tech text-muted">
              <a
                href={CONTRACTOR_RANKING.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:text-fg hover:underline"
              >
                {proof.rankingLabel}
                <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
              </a>
            </dt>
            <dd className="home-proof-value">{statValue(ranking.value, ranking.suffix)}</dd>
          </div>
          <div className="home-proof-cell">
            <dt className="label-tech text-muted">{emergency.label}</dt>
            <dd className="home-proof-value">{statValue(emergency.value, emergency.suffix)}</dd>
          </div>
          <div className="home-proof-cell">
            <dt className="label-tech text-muted">{`${proof.ratingSuffix} · ${total}+ ${proof.reviewsSuffix}`}</dt>
            <dd className="home-proof-value">{rating.toFixed(1)}</dd>
          </div>
          <div className="home-proof-cell">
            <dt className="sr-only">{LATEST_AWARD.title}</dt>
            <dd>
              <Link href="/awards" className="group flex min-h-11 items-center gap-3">
                <Image
                  src={LATEST_AWARD.badge}
                  alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
                  width={68}
                  height={48}
                  sizes="68px"
                  className="h-12 w-[68px] shrink-0"
                />
                <span>
                  <span className="block text-sm leading-tight font-semibold text-fg group-hover:underline">
                    {LATEST_AWARD.title}
                  </span>
                  <span className="mt-1 block text-sm leading-tight text-muted">{`${proof.awardPrefix} ${LATEST_AWARD.category}`}</span>
                </span>
              </Link>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-x-10 gap-y-3 text-sm text-muted lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {proof.trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="joint text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="flex flex-wrap items-center gap-x-2">
            <span>{proof.emergencyLead}</span>
            <a href={BUSINESS.phoneHref} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-fg hover:underline">
              <Phone className="size-4" />
              {BUSINESS.phone}
            </a>
            <span aria-hidden="true">·</span>
            <Link href={proof.emergencyLink.href} className="inline-flex min-h-11 items-center text-link hover:underline">
              {proof.emergencyLink.label}
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
