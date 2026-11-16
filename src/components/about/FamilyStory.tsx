import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { BUSINESS } from "@/lib/business";
import { image } from "@/lib/media";
import { ABOUT_STORY } from "@/content/about";

const strong = "font-semibold text-fg";

/**
 * The long-form story: a 68ch reading column with the opening line set as a
 * pull line, and two small framed photographs beside it (the storefront
 * photo shows an old phone number, so it stays small).
 */
export default function FamilyStory() {
  const portrait = image(ABOUT_STORY.portrait.image, { alt: ABOUT_STORY.portrait.alt });
  const storefront = image(ABOUT_STORY.storefront.image, { alt: ABOUT_STORY.storefront.alt });

  return (
    <Section tone="white" labelledBy="about-story-title">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7 lg:col-start-6">
            <Eyebrow className="mb-4">{ABOUT_STORY.overline}</Eyebrow>
            <h2 id="about-story-title" className="max-w-[18ch] text-display-md text-fg">
              {ABOUT_STORY.title}
            </h2>

            <p className="mt-10 max-w-[34ch] border-l-2 border-accent pl-5 text-display-sm text-balance text-fg">{ABOUT_STORY.pullLine}</p>

            <div className="mt-8 max-w-[68ch] space-y-5 text-body">
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

            <dl className="mt-12 grid max-w-[68ch] grid-cols-3 border-t border-rule">
              {ABOUT_STORY.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={i > 0 ? "flex flex-col-reverse justify-end border-l border-rule pt-5 pl-4 sm:pl-6" : "flex flex-col-reverse justify-end pt-5 pr-4"}
                >
                  <dt className="mt-2 label-tech text-muted">{s.label}</dt>
                  <dd className="text-display-sm text-fg tabular-nums">{s.value}</dd>
                </div>
              ))}
              <div className="flex flex-col-reverse justify-end border-l border-rule pt-5 pl-4 sm:pl-6">
                <dt className="mt-2 label-tech text-muted">
                  {BUSINESS.reviewCount} {ABOUT_STORY.reviewsLabel}
                </dt>
                <dd className="text-display-sm text-fg tabular-nums">{BUSINESS.rating.toFixed(1)}★</dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 content-start items-start gap-4 sm:gap-6 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:grid-cols-1 lg:gap-8">
            <Reveal>
              <Frame media={portrait} aspect="4/5" sizes="(min-width: 1024px) 380px, 45vw" quality={75} />
            </Reveal>
            <Reveal index={1} className="lg:max-w-[18rem]">
              <Frame media={storefront} aspect="4/3" sizes="(min-width: 1024px) 288px, 45vw" quality={75} />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
