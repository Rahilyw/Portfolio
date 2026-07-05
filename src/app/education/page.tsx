import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { education } from "@/data/content";

export const metadata: Metadata = {
  title: "Education — Rahil Wijeyesekera",
  description:
    "B.Sc. Computer Science at the University of Victoria, with an international exchange at the National University of Singapore.",
};

const accents = ["bg-navy-dark", "bg-coral"];

export default function EducationPage() {
  return (
    <PageShell
      title="Education"
      emoji="⛰️"
      accent="study waves"
      subtitle="Where I've studied — from Victoria, BC to Singapore."
    >
      <div className="space-y-8">
        {education.map((e, i) => (
          <article
            key={e.school}
            className="overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
            style={{ transform: `rotate(${i % 2 ? "-0.4deg" : "0.4deg"})` }}
          >
            <div className={`flex items-center justify-between px-6 py-3 ${accents[i % accents.length]}`}>
              <span className="font-bebas text-lg tracking-[3px] text-neon-yellow">EDUCATION</span>
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-white/60">
                {e.period}
              </span>
            </div>
            <div className="bg-white p-6">
              <h2 className="font-bebas text-4xl leading-none text-navy">{e.school.toUpperCase()}</h2>
              <p className="font-editorial mt-1 text-xl italic text-coral">{e.degree}</p>
              <div className="mt-2 h-0.5 w-10 bg-neon-yellow" />
              <p className="mt-2 text-sm text-navy/55">{e.location}</p>
              <p className="mt-3 text-sm leading-relaxed text-navy/80">{e.details}</p>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
