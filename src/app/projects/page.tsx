import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { PixelLink } from "@/components/game/PixelButton";
import { Seashell, Surfboard } from "@/components/game/SurfMotifs";
import { featuredProjects, otherProjects, type Project } from "@/data/content";

export const metadata: Metadata = {
  title: "Projects — Rahil Wijeyesekera",
  description:
    "AI agents, RAG systems, network analyzers, and systems programming projects by Rahil Wijeyesekera.",
};

const chipColors = [
  "bg-tealsurf text-foam",
  "bg-sunset text-foam",
  "bg-mustard text-navy",
  "bg-coral text-foam",
  "bg-navy text-cream",
];

function StackChips({ stack, offset = 0 }: { stack: string[]; offset?: number }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {stack.map((s, i) => (
        <li
          key={s}
          className={`border-2 border-ink px-2 py-0.5 font-press text-[7px] uppercase sm:text-[8px] ${chipColors[(i + offset) % chipColors.length]}`}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function QuestCard({
  project,
  index,
  kind,
}: {
  project: Project;
  index: number;
  kind: "main" | "side";
}) {
  const isMain = kind === "main";
  return (
    <article
      className={`pixel-panel flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)] ${
        isMain && index % 2 ? "float-panel" : ""
      }`}
      style={isMain && index % 2 ? { animationDelay: `${index * 0.35}s` } : undefined}
    >
      <div
        className={`flex items-center justify-between gap-2 px-4 py-2 ${
          isMain ? "bg-sunset" : "bg-tealsurf"
        }`}
      >
        <span className="inline-flex items-center gap-1.5 font-press text-[8px] uppercase text-foam">
          {isMain ? <Surfboard size={12} /> : <Seashell size={12} />}
          {isMain ? "Main Quest" : "Side Quest"}
        </span>
        <span className="font-press text-[8px] text-foam/80">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="border border-lime bg-lime/20 px-1.5 py-0.5 font-press text-[7px] uppercase text-lime">
            Cleared
          </span>
          <span className="font-press text-[7px] uppercase text-foam/45">
            Reward · XP + Stack
          </span>
        </div>
        <h3 className="font-pixel text-xl leading-snug text-foam sm:text-2xl">{project.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-foam/85">{project.description}</p>
        {project.highlights && (
          <ul className="mt-3 space-y-1.5">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2 text-xs leading-relaxed text-foam/75">
                <span className="mt-0.5 shrink-0">
                  <Seashell size={12} />
                </span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
        <StackChips stack={project.stack} offset={index} />
        <div className="mt-4">
          <PixelLink href={project.repo} external variant="primary" className="text-[8px]">
            Open Repo
          </PixelLink>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <PageShell
      title="Projects"
      accent="quest log unlocked"
      hudLabel="Quest Log"
      subtitle="Main quests and side quests from the archipelago - AI agents, cloud apps, and systems tools built from scratch."
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-press text-[11px] uppercase text-mustard">Main Quests</h2>
          <p className="mt-1 text-sm text-foam/70">Boss fights. Highest XP drops.</p>
        </div>
        <p className="font-press text-[9px] text-foam/50">
          {featuredProjects.length} Active
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <QuestCard key={p.name} project={p} index={i} kind="main" />
        ))}
      </div>

      <div className="mb-5 mt-14 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-press text-[11px] uppercase text-mustard">Side Quests</h2>
          <p className="mt-1 text-sm text-foam/70">Optional routes. Still worth the paddle.</p>
        </div>
        <p className="font-press text-[9px] text-foam/50">{otherProjects.length} Cleared</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((p, i) => (
          <QuestCard key={p.name} project={p} index={i} kind="side" />
        ))}
      </div>
    </PageShell>
  );
}
