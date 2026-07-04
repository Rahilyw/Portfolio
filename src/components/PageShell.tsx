import Link from "next/link";
import { site } from "@/data/content";
import { Hibiscus, Starfish, WaveBadge, SunSpiral, SharkSign, CircleBadge } from "@/components/Stickers";

/**
 * Shared layout for section pages, styled like a vintage surf-magazine
 * cover: sunset header with a spinning sunburst, stacked neon-shadow
 * headline with a script accent, scattered sticker decals, and a
 * scrolling cover-line marquee.
 */
export default function PageShell({
  title,
  emoji,
  subtitle,
  accent = "surf's up!",
  children,
}: {
  title: string;
  emoji: string;
  subtitle: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-cream">
      <header
        className="relative overflow-hidden px-6 pb-16 pt-10 text-center"
        style={{
          background:
            "linear-gradient(to bottom, #ffe8c9 0%, #ffd2a6 45%, #ffb183 80%, #ff9e74 100%)",
        }}
      >
        {/* retro sunburst, slowly spinning */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 opacity-90"
          style={{ animation: "sun-spin 90s linear infinite" }}
        >
          <Sunburst />
        </div>

        {/* sticker scatter */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-[6%] top-[30%] -rotate-12 drop-shadow-[3px_3px_0_rgba(29,53,87,0.35)]">
            <Hibiscus />
          </div>
          <div className="absolute right-[7%] top-[26%] rotate-[10deg] drop-shadow-[3px_3px_0_rgba(29,53,87,0.35)]">
            <Starfish />
          </div>
          <div className="absolute bottom-[14%] left-[12%] hidden rotate-[7deg] drop-shadow-[3px_3px_0_rgba(29,53,87,0.35)] md:block">
            <WaveBadge />
          </div>
          <div className="absolute bottom-[12%] right-[10%] hidden -rotate-6 drop-shadow-[3px_3px_0_rgba(29,53,87,0.35)] md:block">
            <SharkSign />
          </div>
          <div className="absolute left-[24%] top-[8%] hidden -rotate-6 lg:block">
            <SunSpiral size={60} />
          </div>
          <div className="absolute right-[22%] top-[6%] hidden rotate-6 drop-shadow-[3px_3px_0_rgba(29,53,87,0.35)] lg:block">
            <CircleBadge size={84} />
          </div>
        </div>

        <nav className="relative z-10 mx-auto flex max-w-4xl items-center justify-between">
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

        {/* magazine kicker */}
        <p className="font-marker relative z-10 mt-8 text-sm tracking-wide text-navy/80">
          ☼ RAHIL&apos;S SURF LOG — VOL. 1 ☼
        </p>

        <h1
          className="font-display relative z-10 mt-2 text-5xl uppercase text-white md:text-7xl"
          style={{
            textShadow: "3px 3px 0 var(--hotpink), 7px 7px 0 var(--navy)",
            WebkitTextStroke: "2px var(--navy)",
          }}
        >
          <span aria-hidden="true">{emoji} </span>
          {title}
        </h1>

        {/* script accent, Roxy-poster style */}
        <p
          aria-hidden="true"
          className="font-script relative z-10 -mt-2 -rotate-3 text-2xl text-hotpink md:text-3xl"
          style={{ textShadow: "2px 2px 0 #fffdf6" }}
        >
          {accent}
        </p>

        <p className="relative z-10 mx-auto mt-3 max-w-xl font-medium text-navy/90">{subtitle}</p>
      </header>

      {/* scrolling cover-line marquee */}
      <div className="overflow-hidden border-y-4 border-navy bg-navy py-1.5" aria-hidden="true">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <span key={copy} className="font-display whitespace-nowrap text-sm tracking-[0.2em] text-cream">
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

function Sunburst() {
  // 16 triangular rays around a warm sun disc, vintage-print style
  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    return (
      <path
        key={i}
        d="M0 -74 L11 -108 L-11 -108 Z"
        fill={i % 2 === 0 ? "#f2b134" : "#f4793b"}
        transform={`rotate(${angle})`}
      />
    );
  });
  return (
    <svg width="360" height="360" viewBox="-180 -180 360 360">
      <g opacity="0.85">{rays}</g>
      <circle r="64" fill="#f2b134" />
      <circle r="64" fill="none" stroke="#e76f51" strokeWidth="5" />
      <circle r="50" fill="none" stroke="#e76f51" strokeWidth="2.5" opacity="0.6" />
    </svg>
  );
}
