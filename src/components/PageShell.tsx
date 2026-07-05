import Link from "next/link";
import { site } from "@/data/content";
import { Hibiscus, Starfish, CircleBadge } from "@/components/Stickers";

export default function PageShell({
  title,
  emoji,
  subtitle,
  accent = "surf's up!",
  section,
  children,
}: {
  title: string;
  emoji: string;
  subtitle: string;
  accent?: string;
  section?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-parchment">
      <header className="relative overflow-hidden bg-parchment pb-12 pt-0 text-center">
        {/* magazine issue strip */}
        <div className="flex items-center justify-between bg-navy-dark px-6 py-2">
          <span className="font-bebas text-sm tracking-[3px] text-neon-yellow">SURF &amp; CODE QUARTERLY</span>
          <span className="font-bebas text-sm tracking-[2px] text-white/50">ISSUE 01 · SUMMER 2026</span>
          <span className="font-bebas text-sm tracking-[3px] text-neon-yellow">{(section ?? title).toUpperCase()}</span>
        </div>

        {/* nav */}
        <nav className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 pt-5">
          <Link
            href="/"
            className="sticker px-4 py-2 font-display text-sm text-navy transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            🌊 Back to the ocean
          </Link>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="sticker px-4 py-2 font-display text-sm text-navy transition hover:-translate-y-0.5"
          >
            GitHub ↗
          </a>
        </nav>

        {/* minimal sticker scatter */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 top-8">
          <div className="absolute left-[5%] top-[38%] -rotate-12 opacity-80 drop-shadow-[3px_3px_0_rgba(10,45,78,0.25)]">
            <Hibiscus size={58} />
          </div>
          <div className="absolute right-[6%] top-[32%] rotate-[10deg] opacity-80 drop-shadow-[3px_3px_0_rgba(10,45,78,0.25)]">
            <Starfish size={52} />
          </div>
          <div className="absolute right-[18%] top-[8%] hidden rotate-6 opacity-60 lg:block">
            <CircleBadge size={72} />
          </div>
        </div>

        {/* kicker */}
        <p className="font-marker relative z-10 mt-10 text-sm tracking-wide text-navy/70">
          ☼ RAHIL&apos;S SURF LOG — VOL. 1 ☼
        </p>

        {/* headline */}
        <h1
          className="font-bebas relative z-10 mt-2 text-7xl uppercase text-navy md:text-9xl"
          style={{ textShadow: "3px 3px 0 var(--neon-yellow), 6px 6px 0 var(--navy-dark)" }}
        >
          <span aria-hidden="true" className="mr-2 text-[0.55em]">{emoji}</span>
          {title}
        </h1>

        {/* script accent */}
        <p
          aria-hidden="true"
          className="font-script relative z-10 -mt-1 -rotate-2 text-2xl text-coral md:text-3xl"
          style={{ textShadow: "2px 2px 0 var(--parchment)" }}
        >
          {accent}
        </p>

        {/* subtitle */}
        <p className="font-editorial relative z-10 mx-auto mt-3 max-w-xl text-lg italic text-navy/70">
          {subtitle}
        </p>
      </header>

      {/* scrolling marquee */}
      <div className="overflow-hidden border-y-4 border-navy-dark bg-navy-dark py-1.5" aria-hidden="true">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <span key={copy} className="font-bebas whitespace-nowrap text-sm tracking-[0.2em] text-parchment">
              {Array.from({ length: 6 })
                .map(() => `${title.toUpperCase()} · SURF · BUILD · REPEAT · `)
                .join("")}
            </span>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">{children}</main>

      <footer className="px-6 pb-8 text-center text-sm text-navy/60">
        <p>
          {site.name} ·{" "}
          <a className="underline hover:text-navy" href={`mailto:${site.email}`}>
            {site.email}
          </a>{" "}
          ·{" "}
          <a className="underline hover:text-navy" href={site.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          ·{" "}
          <a className="underline hover:text-navy" href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
