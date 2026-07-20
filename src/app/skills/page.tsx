import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import StatBar from "@/components/game/StatBar";
import { skillGroups } from "@/data/content";

export const metadata: Metadata = {
  title: "Skills — Rahil Wijeyesekera",
  description:
    "Python, TypeScript, C, RAG, MCP, multi-agent systems, Azure, and systems/networking skills.",
};

const groupPower = [
  { label: "Languages", value: 90, color: "bg-mustard" },
  { label: "AI / ML", value: 88, color: "bg-tealsurf" },
  { label: "Web Cloud", value: 84, color: "bg-sunset" },
  { label: "Databases", value: 80, color: "bg-coral" },
  { label: "Systems", value: 78, color: "bg-ocean-2" },
];

const chipColors = [
  "bg-tealsurf text-foam",
  "bg-sunset text-foam",
  "bg-mustard text-navy",
  "bg-coral text-foam",
  "bg-navy text-cream",
];

export default function SkillsPage() {
  return (
    <PageShell
      title="Skills"
      accent="skill tree"
      hudLabel="Skill Tree"
      subtitle="Character build inventory - from LLM agent frameworks down to raw sockets."
    >
      <section className="pixel-panel mb-8 p-5">
        <h2 className="mb-4 font-press text-[11px] uppercase text-mustard">
          Build Overview
        </h2>
        <div className="space-y-3">
          {groupPower.map((g) => (
            <StatBar key={g.label} label={g.label} value={g.value} color={g.color} />
          ))}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((group, gi) => (
          <section key={group.title} className="pixel-panel p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-press text-[10px] uppercase text-mustard">{group.title}</h2>
              <span className="font-press text-[8px] text-foam/45">
                {group.skills.length} Nodes
              </span>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((s, i) => (
                <li
                  key={s}
                  className={`border-2 border-ink px-2.5 py-1 font-press text-[8px] uppercase transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)] sm:text-[9px] ${chipColors[(gi + i) % chipColors.length]}`}
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
