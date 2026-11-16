import { InlineScript } from "@/components/ui/InlineScript";
import { INTRO_SCRIPT } from "@/lib/intro";

/**
 * The Opening's head script (src/lib/intro.ts), rendered in <head> on every
 * page. It runs before the first paint on hard loads only; off the homepage
 * it records "ineligible:path" and does nothing else.
 */
export default function IntroHead() {
  return <InlineScript id="cs-intro" html={INTRO_SCRIPT} />;
}
