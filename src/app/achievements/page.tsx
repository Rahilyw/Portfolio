import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import TreasureChest from "@/components/TreasureChest";
import { PixelLink } from "@/components/game/PixelButton";
import { Seashell } from "@/components/game/SurfMotifs";
import { achievements } from "@/data/content";

export const metadata: Metadata = {
  title: "Achievements — Rahil Wijeyesekera",
  description:
    "UVEC Hackathon 2025 3rd place, ECSS Director of Sport, and more achievements.",
};

function Buoy() {
  return (
    <svg
      width="48"
      height="64"
      viewBox="0 0 48 64"
      fill="none"
      aria-hidden="true"
      className="animate-buoy"
      shapeRendering="crispEdges"
    >
      <rect x="20" y="2" width="8" height="6" fill="#fde047" />
      <rect x="22" y="8" width="4" height="8" fill="#475569" />
      <rect x="12" y="18" width="24" height="28" fill="#ef4444" />
      <rect x="12" y="28" width="24" height="8" fill="#f8fafc" />
      <rect x="8" y="50" width="32" height="4" fill="#38bdf8" opacity="0.7" />
      <rect x="12" y="56" width="24" height="3" fill="#0ea5e9" opacity="0.5" />
    </svg>
  );
}

export default function AchievementsPage() {
  return (
    <PageShell
      title="Achievements"
      accent="trophy shelf"
      hudLabel="Trophy Room"
      subtitle="Unlocked buoys on the water - each one flags a clear you earned."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-press text-[9px] uppercase text-mustard">
          Collection · {achievements.length} / {achievements.length}
        </p>
        <p className="font-press text-[8px] text-lime">All unlocked</p>
      </div>

      <ol className="space-y-5">
        {achievements.map((a, i) => (
          <li key={a.title} className="flex items-start gap-3 sm:gap-4">
            <div
              style={{ animationDelay: `${i * 0.55}s` }}
              className="shrink-0 pt-1"
            >
              <Buoy />
            </div>
            <article className="pixel-panel flex-1 p-4 sm:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="border-2 border-ink bg-lime px-2 py-0.5 font-press text-[7px] uppercase text-navy">
                  Unlocked
                </span>
                <span className="font-press text-[8px] text-foam/45">
                  Badge #{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h2 className="font-pixel text-xl leading-snug text-foam sm:text-2xl">
                {a.title}
              </h2>
              <p className="mt-2 flex gap-2 text-sm leading-relaxed text-foam/85">
                <span className="mt-0.5 shrink-0">
                  <Seashell size={12} />
                </span>
                <span>{a.detail}</span>
              </p>
              {a.link && (
                <div className="mt-4">
                  <PixelLink href={a.link} external variant="primary" className="text-[8px]">
                    View Project
                  </PixelLink>
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>

      <section className="pixel-panel-light mt-12 p-6 text-center sm:p-8">
        <h2 className="font-pixel text-2xl uppercase text-navy">Buried Treasure</h2>
        <p className="mt-2 text-sm text-navy/70">
          Extra loot from the GitHub profile. Crack the chest.
        </p>
        <div className="mt-4">
          <TreasureChest />
        </div>
      </section>
    </PageShell>
  );
}
