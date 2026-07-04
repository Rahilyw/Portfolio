"use client";

import { useEffect, useRef } from "react";

/**
 * Full-viewport pixel-art ocean, PS2-era style: the whole scene is rendered
 * into a low-resolution buffer (1 art pixel = PX css pixels) and upscaled
 * with nearest-neighbor, so every wave streak and shimmer is a chunky pixel.
 *
 * - Sky: discrete color bands blended with checkerboard dithering
 * - Water: depth bands + two layered traveling sine fields quantized into
 *   light streaks / dark troughs / white foam crests
 * - Shimmer: hash-based sparkle pixels that twinkle at a retro ~5fps
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

const SKY: RGB[] = ["#2e63f7", "#2f77f5", "#2f8cee", "#39a2e6", "#4db8e0"].map(hex);
const SEA: RGB[] = ["#1e63c8", "#2b7fd4", "#2fa3d8", "#37c4d4", "#45d8c8"].map(hex);
const SEA_LIGHT: RGB[] = ["#2b7fd4", "#2fa3d8", "#4fc9de", "#5fdcd8", "#7ce8d4"].map(hex);
const SEA_DARK: RGB[] = ["#174f9e", "#1e63c8", "#2b7fd4", "#2fa3c0", "#37c4b4"].map(hex);
const FOAM: RGB = hex("#e9fbff");
const SPARKLE: RGB = hex("#ffffff");
const HORIZON_LINE: RGB = hex("#1b55a8");

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
            const i = rowOff + x * 4;
            data[i] = c[0];
            data[i + 1] = c[1];
            data[i + 2] = c[2];
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

    if (reduceMotion) {
      draw(0);
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
