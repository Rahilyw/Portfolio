"use client";

import { useEffect, useState } from "react";
import PixelSprite from "@/components/pixel/PixelSprite";
import { finRows, finPalette } from "@/components/pixel/sprites";

/**
 * Easter egg: every so often a pixel shark fin cuts across the water.
 * Purely decorative, never interactive, disabled under reduced motion.
 */
export default function Dolphin() {
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeout: ReturnType<typeof setTimeout>;
    let hide: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = (delay: number) => {
      timeout = setTimeout(() => {
        if (cancelled) return;
        setRun((r) => r + 1);
        setVisible(true);
        hide = setTimeout(() => {
          if (cancelled) return;
          setVisible(false);
          schedule(15000 + Math.random() * 20000);
        }, 9000);
      }, delay);
    };

    schedule(6000 + Math.random() * 8000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      key={run}
      aria-hidden="true"
      className="dolphin pointer-events-none absolute left-0 top-[45%] z-10"
      style={{ animation: "fin-glide 9s linear forwards" }}
    >
      <div className="animate-bob" style={{ animationDuration: "1.6s" }}>
        <PixelSprite rows={finRows} palette={finPalette} px={4} />
      </div>
    </div>
  );
}
