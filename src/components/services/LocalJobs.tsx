import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Section, { type Tone } from "@/components/ui/Section";
import { Check } from "@/components/ui/icons";
import { image } from "@/lib/media";
import type { LocalJob } from "@/content/local-jobs";

const linkClass = "font-semibold text-link underline underline-offset-[0.2em] decoration-1 hover:decoration-2";

/**
 * One job: the photo, what was done, what the estimate covered, and the
 * request button beside the work. With no approved photo the words take the
 * full width; nothing stands in for a picture that is not there.
 */
function JobRow({
  job,
  ctaHref,
  showServiceLink,
  showCityLink,
}: {
  job: LocalJob;
  ctaHref: string;
  showServiceLink: boolean;
  showCityLink: boolean;
}) {
  const media = job.photo ? image(job.photo.src, { alt: job.photo.alt }) : null;
  return (
    <article className="grid grid-cols-1 gap-y-6 border-t border-rule py-8 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-12 lg:gap-x-10 lg:py-10">
      {media && job.photo && (
        <Frame
          media={media}
          aspect="1/1"
          position={job.photo.position}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 60vw, 92vw"
          quality={75}
          caption={job.photo.caption}
          className="sm:max-w-md lg:col-span-4 lg:max-w-none"
        />
      )}
      <div className={media ? "min-w-0 lg:col-span-8" : "min-w-0 lg:col-span-12"}>
        <h3 className="text-display-sm text-fg">{job.title}</h3>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] text-body">
          {job.cost && <span className="font-semibold text-fg tabular-nums">{job.cost}</span>}
          {showCityLink && job.area && (
            <Link href={`/areas/${job.area.slug}`} className={linkClass}>
              Plumber in {job.area.city}
            </Link>
          )}
          {showServiceLink && (
            <Link href={`/services/${job.primaryService.slug}`} className={linkClass}>
              {job.primaryService.label}
            </Link>
          )}
          {job.project && (
            <Link href={`/projects/${job.project.slug}`} className={linkClass}>
              {job.project.label}
            </Link>
          )}
        </p>
        <p className="mt-4 max-w-[62ch] text-body">{job.summary}</p>
        <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h4 className="text-base font-semibold text-fg">What the estimate covered</h4>
            <ul className="mt-2 space-y-1.5">
              {job.estimateCovered.map((item) => (
                <li key={item} className="flex items-start gap-2 text-body">
                  <Check className="mt-1 size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button href={ctaHref} variant="primary" size="lg" className="w-full md:w-auto">
            {job.cta.label}
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * Local job examples on a service or city page. Server component: every word
 * and link is in the HTML.
 *
 * `page` decides the cross links: a service page links each job to its city,
 * a city page links it to its service.
 */
export default function LocalJobs({
  jobs,
  heading,
  lead,
  page,
  ctaHref,
  tone = "shell",
  divider = false,
  id = "local-jobs",
}: {
  jobs: LocalJob[];
  heading: string;
  lead?: string;
  page: "service" | "city";
  /** Where the request button goes. A function gives each job its own address. */
  ctaHref: string | ((job: LocalJob) => string);
  tone?: Tone;
  /** A hairline above, between two sections of the same tone. */
  divider?: boolean;
  id?: string;
}) {
  if (jobs.length === 0) return null;
  const headingId = `${id}-heading`;
  return (
    <Section tone={tone} spacing="sm" labelledBy={headingId} id={id} divider={divider}>
      <Container>
        <div className="mb-8 max-w-3xl sm:mb-10">
          <Eyebrow className="mb-3">Local jobs</Eyebrow>
          <h2 id={headingId} className="text-display-md text-fg">
            {heading}
          </h2>
          {lead && <p className="mt-4 max-w-[60ch] text-lead text-body">{lead}</p>}
        </div>
        <div>
          {jobs.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              ctaHref={typeof ctaHref === "function" ? ctaHref(job) : ctaHref}
              showCityLink={page === "service"}
              showServiceLink={page === "city"}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
