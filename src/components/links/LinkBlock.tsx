import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Section, { type Tone } from "@/components/ui/Section";

/**
 * Section shell for a block of internal links (a LinkGrid and, optionally, a
 * closing link): eyebrow, heading, optional description, then children. The
 * same look as LinkSection, on any of the four tones, so the shared link
 * blocks (related posts, related city pages, builder city pages) can sit on
 * ink as well as on white or shell. A white section draws a hairline at its
 * top, so it parts from a white neighbour without a change of background.
 */
export default function LinkBlock({
  overline,
  heading,
  description,
  tone = "white",
  headingId,
  children,
}: {
  overline?: string;
  heading: string;
  description?: string;
  /** "surface" is the legacy name of the shell tone. */
  tone?: Tone | "surface";
  headingId?: string;
  children: ReactNode;
}) {
  const resolved: Tone = tone === "surface" ? "shell" : tone;
  return (
    <Section tone={resolved} spacing="sm" divider={resolved === "white"} labelledBy={headingId}>
      <Container>
        <div className="mb-8 max-w-2xl sm:mb-10">
          {overline && <Eyebrow className="mb-4">{overline}</Eyebrow>}
          <h2 id={headingId} className="text-display-md text-fg">
            {heading}
          </h2>
          {description && <p className="mt-4 max-w-[56ch] text-lead text-body">{description}</p>}
        </div>
        {children}
      </Container>
    </Section>
  );
}
