"use client";

import { useEffect, useState } from "react";
import DecorSprite from "@/components/pixel/DecorSprite";
import { nightness, useDayNight, useReducedMotion } from "./dayNight";

/**
 * Everything that lives in the sky above the horizon:
 * - detailed pixel clouds drifting (dimmed after dark)
 * - a hot air balloon on a slow crossing
 * - a regular banner plane flyby (daytime only)
 * - the sun and moon arcing with the day/night cycle
 * Decorative only; the canvas starfield itself lives in WaveCanvas.
 */

const CLOUDS = [
  { kind: "cloud0" as const, top: "24%", duration: 90, delay: -30 },
  { kind: "cloud1" as const, top: "56%", duration: 130, delay: -85 },
  { kind: "cloud2" as const, top: "6%", duration: 160, delay: -50 },
];

type Flyby = { key: number; top: number };

export default function SkyLife() {
  const { t, night } = useDayNight();
  const reduce = useReducedMotion();
  const [plane, setPlane] = useState<Flyby | null>(null);

  // frequent daytime banner-plane flyby
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];
    const schedule = () => {
      timeouts.push(
        setTimeout(() => {
          if (!alive) return;
          // planes don't fly at night — try again later
          if (nightNow() > 0.4) {
            schedule();
            return;
          }
          setPlane({ key: Date.now(), top: 8 + Math.random() * 26 });
          timeouts.push(
            setTimeout(() => {
              if (!alive) return;
              setPlane(null);
              schedule();
            }, 26_000)
          );
        }, 8_000 + Math.random() * 18_000)
      );
    };
    schedule();
    return () => {
      alive = false;
      timeouts.forEach(clearTimeout);
    };
  }, [reduce]);

  const day = 1 - night;
  const dimStyle = {
    opacity: 1 - 0.45 * night,
    filter: `brightness(${1 - 0.45 * night})`,
    transition: "opacity 2.5s linear, filter 2.5s linear",
  };

  // sun rides t ∈ [0, 0.5), moon t ∈ [0.5, 1) — both arc over the sky band
  const sunP = t < 0.5 ? t / 0.5 : null;
  const moonP = t >= 0.5 ? (t - 0.5) / 0.5 : null;
  const arc = (p: number) => ({
    left: `${6 + p * 86}%`,
    top: `${58 - 40 * Math.sin(Math.PI * p)}%`,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[42%]"
    >
      {/* sun + moon */}
      {sunP !== null && (
        <div
          className="absolute"
          style={{
            ...arc(sunP),
            opacity: Math.min(1, Math.sin(Math.PI * sunP) * 3) * day,
            transition: "left 1.2s linear, top 1.2s linear, opacity 2s linear",
          }}
        >
          <DecorSprite kind="sun" />
        </div>
      )}
      {moonP !== null && (
        <div
          className="absolute"
          style={{
            ...arc(moonP),
            opacity: Math.min(1, Math.sin(Math.PI * moonP) * 3) * night,
            transition: "left 1.2s linear, top 1.2s linear, opacity 2s linear",
          }}
        >
          <DecorSprite kind="moon" />
        </div>
      )}

      {/* drifting clouds */}
      {CLOUDS.map((c) => (
        <div
          key={c.kind}
          className="cloud absolute left-0"
          style={{
            top: c.top,
            animation: reduce
              ? undefined
              : `cloud-drift ${c.duration}s linear infinite`,
            animationDelay: reduce ? undefined : `${c.delay}s`,
          }}
        >
          <DecorSprite kind={c.kind} style={dimStyle} />
        </div>
      ))}

      {/* hot air balloon on a slow crossing */}
      <div
        className="cloud absolute left-0 top-[26%]"
        style={
          reduce
            ? { left: "70%" }
            : { animation: "cloud-drift 110s linear infinite", animationDelay: "-30s" }
        }
      >
        <div className="animate-bob-slow" style={{ animationDuration: "6s" }}>
          <DecorSprite
            kind="balloon"
            style={{ opacity: day, transition: "opacity 2.5s linear" }}
          />
        </div>
      </div>

      {/* banner plane flyby */}
      {plane && (
        <div
          key={plane.key}
          className="absolute left-0"
          style={{ top: `${plane.top}%`, animation: "fly-across 26s linear forwards" }}
        >
          <DecorSprite kind="plane" />
        </div>
      )}
    </div>
  );
}

/** Current nightness without subscribing — for scheduling decisions only. */
const nightNow = () => nightness(Date.now());
