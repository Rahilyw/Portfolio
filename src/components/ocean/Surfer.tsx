"use client";

import { useEffect, useRef, useState } from "react";
import PixelSprite from "@/components/pixel/PixelSprite";
import { surferRows, surferPalette } from "@/components/pixel/sprites";

/**
 * The cursor-surfer: a pixel-art rider on a wave crest that follows the
 * mouse with a very slight, physical lag (high lerp factor so it feels
 * glued to the cursor rather than trailing behind it).
 */
export default function Surfer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let seen = false;
    let raf = 0;

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

    const loop = () => {
      const el = wrapRef.current;
      if (el && seen) {
        const dx = mouse.x - pos.x;
        // minimal lag: catch up fast, just enough softness to feel physical
        pos.x += dx * 0.35;
        pos.y += (mouse.y - pos.y) * 0.35;
        // quantize the tilt into 4°-steps so the rotation feels pixel-y too
        const tilt = Math.round(Math.max(-16, Math.min(16, dx * 0.5)) / 4) * 4;
        el.style.transform = `translate(${Math.round(pos.x)}px, ${Math.round(pos.y)}px) translate(-50%, -80%) rotate(${tilt}deg)`;
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

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 will-change-transform"
      style={{ visibility: active ? "visible" : "hidden" }}
    >
      <PixelSprite rows={surferRows} palette={surferPalette} px={4} />
    </div>
  );
}
