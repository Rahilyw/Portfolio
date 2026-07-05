"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/content";

const links = [
  { icon: "✉️", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "💼", label: "LinkedIn", value: "in/rahil-wijeyesekera", href: site.linkedin },
  { icon: "🐙", label: "GitHub", value: "@Rahilyw", href: site.github },
  { icon: "📋", label: "Résumé", value: "Download PDF", href: site.resume, download: true },
];

function BottleSVG() {
  return (
    <svg width="120" height="180" viewBox="0 0 120 180" fill="none" aria-hidden="true">
      <rect x="48" y="8" width="24" height="18" rx="5" fill="#b45309" />
      <rect x="50" y="12" width="20" height="3" rx="1.5" fill="#92400e" opacity="0.7" />
      <rect x="50" y="24" width="20" height="26" rx="6" fill="#a5f3fc" opacity="0.9" />
      <path d="M50 46 Q28 60 28 92 L28 142 Q28 162 60 162 Q92 162 92 142 L92 92 Q92 60 70 46 Z" fill="#a5f3fc" opacity="0.85" />
      <path d="M54 52 Q36 64 36 92 L36 140 Q36 154 60 154 Q84 154 84 140 L84 92 Q84 64 66 52 Z" fill="#cffafe" opacity="0.6" />
      <rect x="46" y="78" width="28" height="58" rx="10" fill="#fef3c7" />
      <path d="M52 90 h16 M52 100 h16 M52 110 h12 M52 120 h15" stroke="#d6b26e" strokeWidth="2" strokeLinecap="round" />
      <path d="M45 106 Q60 112 75 106" stroke="#b45309" strokeWidth="2.4" fill="none" />
      <path d="M40 70 Q34 100 38 134" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.75" fill="none" />
      <path d="M32 132 Q46 126 60 132 Q74 138 88 132 L88 142 Q88 154 60 154 Q32 154 32 142 Z" fill="#38bdf8" opacity="0.5" />
    </svg>
  );
}

export default function BottleReveal() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-80 flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="bottle"
            type="button"
            onClick={() => setOpen(true)}
            exit={{ opacity: 0, x: 80, y: -100, rotate: 40, scale: 0.4 }}
            transition={{ duration: 0.55, ease: [0.36, 0.07, 0.19, 0.97] }}
            className="group flex cursor-pointer flex-col items-center rounded-3xl p-6 transition hover:scale-105 focus-visible:outline-none"
            aria-label="Open the bottle to reveal the message"
          >
            <div className="animate-bottle">
              <BottleSVG />
            </div>
            <p className="font-marker mt-4 text-sm text-navy/55 transition group-hover:text-navy">
              a mysterious message washed ashore...
            </p>
            <p className="font-bebas mt-1 text-xl tracking-[3px] text-coral-hot group-hover:underline">
              OPEN THE BOTTLE ↓
            </p>
          </motion.button>
        ) : (
          <motion.div
            key="note"
            initial={{ opacity: 0, y: 80, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="w-full max-w-md"
          >
            {/* parchment letter */}
            <div
              className="relative border-4 border-navy-dark p-8 shadow-[8px_8px_0_#0A2D4E]"
              style={{ background: "linear-gradient(175deg, #fefce8, #fef3c7 55%, #fde68a)" }}
            >
              {/* torn-paper top edge */}
              <div
                aria-hidden="true"
                className="absolute -top-2 left-0 right-0 h-4"
                style={{
                  background:
                    "radial-gradient(circle at 10px 0, transparent 6px, #fefce8 6px) repeat-x",
                  backgroundSize: "20px 16px",
                }}
              />

              <h2
                className="font-bebas text-5xl text-navy-dark"
                style={{ textShadow: "2px 2px 0 #FFE000" }}
              >
                AHOY! 🏄‍♂️
              </h2>
              <p className="font-editorial mt-3 text-sm italic leading-relaxed text-navy/80">
                Whether it&apos;s an internship, a collab, or just to talk AI agents and surfing —
                I&apos;d love to hear from you. The wave&apos;s up. Let&apos;s go.
              </p>

              <div className="my-5 h-px bg-navy/20" />

              <ul className="space-y-3">
                {links.map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.1 }}
                  >
                    <a
                      href={l.href}
                      target={
                        l.href.startsWith("mailto") || l.href.startsWith("/")
                          ? undefined
                          : "_blank"
                      }
                      rel="noopener noreferrer"
                      download={l.download || undefined}
                      className="flex items-center gap-3 border-2 border-navy/20 bg-white/60 px-4 py-3 transition hover:border-navy hover:bg-white hover:shadow-[2px_2px_0_#1d3557]"
                    >
                      <span className="text-xl" aria-hidden="true">{l.icon}</span>
                      <span className="font-bebas text-lg tracking-wide text-navy-dark">
                        {l.label}
                      </span>
                      <span className="ml-auto font-editorial text-sm italic text-navy/60">
                        {l.value}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <p className="mt-6 text-right font-script text-xl text-navy/60">— Rahil</p>
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer font-bebas text-sm tracking-widest text-navy/40 transition hover:text-navy"
              >
                PUT THE MESSAGE BACK ↑
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
