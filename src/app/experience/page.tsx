import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { experience } from "@/data/content";

export const metadata: Metadata = {
  title: "Experience — Rahil Wijeyesekera",
  description:
    "Technical co-founder at Serendira, ECSS Director, Business Design Intern at Innovation Quotient, and more.",
};

const stampColors = [
  { bg: "bg-neon-yellow", text: "text-navy-dark", rotate: "-rotate-3" },
  { bg: "bg-neon-yellow", text: "text-navy-dark", rotate: "rotate-2" },
  { bg: "bg-coral-hot", text: "text-white", rotate: "-rotate-2" },
  { bg: "bg-coral-hot", text: "text-white", rotate: "rotate-3" },
];

const headerColors = [
  "bg-navy-dark",
  "bg-navy-dark",
  "bg-coral",
  "bg-coral",
];

export default function ExperiencePage() {
  return (
    <PageShell
      title="Experience"
      emoji="🗼"
      accent="the grind"
      subtitle="Roles, runs, and the work that shaped the surfer."
    >
      <ol className="space-y-8">
        {experience.map((job, i) => {
          const stamp = stampColors[i % stampColors.length];
          const header = headerColors[i % headerColors.length];
          return (
            <li key={job.company}>
              <article
                className="overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
                style={{ transform: `rotate(${i % 2 ? "-0.4deg" : "0.4deg"})` }}
              >
                {/* LOG header strip */}
                <div className={`flex items-center justify-between px-6 py-3 ${header}`}>
                  <span className="font-bebas text-xl tracking-[3px] text-neon-yellow">
                    LOG {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-white/60">
                    {job.period}
                  </span>
                </div>

                {/* body */}
                <div className="flex items-start gap-6 bg-white p-6">
                  <div className="flex-1">
                    <h2 className="font-bebas text-4xl leading-none text-navy">
                      {job.company.toUpperCase()}
                    </h2>
                    <p className="font-editorial mt-1 text-xl italic text-coral">{job.role}</p>
                    <div className="mt-2 h-0.5 w-10 bg-neon-yellow" />
                    <p className="mt-1 text-sm text-navy/55">{job.location}</p>
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-navy/80">
                      {job.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {/* stamp badge */}
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center ${stamp.bg} ${stamp.rotate}`}
                  >
                    <span className={`font-bebas text-2xl ${stamp.text}`}>{job.stamp}</span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
