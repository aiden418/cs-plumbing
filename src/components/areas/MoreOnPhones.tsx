import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "@/components/ui/icons";

/**
 * A long secondary list closed on phones behind one "Show all" row and open
 * as plain columns from 64rem (areas.css, .area-more). Native <details>: no
 * script, and everything inside is in the server HTML.
 */
export default function MoreOnPhones({
  summary,
  children,
  className,
}: {
  /** The phone row's label, e.g. "Show all 8 cities". */
  summary: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("area-more", className)}>
      <summary className="area-more-summary">
        <span>{summary}</span>
        <ChevronDown className="area-more-icon size-5" aria-hidden="true" />
      </summary>
      <div className="pt-2 lg:pt-0">{children}</div>
    </details>
  );
}

/**
 * The hero keeps a lead of about three lines on desktop: a longer one keeps
 * its first sentence there and the rest, word for word, opens the first
 * section below. Returns [hero part, rest or null].
 */
export function splitLead(text: string, max = 150): [string, string | null] {
  if (text.length <= max) return [text, null];
  // Sentence ends: . ! ? followed by a space and a capital letter or digit.
  const ends = [...text.matchAll(/[.!?](?=\s+[A-Z0-9])/g)].map((m) => m.index + 1);
  // The first one or two sentences, as long as they say something (40+ characters).
  const cut = ends.find((end, i) => i < 2 && end >= 40 && end < text.length - 1);
  if (cut === undefined) return [text, null];
  return [text.slice(0, cut), text.slice(cut).trim()];
}
