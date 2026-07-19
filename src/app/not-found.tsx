import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-parchment px-6 text-center">
      <p className="font-marker text-sm tracking-wide text-navy/50">☼ uncharted waters ☼</p>
      <h1
        className="font-dxburst mt-3 text-7xl uppercase text-navy md:text-9xl"
        style={{ textShadow: "3px 3px 0 var(--neon-yellow), 6px 6px 0 var(--navy-dark)" }}
      >
        Lost at sea
      </h1>
      <p
        aria-hidden="true"
        className="font-script -mt-1 -rotate-2 text-2xl text-coral md:text-3xl"
        style={{ textShadow: "2px 2px 0 var(--parchment)" }}
      >
        wipeout! (404)
      </p>
      <p className="font-editorial mx-auto mt-5 max-w-md text-lg italic text-navy/70">
        This wave broke somewhere off the map. Paddle back to the archipelago and
        pick an island that actually exists.
      </p>
      <Link
        href="/"
        className="sticker mt-8 px-5 py-2.5 font-display text-sm text-navy transition hover:-translate-y-0.5"
      >
        🌊 Back to the ocean
      </Link>
    </div>
  );
}
