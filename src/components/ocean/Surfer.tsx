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

/**
 * Physics tuning. Every rate is expressed per SECOND and applied through
 * exponential smoothing (`1 - e^(-k·dt)`), so the feel is identical at 60,
 * 120, or 144 Hz — the old fixed per-frame lerps ran twice as fast on a
 * high-refresh display.
 */
const CHASE_K = 20; // how eagerly the board chases the cursor (higher = tighter)
const VEL_K = 15; // board-velocity smoothing
const FACE_K = 14; // how fast the rider banks around when turning
const LEAN_K = 11; // tilt smoothing
const LIFT_K = 8; // planing-lift smoothing
const TURN_DEADZONE = 220; // px/s of sideways speed before committing a turn
const MAX_TILT = 15; // degrees of carve lean
/** px/s at which the wake and planing lift reach full strength. */
const FULL_SPEED = 1900;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

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
 * Paints a small scrolling wake beneath the board. `intensity` (0..1, from
 * the board's real speed) and travel direction drive crest height, scroll
 * rate, and foam density.
 */
function drawWake(
  ctx: CanvasRenderingContext2D,
  t: number,
  intensity: number,
  dirX: number
) {
  const w = WAKE_W;
  const h = WAKE_H;
  const img = ctx.createImageData(w, h);
  const data = img.data;

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
 * chases the mouse with a springy physical lag.
 *
 * The board's own screen velocity — not the raw cursor gap — drives the
 * feel: it banks smoothly into turns (mirroring through an edge-on flip),
 * leans into the carve, dips its nose when dropping down the face, and
 * planes a touch higher the faster it rides. A small interactive wake canvas
 * scrolls beneath it, crests growing and foam churning with speed. All
 * smoothing is dt-based, so it feels the same at any refresh rate.
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

    const sheetRaf = requestAnimationFrame(() => setSheetUrl(drawSurferSheet().toDataURL()));

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
    let velX = 0; // smoothed board velocity, px/s
    let velY = 0;
    let facing = 1; // continuous −1..1; lerps so the flip banks, not snaps
    let faceTarget = 1;
    let lean = 0; // smoothed carve tilt, degrees
    let lift = 0; // smoothed planing lift, px
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

        // frame-rate-independent chase toward the cursor
        const chase = 1 - Math.exp(-CHASE_K * dt);
        const nextX = pos.x + (mouse.x - pos.x) * chase;
        const nextY = pos.y + (targetY - pos.y) * chase;

        // the board's actual screen velocity (px/s) is what drives the feel
        const instVX = (nextX - pos.x) / dt;
        const instVY = (nextY - pos.y) / dt;
        pos.x = nextX;
        pos.y = nextY;

        const velSmooth = 1 - Math.exp(-VEL_K * dt);
        velX += (instVX - velX) * velSmooth;
        velY += (instVY - velY) * velSmooth;
        const speed = Math.hypot(velX, velY);

        // commit a turn only past a deadzone (hysteresis), then bank into it
        // smoothly — as `facing` crosses 0 the sprite goes edge-on and flips
        if (velX > TURN_DEADZONE) faceTarget = -1;
        else if (velX < -TURN_DEADZONE) faceTarget = 1;
        facing += (faceTarget - facing) * (1 - Math.exp(-FACE_K * dt));

        // carve lean from sideways speed + a nose dip when dropping down the
        // face (positive velY = moving down-screen). Both in screen space, so
        // the mirror handles left/right correctly.
        const targetLean =
          clamp(velX * 0.006, -MAX_TILT, MAX_TILT) + clamp(velY * 0.004, -5, 5);
        lean += (targetLean - lean) * (1 - Math.exp(-LEAN_K * dt));

        // planing: rides a little higher the faster it goes
        const targetLift = -Math.min(speed / FULL_SPEED, 1) * 3;
        lift += (targetLift - lift) * (1 - Math.exp(-LIFT_K * dt));

        el.style.transform =
          `translate(${Math.round(pos.x)}px, ${Math.round(pos.y + lift)}px) ` +
          `translate(-50%, -66%) rotate(${lean.toFixed(2)}deg) scaleX(${facing.toFixed(3)})`;

        if (wakeCtx) {
          const intensity = Math.min(1, speed / FULL_SPEED);
          drawWake(wakeCtx, wakeT, intensity, facing < 0 ? 1 : -1);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sheetRaf);
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
