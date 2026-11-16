/**
 * What is left of the homepage Opening in version 2: the film's file table
 * and one tiny head script.
 *
 * The stage, the title card, "Skip intro" and the settle animation are gone.
 * The hero still paints first and HeroController fades the film in over it
 * after hydration. Two contracts with the rest of the site remain:
 * - `window.__csHero` ({ intro, file, autoplay, state }) exists from the
 *   first byte; the preview ribbon reads it and HeroController updates it.
 * - `cs:intro-done` is dispatched on document once, at the window's load
 *   event, for anything that waits for the Opening to finish.
 *
 * The script is a plain ES5 string (no build step touches it) and is
 * unit-tested in node:vm by tests/intro-script.test.ts.
 */
import variants from "../../public/videos/hero/variants.json";
import { toSources, type HeroSource } from "@/lib/hero-controller";

/** Every playable cut of the film, in try order (public/videos/hero/variants.json). */
export const HERO_SOURCES: HeroSource[] = toSources(variants);

/** The head script, as rendered by IntroHead on every page. */
export const INTRO_SCRIPT =
  '(function(w,d){w.__csHero=w.__csHero||{intro:"none",file:"none",autoplay:"n/a",state:"idle"};' +
  'var f=0;function done(){if(f)return;f=1;try{d.dispatchEvent(new Event("cs:intro-done"))}catch(e){}}' +
  'if(d.readyState==="complete")setTimeout(done,0);else w.addEventListener("load",done)})(window,document);';
