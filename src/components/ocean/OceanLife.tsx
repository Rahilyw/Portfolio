"use client";

import { useEffect, useState } from "react";
import DecorSprite from "@/components/pixel/DecorSprite";
import IslandSprite from "./IslandSprite";
import { useReducedMotion } from "./dayNight";

/**
 * Easter eggs that live in the water, rendered inside the ocean band:
 * - a little sailboat that tacks back and forth along the horizon
 * - a shark fin that cuts across at random (either direction, facing the
 *   way it swims)
 * - a dolphin that porpoises across in leaping arcs
 * - and, if you wait long enough, a whale surfaces for a breather
 * All decorative, never interactive, disabled under reduced motion.
 */

type Crossing = { key: number; top: number; dir: 1 | -1; dur: number };
type Surfacing = { key: number; left: number; top: number };

/** Schedules a recurring appear/disappear loop with randomized delays. */
function useAppearances<T>(
  make: () => { value: T; visibleMs: number },
  delayRange: [number, number]
) {
  const [current, setCurrent] = useState<T | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    const schedule = () => {
      const delay = delayRange[0] + Math.random() * (delayRange[1] - delayRange[0]);
      timeouts.push(
        setTimeout(() => {
          if (!alive) return;
          const { value, visibleMs } = make();
          setCurrent(value);
          timeouts.push(
            setTimeout(() => {
              if (!alive) return;
              setCurrent(null);
              schedule();
            }, visibleMs)
          );
        }, delay)
      );
    };
    schedule();

    return () => {
      alive = false;
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return current;
}

export default function OceanLife() {
  const reduce = useReducedMotion();

  const shark = useAppearances<Crossing>(
    () => {
      const dur = 10 + Math.random() * 4;
      return {
        value: {
          key: Date.now(),
          top: 32 + Math.random() * 40,
          dir: Math.random() < 0.5 ? 1 : -1,
          dur,
        },
        visibleMs: dur * 1000,
      };
    },
    [12_000, 38_000]
  );

  const dolphin = useAppearances<Crossing>(
    () => ({
      value: { key: Date.now(), top: 26 + Math.random() * 34, dir: 1, dur: 9 },
      visibleMs: 9000,
    }),
    [22_000, 60_000]
  );

  const whale = useAppearances<Surfacing>(
    () => ({
      value: { key: Date.now(), left: 10 + Math.random() * 55, top: 10 + Math.random() * 22 },
      visibleMs: 16_000,
    }),
    [90_000, 210_000]
  );

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

      {/* whale surfacing for air (rare) */}
      {whale && (
        <div
          key={whale.key}
          className="absolute"
          style={{
            left: `${whale.left}%`,
            top: `${whale.top}%`,
            animation: "whale-surface 16s ease-in-out forwards",
          }}
        >
          <IslandSprite variant="whale" />
        </div>
      )}

      {/* shark fin cutting across */}
      {shark && (
        <div
          key={shark.key}
          className="absolute left-0"
          style={{
            top: `${shark.top}%`,
            animation: `${shark.dir === 1 ? "fin-glide" : "fin-glide-rev"} ${shark.dur}s linear forwards`,
          }}
        >
          <div className="animate-bob" style={{ animationDuration: "1.8s" }}>
            <DecorSprite kind="sharkFin" flip={shark.dir === -1} />
          </div>
        </div>
      )}

      {/* dolphin porpoising across in arcs */}
      {dolphin && (
        <div
          key={dolphin.key}
          className="absolute left-0"
          style={{ top: `${dolphin.top}%`, animation: "dolphin-arc 9s ease-in-out forwards" }}
        >
          <DecorSprite kind="dolphin" />
        </div>
      )}
    </div>
  );
}
