import { site } from "@/data/content";
import WaveBackground from "@/components/game/WaveBackground";
import { PixelLink } from "@/components/game/PixelButton";
import { WaveIcon } from "@/components/game/SurfMotifs";

export default function PageShell({
  title,
  subtitle,
  accent = "press start",
  hudLabel = "STAGE SELECT",
  children,
}: {
  title: string;
  subtitle: string;
  accent?: string;
  hudLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="game-cursor relative flex min-h-[100dvh] flex-col overflow-x-hidden text-foam">
      <WaveBackground />

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* HUD top bar */}
        <div className="flex items-center justify-between border-b-4 border-ink bg-ocean-deep/90 px-3 py-2 backdrop-blur-[2px] sm:px-5">
          <span className="font-press text-[8px] uppercase tracking-wider text-mustard sm:text-[10px]">
            Surf Quest · {hudLabel}
          </span>
          <span className="hidden font-press text-[9px] text-foam/60 sm:inline">
            Player 1 · Rahil
          </span>
          <span className="font-press text-[8px] uppercase text-lime sm:text-[10px]">
            HP 100/100
          </span>
        </div>

        {/* nav */}
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pt-5 sm:px-6">
          <PixelLink href="/" variant="secondary">
            <WaveIcon size={14} />
            Ocean Map
          </PixelLink>
          <PixelLink href={site.github} external variant="accent">
            GitHub
          </PixelLink>
        </nav>

        {/* stage title */}
        <header className="mx-auto w-full max-w-5xl px-4 pb-6 pt-8 text-center sm:px-6">
          <p className="font-press text-[9px] uppercase tracking-[0.2em] text-mustard sm:text-[10px]">
            {accent}
          </p>
          <h1
            className="font-pixel mt-3 text-4xl uppercase leading-none text-foam sm:text-5xl md:text-6xl"
            style={{ textShadow: "4px 4px 0 var(--ink), -2px 0 0 var(--ocean-deep)" }}
          >
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-foam/85 sm:text-base">
            {subtitle}
          </p>
          <div className="mx-auto mt-5 h-1 w-24 bg-mustard shadow-[4px_0_0_var(--sunset),8px_0_0_var(--coral)]" />
        </header>

        {/* ticker */}
        <div
          className="overflow-hidden border-y-4 border-ink bg-navy/90 py-1.5"
          aria-hidden="true"
        >
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="font-press whitespace-nowrap text-[9px] tracking-[0.18em] text-mustard sm:text-[10px]"
              >
                {Array.from({ length: 5 })
                  .map(() => `${title.toUpperCase()} · CATCH THE WAVE · BUILD · SHIP · `)
                  .join("")}
              </span>
            ))}
          </div>
        </div>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">{children}</main>

        <footer className="border-t-4 border-ink bg-ocean-deep/95 px-4 py-5 text-center sm:px-6">
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
