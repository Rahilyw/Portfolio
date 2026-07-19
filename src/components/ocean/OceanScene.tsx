import Link from "next/link";
import { islands, site } from "@/data/content";
import { SPRITE_SIZES, DISPLAY_SCALE } from "@/components/pixel/islandArt";
import WaveCanvas from "./WaveCanvas";
import Surfer from "./Surfer";
import IslandSprite from "./IslandSprite";
import OceanLife from "./OceanLife";
import SkyLife from "./SkyLife";
import NightDim from "./NightDim";
import SoundToggle from "@/components/SoundToggle";

const retroChip =
  "border-2 border-ink bg-white/95 px-3 py-1 font-pixel text-sm font-medium text-ink shadow-[3px_3px_0_rgba(8,51,68,0.45)] transition hover:bg-white";

/**
 * The sprite canvases carry different amounts of transparent headroom above
 * the visible art, so each label tucks down (px) into its own sprite box to
 * sit just above the artwork. The chip paints over the sprite, so on the
 * volcano it sits in front of the (faded) smoke column instead of pushing
 * above it.
 */
const LABEL_TUCK: Record<string, number> = {
  volcano: 22,
  lighthouse: 2,
  palm: 30,
  mountain: 26,
  hut: 64,
  bottle: 0,
  ship: 5,
};

/**
 * The desktop map's hand-placed coordinates don't fit a phone — at 375px every
 * island's hit area overlaps a neighbour. Below `md` the islands render as a
 * 2-column grid instead, with sprites shrunk to fit a grid cell. The bottle is
 * much smaller art than the islands, so it shrinks less.
 */
const MOBILE_SPRITE_SCALE: Record<string, number> = {
  volcano: 0.5,
  lighthouse: 0.5,
  palm: 0.5,
  mountain: 0.5,
  hut: 0.5,
  bottle: 0.75,
  ship: 0.5,
};

export default function OceanScene() {
  return (
    <main className="relative h-[100svh] overflow-hidden md:cursor-none">
      {/* pixel sky + ocean, rendered edge to edge (day/night cycle inside) */}
      <WaveCanvas />

      {/* sky life: clouds, sun & moon, balloon, banner plane */}
      <SkyLife />

      {/* headline */}
      <header className="pointer-events-none absolute inset-x-0 top-[9%] z-20 flex flex-col items-center px-6 text-center">
        <h1
          className="font-display text-4xl text-white md:text-6xl"
          style={{ textShadow: "4px 4px 0 var(--navy)", WebkitTextStroke: "2px var(--navy)" }}
        >
          {site.name}
        </h1>
        <p className="mt-3 max-w-xl text-base font-medium text-white/95 [text-shadow:2px_2px_0_rgba(8,51,68,0.45)] md:text-lg">
          {site.tagline}
        </p>
        <p className="mt-5 border-2 border-ink bg-white/90 px-4 py-1.5 font-pixel text-sm text-ink shadow-[3px_3px_0_rgba(8,51,68,0.45)]">
          🏄 Surf around — click an island to explore
        </p>
      </header>

      {/* ocean band with islands + sea life, dimmed together after dark */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[58%]">
        <NightDim className="absolute inset-0">
          <OceanLife />

          {/* desktop: islands scattered across the map at hand-placed coordinates */}
          {islands.map((island) => (
            <Link
              key={island.slug}
              href={`/${island.slug}`}
              className="group absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none md:block"
              style={{ left: `${island.x}%`, top: `${island.y}%` }}
            >
              {/* islands sit still — the animated surf around them provides the motion */}
              <div className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:scale-110 group-focus-visible:scale-110">
                {/* blurb is absolutely positioned so the tuck below stays exact */}
                <span
                  className="relative z-10"
                  style={{ marginBottom: -(LABEL_TUCK[island.variant] ?? 0) }}
                >
                  <span className={`inline-block ${retroChip} group-focus-visible:ring-2 group-focus-visible:ring-white md:text-base`}>
                    {island.label}
                  </span>
                  <span className="absolute left-1/2 top-full hidden -translate-x-1/2 whitespace-nowrap pt-1 text-xs font-medium text-white/90 opacity-0 transition [text-shadow:1px_1px_0_rgba(8,51,68,0.6)] group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
                    {island.blurb}
                  </span>
                </span>
                <IslandSprite variant={island.variant} />
              </div>
            </Link>
          ))}

          {/* mobile: same islands as a 2-column grid so tap targets never overlap */}
          {/* pb clears the sound toggle pinned to the viewport's bottom-left */}
          <div className="absolute inset-0 z-20 grid grid-cols-2 content-evenly justify-items-center px-2 pb-16 md:hidden">
            {islands.map((island) => {
              const scale = MOBILE_SPRITE_SCALE[island.variant] ?? 0.5;
              const [w, h] = SPRITE_SIZES[island.variant];
              const dw = w * DISPLAY_SCALE[island.variant] * scale;
              const dh = h * DISPLAY_SCALE[island.variant] * scale;
              return (
                <Link
                  key={island.slug}
                  href={`/${island.slug}`}
                  className="group flex flex-col items-center focus-visible:outline-none"
                >
                  <div style={{ width: dw, height: dh }}>
                    <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
                      <IslandSprite variant={island.variant} />
                    </div>
                  </div>
                  <span className={`${retroChip} -mt-1 group-focus-visible:ring-2 group-focus-visible:ring-white`}>
                    {island.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </NightDim>
      </div>

      {/* surfer follows the cursor (desktop, motion-safe only) */}
      <Surfer />

      {/* bottom-left controls */}
      <div className="absolute bottom-4 left-4 z-30">
        <SoundToggle />
      </div>
    </main>
  );
}
