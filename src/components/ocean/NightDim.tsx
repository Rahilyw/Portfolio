"use client";

import { useDayNight } from "./dayNight";

/**
 * Dims its children in step with the day/night cycle so DOM sprites
 * (islands, sea life) settle into the darkened ocean instead of glowing
 * daylight-bright over a midnight sea.
 */
export default function NightDim({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { night, live } = useDayNight();
  return (
    <div
      className={className}
      style={{
        filter: `brightness(${1 - 0.38 * night}) saturate(${1 - 0.22 * night})`,
        // no transition until the clock is live — a remount snaps straight to
        // the current dimness instead of fading in from daylight
        transition: live ? "filter 2.5s linear" : "none",
      }}
    >
      {children}
    </div>
  );
}
