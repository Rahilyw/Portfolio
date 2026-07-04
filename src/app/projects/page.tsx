import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { featuredProjects, otherProjects, type Project } from "@/data/content";

export const metadata: Metadata = {
  title: "Projects — Rahil Wijeyesekera",
  description:
    "AI agents, RAG systems, network analyzers, and systems programming projects by Rahil Wijeyesekera.",
};

const chipStyles = [
  "bg-tealsurf text-white",
  "bg-sunset text-white",
  "bg-mustard text-navy",
  "bg-coral text-white",
  "bg-navy text-cream",
];

function StackChips({ stack }: { stack: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5">
      {stack.map((s, i) => (
        <li
          key={s}
          className={`rounded-full border-2 border-navy px-2.5 py-0.5 text-xs font-semibold ${chipStyles[i % chipStyles.length]}`}
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

const tilts = ["rotate-[0.6deg]", "-rotate-[0.5deg]", "-rotate-[0.7deg]", "rotate-[0.4deg]"];

function FeaturedCard({ project, tilt }: { project: Project; tilt: string }) {
  return (
    <article className={`sticker p-6 transition hover:-translate-y-1 ${tilt}`}>
      <h3 className="font-display text-xl text-navy">{project.name}</h3>
      <p className="mt-2 text-navy/85">{project.description}</p>
      {project.highlights && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/75">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
      <StackChips stack={project.stack} />
      <a
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block font-display text-sm text-coral underline-offset-4 hover:underline"
      >
        View on GitHub ↗
      </a>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <PageShell
      title="Projects"
      emoji="🌋"
      accent="the good stuff!"
      subtitle="From autonomous AI agents to raw-socket network tools — everything here is my own work, built from scratch."
    >
      <h2 className="font-display text-3xl uppercase text-navy" style={{ textShadow: "2px 2px 0 var(--lime)" }}>
        Featured
      </h2>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <FeaturedCard key={p.name} project={p} tilt={tilts[i % tilts.length]} />
        ))}
      </div>

      <h2 className="font-display mt-14 text-3xl uppercase text-navy" style={{ textShadow: "2px 2px 0 var(--hotpink)" }}>
        More from the archipelago
      </h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {otherProjects.map((p, i) => (
          <article
            key={p.name}
            className={`sticker flex flex-col p-4 transition hover:-translate-y-1 ${tilts[(i + 1) % tilts.length]}`}
          >
            <h3 className="font-display text-navy">{p.name}</h3>
            <p className="mt-1.5 flex-1 text-sm text-navy/80">{p.description}</p>
            <StackChips stack={p.stack} />
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 font-display text-sm text-coral underline-offset-4 hover:underline"
            >
              GitHub ↗
            </a>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
