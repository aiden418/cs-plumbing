import Link from "next/link";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section, { type Tone } from "@/components/ui/Section";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import UepEstimateForm from "@/components/services/UepEstimateForm";
import { UEP_STATUS } from "@/lib/uep-status";
import { UEP_PAGE } from "@/content/services";

const linkClass =
  "inline-flex min-h-11 items-center gap-1.5 font-semibold text-link underline underline-offset-[0.2em] decoration-1 hover:decoration-2";

/** A link to one of the city's own pages. Inline, so a long label wraps with its arrow beside the last word. */
function CityLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block py-2.5 font-semibold text-link underline decoration-1 underline-offset-[0.2em] hover:decoration-2"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="ml-1 inline size-4 align-[-0.125em]" />
    </a>
  );
}

const T = UEP_PAGE;

/**
 * Where each UEP area stands, with the day it was checked and the city's own
 * documents linked. The Cape Coral connection page shows this: the dated
 * phase information lives there and nowhere else.
 */
export function UepPhaseStatus({ tone = "white" }: { tone?: Tone }) {
  const areas = [
    { name: "North 1 West", status: `${UEP_STATUS.north1West} ${UEP_STATUS.north1WestDeadline}` },
    { name: "North 1 East", status: UEP_STATUS.north1East },
    { name: "North 3", status: UEP_STATUS.north3 },
  ];
  return (
    <Section tone={tone} spacing="sm" labelledBy="uep-status-heading" id="uep-status">
      <Container>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-3">{T.status.overline}</Eyebrow>
            <h2 id="uep-status-heading" className="text-display-md text-fg">
              {T.status.heading}
            </h2>
            <p className="mt-4 max-w-[44ch] text-body">
              {T.status.checkedBefore}
              <time dateTime={UEP_STATUS.checkedOn} className="font-semibold text-fg">
                {UEP_STATUS.checkedOnLabel}
              </time>
              {T.status.checkedAfter}
            </p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <dl className="border-b border-rule">
              {areas.map((area) => (
                <div key={area.name} className="grid grid-cols-1 gap-1 border-t border-rule py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-lg font-semibold text-fg">{area.name}</dt>
                  <dd className="max-w-[62ch] text-body">{area.status}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-8 text-xl font-semibold text-fg">{T.status.decisionHeading}</h3>
            <p className="mt-2 max-w-[62ch] text-body">
              <time dateTime={UEP_STATUS.north3Decision.date} className="font-semibold text-fg">
                {UEP_STATUS.north3Decision.dateLabel}
              </time>
              {": "}
              {UEP_STATUS.north3Decision.summary}
            </p>
            <p className="mt-3 max-w-[62ch] text-body">{T.status.north3Advice}</p>
            <ul className="mt-3 flex flex-col gap-x-8 sm:flex-row sm:flex-wrap">
              <li>
                <CityLink href={UEP_STATUS.north3Decision.sourceUrl}>{UEP_STATUS.north3Decision.sourceLabel}</CityLink>
              </li>
              <li>
                <CityLink href={UEP_STATUS.north1Url}>{T.status.north1Link}</CityLink>
              </li>
              <li>
                <CityLink href={UEP_STATUS.faqUrl}>{T.status.faqLink}</CityLink>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * How a homeowner uses the date on their own Notice of Availability, beside
 * the estimate request that asks for the address and that date.
 */
export function UepNoticeAndEstimate({ tone = "shell" }: { tone?: Tone }) {
  const notice = UEP_STATUS.noticeDate;
  return (
    <Section tone={tone} spacing="sm" labelledBy="uep-notice-heading">
      <Container>
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="min-w-0 lg:col-span-6">
            <Eyebrow className="mb-3">{T.notice.overline}</Eyebrow>
            <h2 id="uep-notice-heading" className="text-display-md text-fg">
              {notice.heading}
            </h2>
            <p className="mt-4 max-w-[60ch] text-body">{notice.intro}</p>
            <ol className="mt-6 border-b border-rule">
              {notice.steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-x-3.5 border-t border-rule py-5">
                  <span aria-hidden="true" className="cv-num-disc">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="pt-0.5 text-lg leading-snug font-semibold text-fg">{step.title}</h3>
                    <p className="mt-1.5 max-w-[56ch] text-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <blockquote className="mt-6 max-w-[60ch] border-l-2 border-primary pl-4 text-body">
              <p>&ldquo;{notice.cityRule}&rdquo;</p>
              <footer className="mt-1 text-[0.9375rem] text-muted">
                {T.notice.ruleSource}{" "}
                <a href={UEP_STATUS.faqUrl} target="_blank" rel="noopener noreferrer" className="text-link underline underline-offset-[0.2em]">
                  {T.notice.ruleSourceLink}
                </a>
                {T.notice.ruleChecked(UEP_STATUS.checkedOnLabel)}
              </footer>
            </blockquote>
            <p className="mt-5 max-w-[60ch] text-body">{notice.lostLetter}</p>
          </div>

          <div id="estimate" className="min-w-0 scroll-mt-28 lg:col-span-6">
            <h2 className="text-display-sm text-fg">{T.estimate.heading}</h2>
            <p className="mt-2 mb-5 max-w-[56ch] text-body">{T.estimate.intro}</p>
            <UepEstimateForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The service page's part: what is on the owner's side of the property line,
 * who pulls the permits and what restoration includes. The dates are on the
 * Cape Coral connection page, linked from here.
 */
export function UepPrivateSide({ tone = "white" }: { tone?: Tone }) {
  return (
    <Section tone={tone} spacing="sm" labelledBy="uep-private-heading">
      <Container>
        <div className="mb-8 max-w-3xl sm:mb-10">
          <h2 id="uep-private-heading" className="text-display-md text-fg">
            {T.privateSide.heading}
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead text-body">{T.privateSide.lead}</p>
        </div>
        <ul className="grid grid-cols-1 border-b border-rule md:grid-cols-3 md:gap-x-10">
          {T.privateSide.items.map((item) => (
            <li key={item.title} className="-mb-px border-y border-rule py-5 md:border-b-0">
              <h3 className="text-xl leading-snug font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 max-w-[60ch] text-body">{item.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 grid grid-cols-1 gap-y-3 border-t border-rule pt-6 md:grid-cols-[1fr_auto] md:items-center md:gap-x-10 md:border-t-0 md:pt-0">
          <p className="max-w-[62ch] text-body">
            <span className="font-semibold text-fg">{T.privateSide.datesTitle}</span> {UEP_STATUS.north3}{" "}
            {T.privateSide.datesAfter(UEP_STATUS.checkedOnLabel)}
          </p>
          <Link href={T.cityPageHref} className={`${linkClass} group`}>
            {T.privateSide.datesLink}
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
