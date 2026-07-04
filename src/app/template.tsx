"use client";

import { motion } from "framer-motion";

/**
 * Route transition: pages rise gently out of the water on navigation.
 * framer-motion honors prefers-reduced-motion via the reducedMotion config.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[100svh] flex-col"
    >
      {children}
    </motion.div>
  );
}
