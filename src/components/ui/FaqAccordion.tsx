import { useId } from "react";
import { cn } from "@/lib/utils";

interface FaqAccordionProps {
  faqs: { question: string; answer: string }[];
  className?: string;
  /**
   * Group name for the native exclusive accordion: opening one answer closes
   * the others with the same name. Defaults to one group per accordion.
   */
  name?: string;
}

/**
 * Questions and answers as native <details name> rows. Every answer is in
 * the server HTML (search engines and Find in page see it; it works without
 * JavaScript). Hairline rows, a plus that turns into a minus. Where the
 * browser supports ::details-content and interpolate-size the answer slides
 * open; elsewhere it opens instantly. The FAQPage JSON-LD stays in the page.
 *
 * No hooks besides useId and no handlers, so it renders the same HTML from a
 * server page or inside a client component.
 */
export default function FaqAccordion({ faqs, className, name }: FaqAccordionProps) {
  // Any characters are fine in a name attribute.
  const fallbackName = `faq-${useId()}`;
  const group = name ?? fallbackName;
  return (
    <div className={cn("border-b border-rule", className)}>
      {faqs.map((faq, index) => (
        <details
          key={index}
          name={group}
          className={cn(
            "group border-t border-rule [interpolate-size:allow-keywords]",
            "[&::details-content]:[block-size:0] [&::details-content]:overflow-clip",
            "[&::details-content]:transition-[block-size,content-visibility] [&::details-content]:duration-250 [&::details-content]:ease-move [&::details-content]:[transition-behavior:allow-discrete]",
            "open:[&::details-content]:[block-size:auto]",
            // The global reduced-motion rule matches elements, not this pseudo-element.
            "motion-reduce:[&::details-content]:transition-none",
          )}
        >
          <summary
            className={cn(
              "flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden",
              "text-[1.0625rem] leading-snug font-semibold text-fg hover:text-link sm:text-lg",
            )}
          >
            <span>{faq.question}</span>
            <span aria-hidden="true" className="relative size-5 shrink-0 text-accent">
              <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 bg-current" />
              <span className="absolute top-0 left-1/2 h-full w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-250 ease-move group-open:scale-y-0" />
            </span>
          </summary>
          <div className="max-w-[68ch] pr-11 pb-6 leading-relaxed text-body">
            <p>{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
