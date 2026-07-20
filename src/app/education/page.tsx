import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { ShellBullet } from "@/components/game/SurfMotifs";
import { education } from "@/data/content";

export const metadata: Metadata = {
  title: "Education — Rahil Wijeyesekera",
  description:
    "B.Sc. Computer Science at the University of Victoria, with an international exchange at the National University of Singapore.",
};

const levelMeta = [
  {
    stage: "01",
    status: "IN PROGRESS",
    statusColor: "bg-mustard text-navy",
    mapLabel: "Home Waters",
  },
  {
    stage: "02",
    status: "CLEARED",
    statusColor: "bg-lime text-navy",
    mapLabel: "Exchange Route",
  },
];

export default function EducationPage() {
  return (
    <PageShell
      title="Education"
      accent="level map"
      hudLabel="Level Map"
      subtitle="Training grounds unlocked - from Victoria, BC to a semester abroad in Singapore."
    >
      {/* path legend */}
      <div className="mb-8 flex flex-wrap items-center gap-3 font-press text-[8px] uppercase text-foam/70">
        <span className="border-2 border-ink bg-ocean-deep px-2 py-1">Route Progress</span>
        <span className="h-1 flex-1 min-w-[4rem] bg-[repeating-linear-gradient(90deg,var(--mustard)_0_8px,transparent_8px_14px)]" />
        <span className="text-mustard">2 Stages</span>
      </div>

      <ol className="relative space-y-8">
        {/* vertical path line */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-[1.15rem] top-8 w-1 bg-[repeating-linear-gradient(180deg,var(--mustard)_0_10px,transparent_10px_18px)] sm:left-[1.35rem]"
        />

        {education.map((e, i) => {
          const meta = levelMeta[i] ?? levelMeta[0];
          return (
            <li key={e.school} className="relative flex gap-4 sm:gap-6">
              {/* node */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border-4 border-ink bg-sunset font-press text-[10px] text-foam shadow-[3px_3px_0_var(--ink)] sm:h-12 sm:w-12">
                {meta.stage}
              </div>

              <article className="pixel-panel flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-4 border-ink bg-navy/60 px-4 py-2">
                  <span className="font-press text-[8px] uppercase text-mustard">
                    {meta.mapLabel}
                  </span>
                  <span className={`border-2 border-ink px-2 py-0.5 font-press text-[8px] uppercase ${meta.statusColor}`}>
                    {meta.status}
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="font-press text-[8px] uppercase text-foam/50">{e.period}</p>
                  <h2 className="font-pixel mt-1 text-2xl uppercase leading-tight text-foam sm:text-3xl">
                    {e.school}
                  </h2>
                  <p className="mt-1 text-base text-mustard sm:text-lg">{e.degree}</p>
                  <p className="mt-1 text-sm text-foam/60">{e.location}</p>
                  <ul className="mt-4 space-y-1.5">
                    <ShellBullet>{e.details}</ShellBullet>
                  </ul>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </PageShell>
  );
}
