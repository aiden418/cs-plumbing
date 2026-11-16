import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import Section, { type Tone } from "@/components/ui/Section";
import { BUSINESS } from "@/lib/business";
import { AWARDS } from "@/lib/awards";
import { ABOUT_CREDENTIALS } from "@/content/about";

const STATS = [
  ABOUT_CREDENTIALS.stats.years,
  ABOUT_CREDENTIALS.stats.homes,
  { value: `${BUSINESS.rating.toFixed(1)}★`, label: `${BUSINESS.reviewCount} ${ABOUT_CREDENTIALS.stats.reviewsLabel}` },
  { value: `${AWARDS.length}×`, label: ABOUT_CREDENTIALS.stats.awardsLabel },
];

// The credential texts stay in this file: one of them carries a `claim-ok`
// marker for the claims gate, and that marker may not move.
const credentials: { title: string; body: string; href?: string; hrefLabel?: string }[] = [
  {
    title: "State-Licensed Plumbing Contractors",
    body: `Florida Certified Plumbing Contractor, license ${BUSINESS.license}. Verifiable on the DBPR (MyFloridaLicense.com). We pull every required permit and pass every Lee County inspection — no exceptions.`,
  },
  {
    title: "Fully Insured & Bonded",
    body: "$2M general liability and full workers' comp on every crew. Certificates of insurance available on request — required by virtually every GC and HOA we work with.", // claim-ok: insurance limit, not a price
  },
  {
    title: `Best of Cape Coral — ${[...AWARDS].map((a) => a.year).sort().join(" & ")}`,
    body: `${AWARDS.map((a) => a.summary).join(" ")} Backed by 9,500+ homes plumbed and a 5.0-star Google rating.`,
    href: "/awards",
    hrefLabel: "See our awards",
  },
  {
    title: "Trusted by SWFL's Top Builders",
    body: "From subdivision rough-ins for major SWFL builders (Stellar, Alair, Red Key, McDowell) to custom homes and remodels — we've completed more new-construction plumbing in Lee County than any other shop our size.",
  },
  {
    title: "Family-Owned, Locally Owned",
    body: "Founded in 1998, second-generation owner-operated, third-generation working in the field. We live in the same neighborhoods we work in — every job is an introduction to your neighbor.",
  },
];

/**
 * Licenses, insurance, award and ranking: the figures as a hairline row, then
 * the credentials as a definition list with hairlines.
 */
export default function Credentials({ tone = "shell" }: { tone?: Tone }) {
  return (
    <Section tone={tone} labelledBy="credentials-title">
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow className="mb-4">{ABOUT_CREDENTIALS.overline}</Eyebrow>
          <h2 id="credentials-title" className="text-display-md text-fg">
            {ABOUT_CREDENTIALS.title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-lead text-body">{ABOUT_CREDENTIALS.lead}</p>
        </Reveal>

        <dl className="mt-12 grid grid-cols-2 border-t border-rule lg:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={
                "flex flex-col-reverse justify-end py-6 pr-4 " +
                (i % 2 === 1 ? "border-l border-rule pl-4 sm:pl-6 " : "") +
                (i >= 2 ? "border-t border-rule lg:border-t-0 " : "") +
                (i === 2 ? "lg:border-l lg:pl-6" : "")
              }
            >
              <dt className="mt-2 label-tech text-muted">{s.label}</dt>
              <dd className="text-display-md text-fg tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>

        <dl aria-label={ABOUT_CREDENTIALS.listLabel} className="mt-6 border-b border-rule">
          {credentials.map((c) => (
            <Reveal key={c.title} className="grid grid-cols-1 gap-y-2 border-t border-rule py-7 lg:grid-cols-12 lg:gap-x-8">
              <dt className="text-lg leading-snug font-semibold text-fg lg:col-span-4">{c.title}</dt>
              <dd className="max-w-[68ch] text-body lg:col-span-8">
                <p>{c.body}</p>
                {c.href && (
                  <Link
                    href={c.href}
                    className="group mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline"
                  >
                    {c.hrefLabel}
                    <span aria-hidden="true" className="transition-transform duration-250 ease-settle group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
