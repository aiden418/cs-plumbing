import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { AWARDS } from "@/lib/awards";
import GoogleReviews from "./GoogleReviews";
import { awards } from "@/content/home";

/**
 * Reviews on white: the shared Google reviews block (live rating, source
 * link; it falls back to BUSINESS without an API key), then the award badges
 * as one compact row. Each award's summary stays in the HTML and is shown
 * from 768 px.
 */
export default function ReviewsAwards() {
  return (
    <>
      <GoogleReviews />
      <div data-tone="white" className="relative bg-canvas pb-12 text-body lg:pb-16">
        <Container>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-4 md:gap-x-10">
            {AWARDS.map((award) => (
              <li key={award.slug}>
                <Link href={awards.link.href} className="group flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
                  <Image
                    src={award.badge}
                    alt={`${award.title} — ${award.category}`}
                    width={award.badgeWidth}
                    height={award.badgeHeight}
                    sizes="112px"
                    className="h-auto w-20 shrink-0 md:w-24"
                  />
                  <span>
                    <span className="block leading-snug font-semibold text-fg group-hover:text-link">{award.title}</span>
                    <span className="mt-1 block max-w-[48ch] text-sm text-muted max-md:sr-only">{award.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </>
  );
}
