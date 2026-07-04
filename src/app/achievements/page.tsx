import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import TreasureChest from "@/components/TreasureChest";
import { achievements } from "@/data/content";

export const metadata: Metadata = {
  title: "Achievements — Rahil Wijeyesekera",
  description:
    "UVEC Hackathon 2025 3rd place, ECSS Director of Sport, and more achievements.",
};

function Buoy() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" aria-hidden="true" className="animate-buoy">
      {/* mast light */}
      <circle cx="28" cy="8" r="5" fill="#fde047" />
      <rect x="26" y="12" width="4" height="10" fill="#475569" />
      {/* body */}
      <path d="M14 26 Q14 20 28 20 Q42 20 42 26 L40 52 Q40 58 28 58 Q16 58 16 52 Z" fill="#ef4444" />
      <path d="M15 34 L41 34 L40.4 42 L15.6 42 Z" fill="#f8fafc" />
      {/* water ripple */}
      <ellipse cx="28" cy="62" rx="20" ry="4" stroke="#38bdf8" strokeWidth="2.5" fill="none" opacity="0.7" />
    </svg>
  );
}

export default function AchievementsPage() {
  return (
    <PageShell
      title="Achievements"
      emoji="🏆"
      accent="trophy shelf!"
      subtitle="Buoy markers on the water — each one flags something I'm proud of."
    >
      <ol className="space-y-6">
        {achievements.map((a, i) => (
          <li key={a.title} className="flex items-start gap-4">
            <div style={{ animationDelay: `${i * 0.6}s` }} className="shrink-0">
              <Buoy />
            </div>
            <article className={`sticker flex-1 p-6 ${i % 2 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"}`}>
              <h2 className="font-display text-lg text-navy">{a.title}</h2>
              <p className="mt-2 text-sm text-navy/80">{a.detail}</p>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-display text-sm text-coral underline-offset-4 hover:underline"
                >
                  View project ↗
                </a>
              )}
            </article>
          </li>
        ))}
      </ol>

      <section className="sticker mt-14 bg-gradient-to-b from-amber-50 to-paper p-8 text-center">
        <h2 className="font-display text-2xl text-navy">Buried treasure</h2>
        <p className="mt-1 text-sm text-navy/70">A little extra loot from my GitHub profile.</p>
        <div className="mt-4">
          <TreasureChest />
        </div>
      </section>
    </PageShell>
  );
}
