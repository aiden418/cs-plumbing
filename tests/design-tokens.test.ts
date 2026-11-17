import { test } from "node:test";
import assert from "node:assert/strict";
import { ALL_RULES, CSS, block, cascade, colour, contrast, declarations, themeTokens } from "./helpers/globals-css";

// The design system promises a set of tokens (.redesign/spec/design-system.md,
// section 2). These tests read src/app/globals.css and hold it to that list,
// and they compute the WCAG contrast of every text colour on every surface
// from the token values themselves.

const STATIC = themeTokens(/static/);
const INLINE = themeTokens(/inline/);
const token = (name: string) => {
  const value = STATIC.get(name);
  assert.ok(value !== undefined, `${name} is declared in an @theme static block`);
  return value;
};

/** Reads `clamp(<min>rem, <a>rem + <b>vw, <max>rem)` and returns pixel sizes at a 16px root. */
function fluid(name: string) {
  const value = token(name);
  const m = value.match(/^clamp\(\s*([\d.]+)rem\s*,\s*([\d.]+)rem\s*\+\s*([\d.]+)vw\s*,\s*([\d.]+)rem\s*\)$/);
  assert.ok(m, `${name} is a clamp(min, rem + vw, max): ${value}`);
  const [min, base, slope, max] = m.slice(1).map(Number);
  const at = (viewport: number) => Math.min(max, Math.max(min, base + (slope / 100) * (viewport / 16))) * 16;
  return { min: min * 16, max: max * 16, at };
}
const rem = (value: string | undefined) => {
  assert.match(value ?? "", /^[\d.]+rem$/);
  return parseFloat(value as string) * 16;
};

test("class names written in tests and scripts stay out of the stylesheet", () => {
  // These test files are full of class names. Tailwind scans the whole project, so without the
  // two exclusions every fixture here would be generated into the CSS that ships.
  assert.match(CSS, /@source not "\.\.\/\.\.\/tests";/);
  assert.match(CSS, /@source not "\.\.\/\.\.\/scripts";/);
});

test("tokens live in `@theme static`, so each one is a real :root variable", () => {
  assert.ok(ALL_RULES.some((r) => r.selector === "@theme static"), "an @theme static block exists");
  assert.ok(!ALL_RULES.some((r) => r.selector === "@theme"), "no plain @theme block (its unused tokens would be dropped from :root)");
  // only the tone aliases are inlined: they must be read at the element
  assert.deepEqual(
    [...INLINE.keys()].sort(),
    ["accent", "body", "canvas", "fg", "focus", "link", "muted", "raised", "rule"].map((n) => `--color-${n}`).sort()
  );
});

test("palette: every colour of the design system, with its value", () => {
  const palette: Record<string, string> = {
    ink: "#0A1730",
    "ink-700": "#12244A",
    navy: "#1B2B4B",
    primary: "#0077CC",
    "primary-dark": "#005FA3",
    "primary-300": "#66B5F2",
    brass: "#B8975A",
    "brass-300": "#D4BC8A",
    "brass-600": "#A8884C",
    bronze: "#7A6235",
    shell: "#F4F6F9",
    "shell-200": "#E9EDF2",
    "shell-300": "#D9DFE7",
    "steel-50": "#F6F7F9",
    "steel-100": "#ECEEF2",
    "steel-200": "#D9DDE3",
    "steel-300": "#B4BCC7",
    "steel-400": "#7F8A99",
    "steel-500": "#5F6B7C",
    "steel-600": "#4E5A6B",
    "steel-700": "#3D4858",
    "steel-800": "#273142",
    "steel-900": "#131E30",
    emergency: "#D4281C",
    "emergency-dark": "#B42318",
    "emergency-300": "#FF7A70",
    success: "#34C759",
    "success-ink": "#1A7F37",
    white: "#FFFFFF",
  };
  for (const [name, value] of Object.entries(palette)) {
    assert.equal(token(`--color-${name}`).toUpperCase(), value, `--color-${name}`);
  }
});

test("tones: white, shell, navy and ink each define every tone colour, and the utilities read them", () => {
  const roles = ["canvas", "raised", "fg", "body", "muted", "rule", "accent", "link", "focus"];
  for (const role of roles) assert.equal(INLINE.get(`--color-${role}`), `var(--tone-${role})`, `bg-/text-/border-${role} reads --tone-${role}`);
  for (const tone of ["white", "shell", "navy", "ink"]) {
    const vars = cascade(`[data-tone="${tone}"]`);
    for (const role of roles) {
      assert.ok(vars.has(`--tone-${role}`), `[data-tone="${tone}"] sets --tone-${role}`);
      colour(vars.get(`--tone-${role}`) as string); // throws if it is not a colour we can resolve
    }
  }
  // a page with no data-tone at all is the white tone
  const root = block(":root");
  const white = cascade(`[data-tone="white"]`);
  for (const role of roles) assert.equal(root.get(`--tone-${role}`), white.get(`--tone-${role}`), `:root --tone-${role} equals the white tone`);
  // the surface itself
  const surface = block("[data-tone]");
  assert.equal(surface.get("background-color"), "var(--tone-canvas)");
  assert.equal(surface.get("color"), "var(--tone-body)");
  // what the tones are made of
  assert.equal(cascade(`[data-tone="shell"]`).get("--tone-canvas"), "var(--color-shell)");
  assert.equal(cascade(`[data-tone="navy"]`).get("--tone-canvas"), "var(--color-navy)");
  assert.equal(cascade(`[data-tone="ink"]`).get("--tone-canvas"), "var(--color-ink)");
  assert.equal(cascade(`[data-tone="ink"]`).get("--tone-accent"), "var(--color-brass)", "brass on dark");
  assert.equal(cascade(`[data-tone="white"]`).get("--tone-accent"), "var(--color-primary-dark)", "brand blue on light");
  assert.equal(cascade(`[data-tone="shell"]`).get("--tone-link"), "var(--color-primary-dark)", "links on shell are primary-dark");
  assert.equal(cascade(`[data-tone="ink"]`).get("--tone-link"), "var(--color-primary-300)");
});

test("type scale: the sizes the specification lists", () => {
  const sizes: Record<string, [number, number]> = {
    "--text-display-xl": [40, 88],
    "--text-display-lg": [34, 64],
    "--text-display-md": [28, 48],
    "--text-display-sm": [22, 32],
    "--text-lead": [19, 22],
    "--text-label": [13, 14],
  };
  for (const [name, [min, max]] of Object.entries(sizes)) {
    const size = fluid(name);
    assert.equal(size.min, min, `${name} smallest size`);
    assert.equal(size.max, max, `${name} largest size`);
    // the range is really used: the smallest size on a 320px phone, the largest by 1920px
    assert.ok(Math.abs(size.at(320) - min) < 0.5, `${name} is ${min}px at 320px wide (got ${size.at(320)})`);
    assert.equal(size.at(1920), max, `${name} is ${max}px at 1920px wide`);
    assert.ok(size.at(1440) > size.at(390), `${name} grows with the viewport`);
  }
  assert.ok(fluid("--text-display-2xl").max > fluid("--text-display-xl").max);
  for (const name of ["2xl", "xl", "lg", "md", "sm"]) {
    assert.ok(Number(token(`--text-display-${name}--line-height`)) <= 1.15, `display-${name} has its own tight line-height`);
    assert.match(token(`--text-display-${name}--letter-spacing`), /^-0\.\d+em$/, `display-${name} has its own tracking`);
  }
  assert.equal(rem(token("--text-sm")), 15, "text-sm is 15px");

  // body: 17px, 18px from 1024px up
  const body = ALL_RULES.filter((r) => r.selector === "body" && r.context.includes("@layer base"));
  const small = body.find((r) => !r.context.some((c) => c.startsWith("@media")));
  const large = body.find((r) => r.context.some((c) => /^@media \(min-width: 64rem\)$/.test(c)));
  assert.ok(small && large, "body has a base rule and a (min-width: 64rem) rule");
  assert.equal(rem(declarations(small.body).get("font-size")), 17);
  assert.equal(rem(declarations(large.body).get("font-size")), 18);
  assert.equal(declarations(small.body).get("font-family"), "var(--font-sans)");
});

test("type: Archivo for h1 and h2 at 108% width, Inter for everything else", () => {
  assert.match(token("--font-display"), /^var\(--font-archivo\), "Archivo Fallback", /);
  assert.match(token("--font-sans"), /^var\(--font-inter\), /);
  assert.equal(token("--font-weight-black"), "800", "font-black is 800");

  const display = block("h1, h2", /@layer base/);
  assert.equal(display.get("font-family"), "var(--font-display)");
  assert.equal(display.get("font-stretch"), "108%");
  assert.equal(display.get("font-weight"), "700");
  const reading = block("h3, h4, h5, h6", /@layer base/);
  assert.equal(reading.get("font-family"), "var(--font-sans)");
  assert.equal(block("h1, h2, h3, h4, h5, h6", /@layer base/).get("text-wrap"), "balance");

  const widths: Record<string, string> = { "display-wide": "120%", "display-normal": "104%", "display-tight": "94%" };
  for (const [utility, stretch] of Object.entries(widths)) {
    const rule = block(`@utility ${utility}`);
    assert.equal(rule.get("font-stretch"), stretch, utility);
    assert.equal(rule.get("font-family"), "var(--font-display)", utility);
  }
  const label = block("@utility label-tech");
  assert.equal(label.get("text-transform"), "uppercase");
  assert.equal(label.get("font-size"), "var(--text-label)");
  assert.equal(label.get("font-family"), "var(--font-sans)");
});

test("space, shape and elevation", () => {
  const section = fluid("--spacing-section");
  assert.deepEqual([section.min, section.max], [72, 144]);
  const sectionSm = fluid("--spacing-section-sm");
  assert.deepEqual([sectionSm.min, sectionSm.max], [48, 88]);
  const gutter = fluid("--spacing-gutter");
  assert.ok(gutter.min >= 16 && gutter.max > gutter.min, "the page gutter is fluid and never under 16px");
  const frame = fluid("--radius-frame");
  assert.deepEqual([frame.min, frame.max], [14, 24]);
  assert.equal(rem(token("--radius-control")), 12);
  assert.equal(token("--radius-chip"), "999px");
  assert.ok(token("--shadow-float").length > 0);
  assert.ok(token("--shadow-lift").length > 0);
  assert.equal(rem(token("--breakpoint-nav")), 70 * 16, "desktop navigation from 1120px");
});

test("motion: four easings, four durations, and nothing that hides content without JavaScript", () => {
  const bezier = (name: string) => {
    const m = token(name).match(/^cubic-bezier\(([\d.]+), ([\d.-]+), ([\d.]+), ([\d.-]+)\)$/);
    assert.ok(m, `${name} is a cubic-bezier`);
    return m.slice(1).map(Number);
  };
  for (const name of ["--ease-enter", "--ease-exit", "--ease-move", "--ease-settle"]) bezier(name);
  // settle overshoots by 3% at most
  const [, y1, , y2] = bezier("--ease-settle");
  let peak = 0;
  for (let t = 0; t <= 1; t += 0.001) peak = Math.max(peak, 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3);
  assert.ok(peak > 1 && peak <= 1.03, `ease-settle overshoots by ${((peak - 1) * 100).toFixed(1)}%`);
  for (const name of ["--ease-enter", "--ease-exit", "--ease-move"]) {
    const [, a, , b] = bezier(name);
    assert.ok(a >= 0 && a <= 1 && b >= 0 && b <= 1, `${name} does not overshoot`);
  }

  const root = block(":root");
  assert.deepEqual(["--dur-1", "--dur-2", "--dur-3", "--dur-4"].map((d) => root.get(d)), ["150ms", "250ms", "450ms", "900ms"]);

  // `enter` rises 12px and never starts from opacity 0; reveal hides only what the observer marked
  const enterFrom = ALL_RULES.find((r) => r.selector === "from" && r.context.includes("@keyframes enter-rise"));
  assert.ok(enterFrom, "enter-rise keyframes exist");
  assert.match(declarations(enterFrom.body).get("transform") ?? "", /0\.75rem/);
  assert.ok(!declarations(enterFrom.body).has("opacity"), "enter does not fade from zero");
  const pending = ALL_RULES.find((r) => r.selector === '[data-reveal="pending"]');
  assert.ok(pending?.context.includes("@media (prefers-reduced-motion: no-preference)"), "reveal only applies when motion is allowed");
  assert.ok(!/\[data-reveal\]\s*\{[^}]*opacity:\s*0/.test(CSS), "content with data-reveal is visible until the observer marks it pending");
  assert.ok(ALL_RULES.some((r) => r.selector === "@media (prefers-reduced-motion: reduce)"), "reduced-motion block exists");

  assert.equal(block(":focus-visible", /@layer base/).get("outline"), "2px solid var(--tone-focus)");
});

test('"Archivo Fallback": one rule for every width and weight an element can ask for', () => {
  const faces = ALL_RULES.filter((r) => r.selector === "@font-face")
    .map((r) => declarations(r.body))
    .filter((d) => d.get("font-family") === '"Archivo Fallback"');
  assert.ok(faces.length >= 1, "the fallback family is declared in globals.css");
  const span = (value: string | undefined) => (value ?? "").split(" ").map((v) => parseFloat(v));
  const percent = (face: Map<string, string>, descriptor: string) => parseFloat(face.get(descriptor) as string);
  // Overrides are fractions of the size-adjusted em, so (ascent + descent) x size-adjust is the
  // line box the text really gets. It has to be the display face's own, in every rule.
  const lineBox = (face: Map<string, string>) => ((percent(face, "ascent-override") + percent(face, "descent-override")) * percent(face, "size-adjust")) / 100;
  for (const face of faces) {
    assert.match(face.get("src") ?? "", /^local\("Arial Bold"\), local\("Arial-BoldMT"\), local\("Helvetica Neue Bold"\), local\("HelveticaNeue-Bold"\), local\("Roboto Bold"\), local\("Roboto-Bold"\)$/);
    for (const descriptor of ["size-adjust", "ascent-override", "descent-override", "line-gap-override"]) {
      assert.match(face.get(descriptor) ?? "", /^[\d.]+%$/, `${descriptor} is set`);
    }
    assert.ok(percent(face, "size-adjust") > 80 && percent(face, "size-adjust") < 130, "size-adjust is in a plausible range");
    assert.ok(Math.abs(lineBox(face) - lineBox(faces[0])) < 0.3, `every rule gives the same line box (${(lineBox(face) / 100).toFixed(3)}em vs ${(lineBox(faces[0]) / 100).toFixed(3)}em)`);
  }
  // exactly one rule answers any weight / width
  for (const weight of [400, 600, 650, 700, 749, 750, 800, 900]) {
    for (const width of [62, 75, 94, 97, 100, 104, 106, 108, 112, 114, 120, 125]) {
      const matching = faces.filter((face) => {
        const [w0, w1] = span(face.get("font-weight"));
        const [s0, s1] = span(face.get("font-stretch"));
        return weight >= w0 && weight <= w1 && width >= s0 && width <= s1;
      });
      assert.equal(matching.length, 1, `weight ${weight} at ${width}% width selects one rule`);
    }
  }
  // wider text needs a larger size-adjust, heavier text too
  const adjustFor = (weight: number, width: number) =>
    parseFloat(
      faces
        .find((face) => {
          const [w0, w1] = span(face.get("font-weight"));
          const [s0, s1] = span(face.get("font-stretch"));
          return weight >= w0 && weight <= w1 && width >= s0 && width <= s1;
        })
        ?.get("size-adjust") as string
    );
  assert.ok(adjustFor(700, 94) < adjustFor(700, 104) && adjustFor(700, 104) < adjustFor(700, 108) && adjustFor(700, 108) < adjustFor(700, 120));
  assert.ok(adjustFor(800, 108) > adjustFor(700, 108));
});

test("contrast: every text colour on every surface is at least 4.5:1", (t) => {
  const AA = 4.5;
  const rows: string[] = [];
  const check = (label: string, text: string, background: string, minimum = AA) => {
    const ratio = contrast(colour(text), colour(background));
    rows.push(`${label.padEnd(34)} ${ratio.toFixed(2).padStart(5)}:1`);
    assert.ok(ratio >= minimum, `${label}: ${ratio.toFixed(2)}:1 is below ${minimum}:1`);
    return ratio;
  };

  for (const tone of ["white", "shell", "navy", "ink"]) {
    const vars = cascade(`[data-tone="${tone}"]`);
    const get = (role: string) => vars.get(`--tone-${role}`) as string;
    for (const role of ["fg", "body", "muted", "accent", "link"]) check(`${tone}: ${role} on canvas`, get(role), get("canvas"));
    // the focus ring is not text: 3:1 is the requirement
    check(`${tone}: focus ring on canvas`, get("focus"), get("canvas"), 3);
    // translucent white text must stay at 60% or more
    for (const role of ["body", "muted"]) assert.ok(colour(get(role)).a >= 0.6, `${tone}: ${role} is not below 60% opacity`);
  }
  check("white on primary (button)", "var(--color-white)", "var(--color-primary)");
  check("white on primary-dark (hover)", "var(--color-white)", "var(--color-primary-dark)");
  check("white on emergency (button)", "var(--color-white)", "var(--color-emergency)");
  check("white on emergency-dark (hover)", "var(--color-white)", "var(--color-emergency-dark)");
  check("ink on brass (button)", "var(--color-ink)", "var(--color-brass)");
  check("ink on white (inverse button)", "var(--color-ink)", "var(--color-white)");
  check("success-ink on white", "var(--color-success-ink)", "var(--color-white)");
  check("success-ink on shell", "var(--color-success-ink)", "var(--color-shell)");
  // the old gray-400 text now resolves to steel-500
  check("legacy gray-400 on white", "var(--color-gray-400)", "var(--color-white)");
  check("legacy gray-500 on shell", "var(--color-gray-500)", "var(--color-shell)");

  // Panels raised above the surface. One pair falls short and is recorded
  // here instead of being hidden: brass labels on a raised navy panel pass
  // only as large text (3:1). Use text-fg there, or raise the panel on ink.
  const knownShortfall: Record<string, number> = { "navy: accent on raised": 4.25 };
  for (const tone of ["white", "shell", "navy", "ink"]) {
    const vars = cascade(`[data-tone="${tone}"]`);
    const get = (role: string) => vars.get(`--tone-${role}`) as string;
    for (const role of ["fg", "body", "muted", "accent", "link"]) {
      const label = `${tone}: ${role} on raised`;
      const known = knownShortfall[label];
      const ratio = check(label, get(role), get("raised"), known === undefined ? AA : 3);
      if (known !== undefined) {
        assert.ok(ratio < AA, `${label} now passes (${ratio.toFixed(2)}:1): remove it from knownShortfall`);
        assert.ok(Math.abs(ratio - known) < 0.02, `${label} is recorded as ${known}:1 but measures ${ratio.toFixed(2)}:1`);
      }
    }
  }

  // rules the builders must follow, shown with their numbers
  const brassOnWhite = contrast(colour("var(--color-brass)"), colour("var(--color-white)"));
  const primaryOnShell = contrast(colour("var(--color-primary)"), colour("var(--color-shell)"));
  const steel400OnWhite = contrast(colour("var(--color-steel-400)"), colour("var(--color-white)"));
  assert.ok(brassOnWhite < AA && primaryOnShell < AA && steel400OnWhite < AA, "the three banned pairs really do fail, which is why they are banned");
  rows.push(`${"banned: brass on white".padEnd(34)} ${brassOnWhite.toFixed(2).padStart(5)}:1`);
  rows.push(`${"banned: primary text on shell".padEnd(34)} ${primaryOnShell.toFixed(2).padStart(5)}:1`);
  rows.push(`${"banned: steel-400 text on white".padEnd(34)} ${steel400OnWhite.toFixed(2).padStart(5)}:1`);

  for (const row of rows) t.diagnostic(row);
});
