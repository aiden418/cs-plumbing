import type { CSSProperties } from "react";
import { preload } from "react-dom";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import LogoLockup from "@/components/ui/LogoLockup";
import { InlineScript } from "@/components/ui/InlineScript";
import { ArrowRight, HardHat, Home, Phone, Star } from "@/components/ui/icons";
import HeroController from "@/components/home/HeroController";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { slot } from "@/lib/media";
import { PHONE_MEDIA } from "@/lib/hero-controller";
import { HERO_SOURCES, frameScript } from "@/lib/intro";
import { hero, heroInterim } from "@/content/home";

/**
 * One `sizes` for both art directions. It covers the Opening's stage (the
 * frame centred and enlarged, about 60% of a desktop window), which is the
 * largest the photograph is ever shown; the settled frame is smaller.
 */
const SIZES = "(min-width: 64rem) 62vw, 100vw";
const QUALITY = 75;

/** The still: <picture> with the phone crop for upright phones, preloaded once per art direction. */
function HeroStill() {
  const media = slot("home.hero");
  if (!media) return null;
  const common = { alt: media.alt, sizes: SIZES, quality: QUALITY, loading: "eager", fetchPriority: "high" } as const;
  const { props: desktop } = getImageProps({
    ...common,
    src: media.desktop.src,
    width: media.desktop.width,
    height: media.desktop.height,
  });
  const phone = media.mobile
    ? getImageProps({ ...common, src: media.mobile.src, width: media.mobile.width, height: media.mobile.height }).props
    : null;

  if (phone?.srcSet) {
    preload(phone.src, { as: "image", imageSrcSet: phone.srcSet, imageSizes: SIZES, fetchPriority: "high", media: PHONE_MEDIA });
    preload(desktop.src, {
      as: "image",
      imageSrcSet: desktop.srcSet,
      imageSizes: SIZES,
      fetchPriority: "high",
      media: `not all and ${PHONE_MEDIA}`,
    });
  } else {
    preload(desktop.src, { as: "image", imageSrcSet: desktop.srcSet, imageSizes: SIZES, fetchPriority: "high" });
  }

  const { style: _style, ...img } = desktop;
  void _style;
  return (
    <picture>
      {phone?.srcSet && (
        <source media={PHONE_MEDIA} srcSet={phone.srcSet} sizes={SIZES} width={phone.width} height={phone.height} />
      )}
      {/* Props from getImageProps: art direction needs a plain <picture>. */}
      <img {...img} alt={media.alt} className="cs-hero-still" />
    </picture>
  );
}

function frameStyle(): CSSProperties {
  const media = slot("home.hero");
  return {
    backgroundColor: media?.desktop.color,
    "--hero-pos": media?.desktop.position ?? "50% 50%",
    "--hero-pos-phone": media?.mobile?.position ?? "50% 50%",
  } as CSSProperties;
}

/**
 * The homepage hero: the settled layout is the only layout. The Opening
 * (first visit) is a CSS state on <html data-intro> set by the head script
 * in src/lib/intro.ts; see src/app/styles/opening.css.
 */
export default function Hero() {
  const arrive = (i: number) => ({ "--intro-i": i }) as CSSProperties;

  return (
    <>
      <section data-tone="ink" aria-labelledby="hero-title" className="cs-hero relative bg-canvas text-body">
        {/* The Opening's title card. Shown only while <html data-intro> is set. */}
        <div className="cs-intro">
          <div id="cs-intro-stage" className="cs-intro-stage" />
          <div className="cs-intro-card">
            <div aria-hidden="true" className="flex min-w-0 items-center gap-3 nav:gap-4">
              <LogoLockup size="sm" wordmark={false} href={null} />
              <p className="text-display-sm font-display font-bold text-white [font-stretch:108%]">{hero.kicker}</p>
            </div>
            <Button variant="inverse" size="sm" data-intro-skip="" className="shrink-0">
              {hero.skipLabel}
            </Button>
          </div>
        </div>

        <Container className="cs-hero-body">
          {/* Phones and tablets: kicker, headline, photograph, then the rest of the
              copy, so the film is on the first screen. The copy column dissolves
              into the grid there (display: contents) and is ordered around the
              figure; from lg it is the left column again. */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-start lg:gap-x-8">
            <div className="max-lg:contents lg:col-span-5">
              <div data-intro-in="" style={arrive(0)} className="max-lg:order-1">
                <Eyebrow>{hero.kicker}</Eyebrow>
              </div>
              <h1 id="hero-title" data-intro-in="" style={arrive(1)} className="mt-5 text-display-lg text-fg display-normal max-lg:order-2">
                {hero.headline}
              </h1>
              <p data-intro-in="" style={arrive(2)} className="mt-6 max-w-[48ch] text-lead text-body max-lg:order-4 max-lg:mt-8">
                {hero.lead}
              </p>
              <div data-intro-in="" style={arrive(3)} className="mt-8 flex flex-wrap items-center gap-3 max-lg:order-5">
                <Button
                  href={BUSINESS.phoneHref}
                  size="lg"
                  icon={<Phone className="size-5" />}
                  data-intro-focus=""
                  className="max-sm:w-full"
                >
                  {`Call ${BUSINESS.phone}`}
                </Button>
                <Button href="/booking" variant="inverse" size="lg" className="max-sm:w-full">
                  {hero.bookLabel}
                </Button>
                <Button href="/quote-builder" variant="ghost" size="lg" className="max-sm:mt-1">
                  {hero.quoteLabel}
                </Button>
              </div>
              <p data-intro-in="" style={arrive(4)} className="mt-8 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted max-lg:order-6">
                <span>{`${hero.licensePrefix} · ${BUSINESS.license}`}</span>
                <Link href="/awards" className="whitespace-nowrap text-link underline-offset-[0.2em] hover:underline">
                  {LATEST_AWARD.title}
                </Link>
              </p>
            </div>

            <figure className="cs-hero-figure max-lg:order-3 max-lg:mt-8 lg:col-span-7 lg:mt-10">
              <div id="cs-hero-frame" className="cs-hero-frame" style={frameStyle()} suppressHydrationWarning>
                <HeroStill />
                <video
                  id="cs-hero-video"
                  className="cs-hero-film"
                  muted
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  loop={hero.mode === "loop"}
                  aria-hidden="true"
                  tabIndex={-1}
                  // the frame script sets src before hydration on the Opening path
                  suppressHydrationWarning
                />
                <InlineScript html={frameScript(HERO_SOURCES)} />
                <HeroController
                  sources={HERO_SOURCES}
                  mode={hero.mode}
                  labels={{ pause: hero.pauseLabel, play: hero.playLabel, replay: hero.replayLabel }}
                />
              </div>
              <figcaption data-intro-in="" style={arrive(5)} className="label-tech mt-3 text-muted">
                {hero.caption}
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      <HeroInterim />
    </>
  );
}

/**
 * Interim: what the old hero showed that the new hero does not place. The
 * Home team replaces this block with the doors and the proof strip.
 */
function HeroInterim() {
  const [builders, homeowners] = heroInterim.doors;
  const icons = { [builders.href]: HardHat, [homeowners.href]: Home };

  return (
    <section data-tone="ink" className="relative border-t border-rule bg-canvas pt-section-sm pb-section-sm text-body">
      <Container>
        <div data-pipe-node="hero-cta" className="grid grid-cols-1 border-t border-rule md:grid-cols-2">
          {heroInterim.doors.map((door, i) => {
            const Icon = icons[door.href];
            return (
              <Link
                key={door.href}
                href={door.href}
                className={`group block border-b border-rule py-6 md:py-8 ${i === 0 ? "md:border-r md:pr-8" : "md:pl-8"}`}
              >
                <span className="label-tech flex items-center gap-2 text-accent">
                  <Icon className="size-5" />
                  {door.label}
                </span>
                <span className="mt-3 block text-display-sm font-display font-bold text-fg">{door.title}</span>
                <span className="mt-2 block text-body">{door.body}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 font-semibold text-fg">
                  {door.cta}
                  <ArrowRight className="size-5 transition-transform duration-250 ease-settle group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 text-sm text-body">
              <span className="flex gap-0.5 text-brass" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span>
                {`${BUSINESS.rating.toFixed(1)} ${heroInterim.ratingSuffix} · ${BUSINESS.reviewCount}+ ${heroInterim.reviewsSuffix}`}
              </span>
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {heroInterim.trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="joint text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted">
              {heroInterim.emergencyLead}{" "}
              <a href={BUSINESS.phoneHref} className="inline-flex min-h-11 items-center gap-1 font-semibold text-fg hover:underline">
                <Phone className="size-4" />
                {BUSINESS.phone}
              </a>{" "}
              ·{" "}
              <Link href={heroInterim.emergencyLink.href} className="inline-flex min-h-11 items-center text-link hover:underline">
                {heroInterim.emergencyLink.label}
              </Link>
            </p>
          </div>

          <Link href="/awards" className="flex items-center gap-3 self-start rounded-control border border-rule px-4 py-3 md:self-auto">
            <Image
              src={LATEST_AWARD.badge}
              alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
              width={54}
              height={38}
              sizes="54px"
              className="h-[38px] w-[54px]"
            />
            <span className="text-left">
              <span className="block text-sm font-semibold leading-tight text-fg">{LATEST_AWARD.title}</span>
              <span className="block text-sm text-muted">{`${heroInterim.awardPrefix} ${LATEST_AWARD.category}`}</span>
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
