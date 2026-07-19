import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const alt = "Rahil Wijeyesekera — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Link-preview card: a flat pixel-art ocean scene matching the homepage —
 * sky band, sun, chunky wave stripes, and the name in a bordered chip.
 * Satori only supports flexbox, so everything is rectangles and circles.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(180deg, #7dd3fc 0%, #38bdf8 52%, #0284c7 52%, #075985 100%)",
          position: "relative",
        }}
      >
        {/* sun */}
        <div
          style={{
            position: "absolute",
            top: 64,
            right: 110,
            width: 110,
            height: 110,
            borderRadius: 12,
            background: "#fde047",
            boxShadow: "8px 8px 0 rgba(8,51,68,0.25)",
          }}
        />
        {/* wave stripes on the sea */}
        {[380, 440, 500, 560].map((top, i) => (
          <div
            key={top}
            style={{
              position: "absolute",
              top,
              left: i % 2 ? 60 : 0,
              width: 1200,
              height: 14,
              background: i % 2 ? "rgba(224,242,254,0.35)" : "rgba(224,242,254,0.22)",
            }}
          />
        ))}
        {/* name chip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "auto",
            marginTop: 150,
            padding: "44px 72px",
            background: "rgba(255,255,255,0.96)",
            border: "6px solid #083344",
            boxShadow: "12px 12px 0 rgba(8,51,68,0.45)",
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 700, color: "#0A2D4E", letterSpacing: -1 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 32, marginTop: 18, color: "#155e75" }}>{site.tagline}</div>
          <div style={{ fontSize: 26, marginTop: 26, color: "#e11d48", fontWeight: 700 }}>
            🏄 Surf around — click an island to explore
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
