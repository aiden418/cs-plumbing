import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section, { type Tone } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/icons";
import { BUSINESS } from "@/lib/business";
import { LICENSE_STATUS_SENTENCE } from "@/lib/claims";
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
    body: `Florida Certified Plumbing Contractor, license ${BUSINESS.license}. ${LICENSE_STATUS_SENTENCE} We pull every required permit and pass every Lee County inspection — no exceptions.`,
    href: BUSINESS.licenseRecordUrl,
    hrefLabel: "See the state record on MyFloridaLicense.com",
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
 * Licenses, insurance and award: the figures in one row, then the
 * credentials as a definition list with a 1 px line between rows (title
 * beside the text on desktop).
 */
export default function Credentials({ tone = "shell" }: { tone?: Tone }) {
  return (
    <Section tone={tone} spacing="sm" labelledBy="credentials-title">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow className="mb-3">{ABOUT_CREDENTIALS.overline}</Eyebrow>
          <h2 id="credentials-title" className="text-display-md text-fg">
            {ABOUT_CREDENTIALS.title}
          </h2>
          <p className="mt-4 max-w-[56ch] text-lead text-body">{ABOUT_CREDENTIALS.lead}</p>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-rule pt-5 sm:mt-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-1 text-[0.9375rem] font-medium text-body">{s.label}</dt>
              <dd className="font-display text-display-md font-bold text-fg tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>

        <dl aria-label={ABOUT_CREDENTIALS.listLabel} className="mt-8 border-b border-rule">
          {credentials.map((c) => (
            <div key={c.title} className="grid grid-cols-1 gap-y-1.5 border-t border-rule py-5 lg:grid-cols-12 lg:gap-x-8">
              <dt className="text-lg leading-snug font-semibold text-fg lg:col-span-4">{c.title}</dt>
              <dd className="max-w-[68ch] text-body lg:col-span-8">
                <p>{c.body}</p>
                {c.href && /^https?:/.test(c.href) && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block py-2.5 font-semibold text-link underline-offset-4 hover:underline"
                  >
                    {c.hrefLabel}
                    {/* A no-break space keeps the icon beside the last word when the label wraps. */}
                    <span className="whitespace-nowrap">
                      &nbsp;
                      <ExternalLink className="inline size-4 align-[-0.125em]" aria-hidden="true" />
                    </span>
                  </a>
                )}
                {c.href && !/^https?:/.test(c.href) && (
                  <Link
                    href={c.href}
                    className="group mt-1 inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline-offset-4 hover:underline"
                  >
                    {c.hrefLabel}
                    <span aria-hidden="true" className="transition-transform duration-250 ease-settle group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </Section>
  );
}
