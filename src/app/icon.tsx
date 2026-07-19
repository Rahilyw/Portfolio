import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser-tab favicon: a tiny flat ocean — sky, pixel sun, and sea. */
export default function Icon() {
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
            top: 4,
            right: 5,
            width: 9,
            height: 9,
            borderRadius: 2,
            background: "#fde047",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 21,
            left: 0,
            width: 32,
            height: 3,
            background: "rgba(224,242,254,0.5)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
