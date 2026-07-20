import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { ShellBullet, Surfboard } from "@/components/game/SurfMotifs";
import { experience } from "@/data/content";

export const metadata: Metadata = {
  title: "Experience — Rahil Wijeyesekera",
  description:
    "Technical co-founder at Serendira, ECSS Director, Business Design Intern at Innovation Quotient, and more.",
};

const stampColors = [
  "bg-mustard text-navy",
  "bg-tealsurf text-foam",
  "bg-sunset text-foam",
  "bg-coral text-foam",
];

export default function ExperiencePage() {
  return (
    <PageShell
      title="Experience"
      accent="campaign journal"
      hudLabel="Campaign Log"
      subtitle="Chapters paddled through - startups, campus leadership, and real client work."
    >
      <ol className="space-y-6">
        {experience.map((job, i) => (
          <li key={job.company}>
            <article className="pixel-panel overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-navy/50 px-4 py-2.5">
                <span className="inline-flex items-center gap-2 font-press text-[9px] uppercase text-mustard">
                  <Surfboard size={12} />
                  Chapter {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-press text-[8px] uppercase text-foam/55">{job.period}</span>
              </div>

              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:p-5">
                <div className="flex-1">
                  <h2 className="font-pixel text-2xl uppercase leading-tight text-foam sm:text-3xl">
                    {job.company}
                  </h2>
                  <p className="mt-1 text-base text-mustard sm:text-lg">{job.role}</p>
                  <p className="mt-1 text-sm text-foam/55">{job.location}</p>
                  <ul className="mt-4 space-y-2">
                    {job.points.map((pt) => (
                      <ShellBullet key={pt}>{pt}</ShellBullet>
                    ))}
                  </ul>
                </div>

                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center border-4 border-ink font-press text-sm shadow-[4px_4px_0_var(--ink)] sm:h-20 sm:w-20 sm:text-base ${stampColors[i % stampColors.length]}`}
                >
                  {job.stamp}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
