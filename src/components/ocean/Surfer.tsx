"use client";

import { useEffect, useRef, useState } from "react";
import { drawSurferSheet, FRAME_COUNT, FRAME_SIZE } from "@/components/pixel/surferSheet";
import { HORIZON } from "./WaveCanvas";

/** Nearest-neighbor display scale: 64px frames shown at 128px, crisp. */
const SCALE = 2;
/** ~60ms per frame — fast, arcade-fluid loop. */
const CYCLE_S = (FRAME_COUNT * 60) / 1000;
/** How far below the horizon line the rider's waterline is allowed to reach. */
const SEA_MARGIN = 40;
/** Smoothed horizontal velocity needed before the rider turns around. */
const TURN_THRESHOLD = 4;

const DISPLAY = FRAME_SIZE * SCALE;
const SHEET_W = FRAME_COUNT * DISPLAY;

/** Mini wake canvas — art pixels upscaled for chunky pixel look. */
const WAKE_PX = 3;
const WAKE_W = 30; // art pixels wide
const WAKE_H = 10;

function rnd(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Paints a small scrolling wake beneath the board. Speed and direction
 * from cursor velocity drive crest height, scroll rate, and foam density.
 */
function drawWake(
  ctx: CanvasRenderingContext2D,
  t: number,
  speed: number,
  dirX: number
) {
  const w = WAKE_W;
  const h = WAKE_H;
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const intensity = Math.min(1, speed / 18);
  const scroll = t * (2.2 + intensity * 4) * (dirX >= 0 ? 1 : -1);
  const amp = 0.35 + intensity * 0.9;

  for (let y = 0; y < h; y++) {
    const rowOff = y * w * 4;
    const depth = y / (h - 1);

    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const wave =
        Math.sin(nx * 6.2 + scroll + y * 0.55) * amp +
        Math.sin(nx * 11.5 - scroll * 1.4 + y * 0.3) * amp * 0.45;

      let r = 47;
      let g = 163;
      let b = 216;
      let a = 0;

      // crest band near the top — fades out toward bottom
      const crestY = 2.2 + wave * 2.2 + Math.sin(scroll * 0.8 + nx * 4) * 0.4;
      if (y >= crestY - 0.5 && y <= crestY + 2.8) {
        const crestT = 1 - Math.abs(y - crestY) / 2.5;
        if (crestT > 0.15) {
          a = (0.55 + intensity * 0.4) * crestT * (1 - depth * 0.35);
          if (crestT > 0.7 && intensity > 0.25) {
            r = 233;
            g = 251;
            b = 255;
          } else if (crestT > 0.45) {
            r = 95;
            g = 220;
            b = 216;
          } else {
            r = 47;
            g = 163;
            b = 216;
          }
        }
      }

      // foam flecks when carving fast
      if (intensity > 0.2 && rnd(x * 17.3 + y * 9.1 + Math.floor(t * 8)) < 0.08 * intensity) {
        r = 255;
        g = 255;
        b = 255;
        a = Math.max(a, 0.5 + intensity * 0.4);
      }

      // soft dissolve at edges and bottom
      const edgeFade = Math.min(nx, 1 - nx) * 2.2;
      const bottomFade = 1 - depth * 0.85;
      a *= Math.min(1, edgeFade) * bottomFade;

      const i = rowOff + x * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = Math.round(a * 255);
    }
  }

  ctx.clearRect(0, 0, w * WAKE_PX, h * WAKE_PX);
  ctx.putImageData(img, 0, 0);
}

/**
 * The cursor-surfer mini-game: a 12-frame procedurally painted sprite sheet
 * (see surferSheet.ts) playing on a CSS steps() loop, riding a div that
 * chases the mouse with a slight physical lag.
 *
 * A small interactive wake canvas scrolls beneath the board — crests grow
 * and foam churns faster the harder you carve.
 */
export default function Surfer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wakeRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    setSheetUrl(drawSurferSheet().toDataURL());

    const wakeCanvas = wakeRef.current;
    const wakeCtx = wakeCanvas?.getContext("2d");
    if (wakeCanvas && wakeCtx) {
      wakeCanvas.width = WAKE_W;
      wakeCanvas.height = WAKE_H;
      wakeCtx.imageSmoothingEnabled = false;
    }

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let seen = false;
    let raf = 0;
    let velX = 0;
    let speed = 0;
    let facing = 1;
    let wakeT = 0;
    let lastNow = performance.now();

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!seen) {
        seen = true;
        pos.x = mouse.x;
        pos.y = mouse.y;
        setActive(true);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      wakeT += dt;

      const el = wrapRef.current;
      if (el && seen) {
        const seaTop = window.innerHeight * HORIZON + SEA_MARGIN;
        const targetY = Math.max(mouse.y, seaTop);

        const dx = mouse.x - pos.x;
        const dy = targetY - pos.y;
        pos.x += dx * 0.35;
        pos.y += dy * 0.35;

        velX = velX * 0.8 + dx * 0.2;
        speed = speed * 0.85 + Math.hypot(dx, dy) * 0.15;

        if (velX > TURN_THRESHOLD) facing = -1;
        else if (velX < -TURN_THRESHOLD) facing = 1;

        const tilt = Math.round(Math.max(-16, Math.min(16, dx * 0.5)) / 4) * 4;
        el.style.transform = `translate(${Math.round(pos.x)}px, ${Math.round(pos.y)}px) translate(-50%, -66%) rotate(${tilt}deg) scaleX(${facing})`;

        if (wakeCtx) {
          drawWake(wakeCtx, wakeT, speed, facing === -1 ? 1 : -1);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const wakeDisplayW = WAKE_W * WAKE_PX;
  const wakeDisplayH = WAKE_H * WAKE_PX;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 will-change-transform"
      style={{ visibility: active ? "visible" : "hidden" }}
    >
      <style>{`
        @keyframes surf-cycle {
          from { background-position: 0 0; }
          to { background-position: -${SHEET_W}px 0; }
        }
      `}</style>
      {sheetUrl && (
        <div
          style={{
            width: DISPLAY,
            height: DISPLAY,
            backgroundImage: `url(${sheetUrl})`,
            backgroundSize: `${SHEET_W}px ${DISPLAY}px`,
            imageRendering: "pixelated",
            animation: `surf-cycle ${CYCLE_S}s steps(${FRAME_COUNT}) infinite`,
          }}
        />
      )}
      <canvas
        ref={wakeRef}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: DISPLAY * 0.62,
          width: wakeDisplayW,
          height: wakeDisplayH,
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
