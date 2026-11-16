import Link from "next/link";
import Container from "@/components/ui/Container";
import Frame from "@/components/ui/Frame";
import { ArrowRight, ShieldCheck } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { LATEST_AWARD } from "@/lib/awards";
import { picture } from "@/lib/media";
import { doors, hero } from "@/content/home";

/**
 * Right under the hero, on white: the license and award line (small), then
 * the two doors (builders, homeowners), each a photograph beside a label,
 * a title, one line and an arrow. Stacked on phones, side by side from 640 px.
 */
export default function HomeIntro() {
  return (
    <div data-tone="white" className="relative bg-canvas text-body">
      <div className="border-b border-rule">
        <Container>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="size-[1.125rem] shrink-0 text-accent" aria-hidden="true" />
              {`${hero.licensePrefix} · ${BUSINESS.license}`}
            </span>
            <span aria-hidden="true" className="max-sm:hidden">
              ·
            </span>
            <Link href="/awards" className="inline-flex min-h-11 items-center font-semibold whitespace-nowrap text-link underline-offset-[0.2em] hover:underline sm:min-h-0">
              {LATEST_AWARD.title}
            </Link>
          </p>
        </Container>
      </div>

      <Container className="py-6 sm:py-8 lg:py-14">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {doors.map((door) => {
            const media = picture(door.slot);
            return (
              <li key={door.href}>
                <Link href={door.href} className="home-door group">
                  {media && (
                    <Frame
                      media={media}
                      alt=""
                      aspect="1/1"
                      sizes="(min-width: 64rem) 220px, (min-width: 40rem) 160px, 112px"
                      className="home-door-frame"
                    />
                  )}
                  <span className="home-door-text">
                    <span className="block text-sm font-semibold text-accent">{door.label}</span>
                    <span className="home-door-title">{door.title}</span>
                    <span className="home-door-body max-sm:sr-only">{door.body}</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-semibold text-link">
                      {door.cta}
                      <ArrowRight className="size-5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </div>
  );
}
