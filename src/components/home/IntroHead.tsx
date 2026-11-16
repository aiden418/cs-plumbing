import { InlineScript } from "@/components/ui/InlineScript";
import { INTRO_SCRIPT } from "@/lib/intro";

/**
 * The head script from src/lib/intro.ts, rendered in <head> on every page:
 * it creates `window.__csHero` and fires `cs:intro-done` once at load.
 */
export default function IntroHead() {
  return <InlineScript id="cs-intro" html={INTRO_SCRIPT} />;
}
