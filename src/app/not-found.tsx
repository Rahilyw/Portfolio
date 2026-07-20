import Link from "next/link";
import WaveBackground from "@/components/game/WaveBackground";
import { PixelLink } from "@/components/game/PixelButton";
import { WaveIcon } from "@/components/game/SurfMotifs";

export default function NotFound() {
  return (
    <div className="game-cursor relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 text-center text-foam">
      <WaveBackground />
      <div className="relative z-10 max-w-lg">
        <p className="font-press text-[9px] uppercase tracking-[0.2em] text-mustard">
          Error · Out of Bounds
        </p>
        <h1
          className="font-pixel mt-4 text-5xl uppercase leading-none sm:text-7xl"
          style={{ textShadow: "4px 4px 0 var(--ink)" }}
        >
          Wipeout
        </h1>
        <p className="mt-2 font-press text-[10px] text-sunset">404 · Lost at Sea</p>
        <p className="mt-5 text-sm leading-relaxed text-foam/85 sm:text-base">
          This wave broke somewhere off the map. Paddle back to the archipelago and pick an
          island that actually exists.
        </p>
        <div className="mt-8 flex justify-center">
          <PixelLink href="/" variant="primary">
            <WaveIcon size={14} />
            Ocean Map
          </PixelLink>
        </div>
        <p className="mt-6">
          <Link href="/" className="font-press text-[8px] text-foam/50 underline-offset-2 hover:underline">
            or wait for the next set
          </Link>
        </p>
      </div>
    </div>
  );
}
