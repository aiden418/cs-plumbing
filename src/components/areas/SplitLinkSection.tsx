import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";

/**
 * The link sections under the area and service-city pages: eyebrow, heading
 * and description above the links on phones, beside them from 64rem so the
 * section stays short. Server component; every anchor is in the HTML.
 */
export default function SplitLinkSection({
  overline,
  heading,
  description,
  tone,
  headingId,
  children,
}: {
  overline?: string;
  heading: string;
  description?: string;
  tone: "white" | "shell";
  headingId: string;
  children: ReactNode;
}) {
  return (
    <Section tone={tone} spacing="sm" divider={tone === "white"} labelledBy={headingId}>
      <Container>
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            {overline && <Eyebrow className="mb-3">{overline}</Eyebrow>}
            <h2 id={headingId} className="text-display-md text-fg">
              {heading}
            </h2>
            {description && <p className="mt-4 max-w-[56ch] text-lead text-body">{description}</p>}
          </div>
          <div className="lg:col-span-8">{children}</div>
        </div>
      </Container>
    </Section>
  );
}
