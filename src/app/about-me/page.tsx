import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/data/content";
import WaveBackground from "@/components/game/WaveBackground";
import StatBar from "@/components/game/StatBar";
import { PixelLink } from "@/components/game/PixelButton";
import { Seashell, Surfboard, WaveIcon, ShellBullet } from "@/components/game/SurfMotifs";
import BottleReveal from "@/components/BottleReveal";

export const metadata: Metadata = {
  title: "About Me — Rahil Wijeyesekera",
  description:
    "Third-year CS student at UVic, Technical Co-founder, Surf Club Executive, and builder of things that ship.",
};

const attributes = [
  { label: "AI Agents", value: 88, color: "bg-tealsurf" },
  { label: "Systems", value: 78, color: "bg-ocean-2" },
  { label: "Web Cloud", value: 84, color: "bg-sunset" },
  { label: "Languages", value: 90, color: "bg-mustard" },
  { label: "Ship Speed", value: 92, color: "bg-coral" },
  { label: "Surf Power", value: 95, color: "bg-lime" },
];

const vitals = [
  { label: "Class", value: "Builder / Surfer" },
  { label: "Level", value: "CS Year 3" },
  { label: "Guild", value: "UVic Surf Club Exec" },
  { label: "Sport", value: "High-level rugby" },
  { label: "Home Base", value: "Victoria, BC" },
  { label: "Surf Map", value: "Tofino · Sri Lanka · Singapore" },
];

export default function AboutMePage() {
  return (
    <div className="game-cursor relative flex min-h-[100dvh] flex-col overflow-x-hidden text-foam">
      <WaveBackground />

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <div className="flex items-center justify-between border-b-4 border-ink bg-ocean-deep/90 px-3 py-2 sm:px-5">
          <span className="font-press text-[8px] uppercase tracking-wider text-mustard sm:text-[10px]">
            Surf Quest · Character Sheet
          </span>
          <span className="font-press text-[8px] uppercase text-lime sm:text-[10px]">
            HP 100/100
          </span>
        </div>

        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-5 sm:px-6">
          <PixelLink href="/" variant="secondary">
            <WaveIcon size={14} />
            Ocean Map
          </PixelLink>
          <PixelLink href={site.github} external variant="accent">
            GitHub
          </PixelLink>
        </nav>

        {/* Character header */}
        <header className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-10 md:grid-cols-[220px_1fr] md:items-end sm:px-6">
          <div className="pixel-panel float-panel mx-auto w-full max-w-[220px] overflow-hidden p-2">
            <div className="relative aspect-[3/4] border-2 border-ink bg-navy">
              <Image
                src="/images/rahil-portrait.jpeg"
                alt="Rahil Wijeyesekera"
                fill
                sizes="220px"
                priority
                className="object-cover object-top"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <p className="mt-2 text-center font-press text-[8px] text-mustard">Portrait Unlocked</p>
          </div>

          <div>
            <p className="font-press text-[9px] uppercase tracking-[0.18em] text-mustard">
              Player Select
            </p>
            <h1
              className="font-pixel mt-2 text-3xl uppercase leading-tight text-foam sm:text-5xl"
              style={{ textShadow: "4px 4px 0 var(--ink)" }}
            >
              Yasith Rahil
              <br />
              Wijeyesekera
            </h1>
            <p className="mt-3 inline-flex items-center gap-2 border-2 border-ink bg-sunset px-3 py-1 font-press text-[9px] uppercase text-foam">
              <Surfboard size={12} />
              The Builder Who Ships
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foam/90 sm:text-base">
              Third-year Computer Science at UVic. Technical Co-founder. Surf Club Executive.
              Rugby veteran. He does not study products - he builds them and paddles them into
              the wild.
            </p>
          </div>
        </header>

        <div
          className="overflow-hidden border-y-4 border-ink bg-navy/90 py-1.5"
          aria-hidden="true"
        >
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="font-press whitespace-nowrap text-[9px] tracking-[0.18em] text-mustard"
              >
                {Array.from({ length: 6 })
                  .map(() => "CHARACTER BUILD · ORIGIN STORY · STATS ALLOCATED · ")
                  .join("")}
              </span>
            ))}
          </div>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-10 sm:px-6">
          {/* Stats + Vitals */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="pixel-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 font-press text-[11px] uppercase text-mustard">
                <Seashell /> Attribute Points
              </h2>
              <div className="space-y-3">
                {attributes.map((stat) => (
                  <StatBar
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    color={stat.color}
                  />
                ))}
              </div>
              <p className="mt-4 font-press text-[8px] leading-relaxed text-foam/55">
                Points invested via shipping real projects, not reading about waves.
              </p>
            </section>

            <section className="pixel-panel p-5">
              <h2 className="mb-4 flex items-center gap-2 font-press text-[11px] uppercase text-mustard">
                <Surfboard /> Character Vitals
              </h2>
              <dl className="space-y-3">
                {vitals.map((v) => (
                  <div
                    key={v.label}
                    className="grid grid-cols-[6.5rem_1fr] gap-2 border-b-2 border-foam/10 pb-2 sm:grid-cols-[7.5rem_1fr]"
                  >
                    <dt className="font-press text-[8px] uppercase text-foam/50">{v.label}</dt>
                    <dd className="text-sm text-foam">{v.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="relative mt-5 aspect-[16/10] border-2 border-ink">
                <Image
                  src="/images/rahil-surf-beach.jpeg"
                  alt="Surf session"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            </section>
          </div>

          {/* Origin story */}
          <section className="pixel-panel p-5 sm:p-6">
            <h2 className="mb-4 font-press text-[11px] uppercase text-mustard">Origin Story</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 font-press text-[9px] text-sunset">Quest Log Entry 01</p>
                <p className="text-sm leading-relaxed text-foam/90">
                  You can read a hundred papers on surfing and still wipe out on your first wave.
                  Same deal with software. Serendira, FlockIn, a TCP analyzer from scratch in C -
                  that is where the real XP drops. Ship first, polish later.
                </p>
              </div>
              <div>
                <p className="mb-2 font-press text-[9px] text-sunset">Quest Log Entry 02</p>
                <p className="text-sm leading-relaxed text-foam/90">
                  From TCP packets at the bottom to React on top, the drive is full-stack
                  curiosity. As Technical Co-founder at Serendira that meant product,
                  infrastructure, and growth in one run. The C tools were pure side quests.
                </p>
              </div>
            </div>
            <blockquote className="mt-6 border-4 border-ink bg-coral px-4 py-4 font-pixel text-lg leading-snug text-foam sm:text-xl">
              &ldquo;Ship first, polish later. You can not learn to surf by reading about it.&rdquo;
            </blockquote>
          </section>

          {/* Photo gallery as unlocked zones */}
          <section>
            <h2 className="mb-4 font-press text-[11px] uppercase text-mustard">
              Unlocked Zones · Life in the Swell
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { src: "/images/rahil-tofino.jpeg", alt: "Tofino surf", label: "Tofino, BC" },
                { src: "/images/rahil-surf-shop.jpeg", alt: "Surf shop", label: "On the Boards" },
                { src: "/images/rahil-ocean.jpeg", alt: "On the water", label: "On the Water" },
              ].map((shot, i) => (
                <figure
                  key={shot.src}
                  className={`pixel-panel overflow-hidden p-2 ${i === 1 ? "float-panel" : ""}`}
                  style={i === 1 ? { animationDelay: "0.6s" } : undefined}
                >
                  <div className="relative aspect-[4/5] border-2 border-ink">
                    <Image src={shot.src} alt={shot.alt} fill sizes="280px" className="object-cover" />
                  </div>
                  <figcaption className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-press text-[8px] text-mustard">{shot.label}</span>
                    <span className="font-press text-[7px] text-lime">CLEAR</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* Contact easter egg */}
          <section className="pixel-panel-light p-6 text-center sm:p-8">
            <p className="font-press text-[9px] uppercase text-navy/60">Secret Item Found</p>
            <h2 className="font-pixel mt-2 text-2xl uppercase text-navy sm:text-3xl">
              Message in a Bottle
            </h2>
            <ul className="mx-auto mt-3 max-w-md space-y-1 text-left">
              <ShellBullet className="text-navy/80">
                Tap the bottle to reveal contact loot
              </ShellBullet>
              <ShellBullet className="text-navy/80">
                Email, LinkedIn, GitHub, and résumé drop
              </ShellBullet>
            </ul>
            <div className="mt-4 [&_button]:font-press [&_p]:text-navy/70">
              <BottleReveal />
            </div>
          </section>
        </main>

        <footer className="border-t-4 border-ink bg-ocean-deep/95 px-4 py-5 text-center">
          <p className="font-press text-[8px] leading-relaxed text-foam/70 sm:text-[9px]">
            {site.name}
            {" · "}
            <a className="text-mustard underline-offset-2 hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            {" · "}
            <a
              className="text-mustard underline-offset-2 hover:underline"
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {" · "}
            <a
              className="text-mustard underline-offset-2 hover:underline"
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
