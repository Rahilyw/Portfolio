"use client";

import { useEffect, useState } from "react";
import {
  drawSpriteCanvas,
  drawSplashSheet,
  SPRITE_SIZES,
  SPLASH_FRAMES,
  DISPLAY_SCALE,
  type SpriteVariant,
} from "@/components/pixel/islandArt";

/** ms per splash frame — a slow, lapping cadence. */
const SPLASH_FRAME_MS = 150;

/**
 * Floating sprites ride the swell: the ARTWORK layer rocks or bobs while the
 * splash layer stays pinned to the waterline, so the foam reads as water the
 * sprite moves through rather than a decal glued to it. Islands are land —
 * they hold still and let the surf provide the motion.
 */
const FLOAT_MOTION: Partial<Record<SpriteVariant, string>> = {
  ship: "animate-ship-rock",
  bottle: "animate-bottle",
  whale: "animate-bob-slow",
};

/**
 * Detailed pixel-art scenery sprites — islands, the pirate ship, the message
 * bottle, and the whale. Painted procedurally on the client (see islandArt.ts)
 * and upscaled nearest-neighbor for the chunky look.
 *
 * Each sprite carries an animated surf layer: an 8-frame hard-pixel splash
 * sheet playing on a CSS steps() loop, so waves lap and spurt against the
 * shore. Loops are desynced per variant so the coastline doesn't pulse in
 * unison.
 */
export default function IslandSprite({ variant }: { variant: SpriteVariant }) {
  const [art, setArt] = useState<{ sprite: string; splash: string } | null>(null);

  useEffect(() => {
    // paint on the next frame — canvas work needs the client, and deferring
    // keeps setState out of the synchronous effect body
    const id = requestAnimationFrame(() =>
      setArt({
        sprite: drawSpriteCanvas(variant).toDataURL(),
        splash: drawSplashSheet(variant).toDataURL(),
      })
    );
    return () => cancelAnimationFrame(id);
  }, [variant]);

  const [w, h] = SPRITE_SIZES[variant];
  const scale = DISPLAY_SCALE[variant];
  const dw = w * scale;
  const dh = h * scale;
  const sheetW = dw * SPLASH_FRAMES;
  const cycleS = (SPLASH_FRAMES * SPLASH_FRAME_MS) / 1000;
  // deterministic per-variant offset so shores don't splash in lockstep
  const desync = -((variant.length * 0.37) % cycleS);

  return (
    <div style={{ position: "relative", width: dw, height: dh }} aria-hidden="true">
      <style>{`
        @keyframes splash-${variant} {
          from { background-position: 0 0; }
          to { background-position: -${sheetW}px 0; }
        }
      `}</style>
      {art && (
        <>
          {/* artwork layer: floaters rock/bob on the swell, islands sit still */}
          <div
            className={FLOAT_MOTION[variant]}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${art.sprite})`,
              backgroundSize: `${dw}px ${dh}px`,
              imageRendering: "pixelated",
            }}
          />
          {/* surf layer: steps() hard-cuts one splash frame per tick; stays
              pinned to the waterline while the artwork above it moves */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${art.splash})`,
              backgroundSize: `${sheetW}px ${dh}px`,
              imageRendering: "pixelated",
              animation: `splash-${variant} ${cycleS}s steps(${SPLASH_FRAMES}) ${desync}s infinite`,
            }}
          />
        </>
      )}
    </div>
  );
}
