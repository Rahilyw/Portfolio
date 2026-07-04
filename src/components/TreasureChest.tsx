"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { githubBadges } from "@/data/content";

/** A treasure chest that opens to reveal GitHub achievement badges. */
export default function TreasureChest() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="group cursor-pointer rounded-2xl p-4 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
        aria-label={open ? "Close the treasure chest" : "Open the treasure chest"}
      >
        <svg width="140" height="110" viewBox="0 0 140 110" fill="none" aria-hidden="true">
          {/* lid — rotates open */}
          <g
            style={{
              transform: open ? "rotate(-38deg)" : "rotate(0deg)",
              transformOrigin: "28px 58px",
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <path d="M24 58 Q24 30 70 30 Q116 30 116 58 Z" fill="#92400e" />
            <path d="M30 56 Q32 36 70 36 Q108 36 110 56 Z" fill="#b45309" />
            <rect x="62" y="30" width="16" height="28" rx="2" fill="#fbbf24" />
          </g>
          {/* glow when open */}
          {open && <ellipse cx="70" cy="60" rx="34" ry="12" fill="#fde047" opacity="0.7" />}
          {/* base */}
          <rect x="24" y="58" width="92" height="44" rx="6" fill="#92400e" />
          <rect x="30" y="62" width="80" height="36" rx="4" fill="#b45309" />
          <rect x="62" y="58" width="16" height="44" rx="2" fill="#fbbf24" />
          <circle cx="70" cy="74" r="5" fill="#78350f" />
          {/* coins peeking out when open */}
          {open && (
            <g>
              <circle cx="48" cy="58" r="6" fill="#fde047" stroke="#f59e0b" />
              <circle cx="92" cy="56" r="5" fill="#fde047" stroke="#f59e0b" />
              <circle cx="70" cy="54" r="6" fill="#facc15" stroke="#f59e0b" />
            </g>
          )}
        </svg>
        <p className="mt-1 text-sm font-medium text-ink/70 transition group-hover:text-ink">
          {open ? "GitHub badge loot!" : "Psst… open the chest"}
        </p>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-3 flex flex-wrap justify-center gap-2"
          >
            {githubBadges.map((badge, i) => (
              <motion.li
                key={badge}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 * i, type: "spring", stiffness: 300, damping: 18 }}
                className="rounded-full border border-amber-300 bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-900 shadow-sm"
              >
                🏅 {badge}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
