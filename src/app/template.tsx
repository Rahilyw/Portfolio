"use client";

import { motion } from "framer-motion";

/**
 * Route transition: pages surface softly on navigation.
 * Opacity only — a transform here would become the containing block for the
 * game pages' `position: fixed` ocean background and pin it to the page box
 * instead of the viewport (and WaveCanvas would size its pixel buffer to the
 * full page height on mount).
 * framer-motion honors prefers-reduced-motion via the reducedMotion config.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[100svh] flex-col"
    >
      {children}
    </motion.div>
  );
}
