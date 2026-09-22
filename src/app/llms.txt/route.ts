import { buildLlmsTxt } from "@/lib/llms";

// llms.txt — the AI-crawler manifest. Authored in src/lib/llms.ts alongside
// llms-full.txt so the two can never disagree about the site's inventory.

// Route handlers are dynamic by default in Next 15+; force static so this
// prerenders at build time and serves from the CDN.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
