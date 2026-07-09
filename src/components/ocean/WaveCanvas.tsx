"use client";

import { useEffect, useRef } from "react";
import { nightness } from "./dayNight";

/**
 * Full-viewport pixel-art ocean, PS2-era style: the whole scene is rendered
 * into a low-resolution buffer (1 art pixel = PX css pixels) and upscaled
 * with nearest-neighbor, so every wave streak and shimmer is a chunky pixel.
 *
 * - Sky: discrete color bands blended with checkerboard dithering
 * - Water: depth bands + two layered traveling sine fields quantized into
 *   light streaks / dark troughs / white foam crests
 * - Shimmer: hash-based sparkle pixels that twinkle at a retro ~5fps
 * - Day/night: palettes blend on the shared 10-minute cycle (dayNight.ts),
 *   passing through a warm sunset wash; at night the sky fills with a
 *   hash-seeded twinkling starfield
 */

const PX = 5; // css pixels per art pixel
/** Fraction of viewport height where sky meets sea — shared with Surfer so the rider stays in the water. */
export const HORIZON = 0.42;

type RGB = [number, number, number];

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

// day palettes
const SKY_D: RGB[] = ["#2e63f7", "#2f77f5", "#2f8cee", "#39a2e6", "#4db8e0"].map(hex);
const SEA_D: RGB[] = ["#1e63c8", "#2b7fd4", "#2fa3d8", "#37c4d4", "#45d8c8"].map(hex);
const SEA_LIGHT_D: RGB[] = ["#2b7fd4", "#2fa3d8", "#4fc9de", "#5fdcd8", "#7ce8d4"].map(hex);
const SEA_DARK_D: RGB[] = ["#174f9e", "#1e63c8", "#2b7fd4", "#2fa3c0", "#37c4b4"].map(hex);
const FOAM_D: RGB = hex("#e9fbff");
const SPARKLE_D: RGB = hex("#ffffff");
const HORIZON_D: RGB = hex("#1b55a8");

// night palettes
const SKY_N: RGB[] = ["#050a24", "#081130", "#0c1a40", "#12234e", "#1a2f5c"].map(hex);
const SEA_N: RGB[] = ["#0a1c46", "#0e2654", "#123260", "#173e62", "#1d4a60"].map(hex);
const SEA_LIGHT_N: RGB[] = ["#14305e", "#1a3c6c", "#224c74", "#2a5a74", "#356a72"].map(hex);
const SEA_DARK_N: RGB[] = ["#060f30", "#0a1c46", "#0e2654", "#122e4e", "#173846"].map(hex);
const FOAM_N: RGB = hex("#a8bfd8");
const SPARKLE_N: RGB = hex("#e8f0fa");
const HORIZON_N: RGB = hex("#081432");

// sunset wash, strongest mid-transition (indigo top → amber horizon)
const SKY_DUSK: RGB[] = ["#3e3f8f", "#7c4f9e", "#c95d84", "#f07a5a", "#ffb257"].map(hex);
const DUSK_GLINT: RGB = hex("#ff9a5e");
const STAR: RGB = hex("#ebf0ff");

const mixRGB = (a: RGB, b: RGB, u: number): RGB => [
  a[0] + (b[0] - a[0]) * u,
  a[1] + (b[1] - a[1]) * u,
  a[2] + (b[2] - a[2]) * u,
];

// integer hash → [0, 1023]
const hash = (x: number, y: number, t: number) => {
  let h = x * 374761393 + y * 668265263 + t * 1274126177;
  h = (h ^ (h >> 13)) * 1103515245;
  return (h ^ (h >> 16)) & 1023;
};

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    let img: ImageData | null = null;

    const resize = () => {
      w = Math.ceil(canvas.offsetWidth / PX);
      h = Math.ceil(canvas.offsetHeight / PX);
      canvas.width = w;
      canvas.height = h;
      img = ctx.createImageData(w, h);
    };

    const draw = (t: number) => {
      if (!img) return;
      const data = img.data;
      const horizonY = Math.floor(h * HORIZON);
      const tq = Math.floor(t * 5); // quantized time for retro twinkle

      // day/night blend for this frame (shared wall-clock cycle)
      const n = nightness(Date.now());
      const dusk = Math.sin(Math.PI * n); // peaks mid-transition
      const SKY = SKY_D.map((c, i) =>
        mixRGB(mixRGB(c, SKY_N[i], n), SKY_DUSK[i], dusk * 0.6)
      );
      const SEA = SEA_D.map((c, i) => mixRGB(c, SEA_N[i], n));
      const SEA_LIGHT = SEA_LIGHT_D.map((c, i) =>
        mixRGB(mixRGB(c, SEA_LIGHT_N[i], n), DUSK_GLINT, dusk * 0.3)
      );
      const SEA_DARK = SEA_DARK_D.map((c, i) => mixRGB(c, SEA_DARK_N[i], n));
      const FOAM = mixRGB(FOAM_D, FOAM_N, n);
      const SPARKLE = mixRGB(SPARKLE_D, SPARKLE_N, n);
      const HORIZON_LINE = mixRGB(mixRGB(HORIZON_D, HORIZON_N, n), DUSK_GLINT, dusk * 0.35);

      for (let y = 0; y < h; y++) {
        const rowOff = y * w * 4;

        if (y < horizonY) {
          // ----- sky: banded gradient with dither between bands -----
          const pos = (y / horizonY) * (SKY.length - 1);
          const band = Math.floor(pos);
          const frac = pos - band;
          for (let x = 0; x < w; x++) {
            // checkerboard dither in the transition zone between bands
            const useNext =
              frac > 0.5 && (x + y) % 2 === 0 && band < SKY.length - 1 ? 1 : 0;
            const c = SKY[Math.min(band + useNext, SKY.length - 1)];
            let r = c[0];
            let gr = c[1];
            let b = c[2];

            // starfield fades in with the night — static positions, slow twinkle
            if (n > 0.02) {
              const s = hash(x, y, 4099);
              if (s < 3) {
                const tw = 0.5 + 0.5 * (hash(x, y, 977 + (tq >> 2)) / 1023);
                const u = n * tw * (s === 0 ? 1 : 0.7);
                r += (STAR[0] - r) * u;
                gr += (STAR[1] - gr) * u;
                b += (STAR[2] - b) * u;
              }
            }

            const i = rowOff + x * 4;
            data[i] = r;
            data[i + 1] = gr;
            data[i + 2] = b;
            data[i + 3] = 255;
          }
        } else if (y < horizonY + 2) {
          // ----- horizon line -----
          for (let x = 0; x < w; x++) {
            const i = rowOff + x * 4;
            data[i] = HORIZON_LINE[0];
            data[i + 1] = HORIZON_LINE[1];
            data[i + 2] = HORIZON_LINE[2];
            data[i + 3] = 255;
          }
        } else {
          // ----- water -----
          const depth = (y - horizonY) / (h - horizonY); // 0 far → 1 near
          const pos = depth * (SEA.length - 1);
          const band = Math.floor(pos);
          const frac = pos - band;
          // waves get bigger and slower-looking closer to shore
          const rowScale = 0.5 + depth * 0.9;

          for (let x = 0; x < w; x++) {
            // two traveling sine fields make streaks that drift like swell
            const v =
              Math.sin(x * 0.32 * rowScale + t * 1.8 + y * 0.9) * 0.55 +
              Math.sin(x * 0.11 - t * 1.1 + y * 0.37) * 0.45 +
              Math.sin(y * 0.6 - t * 0.55) * 0.3;

            let c: RGB;
            const bi = Math.min(
              band + (frac > 0.5 && (x + y) % 2 === 0 ? 1 : 0),
              SEA.length - 1
            );
            if (v > 1.05) c = FOAM;
            else if (v > 0.55) c = SEA_LIGHT[bi];
            else if (v < -0.75) c = SEA_DARK[bi];
            else c = SEA[bi];

            // shimmer: sparse white pixels twinkling, densest mid-ocean
            const sparkleP = 4 + Math.floor(10 * Math.sin(Math.PI * depth));
            if (hash(x, y, tq) < sparkleP) c = SPARKLE;

            const i = rowOff + x * 4;
            data[i] = c[0];
            data[i + 1] = c[1];
            data[i + 2] = c[2];
            data[i + 3] = 255;
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let slowTick: ReturnType<typeof setInterval> | undefined;
    if (reduceMotion) {
      // static frame, but still follow the day/night cycle at a slow tick
      draw(0);
      slowTick = setInterval(() => draw(0), 10_000);
    } else {
      const start = performance.now();
      const loop = (now: number) => {
        if (!running) return;
        draw((now - start) / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (slowTick) clearInterval(slowTick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}
