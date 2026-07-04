import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { skillGroups } from "@/data/content";

export const metadata: Metadata = {
  title: "Skills — Rahil Wijeyesekera",
  description:
    "Python, TypeScript, C, RAG, MCP, multi-agent systems, Azure, and systems/networking skills.",
};

export default function SkillsPage() {
  return (
    <PageShell
      title="Skills"
      emoji="🌴"
      accent="wax on, wax off"
      subtitle="My toolbox — from LLM agent frameworks down to raw sockets."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {skillGroups.map((group, gi) => {
          const chipStyles = [
            "bg-tealsurf text-white",
            "bg-sunset text-white",
            "bg-mustard text-navy",
            "bg-coral text-white",
            "bg-navy text-cream",
          ];
          return (
            <section
              key={group.title}
              className={`sticker p-6 ${gi % 2 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"}`}
            >
              <h2 className="font-display text-lg text-navy">{group.title}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((s, i) => (
                  <li
                    key={s}
                    className={`rounded-full border-2 border-navy px-3 py-1 text-sm font-semibold ${chipStyles[(gi + i) % chipStyles.length]}`}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
