"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/content";

const links = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: "✉️" },
  { label: "LinkedIn", value: "in/rahil-wijeyesekera", href: site.linkedin, icon: "💼" },
  { label: "GitHub", value: "@Rahilyw", href: site.github, icon: "🐙" },
];

/** The contact page centerpiece: a floating bottle that uncorks into a note. */
export default function MessageInABottle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="bottle"
            type="button"
            onClick={() => setOpen(true)}
            exit={{ opacity: 0, y: -20, rotate: 8 }}
            transition={{ duration: 0.3 }}
            className="group flex cursor-pointer flex-col items-center rounded-3xl p-6 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            aria-label="Open the bottle to read the message"
          >
            <div className="animate-bottle">
              <svg width="120" height="180" viewBox="0 0 120 180" fill="none" aria-hidden="true">
                {/* cork */}
                <rect x="48" y="8" width="24" height="18" rx="5" fill="#b45309" />
                <rect x="50" y="12" width="20" height="3" rx="1.5" fill="#92400e" opacity="0.7" />
                {/* neck */}
                <rect x="50" y="24" width="20" height="26" rx="6" fill="#a5f3fc" opacity="0.9" />
                {/* body */}
                <path
                  d="M50 46 Q28 60 28 92 L28 142 Q28 162 60 162 Q92 162 92 142 L92 92 Q92 60 70 46 Z"
                  fill="#a5f3fc"
                  opacity="0.85"
                />
                <path
                  d="M54 52 Q36 64 36 92 L36 140 Q36 154 60 154 Q84 154 84 140 L84 92 Q84 64 66 52 Z"
                  fill="#cffafe"
                  opacity="0.6"
                />
                {/* rolled note inside */}
                <rect x="46" y="78" width="28" height="58" rx="10" fill="#fef3c7" />
                <path d="M52 90 h16 M52 100 h16 M52 110 h12 M52 120 h15" stroke="#d6b26e" strokeWidth="2" strokeLinecap="round" />
                {/* twine around the note */}
                <path d="M45 106 Q60 112 75 106" stroke="#b45309" strokeWidth="2.4" fill="none" />
                {/* glass shine */}
                <path d="M40 70 Q34 100 38 134" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.75" fill="none" />
                {/* water line inside bottle */}
                <path d="M32 132 Q46 126 60 132 Q74 138 88 132 L88 142 Q88 154 60 154 Q32 154 32 142 Z" fill="#38bdf8" opacity="0.5" />
              </svg>
            </div>
            <p className="mt-4 rounded-full bg-white/80 px-5 py-2 font-display font-medium text-ink shadow-sm backdrop-blur transition group-hover:bg-white">
              A bottle washed ashore… open it 👀
            </p>
          </motion.button>
        ) : (
          <motion.div
            key="note"
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-full max-w-md"
          >
            <div
              className="relative rounded-lg border-[3px] border-navy p-8 shadow-[6px_6px_0_var(--navy)]"
              style={{
                background: "linear-gradient(175deg, #fefce8, #fef3c7 60%, #fde68a)",
              }}
            >
              {/* torn-paper top edge */}
              <div
                aria-hidden="true"
                className="absolute -top-1.5 left-0 right-0 h-3"
                style={{
                  background:
                    "radial-gradient(circle at 8px 0, transparent 5px, #fefce8 5px) repeat-x",
                  backgroundSize: "16px 12px",
                }}
              />
              <h2 className="font-display text-2xl font-semibold text-ink">Ahoy! 🏄</h2>
              <p className="mt-3 text-ink/80">
                Thanks for sailing all the way out here. Whether it&apos;s an internship,
                a collab, or just to talk AI agents and systems — I&apos;d love to hear
                from you.
              </p>
              <ul className="mt-6 space-y-3">
                {links.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                  >
                    <a
                      href={l.href}
                      target={l.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-amber-200/70 bg-white/70 px-4 py-3 transition hover:bg-white hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <span aria-hidden="true" className="text-xl">{l.icon}</span>
                      <span className="font-medium text-ink">{l.label}</span>
                      <span className="ml-auto text-sm text-ink/60">{l.value}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-6 text-right font-display text-ink/70">— Rahil</p>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer text-sm text-ink/50 underline-offset-2 hover:text-ink hover:underline"
              >
                Put the note back in the bottle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
