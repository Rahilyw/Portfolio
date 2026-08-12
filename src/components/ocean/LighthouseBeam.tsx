"use client";

import { useDayNight } from "./dayNight";

/**
 * Rotating lighthouse beam, anchored on the lantern room of the lighthouse
 * sprite. Fades in with nightness on the shared day/night clock (same pattern
 * as NightDim) so the lamp only sweeps the map after dark.
 *
 * The sweep runs inside a scaleY-squashed plane so the rotation traces an
 * ellipse: the beam foreshortens when pointing up or down the map, which reads
 * as a light circling the flat sea rather than a windmill on the tower.
 */

// lantern-room center in display px: draw coords (48, 11.5) × DRAW_SCALE 1.25
// (96×72 paint space → 120×90 art grid) × DISPLAY_SCALE 2
const LAMP_X = 120;
const LAMP_Y = 29;
const BEAM_H = 72;

export default function LighthouseBeam() {
  const { night, live } = useDayNight();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: LAMP_X,
        top: LAMP_Y,
        width: 0,
        height: 0,
        opacity: night,
        // matches NightDim: no transition until the clock is live, so a
        // remount snaps to the current nightness instead of fading in
        transition: live ? "opacity 2.5s linear" : "none",
        pointerEvents: "none",
      }}
    >
      <style>{`
        /* One revolution at constant speed, but the beam only shows while it
           sweeps the sea in front of the tower (0° = right, 90° = down,
           180° = left). Across the upward half it fades out — gone "behind"
           the lighthouse — and fades back in on the far side, so it never
           rakes across the sky. */
        @keyframes lh-sweep {
          0%   { transform: rotate(0deg); opacity: 0; }
          6%   { transform: rotate(21.6deg); opacity: 1; }
          44%  { transform: rotate(158.4deg); opacity: 1; }
          50%  { transform: rotate(180deg); opacity: 0; }
          100% { transform: rotate(360deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lh-beam { animation: none !important; visibility: hidden; }
        }
      `}</style>

      {/* lamp halo — steady glow around the lantern room */}
      <div
        style={{
          position: "absolute",
          left: -28,
          top: -28,
          width: 56,
          height: 56,
          background:
            "radial-gradient(circle, rgba(255,214,80,0.55), rgba(255,214,80,0.18) 45%, transparent 70%)",
        }}
      />

      {/* squashed sweep plane */}
      <div style={{ position: "absolute", transform: "scaleY(0.55)" }}>
        <div
          className="lh-beam"
          style={{
            position: "absolute",
            left: 0,
            top: -BEAM_H / 2,
            width: "min(48vw, 620px)",
            height: BEAM_H,
            transformOrigin: "0 50%",
            background:
              "linear-gradient(90deg, rgba(255,222,120,0.5) 0%, rgba(255,214,80,0.26) 30%, rgba(255,214,80,0.1) 65%, transparent 95%)",
            clipPath: "polygon(0 46%, 100% 0%, 100% 100%, 0 54%)",
            animation: "lh-sweep 12s linear infinite",
          }}
        />
      </div>
    </div>
  );
}
