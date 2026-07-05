import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { featuredProjects, otherProjects, type Project } from "@/data/content";

export const metadata: Metadata = {
  title: "Projects — Rahil Wijeyesekera",
  description:
    "AI agents, RAG systems, network analyzers, and systems programming projects by Rahil Wijeyesekera.",
};

const chipColors = [
  "bg-tealsurf text-white",
  "bg-sunset text-white",
  "bg-mustard text-navy",
  "bg-coral text-white",
  "bg-navy text-cream",
];

const tilts = ["rotate-[0.5deg]", "-rotate-[0.4deg]", "-rotate-[0.6deg]", "rotate-[0.3deg]"];

function StackChips({ stack, offset = 0 }: { stack: string[]; offset?: number }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {stack.map((s, i) => (
        <li
          key={s}
          className={`rounded-full border-2 border-navy px-2.5 py-0.5 text-xs font-semibold ${chipColors[(i + offset) % chipColors.length]}`}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
      className={`overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.1)] transition hover:-translate-y-1 ${tilts[index % tilts.length]}`}
    >
      <div className="bg-navy-dark px-5 py-3">
        <span className="font-bebas text-xs tracking-[3px] text-neon-yellow">FEATURED BUILD</span>
      </div>
      <div className="flex flex-1 flex-col bg-white p-5">
        <h3 className="font-bebas text-2xl leading-tight text-navy">{project.name}</h3>
        <div className="mt-1 h-0.5 w-8 bg-neon-yellow" />
        <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/85">{project.description}</p>
        {project.highlights && (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-relaxed text-navy/70">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}
        <StackChips stack={project.stack} offset={index} />
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-bebas tracking-widest text-coral-hot underline-offset-4 hover:underline"
        >
          View on GitHub ↗
        </a>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <PageShell
      title="Projects"
      emoji="🌋"
      accent="the good stuff!"
      subtitle="From autonomous AI agents to raw-socket network tools — everything built from scratch."
    >
      {/* gear review banner */}
      <div className="mb-8 flex items-center gap-4">
        <h2 className="font-bebas text-4xl uppercase text-navy-dark">Gear Reviews</h2>
        <div className="h-0.5 flex-1 bg-navy/20" />
        <span className="font-bebas text-sm tracking-[3px] text-coral-hot">FEATURED BUILDS</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <FeaturedCard key={p.name} project={p} index={i} />
        ))}
      </div>

      {/* more section */}
      <div className="mt-14 flex items-center gap-4">
        <h2 className="font-bebas text-3xl uppercase text-navy-dark">More from the Archipelago</h2>
        <div className="h-0.5 flex-1 bg-navy/20" />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((p, i) => (
          <article
            key={p.name}
            className={`flex flex-col overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition hover:-translate-y-1 ${tilts[(i + 1) % tilts.length]}`}
          >
            <div className="bg-navy px-4 py-2">
              <span className="font-bebas text-xs tracking-[2px] text-neon-yellow">PROJECT</span>
            </div>
            <div className="flex flex-1 flex-col bg-white p-4">
              <h3 className="font-bebas text-lg leading-tight text-navy">{p.name}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-navy/80">{p.description}</p>
              <StackChips stack={p.stack} offset={i + 2} />
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 font-bebas text-sm tracking-widest text-coral-hot underline-offset-4 hover:underline"
              >
                GitHub ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
