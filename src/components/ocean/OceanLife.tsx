"use client";

import DecorSprite from "@/components/pixel/DecorSprite";
import { useReducedMotion } from "./dayNight";

/**
 * Sea life rendered inside the ocean band: a little sailboat that tacks
 * back and forth along the horizon. Decorative, never interactive,
 * disabled under reduced motion.
 */

export default function OceanLife() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* sailboat tacking along the horizon, behind the islands */}
      <div
        className="absolute left-0 top-[2%]"
        style={reduce ? { left: "12%" } : { animation: "sail-x 260s ease-in-out infinite" }}
      >
        <div style={reduce ? undefined : { animation: "sail-flip 260s linear infinite" }}>
          <div className="animate-bob-slow">
            <DecorSprite kind="sailboat" scale={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}
