"use client";

import { useEffect, useRef, useState } from "react";
import { drawSurferSheet, FRAME_COUNT, FRAME_SIZE } from "@/components/pixel/surferSheet";
import { HORIZON, PX } from "./WaveCanvas";

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

/** Where the board meets the water, in css px below the transform anchor. */
const CONTACT_DY = 8;
/** How far behind the anchor the tail/wake sits, in css px. */
const TAIL_BACK = 24;
/** Ceiling on live water-FX particles (trail + spray). */
const MAX_PARTS = 180;

/**
 * One water-FX particle, stored in ART-pixel units (viewport px / PX) so the
 * foam lands on the same chunky grid as the ocean. Foam trail dabs use
 * grav = 0 and near-zero velocity so they linger on the surface; spray uses
 * an upward kick + gravity so it arcs and falls back.
 */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  grav: number;
  alpha: number;
};

/**
 * The cursor-surfer mini-game: a 12-frame procedurally painted sprite sheet
 * (see surferSheet.ts) playing on a CSS steps() loop, riding a div that
 * chases the mouse with a springy physical lag.
 *
 * The board's own screen velocity — not the raw cursor gap — drives the
 * feel: it banks smoothly into turns (mirroring through an edge-on flip),
 * leans into the carve, dips its nose when dropping down the face, and
 * planes a touch higher the faster it rides. All smoothing is dt-based, so it
 * feels the same at any refresh rate.
 *
 * A full-viewport water-FX canvas sits just behind the board and is what
 * makes it read as riding real water: it lays down a persistent foam wake
 * trail along the board's path, throws gravity-arced spray off the tail that
 * grows with speed, and bursts a splash when the board snaps into a turn.
 */
export default function Surfer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const sheetRaf = requestAnimationFrame(() => setSheetUrl(drawSurferSheet().toDataURL()));

    const fxCanvas = fxRef.current;
    const fx = fxCanvas?.getContext("2d") ?? null;
    let fxW = 0;
    let fxH = 0;
    const sizeFx = () => {
      if (!fxCanvas) return;
      fxW = Math.ceil(window.innerWidth / PX);
      fxH = Math.ceil(window.innerHeight / PX);
      fxCanvas.width = fxW;
      fxCanvas.height = fxH;
      if (fx) fx.imageSmoothingEnabled = false;
    };
    sizeFx();

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let seen = false;
    let raf = 0;
    let velX = 0; // smoothed board velocity, px/s
    let velY = 0;
    let facing = 1; // continuous −1..1; lerps so the flip banks, not snaps
    let faceTarget = 1;
    let lastFaceTarget = 1;
    let lean = 0; // smoothed carve tilt, degrees
    let lift = 0; // smoothed planing lift, px
    let lastNow = performance.now();

    // water-FX particles, in art-pixel space
    const parts: Particle[] = [];
    /** Spawn a particle from css-px position/velocity (converted to art px). */
    const emit = (
      cx: number,
      cy: number,
      cvx: number,
      cvy: number,
      life: number,
      size: number,
      cgrav: number,
      alpha: number
    ) => {
      if (parts.length >= MAX_PARTS) parts.shift();
      parts.push({
        x: cx / PX,
        y: cy / PX,
        vx: cvx / PX,
        vy: cvy / PX,
        life,
        max: life,
        size,
        grav: cgrav / PX,
        alpha,
      });
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

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

        /* ---- feed the water FX from the board's motion ---- */
        const inv = 1 / Math.max(speed, 1);
        const dirX = velX * inv; // unit travel direction
        const dirY = velY * inv;
        const contactY = pos.y + CONTACT_DY;
        const tailX = pos.x - dirX * TAIL_BACK;
        const tailY = contactY - dirY * TAIL_BACK * 0.35;
        const perpX = -dirY; // perpendicular to travel, for the V-wake
        const perpY = dirX;

        if (speed > 70) {
          // short-lived foam dab on the path → a compact wake that hugs the
          // board instead of a long lingering ribbon
          emit(
            tailX + rand(-2, 2),
            tailY + rand(-1.5, 1.5),
            rand(-5, 5),
            rand(-4, 3),
            rand(0.35, 0.6),
            Math.random() < 0.25 ? 2 : 1,
            0,
            0.65
          );
          // two diverging crests spreading off the tail (the V-wake)
          if (speed > 220) {
            const spread = 20 + Math.min(speed * 0.03, 36);
            for (const side of [1, -1]) {
              emit(
                tailX,
                tailY,
                perpX * side * spread - dirX * 14,
                perpY * side * spread - dirY * 14,
                rand(0.28, 0.46),
                1,
                50,
                0.5
              );
            }
          }
        }

        // carve spray: kicked back and up off the tail, arcs under gravity;
        // a quick flick, more of it only when really driving hard
        const sprayI = clamp((speed - 340) / 1100, 0, 1);
        const nSpray = Math.floor(sprayI * 2.5) + (Math.random() < sprayI * 0.7 ? 1 : 0);
        for (let s = 0; s < nSpray; s++) {
          const back = rand(70, 150) * sprayI + 35;
          emit(
            tailX + rand(-3, 3),
            tailY + rand(-2.5, 2.5),
            -dirX * back + rand(-60, 60),
            -dirY * back - rand(100, 180), // upward kick
            rand(0.2, 0.4),
            Math.random() < 0.2 ? 2 : 1,
            980,
            0.85
          );
        }

        // splash burst the instant the board commits to a new turn direction
        if (faceTarget !== lastFaceTarget && speed > 260) {
          const side = faceTarget < lastFaceTarget ? 1 : -1;
          for (let s = 0; s < 7; s++) {
            const ang = rand(-0.5, 0.5);
            const kx = perpX * side * rand(80, 175) - dirX * rand(30, 80);
            const ky = perpY * side * rand(80, 175) - dirY * rand(30, 80) - rand(120, 200);
            emit(
              tailX,
              tailY,
              kx * Math.cos(ang),
              ky - Math.abs(kx) * Math.sin(ang) * 0.2,
              rand(0.28, 0.5),
              Math.random() < 0.35 ? 2 : 1,
              980,
              0.9
            );
          }
        }
        lastFaceTarget = faceTarget;
      }

      /* ---- simulate + paint the water FX ---- */
      if (fx) {
        fx.clearRect(0, 0, fxW, fxH);
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.life -= dt;
          if (p.life <= 0) {
            parts.splice(i, 1);
            continue;
          }
          p.vy += p.grav * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          const f = p.life / p.max;
          // foam whitens when fresh, cools to aqua as it settles/dissolves
          const col = f > 0.62 ? "255,255,255" : f > 0.32 ? "191,239,250" : "124,232,236";
          fx.fillStyle = `rgba(${col},${(Math.min(1, f * 1.5) * p.alpha).toFixed(3)})`;
          fx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
      }

      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", sizeFx);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", sizeFx);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sheetRaf);
    };
  }, []);

  return (
    <>
      {/* water-FX layer: sits behind the board, above the ocean */}
      <canvas
        ref={fxRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 h-full w-full"
        style={{ imageRendering: "pixelated", visibility: active ? "visible" : "hidden" }}
      />

      {/* the rider */}
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
      </div>
    </>
  );
}
