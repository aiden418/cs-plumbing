import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";
import type { CompletedProject } from "@/lib/types";
import { PROJECT_PAGE } from "@/content/projects";

const T = PROJECT_PAGE.glance;

/**
 * Builder case-study template: builder (with permission), location, home
 * type, fixtures, phases, schedule vs. plan, inspections, and one field
 * problem solved. Renders only the facts that are filled in, and nothing at
 * all when the project has no `caseStudy`. Facts are a definition list with
 * hairlines (design-system "Data rows").
 */
export default function CaseStudyFacts({ project }: { project: CompletedProject }) {
  const cs = project.caseStudy;
  if (!cs) return null;

  const facts: { label: string; value: React.ReactNode }[] = [];
  if (cs.builder?.permission) facts.push({ label: T.builder, value: cs.builder.name });
  if (project.location) facts.push({ label: T.location, value: project.location });
  if (cs.homeType) facts.push({ label: T.homeType, value: cs.homeType });
  if (cs.projectType) facts.push({ label: T.projectType, value: cs.projectType });
  if (cs.fixtureCount != null) facts.push({ label: T.fixtures, value: cs.fixtureCount });
  if (cs.phasesPerformed?.length) facts.push({ label: T.phasesPerformed, value: cs.phasesPerformed.join(" → ") });
  if (cs.projectManagement) facts.push({ label: T.projectManagement, value: cs.projectManagement });
  if (cs.schedule && (cs.schedule.planned || cs.schedule.actual))
    facts.push({
      label: T.schedule,
      value: (
        <>
          {cs.schedule.planned && (
            <span className="block">
              {T.planned} {cs.schedule.planned}
            </span>
          )}
          {cs.schedule.actual && (
            <span className="block">
              {T.actual} {cs.schedule.actual}
            </span>
          )}
          {cs.schedule.note && <span className="mt-1 block font-normal text-muted">{cs.schedule.note}</span>}
        </>
      ),
    });

  const hasInspections = Boolean(cs.inspections && cs.inspections.length > 0);

  return (
    <Section tone="white" labelledBy="case-study-facts">
      <Container>
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">{T.overline}</Eyebrow>
            <h2 id="case-study-facts" className="text-display-md text-fg">
              {T.heading}
            </h2>
          </div>

          <div className="lg:col-span-8">
            {facts.length > 0 && (
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.label} className="border-t border-rule py-4">
                    <dt className="label-tech text-muted">{f.label}</dt>
                    <dd className="mt-1.5 font-semibold text-fg tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {(hasInspections || cs.fieldProblem) && (
              <div className="mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8">
                {hasInspections && (
                  <div>
                    <h3 className="label-tech mb-4 flex items-center gap-2.5 text-accent">
                      <span className="joint" aria-hidden="true" />
                      {T.inspections}
                    </h3>
                    <dl className="border-t border-rule">
                      {cs.inspections!.map((i) => (
                        <div key={i.phase} className="flex justify-between gap-4 border-b border-rule py-3">
                          <dt className="text-muted">{i.phase}</dt>
                          <dd className="text-right font-semibold text-fg">{i.result}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
                {cs.fieldProblem && (
                  <div>
                    <h3 className="label-tech mb-4 flex items-center gap-2.5 text-accent">
                      <span className="joint" aria-hidden="true" />
                      {T.fieldProblem}
                    </h3>
                    <div className="border-t border-rule pt-4">
                      <p className="text-body">
                        <strong className="font-semibold text-fg">{T.problem}</strong> {cs.fieldProblem.problem}
                      </p>
                      <p className="mt-3 text-body">
                        <strong className="font-semibold text-fg">{T.solution}</strong> {cs.fieldProblem.solution}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
