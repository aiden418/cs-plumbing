import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/icons";
import { CONTRACTOR_RANKING, LATEST_AWARD, STATS } from "@/lib/constants";
import { proof } from "@/content/home";

/** "9500" + "+" → "9,500+": the final number as text (no counting). */
function statValue(value: number, suffix: string) {
  return `${value.toLocaleString("en-US")}${suffix}`;
}

/**
 * Proof on shell: the four numbers in one row (2 × 2 on phones) and the
 * latest award as one line. The ranking's caption links to its source.
 */
export default function ProofStrip() {
  return (
    <section data-tone="shell" aria-label={proof.label} className="relative bg-canvas py-12 text-body lg:py-16">
      <Container>
        <dl className="home-proof">
          {STATS.map((stat) => {
            const ranking = stat.label === proof.rankingLabel;
            return (
              <div key={stat.label} className="home-proof-cell">
                <dt className="home-proof-label">
                  {ranking ? (
                    <a
                      href={CONTRACTOR_RANKING.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline decoration-steel-300 underline-offset-4 hover:text-link hover:decoration-current"
                    >
                      {proof.rankingLabel}
                      <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    stat.label
                  )}
                </dt>
                <dd className="home-proof-value">{statValue(stat.value, stat.suffix)}</dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-8 border-t border-rule pt-6 max-md:sr-only lg:mt-10">
          <Link href="/awards" className="group inline-flex items-center gap-4">
            <Image
              src={LATEST_AWARD.badge}
              alt={`${LATEST_AWARD.title} — ${LATEST_AWARD.category}`}
              width={68}
              height={48}
              sizes="68px"
              className="h-12 w-[68px] shrink-0"
            />
            <span>
              <span className="block font-semibold text-fg group-hover:text-link">{LATEST_AWARD.title}</span>
              <span className="block text-muted">{`${proof.awardPrefix} ${LATEST_AWARD.category}`}</span>
            </span>
          </Link>
        </p>
      </Container>
    </section>
  );
}
