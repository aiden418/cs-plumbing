import { BUSINESS } from "@/lib/constants";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";


// The site's dark surface and its two accents (globals.css: ink, ink-700,
// brass-300). The emergency card swaps brass for the emergency red.
const INK = "#0A1730";
const INK_RAISED = "#12244A";
const BRASS = "#D4BC8A";
const RED = "#FF6B61";
const TEXT = "#FFFFFF";
const TEXT_SOFT = "#B9C4D9";
const TEXT_FAINT = "#8492AE";

/** The logo emblem (marlin and compass, transparent), scaled down for the cards. */
let emblemPromise: Promise<string | null> | null = null;
function ogEmblem(): Promise<string | null> {
  emblemPromise ??= readFile(join(process.cwd(), "src/assets/og", "logo-emblem.png"))
    .then((buf) => `data:image/png;base64,${buf.toString("base64")}`)
    .catch(() => null);
  return emblemPromise;
}

export type OgVariant = "default" | "service" | "area" | "service-city" | "blog" | "emergency";

/**
 * The site's headline face for the share cards. Without a font of its own the
 * image renderer has one weight (regular), so a "900" headline drew thin.
 * Three static cuts of Archivo (OFL, src/assets/fonts) are read once per
 * runtime instance; if they cannot be read the card falls back to the
 * built-in face instead of failing.
 */
const HEADLINE_FONT = "Archivo";
type OgFont = { name: string; data: ArrayBuffer; weight: 400 | 600 | 800; style: "normal" };
let fontsPromise: Promise<OgFont[]> | null = null;
function ogFonts(): Promise<OgFont[]> {
  // process.cwd() + a literal path is the form Next traces into the server
  // bundle, so the font files ship with every share-image route.
  const read = (file: string) =>
    readFile(join(process.cwd(), "src/assets/fonts", file)).then(
      (buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
    );
  fontsPromise ??= Promise.all([
    read("archivo-latin-800-normal.woff"),
    read("archivo-latin-600-normal.woff"),
    read("archivo-latin-400-normal.woff"),
  ])
    .then(([bold, semi, regular]): OgFont[] => [
      { name: HEADLINE_FONT, data: bold, weight: 800, style: "normal" },
      { name: HEADLINE_FONT, data: semi, weight: 600, style: "normal" },
      // Once any font is supplied the renderer uses it for all text, so the
      // regular cut is needed for the subtitle to stay lighter than the title.
      { name: HEADLINE_FONT, data: regular, weight: 400, style: "normal" },
    ])
    .catch(() => []);
  return fontsPromise;
}

type OgInput = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  variant?: OgVariant;
};

export async function createOgImage({ title, eyebrow, subtitle, variant = "default" }: OgInput) {
  const [fonts, emblem] = await Promise.all([ogFonts(), ogEmblem()]);
  const headline = fonts.length > 0 ? HEADLINE_FONT : undefined;
  const accent = variant === "emergency" ? RED : BRASS;
  // Sized so the longest titles on the site stay within three or four lines of the text column.
  const titleSize = title.length > 70 ? 46 : title.length > 48 ? 52 : title.length > 26 ? 62 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(120deg, ${INK} 0%, ${INK} 55%, ${INK_RAISED} 100%)`,
          fontFamily: headline ?? "system-ui, -apple-system, sans-serif",
          color: TEXT,
        }}
      >
        {/* Words: label, headline, one supporting line, then the address. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: emblem ? 760 : 1200,
            padding: "64px 28px 56px 72px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", width: 56, height: 3, background: accent, marginBottom: 28 }} />
            {eyebrow ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 21,
                  fontWeight: 600,
                  color: accent,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                {eyebrow}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                fontWeight: 800,
                letterSpacing: -1.5,
                lineHeight: 1.03,
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 25,
                  fontWeight: 400,
                  color: TEXT_SOFT,
                  marginTop: 24,
                  lineHeight: 1.4,
                  maxWidth: 620,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", fontSize: 20, fontWeight: 600 }}>
            <span style={{ color: TEXT }}>csplumbinglee.com</span>
            <span style={{ color: TEXT_FAINT, margin: "0 14px" }}>·</span>
            <span style={{ color: TEXT_FAINT, fontWeight: 400 }}>
              {variant === "emergency" ? `24/7 · ${BUSINESS.phone}` : `Family owned since ${BUSINESS.founded}`}
            </span>
          </div>
        </div>

        {/* The emblem, alone on the dark field. */}
        {emblem ? (
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", paddingRight: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={emblem} width={380} height={307} />
          </div>
        ) : null}
      </div>
    ),
    { ...ogImageSize, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
