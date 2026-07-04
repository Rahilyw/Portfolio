import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { experience } from "@/data/content";

export const metadata: Metadata = {
  title: "Experience — Rahil Wijeyesekera",
  description:
    "Technical co-founder at Serendira and business design intern at Innovation Quotient.",
};

export default function ExperiencePage() {
  return (
    <PageShell
      title="Experience"
      emoji="🗼"
      accent="the grind"
      subtitle="Where I've worked — from co-founding a startup to enterprise consulting."
    >
      <ol className="relative space-y-8 border-l-[3px] border-navy/30 pl-6">
        {experience.map((job, i) => (
          <li key={job.company} className="relative">
            <span
              className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-[3px] border-navy bg-tealsurf"
              aria-hidden="true"
            />
            <article className={`sticker p-6 ${i % 2 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl text-navy">{job.role}</h2>
                <p className="font-display text-sm text-coral">{job.period}</p>
              </div>
              <p className="mt-1 font-medium text-navy/85">{job.company}</p>
              <p className="text-sm text-navy/60">{job.location}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-navy/80">
                {job.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
