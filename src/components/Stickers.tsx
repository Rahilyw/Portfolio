/**
 * Original surf-sticker SVGs, evoking vintage surf-shop decals.
 * All decorative — every sticker is aria-hidden by the caller.
 */

export function Hibiscus({ size = 72 }: { size?: number }) {
  const petal = "M0 0 C -20 -12 -24 -40 -6 -52 C 4 -58 16 -52 18 -40 C 20 -24 14 -8 0 0 Z";
  return (
    <svg width={size} height={size} viewBox="-64 -64 128 128" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={petal} fill="#f72585" stroke="#1d3557" strokeWidth="3" />
          <path d="M0 -8 C -6 -20 -8 -34 -2 -44" stroke="#ffd9b0" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <circle r="9" fill="#f2b134" stroke="#1d3557" strokeWidth="3" />
      {[20, 90, 160, 230, 300].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="-9" x2="0" y2="-22" stroke="#f2b134" strokeWidth="2.5" />
          <circle cy="-24" r="3" fill="#f2b134" />
        </g>
      ))}
    </svg>
  );
}

export function Starfish({ size = 68 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120" aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d="M0 -6 C -8 -14 -12 -34 0 -52 C 12 -34 8 -14 0 -6 Z"
          fill="#f2b134"
          stroke="#1d3557"
          strokeWidth="3.5"
          transform={`rotate(${a})`}
        />
      ))}
      <circle r="11" fill="#f2b134" stroke="#1d3557" strokeWidth="0" />
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <circle cy="-20" r="2.2" fill="#e76f51" />
          <circle cy="-32" r="2" fill="#e76f51" />
        </g>
      ))}
    </svg>
  );
}

/** Rounded-rect badge with a curling wave, Great-Wave style. */
export function WaveBadge({ size = 76 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" aria-hidden="true">
      <rect x="3" y="3" width="74" height="94" rx="12" fill="#fffdf6" stroke="#1d3557" strokeWidth="4" />
      <circle cx="58" cy="24" r="8" fill="#f2b134" stroke="#1d3557" strokeWidth="2.5" />
      <path
        d="M8 74 C 10 52 22 40 38 40 C 54 40 60 50 58 58 C 50 52 42 54 40 60 C 52 58 60 64 58 74 Z"
        fill="#2a9d8f"
        stroke="#1d3557"
        strokeWidth="3"
      />
      <path d="M14 66 C 20 54 30 48 40 48" stroke="#fffdf6" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M8 82 Q 20 76 32 82 T 56 82 T 80 82" stroke="#1d3557" strokeWidth="3" fill="none" />
      <path d="M8 89 Q 20 83 32 89 T 56 89 T 80 89" stroke="#1d3557" strokeWidth="3" fill="none" opacity="0.5" />
    </svg>
  );
}

/** Hand-drawn spiral sun, like an old surf-zine doodle. */
export function SunSpiral({ size = 80 }: { size?: number }) {
  const rays = Array.from({ length: 14 }, (_, i) => {
    const a = (i * 360) / 14;
    const len = i % 2 === 0 ? 56 : 44;
    return <line key={i} x1="0" y1="-30" x2="0" y2={-len} stroke="#e76f51" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a})`} />;
  });
  return (
    <svg width={size} height={size} viewBox="-64 -64 128 128" aria-hidden="true">
      {rays}
      <circle r="26" fill="#f2b134" stroke="#e76f51" strokeWidth="4" />
      <path
        d="M0 0 C 6 -2 8 -8 4 -12 C -2 -17 -12 -13 -14 -5 C -16 5 -8 14 2 14 C 14 14 21 4 19 -8"
        fill="none"
        stroke="#e76f51"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Yellow road-sign sticker: shark silhouette + OCEAN VIBES ONLY. */
export function SharkSign({ size = 86 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="6" y="6" width="88" height="88" rx="14" fill="#f2b134" stroke="#1d3557" strokeWidth="5" />
      <path
        d="M20 52 Q 32 34 52 34 Q 50 26 56 20 Q 60 28 58 35 Q 72 38 80 50 Q 66 48 60 50 Q 64 56 62 62 Q 56 56 50 54 Q 34 56 20 52 Z"
        fill="#1d3557"
      />
      <text x="50" y="76" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d3557" fontFamily="var(--font-retro), sans-serif">
        OCEAN VIBES
      </text>
      <text x="50" y="88" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1d3557" fontFamily="var(--font-retro), sans-serif">
        ONLY
      </text>
    </svg>
  );
}

/** Circular surf-club badge with text on a ring. */
export function CircleBadge({ size = 96, top = "RAHIL'S SURF CLUB", bottom = "EST. 2023" }: { size?: number; top?: string; bottom?: string }) {
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120" aria-hidden="true">
      <circle r="56" fill="#2a9d8f" stroke="#1d3557" strokeWidth="4" />
      <circle r="38" fill="#fffdf6" stroke="#1d3557" strokeWidth="3" />
      <defs>
        <path id="badge-top" d="M -44 0 A 44 44 0 0 1 44 0" fill="none" />
        <path id="badge-bottom" d="M -44 0 A 44 44 0 0 0 44 0" fill="none" />
      </defs>
      <text fontSize="12" fontWeight="bold" fill="#fffdf6" fontFamily="var(--font-retro), sans-serif" letterSpacing="2">
        <textPath href="#badge-top" startOffset="50%" textAnchor="middle">
          {top}
        </textPath>
      </text>
      <text fontSize="11" fontWeight="bold" fill="#fffdf6" fontFamily="var(--font-retro), sans-serif" letterSpacing="3">
        <textPath href="#badge-bottom" startOffset="50%" textAnchor="middle">
          {bottom}
        </textPath>
      </text>
      {/* little surfer silhouette riding a wave inside */}
      <path d="M -26 14 C -16 2 -2 -2 10 2 C 20 6 26 12 28 18 C 12 12 -8 14 -26 18 Z" fill="#2a9d8f" />
      <circle cx="2" cy="-12" r="4" fill="#1d3557" />
      <path d="M 2 -8 L 0 2 M 2 -6 L -6 -2 M 2 -6 L 10 -4 M 0 2 L -4 10 M 0 2 L 6 10" stroke="#1d3557" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M -10 12 L 14 12" stroke="#e76f51" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
