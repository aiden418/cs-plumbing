import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const BRAND_PRIMARY = "#0077CC";
const BRAND_PRIMARY_DARK = "#005FA3";
const TEXT_DARK = "#1D1D1F";
const TEXT_MUTED = "#86868B";

export type OgVariant = "default" | "service" | "area" | "service-city" | "blog" | "emergency";

type OgInput = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  variant?: OgVariant;
};

export function createOgImage({ title, eyebrow, subtitle, variant = "default" }: OgInput) {
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
                fontWeight: 900,
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
                  fontWeight: 700,
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
                fontWeight: 900,
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
                Family-owned since 1997
              </span>
              <span style={{ fontSize: 18, color: TEXT_MUTED }}>•</span>
              <span style={{ fontSize: 18, color: TEXT_DARK, fontWeight: 600 }}>
                Licensed CFC1432485
              </span>
              <span style={{ fontSize: 18, color: TEXT_MUTED }}>•</span>
              <span style={{ fontSize: 18, color: TEXT_DARK, fontWeight: 600 }}>
                {isEmergency ? "24/7 Emergency" : "5.0 stars · 75+ Reviews"}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize },
  );
}
