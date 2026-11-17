import { BUSINESS } from "@/lib/constants";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const BRAND_PRIMARY = "#0077CC";
const BRAND_PRIMARY_DARK = "#005FA3";
const TEXT_DARK = "#1D1D1F";
const TEXT_MUTED = "#86868B";

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
  const fonts = await ogFonts();
  const headline = fonts.length > 0 ? HEADLINE_FONT : undefined;
  const isEmergency = variant === "emergency";
  const accent = isEmergency ? "#FF3B30" : BRAND_PRIMARY;
  const accentDark = isEmergency ? "#C8261D" : BRAND_PRIMARY_DARK;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            display: "flex",
            height: 14,
            width: "100%",
            background: `linear-gradient(90deg, ${accent} 0%, ${accentDark} 100%)`,
          }}
        />

        {/* Decorative corner */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: accent,
            opacity: 0.08,
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "60px 72px",
            justifyContent: "space-between",
          }}
        >
          {/* Header: brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
                color: "white",
                fontFamily: headline,
                fontWeight: 800,
                fontSize: 26,
                letterSpacing: -1,
              }}
            >
              C&S
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: TEXT_DARK,
                  letterSpacing: -0.3,
                  lineHeight: 1.1,
                }}
              >
                C&S Plumbing of Lee
              </div>
              <div style={{ fontSize: 16, color: TEXT_MUTED, marginTop: 2 }}>
                csplumbinglee.com
              </div>
            </div>
          </div>

          {/* Title block */}
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
            {eyebrow ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontFamily: headline,
                  fontWeight: 600,
                  color: accent,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                {eyebrow}
              </div>
            ) : null}
            <div
              style={{
                fontSize: title.length > 60 ? 64 : title.length > 38 ? 76 : 88,
                fontFamily: headline,
                fontWeight: 800,
                color: TEXT_DARK,
                letterSpacing: -2,
                lineHeight: 1.04,
                display: "flex",
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: TEXT_MUTED,
                  marginTop: 22,
                  lineHeight: 1.35,
                  maxWidth: 920,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          {/* Footer trust strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #E8E8ED",
              paddingTop: 22,
            }}
          >
            <div style={{ display: "flex", gap: 28 }}>
              <span style={{ fontSize: 18, color: TEXT_DARK, fontWeight: 600 }}>
                Family owned and operated since 1998
              </span>
              <span style={{ fontSize: 18, color: TEXT_MUTED }}>•</span>
              <span style={{ fontSize: 18, color: TEXT_DARK, fontWeight: 600 }}>
                {`Licensed ${BUSINESS.license}`}
              </span>
              <span style={{ fontSize: 18, color: TEXT_MUTED }}>•</span>
              <span style={{ fontSize: 18, color: TEXT_DARK, fontWeight: 600 }}>
                {isEmergency ? "24/7 Emergency" : `${BUSINESS.rating.toFixed(1)} stars · ${BUSINESS.reviewCount}+ Reviews`}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize, ...(fonts.length > 0 ? { fonts } : {}) },
  );
}
