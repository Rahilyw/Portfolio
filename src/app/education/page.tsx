import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { education } from "@/data/content";

export const metadata: Metadata = {
  title: "Education — Rahil Wijeyesekera",
  description:
    "B.Sc. Computer Science at the University of Victoria, with an international exchange at the National University of Singapore.",
};

export default function EducationPage() {
  return (
    <PageShell
      title="Education"
      emoji="⛰️"
      accent="study waves"
      subtitle="Where I've studied — from Victoria, BC to Singapore."
    >
      <ol className="relative space-y-8 border-l-[3px] border-navy/30 pl-6">
        {education.map((e, i) => (
          <li key={e.school} className="relative">
            <span
              className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-[3px] border-navy bg-mustard"
              aria-hidden="true"
            />
            <article className={`sticker p-6 ${i % 2 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl text-navy">{e.school}</h2>
                <p className="font-display text-sm text-coral">{e.period}</p>
              </div>
              <p className="mt-1 font-medium text-navy/85">{e.degree}</p>
              <p className="text-sm text-navy/60">{e.location}</p>
              <p className="mt-3 text-sm text-navy/80">{e.details}</p>
            </article>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
