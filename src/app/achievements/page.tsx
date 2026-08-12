import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import TreasureChest from "@/components/TreasureChest";
import { PixelLink } from "@/components/game/PixelButton";
import { Surfboard } from "@/components/game/SurfMotifs";
import {
  featuredAchievement,
  activeQuests,
  currentObjective,
  clearedQuests,
  legacyAchievements,
  type Achievement,
} from "@/data/content";

export const metadata: Metadata = {
  title: "Achievements — Rahil Wijeyesekera",
  description:
    "UVEC Hackathon 3rd place, UVEC events leadership and Cursor Codechella, UVic Surf Club trips, Royal College rugby vice-captaincy and Senior Prefectship.",
};

/* ---------- pixel sprites (crispEdges, palette tokens) ---------- */

function TrophyCup() {
  return (
    <svg
      width="104"
      height="104"
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="animate-bob-slow"
      shapeRendering="crispEdges"
    >
      {/* sparkles */}
      <rect x="26" y="2" width="2" height="2" fill="#f0fbff" />
      <rect x="3" y="5" width="2" height="2" fill="#f0fbff" />
      {/* rim */}
      <rect x="7" y="4" width="18" height="2" fill="#fde68a" />
      {/* bowl */}
      <rect x="8" y="6" width="16" height="8" fill="#f2b134" />
      <rect x="9" y="7" width="3" height="5" fill="#fde68a" />
      <rect x="20" y="6" width="4" height="8" fill="#f4793b" />
      {/* medal on the cup */}
      <rect x="14" y="8" width="4" height="4" fill="#e76f51" />
      {/* handles */}
      <rect x="4" y="6" width="2" height="6" fill="#f2b134" />
      <rect x="26" y="6" width="2" height="6" fill="#f2b134" />
      <rect x="2" y="6" width="2" height="2" fill="#f2b134" />
      <rect x="28" y="6" width="2" height="2" fill="#f2b134" />
      {/* taper + stem */}
      <rect x="10" y="14" width="12" height="2" fill="#f4793b" />
      <rect x="14" y="16" width="4" height="4" fill="#f2b134" />
      {/* base */}
      <rect x="10" y="20" width="12" height="2" fill="#1d3557" />
      <rect x="8" y="22" width="16" height="4" fill="#083344" />
    </svg>
  );
}

function Ticket() {
  return (
    <svg width="44" height="44" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="1" y="4" width="14" height="8" fill="#fde68a" />
      <rect x="1" y="4" width="14" height="1" fill="#f2b134" />
      <rect x="1" y="11" width="14" height="1" fill="#f2b134" />
      {/* perforation */}
      <rect x="10" y="5" width="1" height="1" fill="#083344" />
      <rect x="10" y="7" width="1" height="1" fill="#083344" />
      <rect x="10" y="9" width="1" height="1" fill="#083344" />
      {/* text lines */}
      <rect x="3" y="6" width="5" height="1" fill="#1d3557" />
      <rect x="3" y="8" width="4" height="1" fill="#1d3557" />
      {/* stub star */}
      <rect x="12" y="7" width="2" height="2" fill="#f4793b" />
    </svg>
  );
}

function Whistle() {
  return (
    <svg width="44" height="44" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      {/* cord ring */}
      <rect x="2" y="2" width="2" height="2" fill="#fde68a" />
      {/* body */}
      <rect x="2" y="5" width="9" height="6" fill="#f2b134" />
      <rect x="2" y="10" width="9" height="1" fill="#f4793b" />
      {/* mouthpiece */}
      <rect x="11" y="6" width="4" height="2" fill="#f2b134" />
      {/* air hole */}
      <rect x="5" y="7" width="2" height="2" fill="#083344" />
    </svg>
  );
}

function RugbyBall() {
  return (
    <svg width="44" height="44" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="4" y="4" width="8" height="1" fill="#e76f51" />
      <rect x="2" y="5" width="12" height="2" fill="#e76f51" />
      <rect x="1" y="7" width="14" height="2" fill="#e76f51" />
      <rect x="2" y="9" width="12" height="2" fill="#e76f51" />
      <rect x="4" y="11" width="8" height="1" fill="#e76f51" />
      {/* end shading */}
      <rect x="1" y="7" width="2" height="2" fill="#b45a43" />
      <rect x="13" y="7" width="2" height="2" fill="#b45a43" />
      {/* lacing */}
      <rect x="5" y="7" width="6" height="1" fill="#f0fbff" />
      <rect x="6" y="6" width="1" height="1" fill="#f0fbff" />
      <rect x="8" y="6" width="1" height="1" fill="#f0fbff" />
      <rect x="6" y="8" width="1" height="1" fill="#f0fbff" />
      <rect x="8" y="8" width="1" height="1" fill="#f0fbff" />
    </svg>
  );
}

function SilverBadge() {
  return (
    <svg width="44" height="44" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      {/* crown */}
      <rect x="5" y="0" width="1" height="2" fill="#f2b134" />
      <rect x="7" y="0" width="2" height="2" fill="#f2b134" />
      <rect x="10" y="0" width="1" height="2" fill="#f2b134" />
      {/* sterling silver shield */}
      <rect x="3" y="2" width="10" height="2" fill="#f0fbff" />
      <rect x="3" y="4" width="10" height="5" fill="#cbd5e1" />
      <rect x="4" y="9" width="8" height="2" fill="#cbd5e1" />
      <rect x="5" y="11" width="6" height="2" fill="#94a3b8" />
      <rect x="6" y="13" width="4" height="1" fill="#94a3b8" />
      <rect x="7" y="14" width="2" height="1" fill="#64748b" />
      {/* crest */}
      <rect x="6" y="4" width="4" height="4" fill="#1d3557" />
      <rect x="7" y="5" width="2" height="2" fill="#f2b134" />
    </svg>
  );
}

function LootStar() {
  return (
    <svg width="44" height="44" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <rect x="7" y="1" width="2" height="2" fill="#f2b134" />
      <rect x="6" y="3" width="4" height="2" fill="#f2b134" />
      <rect x="1" y="5" width="14" height="2" fill="#f2b134" />
      <rect x="3" y="7" width="10" height="2" fill="#f2b134" />
      <rect x="5" y="9" width="6" height="2" fill="#f2b134" />
      <rect x="3" y="11" width="4" height="2" fill="#f2b134" />
      <rect x="9" y="11" width="4" height="2" fill="#f2b134" />
      <rect x="7" y="6" width="2" height="2" fill="#fde68a" />
    </svg>
  );
}

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

function AchievementIcon({ icon }: { icon: Achievement["icon"] }) {
  switch (icon) {
    case "ticket":
      return <Ticket />;
    case "whistle":
      return <Whistle />;
    case "surfboard":
      return <Surfboard size={44} />;
    case "rugby":
      return <RugbyBall />;
    case "shield":
      return <SilverBadge />;
    case "star":
      return <LootStar />;
    default:
      return <TrophyCup />;
  }
}

/* ---------- shared bits ---------- */

function StatusChip({ status }: { status: "in-progress" | "unlocked" | "legacy" }) {
  if (status === "in-progress") {
    return (
      <span className="border-2 border-ink bg-sunset px-2 py-0.5 font-press text-[7px] uppercase text-foam">
        In Progress
      </span>
    );
  }
  if (status === "legacy") {
    return (
      <span className="border-2 border-navy bg-navy px-2 py-0.5 font-press text-[7px] uppercase text-cream">
        Legacy
      </span>
    );
  }
  return (
    <span className="border-2 border-ink bg-lime px-2 py-0.5 font-press text-[7px] uppercase text-navy">
      Unlocked
    </span>
  );
}

function SectionHeader({
  kicker,
  title,
  tone,
}: {
  kicker: string;
  title: string;
  tone: "sunset" | "tealsurf";
}) {
  return (
    <div className="mb-5 mt-14 flex items-end justify-between gap-4 border-b-4 border-ink pb-2">
      <div>
        <p className={`font-press text-[8px] uppercase tracking-[0.2em] ${tone === "sunset" ? "text-sunset" : "text-tealsurf"}`}>
          {kicker}
        </p>
        <h2 className="font-pixel mt-1 text-2xl uppercase leading-none text-foam sm:text-3xl">
          {title}
        </h2>
      </div>
      <div
        aria-hidden="true"
        className={`mb-1 h-2 w-16 sm:w-28 ${tone === "sunset" ? "bg-sunset" : "bg-tealsurf"}`}
        style={{ boxShadow: "3px 3px 0 var(--ink)" }}
      />
    </div>
  );
}

function MetaLine({ org, period, light }: { org: string; period: string; light?: boolean }) {
  return (
    <p className={`mt-1 font-press text-[8px] uppercase leading-relaxed ${light ? "text-navy/60" : "text-mustard"}`}>
      {org} <span className={light ? "text-navy/40" : "text-foam/40"}>· {period}</span>
    </p>
  );
}

/* ---------- page ---------- */

const badgeCount =
  1 + activeQuests.length + clearedQuests.length + legacyAchievements.length;

export default function AchievementsPage() {
  return (
    <PageShell
      title="Achievements"
      accent="trophy shelf"
      hudLabel="Trophy Room"
      subtitle="Every badge here was earned somewhere between Colombo and the coast of Vancouver Island."
    >
      {/* scoreboard */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="font-press text-[9px] uppercase text-mustard">
          Collection · {badgeCount} / {badgeCount} badges
        </p>
        <p className="font-press text-[8px] uppercase text-sunset">
          {activeQuests.length} quest{activeQuests.length === 1 ? "" : "s"} in progress
        </p>
        <p className="hidden font-press text-[8px] uppercase text-foam/50 sm:block">
          Two coastlines · Colombo → Victoria
        </p>
      </div>

      {/* spotlight: the podium finish */}
      <section aria-label="Featured achievement" className="pixel-panel p-5 sm:p-7">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto sm:px-3">
            <TrophyCup />
            <span className="border-2 border-ink bg-mustard px-2 py-1 font-press text-[8px] uppercase text-navy">
              Podium Finish
            </span>
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusChip status="unlocked" />
              <span className="font-press text-[8px] uppercase text-foam/45">
                Main quest cleared
              </span>
            </div>
            <h2 className="font-pixel text-2xl leading-snug text-foam sm:text-3xl">
              {featuredAchievement.title}
            </h2>
            <MetaLine org={featuredAchievement.org} period={featuredAchievement.period} />
            <p className="mt-3 max-w-prose text-sm leading-relaxed text-foam/85">
              {featuredAchievement.detail}
            </p>
            {featuredAchievement.link && (
              <div className="mt-4">
                <PixelLink
                  href={featuredAchievement.link}
                  external
                  variant="primary"
                  className="text-[8px]"
                >
                  {featuredAchievement.linkLabel ?? "View"}
                </PixelLink>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* quests in progress */}
      <SectionHeader kicker="active" title="Quests in Progress" tone="sunset" />
      <div className="grid gap-5">
        <article className="pixel-panel p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 pt-1">
              <Ticket />
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusChip status="in-progress" />
              </div>
              <h3 className="font-pixel text-xl leading-snug text-foam sm:text-2xl">
                {activeQuests[0].title}
              </h3>
              <MetaLine org={activeQuests[0].org} period={activeQuests[0].period} />
              <p className="mt-2 text-sm leading-relaxed text-foam/85">
                {activeQuests[0].detail}
              </p>
            </div>
          </div>

          {/* the flagship objective under this role */}
          <div className="mt-4 border-2 border-ink bg-navy/50 p-3 sm:p-4">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="border-2 border-ink bg-sunset px-2 py-0.5 font-press text-[7px] uppercase text-foam">
                Current objective
              </span>
              <span className="font-press text-[8px] uppercase text-mustard">
                {currentObjective.date}
              </span>
            </div>
            <p className="font-pixel text-lg leading-snug text-foam">
              {currentObjective.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foam/80">
              {currentObjective.detail}
            </p>
            <div className="mt-3">
              <PixelLink
                href={currentObjective.link}
                external
                variant="accent"
                className="text-[8px]"
              >
                Event Page
              </PixelLink>
            </div>
          </div>
        </article>
      </div>

      {/* cleared side quests */}
      <SectionHeader kicker="cleared" title="Side Quests" tone="tealsurf" />
      <ol className="space-y-5">
        {clearedQuests.map((a, i) => (
          <li key={a.title} className="flex items-start gap-3 sm:gap-4">
            <div style={{ animationDelay: `${i * 0.55}s` }} className="shrink-0 pt-1">
              <Buoy />
            </div>
            <article className="pixel-panel flex-1 p-4 sm:p-5">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <StatusChip status="unlocked" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-pixel text-xl leading-snug text-foam sm:text-2xl">
                    {a.title}
                  </h3>
                  <MetaLine org={a.org} period={a.period} />
                </div>
                <div className="hidden shrink-0 sm:block">
                  <AchievementIcon icon={a.icon} />
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foam/85">{a.detail}</p>
            </article>
          </li>
        ))}
      </ol>

      {/* origin story: the older save file */}
      <section
        aria-label="Origin story"
        className="pixel-panel-light mt-14 p-5 sm:p-7"
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-navy/20 pb-3">
          <div>
            <p className="font-press text-[8px] uppercase tracking-[0.2em] text-coral">
              older save file loaded
            </p>
            <h2 className="font-pixel mt-1 text-2xl uppercase leading-none text-navy sm:text-3xl">
              Origin Story
            </h2>
          </div>
          <p className="font-press text-[8px] uppercase text-navy/55">
            Royal College · Colombo, Sri Lanka
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {legacyAchievements.map((a) => (
            <article key={a.title}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1">
                  <AchievementIcon icon={a.icon} />
                </div>
                <div className="min-w-0">
                  <div className="mb-2">
                    <StatusChip status="legacy" />
                  </div>
                  <h3 className="font-pixel text-xl leading-snug text-navy">{a.title}</h3>
                  <MetaLine org={a.org} period={a.period} light />
                  <p className="mt-2 text-sm leading-relaxed text-navy/80">{a.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* bonus loot */}
      <section className="pixel-panel mt-14 p-6 text-center sm:p-8">
        <h2 className="font-pixel text-2xl uppercase text-foam">Buried Treasure</h2>
        <p className="mt-2 text-sm text-foam/70">
          Extra loot from the GitHub profile. Crack the chest.
        </p>
        <div className="mt-4">
          <TreasureChest />
        </div>
      </section>
    </PageShell>
  );
}
