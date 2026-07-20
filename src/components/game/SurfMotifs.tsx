/** Tiny pixel motifs for bullets, dividers, and accents. */

export function Seashell({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="6" y="1" width="2" height="2" fill="#f2b134" />
      <rect x="4" y="3" width="6" height="2" fill="#fde68a" />
      <rect x="2" y="5" width="10" height="2" fill="#f2b134" />
      <rect x="1" y="7" width="12" height="2" fill="#fde68a" />
      <rect x="3" y="9" width="8" height="2" fill="#f2b134" />
      <rect x="5" y="11" width="4" height="2" fill="#e76f51" />
    </svg>
  );
}

export function Surfboard({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="7" y="0" width="2" height="2" fill="#f4793b" />
      <rect x="6" y="2" width="4" height="10" fill="#fde68a" />
      <rect x="7" y="4" width="2" height="6" fill="#e76f51" />
      <rect x="6" y="12" width="4" height="2" fill="#f4793b" />
      <rect x="7" y="14" width="2" height="2" fill="#1d3557" />
    </svg>
  );
}

export function WaveIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="0" y="10" width="4" height="2" fill="#38bdf8" />
      <rect x="2" y="8" width="4" height="2" fill="#0ea5e9" />
      <rect x="4" y="6" width="4" height="2" fill="#38bdf8" />
      <rect x="6" y="8" width="4" height="2" fill="#0ea5e9" />
      <rect x="8" y="10" width="4" height="2" fill="#38bdf8" />
      <rect x="10" y="8" width="4" height="2" fill="#0ea5e9" />
      <rect x="12" y="10" width="4" height="2" fill="#38bdf8" />
      <rect x="1" y="12" width="14" height="2" fill="#0284c7" />
    </svg>
  );
}

export function ShellBullet({
  children,
  className = "text-foam/90",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={`flex gap-2 text-sm leading-relaxed ${className}`}>
      <span className="mt-0.5 shrink-0">
        <Seashell />
      </span>
      <span>{children}</span>
    </li>
  );
}
