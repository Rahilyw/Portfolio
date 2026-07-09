"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { drawDecorCanvas, DECOR_SIZES, type DecorKind } from "./decorArt";

// data-URL cache — each sprite kind is painted once per session
const cache = new Map<DecorKind, string>();

/**
 * Renders one of the procedural decor sprites (decorArt.ts) with
 * nearest-neighbor upscaling. Directional sprites face right by default;
 * pass flip to send them left.
 */
export default function DecorSprite({
  kind,
  scale = 2,
  flip = false,
  className,
  style,
}: {
  kind: DecorKind;
  /** Art pixels → CSS pixels. */
  scale?: number;
  flip?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const [url, setUrl] = useState<string | null>(cache.get(kind) ?? null);

  useEffect(() => {
    // paint (or re-read the cache) on the next frame — canvas work needs the
    // client, and deferring keeps setState out of the synchronous effect body
    const id = requestAnimationFrame(() => {
      const u = cache.get(kind) ?? drawDecorCanvas(kind).toDataURL();
      cache.set(kind, u);
      setUrl(u);
    });
    return () => cancelAnimationFrame(id);
  }, [kind]);

  const [w, h] = DECOR_SIZES[kind];
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        width: w * scale,
        height: h * scale,
        backgroundImage: url ? `url(${url})` : undefined,
        backgroundSize: "100% 100%",
        imageRendering: "pixelated",
        transform: flip ? "scaleX(-1)" : undefined,
        ...style,
      }}
    />
  );
}
