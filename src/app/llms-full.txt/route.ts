import { buildLlmsFullTxt } from "@/lib/llms";

// llms-full.txt — llms.txt plus the full plain text of every service, area,
// service+city, blog and project page. One fetch gives an AI engine the whole
// site without HTML, navigation or scripts. Built in src/lib/llms.ts.

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
