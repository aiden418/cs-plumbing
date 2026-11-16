import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/business";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Frame from "@/components/ui/Frame";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import { Calendar, Phone } from "@/components/ui/icons";
import type { MediaRef } from "@/lib/media-types";

export interface CtaAction {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface CtaBandProps {
  title: string;
  /** Words appended to the title in the same colour. */
  accent?: string;
  eyebrow?: string;
  /** One line under the heading. */
  body?: ReactNode;
  /** The second action next to Call. Defaults to booking a service. */
  secondary?: CtaAction | null;
  /** Replaces the Call button (rare: the call is the primary action everywhere). */
  primary?: CtaAction;
  /** The hours line under the buttons (default true). */
  showHours?: boolean;
  /** A small line under the buttons, after the hours. */
  note?: ReactNode;
  align?: "left" | "center";
  /**
   * A photograph shown in a frame beside the words from lg up, where the
   * words then align left. Phones and tablets keep the plain band.
   */
  media?: MediaRef | null;
  id?: string;
  headingId?: string;
  className?: string;
}

const DEFAULT_SECONDARY: CtaAction = { label: "Book a Service", href: "/booking" };

/**
 * The closing band on ink: eyebrow, display heading, one line, Call (primary)
 * plus a second action, and the hours.
 */
export default function CtaBand({
  title,
  accent,
  eyebrow,
  body,
  secondary = DEFAULT_SECONDARY,
  primary,
  showHours = true,
  note,
  align = "center",
  media,
  id,
  headingId,
  className,
}: CtaBandProps) {
  const center = align === "center";
  const split = Boolean(media);
  const call: CtaAction = primary ?? {
    label: `Call ${BUSINESS.phone}`,
    href: BUSINESS.phoneHref,
    icon: <Phone className="size-5" />,
  };
  return (
    <Section tone="ink" id={id} labelledBy={headingId} className={className}>
      <Container>
        <div className={cn(split && "lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8")}>
        <Reveal className={cn("max-w-3xl", center && "mx-auto text-center", split && "lg:col-span-6 lg:mx-0 lg:text-left")}>
          {eyebrow && <Eyebrow className={cn("mb-5", center && "justify-center", split && "lg:justify-start")}>{eyebrow}</Eyebrow>}
          <h2 id={headingId} className="text-display-md text-fg">
            {title}
            {accent && <> {accent}</>}
          </h2>
          {body && <p className={cn("mt-5 max-w-[56ch] text-lead text-body", center && "mx-auto", split && "lg:mx-0")}>{body}</p>}
          <div className={cn("mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap", center && "sm:justify-center", split && "lg:justify-start")}>
            <Button href={call.href} size="lg" icon={call.icon} className="w-full sm:w-auto">
              {call.label}
            </Button>
            {secondary && (
              <Button
                href={secondary.href}
                variant="secondary"
                size="lg"
                icon={secondary.icon ?? <Calendar className="size-5" />}
                className="w-full sm:w-auto"
              >
                {secondary.label}
              </Button>
            )}
          </div>
          {(showHours || note) && (
            <div className="mt-6 space-y-1 text-sm text-muted">
              {showHours && <p>{BUSINESS.hours.open}</p>}
              {note && <p>{note}</p>}
            </div>
          )}
        </Reveal>
        {media && (
          <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
            <Frame media={media} aspect="3/2" sizes="(min-width: 1024px) 40vw, 1px" />
          </div>
        )}
        </div>
      </Container>
    </Section>
  );
}
