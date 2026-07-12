"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Shared day/night clock for the ocean scene. Pure function of wall-clock
 * time, so the canvas ocean and the DOM sprites stay in sync without any
 * shared state: 45 seconds of day, 45 seconds of night, with short
 * sunrise/sunset ramps between them.
 *
 * Cycle t: 0 = sunrise, 0.25 = high noon, 0.5 = sunset, 0.75 = deep night.
 */
export const CYCLE_MS = 90_000;

/** Ramp half-width as a fraction of the cycle (~4.5s each side). */
const RAMP = 0.05;

const smooth = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

/** Position in the cycle, 0..1. */
export const cycleT = (now: number) => (now % CYCLE_MS) / CYCLE_MS;

/** 0 = full day, 1 = full night. */
export function nightness(now: number): number {
  // triangle distance from the middle of the night (t = 0.75)
  const d = Math.abs(((cycleT(now) - 0.75 + 1.5) % 1) - 0.5);
  return 1 - smooth(0.25 - RAMP, 0.25 + RAMP, d);
}

/** Ticks once a second with the current cycle position and nightness. */
export function useDayNight() {
  // deterministic daytime default so SSR and first client render agree
  const [state, setState] = useState({ t: 0.25, night: 0 });
  useEffect(() => {
    const tick = () =>
      setState({ t: cycleT(Date.now()), night: nightness(Date.now()) });
    // first tick lands right after paint; transitions smooth the correction
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  return state;
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** True if the visitor prefers reduced motion (false during SSR). */
export function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const m = window.matchMedia(MOTION_QUERY);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false
  );
}
