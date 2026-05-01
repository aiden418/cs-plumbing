import type { AnswerBlock } from "@/lib/types";

export default function AnswerBlocks({ blocks }: { blocks: AnswerBlock[] }) {
  if (!blocks?.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: blocks.map((b) => ({
      "@type": "Question",
      name: b.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: b.detail ? `${b.answer} ${b.detail}` : b.answer,
      },
    })),
  };

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-block text-primary text-xs font-semibold tracking-widest uppercase mb-2">
            Quick Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            What homeowners ask us first
          </h2>
        </div>
        <div className="grid gap-4 sm:gap-5">
          {blocks.map((block) => (
            <div
              key={block.question}
              className="rounded-xl border border-gray-200 bg-[#F5F5F7] p-5 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                {block.question}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                <span className="font-semibold text-gray-900">{block.answer}</span>
                {block.detail ? (
                  <span className="text-gray-600"> {block.detail}</span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
