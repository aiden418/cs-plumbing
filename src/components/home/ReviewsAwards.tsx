import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { AWARDS } from "@/lib/awards";
import GoogleReviews from "./GoogleReviews";
import { awards } from "@/content/home";

/**
 * Chapter 6 on white: the shared Google reviews block (live rating, quotes,
 * source link; it falls back to BUSINESS without an API key), then the award
 * badges with their award lines, each linking to /awards.
 */
export default function ReviewsAwards() {
  return (
    <>
      <GoogleReviews />
      <Section tone="white" spacing="sm">
        <Container>
          <ul className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8">
            {AWARDS.map((award) => (
              <li key={award.slug}>
                <Link href={awards.link.href} className="group flex items-center gap-5">
                  <Image
                    src={award.badge}
                    alt={`${award.title} — ${award.category}`}
                    width={award.badgeWidth}
                    height={award.badgeHeight}
                    sizes="112px"
                    className="h-auto w-20 shrink-0 sm:w-28"
                  />
                  <span>
                    <span className="block font-semibold text-fg group-hover:underline group-hover:underline-offset-4">
                      {award.title}
                    </span>
                    <span className="mt-1 block max-w-[48ch] text-sm text-muted">{award.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
