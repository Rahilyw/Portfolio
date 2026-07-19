import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: same mini ocean scene at Apple's 180px size. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(180deg, #7dd3fc 0%, #38bdf8 55%, #0284c7 55%, #075985 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 28,
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "#fde047",
          }}
        />
        {[112, 136, 158].map((top, i) => (
          <div
            key={top}
            style={{
              position: "absolute",
              top,
              left: i % 2 ? 16 : 0,
              width: 180,
              height: 10,
              background: i % 2 ? "rgba(224,242,254,0.35)" : "rgba(224,242,254,0.22)",
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
