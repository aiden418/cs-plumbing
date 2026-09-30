import type { FAQ } from "@/lib/types";

/** Plain <details> FAQ list — server-rendered, same look as the /builders FAQ. */
export default function FaqAccordionList({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {faqs.map((faq) => (
        <details key={faq.question} className="group overflow-hidden rounded-xl border border-gray-200 bg-white">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left text-base font-semibold text-gray-900 transition-colors hover:text-primary sm:px-6 sm:py-5 sm:text-lg">
            <span className="pr-4">{faq.question}</span>
            <svg
              className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-5 pb-5 leading-relaxed text-gray-600 sm:px-6 sm:pb-6">{faq.answer}</div>
        </details>
      ))}
    </div>
  );
}
