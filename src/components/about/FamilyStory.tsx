import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Section from "@/components/ui/Section";
import { BUSINESS } from "@/lib/business";
import { image } from "@/lib/media";
import { ABOUT_HERO, ABOUT_STORY } from "@/content/about";

const strong = "font-semibold text-fg";

/**
 * The story: the rest of the hero's lead, then the family story in short
 * paragraphs beside the family portrait. The storefront photo shows an old
 * phone number, so it stays small.
 */
export default function FamilyStory() {
  const portrait = image(ABOUT_STORY.portrait.image, { alt: ABOUT_STORY.portrait.alt });
  const storefront = image(ABOUT_STORY.storefront.image, { alt: ABOUT_STORY.storefront.alt });

  return (
    <Section tone="white" spacing="sm" labelledBy="about-story-title">
      <Container>
        {/* Phones: opening, photos, story. Desktop: photos in the left column beside both. */}
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-6">
          <div className="lg:col-span-7 lg:col-start-6">
            <Eyebrow className="mb-3">{ABOUT_STORY.overline}</Eyebrow>
            <h2 id="about-story-title" className="max-w-[20ch] text-display-md text-fg">
              {ABOUT_STORY.title}
            </h2>
            <p className="mt-5 max-w-[56ch] text-lead text-body">{ABOUT_HERO.descriptionMore}</p>
            <p className="mt-6 max-w-[30ch] font-display text-display-sm font-bold text-balance text-fg [font-stretch:108%]">
              {ABOUT_STORY.pullLine}
            </p>
          </div>

          <div className="grid grid-cols-[3fr_2fr] content-start items-start gap-4 sm:gap-6 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:grid-cols-1">
            <Frame
              media={portrait}
              aspect="4/5"
              sizes="(min-width: 1024px) 460px, 56vw"
              quality={75}
              className="lg:max-w-[28.75rem]"
            />
            <Frame
              media={storefront}
              aspect="4/3"
              sizes="(min-width: 1024px) 256px, 38vw"
              quality={75}
              className="lg:max-w-[16rem]"
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="max-w-[64ch] space-y-5 text-body">
              <p>
                Before C&S, there was <strong className={strong}>Samuel Pellechio
                Sr.</strong> — a mason and general contractor in Philadelphia who built thousands
                of homes and lived by one rule: a job isn&apos;t finished until it&apos;s done
                right. In 1984 he moved the family to Cape Coral, his two sons in tow.
              </p>
              <p>
                Both boys grew up in the trades and graduated from Cape Coral High.{" "}
                <strong className={strong}>Sam</strong> earned his plumbing license in
                December 1997 and in 1998 — with his brother <strong className={strong}>Chris</strong>{" "}
                and their father — founded{" "}
                <strong className={strong}>C&S Plumbing of Lee</strong> in Cape Coral. The name says it
                plainly: <strong className={strong}>C&S — for Chris and Sam.</strong>{" "}
                Samuel Jr. has led it ever since, on one promise: honest work, fair pricing, and
                treating every customer like family. Nearly three decades and 9,500+ homes later,
                that promise became our legacy.
              </p>
              <p>
                Today the third generation is on the job.{" "}
                <strong className={strong}>Aiden Pellechio</strong> grew up around these
                job sites and learned the trade the way his dad did — by working it. He runs
                the office, estimating and project management for C&S while working toward his
                construction management degree at FGCU, with plans to earn his GC and plumbing licenses down the road. Same name
                on the truck. Same standard on every pipe.
              </p>
            </div>

            <dl className="mt-10 grid max-w-[40rem] grid-cols-3 gap-x-4 border-t border-rule pt-5 sm:gap-x-8">
              {ABOUT_STORY.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1 text-[0.9375rem] font-medium text-body">{s.label}</dt>
                  <dd className="font-display text-display-sm font-bold text-fg tabular-nums">{s.value}</dd>
                </div>
              ))}
              <div className="flex flex-col-reverse justify-end">
                <dt className="mt-1 text-[0.9375rem] font-medium text-body">
                  {BUSINESS.reviewCount} {ABOUT_STORY.reviewsLabel}
                </dt>
                <dd className="font-display text-display-sm font-bold text-fg tabular-nums">{BUSINESS.rating.toFixed(1)}★</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
