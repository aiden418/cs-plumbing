import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { getImageProps } from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Stars from "@/components/ui/Stars";
import { ArrowRight, Phone } from "@/components/ui/icons";
import HeroController from "@/components/home/HeroController";
import { BUSINESS } from "@/lib/business";
import { fetchPlaceData } from "@/lib/google-reviews";
import { slot } from "@/lib/media";
import { PHONE_MEDIA } from "@/lib/hero-controller";
import { HERO_SOURCES } from "@/lib/intro";
import { hero, proof } from "@/content/home";

/** The photograph fills the hero edge to edge at every width. */
const SIZES = "100vw";
const QUALITY = 75;

/**
 * The still: <picture> with the phone crop for upright phones, preloaded once
 * per art direction, so exactly one hero image is requested. It is the first
 * thing painted and the page's LCP element; the film only ever covers it.
 */
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
      <img {...img} alt={media.alt} className="home-hero-still" />
    </picture>
  );
}

function mediaStyle(): CSSProperties {
  const media = slot("home.hero");
  return {
    backgroundColor: media?.desktop.color,
    "--hero-pos": media?.desktop.position ?? "50% 50%",
    "--hero-pos-phone": media?.mobile?.position ?? "50% 50%",
  } as CSSProperties;
}

/** The headline, word for word, with the key words ("Most Trusted") on their own underlined line. */
function Headline() {
  const key = "Most Trusted";
  const at = hero.headline.indexOf(key);
  if (at < 0) return <>{hero.headline}</>;
  return (
    <>
      {hero.headline.slice(0, at)}
      <span className="home-hero-key">{key}</span>
      {hero.headline.slice(at + key.length)}
    </>
  );
}

/**
 * The homepage hero (v2-bright.md, "The Opening, simplified"): the job-site
 * photograph fills the first screen behind the words, the film fades in over
 * it, a navy scrim (strongest bottom-left) carries the white type. The
 * header (another component) is transparent over a [data-hero-photo] hero.
 */
export default async function Hero() {
  const live = await fetchPlaceData();
  const rating = live?.rating ?? BUSINESS.rating;
  const total = live?.total ?? BUSINESS.reviewCount;

  return (
    <section data-hero-photo="" data-tone="ink" aria-labelledby="hero-title" className="home-hero">
      <div id="cs-hero-frame" className="home-hero-media" style={mediaStyle()}>
        <HeroStill />
        <video
          id="cs-hero-video"
          className="home-hero-film"
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      <div className="home-hero-scrim" aria-hidden="true" />

      <Container className="home-hero-body">
        <p className="home-hero-rating">
          <Stars rating={rating} label={`${rating.toFixed(1)} out of 5 stars`} className="size-[1.125rem]" />
          <span>{`${rating.toFixed(1)} ${proof.ratingSuffix} · ${total}+ ${proof.reviewsSuffix}`}</span>
        </p>
        <h1 id="hero-title" className="home-hero-title">
          <Headline />
        </h1>
        <p className="home-hero-lead">{hero.lead}</p>
        <div className="home-hero-actions">
          <Button href={BUSINESS.phoneHref} size="lg" icon={<Phone className="size-5" />} className="home-hero-button">
            {`Call ${BUSINESS.phone}`}
          </Button>
          <Button href="/booking" variant="inverse" size="lg" className="home-hero-button">
            {hero.bookLabel}
          </Button>
        </div>
        <p className="home-hero-more">
          <Link href="/quote-builder" className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline-offset-[0.25em] hover:underline">
            {hero.quoteLabel}
            <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </p>
      </Container>

      <HeroController sources={HERO_SOURCES} labels={{ pause: hero.pauseLabel, play: hero.playLabel }} />
    </section>
  );
}
