import type { Metadata } from "next";
import type { CSSProperties } from "react";
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
    "Third-year CS at UVic, technical co-founder at Serendira, surf club regular. Stats, snapshots, and the spawn point.",
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
  { label: "Guild", value: "UVic Surf Club · ECSS" },
  { label: "Sport", value: "Rugby" },
  { label: "Home Base", value: "Victoria, BC" },
  { label: "Surf Map", value: "Tofino · Sri Lanka · Singapore" },
];

/* Field journal: taped-down snapshots. Tilt + tape vary per snap so the
   grid reads as hand-placed, not generated. */
const snaps = [
  {
    src: "/images/rahil-with-surfboard.jpeg",
    alt: "Rahil on the beach in Tofino, longboard under one arm, horns up",
    label: "Tofino, BC",
    note: "boards out",
    tilt: "-2deg",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/rahil-surf-shop.jpeg",
    alt: "Rahil grinning between two full racks of surfboards in a shop",
    label: "Board Shop",
    note: "just browsing",
    tilt: "1.5deg",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/images/rahil-ocean.jpeg",
    alt: "Rahil out on the water",
    label: "Home Waters",
    note: "victoria, bc",
    tilt: "-1deg",
    aspect: "aspect-[4/5]",
  },
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
          <div className="relative mx-auto w-full max-w-[220px]">
            <div className="pixel-panel float-panel overflow-hidden p-2">
              <div className="relative aspect-[3/4] border-2 border-ink bg-navy">
                <Image
                  src="/images/rahil-portrait.jpeg"
                  alt="Rahil Wijeyesekera"
                  fill
                  sizes="220px"
                  priority
                  className="object-cover object-top"
                />
              </div>
              <p className="mt-2 text-center font-press text-[8px] text-mustard">
                Portrait Unlocked
              </p>
            </div>
            {/* souvenir starfish pinned over the card corner */}
            <Image
              src="/images/starfish.png"
              alt=""
              width={72}
              height={73}
              aria-hidden="true"
              className="sticker absolute -right-6 -top-5 rotate-12"
            />
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
              Ships early · Wipes out often
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foam/90 sm:text-base">
              Third-year CS at UVic and technical co-founder at Serendira. I spent a semester
              at NUS in Singapore, interned in Sri Lanka, and learned to surf in water cold
              enough that renting the thick wetsuit stops feeling optional. I like building
              things more than talking about building things, so here are the stats.
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
                  .map(() => "CHARACTER BUILD · FIELD JOURNAL · SPAWN POINT · ")
                  .join("")}
              </span>
            ))}
          </div>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 space-y-10 px-4 py-10 sm:px-6">
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
                Self-reported. Recalibrated after every wipeout.
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
                  alt="Surf session on a Vancouver Island beach"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            </section>
          </div>

          {/* Spawn point: Sri Lanka dossier */}
          <section className="relative">
            <h2 className="mb-4 font-press text-[11px] uppercase text-mustard">
              Spawn Point · Island of Origin
            </h2>
            <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
              <div className="pixel-panel-light relative p-3">
                <Image
                  src="/images/sri-lanka-map.jpg"
                  alt="Vintage survey map of Ceylon"
                  width={500}
                  height={743}
                  sizes="(min-width: 768px) 320px, 90vw"
                  className="w-full border-2 border-ink"
                />
                {/* postage pinned over the map edge */}
                <div className="absolute -right-4 top-6 w-[88px] rotate-6 border-2 border-ink bg-paper p-0.5 shadow-[4px_4px_0_var(--ink)] sm:w-[104px]">
                  <Image
                    src="/images/lighthouse-stamp.jpg"
                    alt="Sri Lankan 75-cent stamp of the Great Basses lighthouse"
                    width={736}
                    height={1046}
                    className="w-full"
                  />
                  <span className="tape -left-3 -top-2 h-4 w-10 -rotate-45" aria-hidden="true" />
                </div>
                <div className="absolute -right-2 top-44 w-[72px] -rotate-6 border-2 border-ink bg-paper p-0.5 shadow-[4px_4px_0_var(--ink)] sm:w-[84px]">
                  <Image
                    src="/images/sri-lanka-stamp.jpg"
                    alt="Ceylon 10-cent stamp of king coconuts"
                    width={354}
                    height={400}
                    className="w-full"
                  />
                  <span className="tape -right-3 -top-2 h-4 w-10 rotate-45" aria-hidden="true" />
                </div>
                <p className="mt-2 text-center font-press text-[8px] uppercase text-navy/70">
                  Ceylon · Survey Map
                </p>
              </div>

              <div className="pixel-panel relative p-5 sm:p-6">
                <p className="mb-2 font-press text-[9px] text-sunset">Heritage Log</p>
                <p className="max-w-prose text-sm leading-relaxed text-foam/90 sm:text-base">
                  Wijeyesekera is a Sri Lankan name, and the island keeps pulling me back.
                  Summer 2024 I was there interning at Innovation Quotient, turning market
                  research into growth plans for bank boards. The surfing was strictly
                  extracurricular. The water is thirty degrees warmer than home and nobody
                  brags about it, which I respect.
                </p>
                <p className="mt-3 max-w-prose text-sm leading-relaxed text-foam/90 sm:text-base">
                  The lighthouse on the 75-cent stamp is Great Basses, a real one off the
                  south coast. The other stamp is king coconuts. Both grow on you.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Innovation Quotient · 2024", "NUS Exchange · 2025", "Tofino runs · ongoing"].map(
                    (chip) => (
                      <span
                        key={chip}
                        className="border-2 border-ink bg-navy px-2 py-1 font-press text-[8px] uppercase text-foam"
                      >
                        {chip}
                      </span>
                    )
                  )}
                </div>
                {/* souvenirs escaping the panel */}
                <Image
                  src="/images/coconut.png"
                  alt=""
                  width={80}
                  height={102}
                  aria-hidden="true"
                  className="sticker absolute -bottom-6 -right-4 -rotate-6"
                />
                <Image
                  src="/images/fish.png"
                  alt=""
                  width={110}
                  height={35}
                  aria-hidden="true"
                  className="sticker absolute -bottom-4 left-6 rotate-3"
                />
              </div>
            </div>
          </section>

          {/* Quest log */}
          <section className="pixel-panel p-5 sm:p-6">
            <h2 className="mb-4 font-press text-[11px] uppercase text-mustard">Quest Log</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 font-press text-[9px] text-sunset">Entry 01 · Main Quest</p>
                <p className="text-sm leading-relaxed text-foam/90">
                  Serendira started while I was still sorting out my course schedule. I lead
                  engineering for a talent platform matching remote professionals across Asia
                  with enterprise clients, and on a founding team that means design, build,
                  deploy, and answering the bug reports too. Somewhere between the pitch deck
                  and the first real users I stopped being precious about unfinished code.
                </p>
              </div>
              <div>
                <p className="mb-2 font-press text-[9px] text-sunset">Entry 02 · Side Quests</p>
                <p className="text-sm leading-relaxed text-foam/90">
                  The C projects are how I relax, which I understand is a strange sentence. A
                  process manager, a FAT12 file-system tool, a TCP analyzer that rebuilds
                  connection state from raw captures. I like knowing what the bytes are doing
                  under all the frameworks. Then I climb back up the stack and make things
                  like this site, a canvas doing its best impression of an ocean.
                </p>
              </div>
            </div>
            <blockquote className="mt-6 border-4 border-ink bg-coral px-4 py-4 font-pixel text-lg leading-snug text-foam sm:text-xl">
              &ldquo;Paddle out. Worst case, you swim back.&rdquo;
            </blockquote>
          </section>

          {/* Field journal: taped snapshots + lurking shark */}
          <section className="relative">
            <h2 className="mb-4 font-press text-[11px] uppercase text-mustard">
              Field Journal · Life in the Swell
            </h2>
            {/* the shark inspects the journal from behind the snaps */}
            <Image
              src="/images/shark-popup.png"
              alt=""
              width={150}
              height={181}
              aria-hidden="true"
              className="sticker absolute -top-14 right-2 hidden rotate-6 md:block"
            />
            <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
              {snaps.map((shot) => (
                <figure
                  key={shot.src}
                  className="snap p-2"
                  style={{ "--tilt": shot.tilt } as CSSProperties}
                >
                  <span
                    className="tape -top-3 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-2"
                    aria-hidden="true"
                  />
                  <div className={`relative ${shot.aspect} border-2 border-ink`}>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-2 flex items-baseline justify-between gap-2 px-1 pb-1">
                    <span className="font-press text-[8px] uppercase text-navy">{shot.label}</span>
                    <span className="font-pixel text-sm lowercase text-navy/70">{shot.note}</span>
                  </figcaption>
                </figure>
              ))}

              {/* found footage: the old point-and-shoot, screen still on */}
              <figure className="snap p-2" style={{ "--tilt": "2.5deg" } as CSSProperties}>
                <span
                  className="tape -top-3 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-3"
                  aria-hidden="true"
                />
                <div className="border-2 border-ink bg-paper">
                  <Image
                    src="/images/retro-camera.png"
                    alt="Back of an old Canon point-and-shoot, its screen showing a 2022 skimboarding photo"
                    width={1080}
                    height={666}
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw"
                    className="w-full"
                  />
                </div>
                <figcaption className="mt-2 flex items-baseline justify-between gap-2 px-1 pb-1">
                  <span className="font-press text-[8px] uppercase text-navy">Found Footage</span>
                  <span className="font-pixel text-sm lowercase text-navy/70">skim era, 2022</span>
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Contact easter egg */}
          <section className="pixel-panel-light relative p-6 text-center sm:p-8">
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
            <Image
              src="/images/seashell.png"
              alt=""
              width={64}
              height={58}
              aria-hidden="true"
              className="sticker absolute -left-4 -top-5 -rotate-12"
            />
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
