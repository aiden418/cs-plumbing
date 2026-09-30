import { Briefcase, CalendarClock, ClipboardCheck, HardHat, Home, Layers, MapPin, Wrench } from "lucide-react";
import Container from "@/components/ui/Container";
import type { CompletedProject } from "@/lib/types";

/**
 * Builder case-study template: builder (with permission), location, home
 * type, fixtures, phases, schedule vs. plan, inspections, and one field
 * problem solved. Renders only the facts that are filled in, and nothing at
 * all when the project has no `caseStudy`.
 */
export default function CaseStudyFacts({ project }: { project: CompletedProject }) {
  const cs = project.caseStudy;
  if (!cs) return null;

  const facts: { icon: React.ReactNode; label: string; value: React.ReactNode }[] = [];
  if (cs.builder?.permission) facts.push({ icon: <HardHat className="h-4 w-4" />, label: "Builder", value: cs.builder.name });
  if (project.location) facts.push({ icon: <MapPin className="h-4 w-4" />, label: "Location", value: project.location });
  if (cs.homeType) facts.push({ icon: <Home className="h-4 w-4" />, label: "Home type", value: cs.homeType });
  if (cs.projectType) facts.push({ icon: <Home className="h-4 w-4" />, label: "Project type", value: cs.projectType });
  if (cs.fixtureCount != null) facts.push({ icon: <Wrench className="h-4 w-4" />, label: "Fixtures", value: cs.fixtureCount });
  if (cs.phasesPerformed?.length)
    facts.push({ icon: <Layers className="h-4 w-4" />, label: "Phases performed", value: cs.phasesPerformed.join(" → ") });
  if (cs.projectManagement)
    facts.push({ icon: <Briefcase className="h-4 w-4" />, label: "Estimating & PM", value: cs.projectManagement });
  if (cs.schedule && (cs.schedule.planned || cs.schedule.actual))
    facts.push({
      icon: <CalendarClock className="h-4 w-4" />,
      label: "Schedule vs. plan",
      value: (
        <>
          {cs.schedule.planned && <span className="block">Planned: {cs.schedule.planned}</span>}
          {cs.schedule.actual && <span className="block">Actual: {cs.schedule.actual}</span>}
          {cs.schedule.note && <span className="mt-1 block text-gray-500">{cs.schedule.note}</span>}
        </>
      ),
    });

  return (
    <section className="border-b border-gray-200 bg-white py-12 sm:py-16" aria-labelledby="case-study-facts">
      <Container>
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-widest text-primary sm:text-sm">
          Builder case study
        </span>
        <h2 id="case-study-facts" className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          The job at a glance
        </h2>

        {facts.length > 0 && (
          <dl className="grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-2xl border border-gray-200 bg-[#F5F5F7] p-5">
                <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <span className="text-primary">{f.icon}</span>
                  {f.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-gray-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          {cs.inspections && cs.inspections.length > 0 && (
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900">
                <ClipboardCheck className="h-4 w-4 text-primary" /> Inspection results
              </h3>
              <ul className="divide-y divide-gray-100 text-sm">
                {cs.inspections.map((i) => (
                  <li key={i.phase} className="flex justify-between gap-4 py-2">
                    <span className="text-gray-500">{i.phase}</span>
                    <span className="font-semibold text-gray-900">{i.result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cs.fieldProblem && (
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">
                Field problem solved
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                <strong className="text-gray-900">Problem:</strong> {cs.fieldProblem.problem}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                <strong className="text-gray-900">Solution:</strong> {cs.fieldProblem.solution}
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
