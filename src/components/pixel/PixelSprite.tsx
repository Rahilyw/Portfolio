import type { ReactElement } from "react";

/**
 * Renders a pixel-art sprite from a string map. Each character indexes into
 * the palette; "." and " " are transparent. Horizontal runs of the same
 * color are merged into single rects to keep the DOM small.
 */
export default function PixelSprite({
  rows,
  palette,
  px = 4,
  className,
}: {
  rows: string[];
  palette: Record<string, string>;
  px?: number;
  className?: string;
}) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const rects: ReactElement[] = [];

  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === "." || c === " " || !palette[c]) {
        x++;
        continue;
      }
      let x2 = x + 1;
      while (x2 < row.length && row[x2] === c) x2++;
      rects.push(
        <rect key={`${x}-${y}`} x={x} y={y} width={x2 - x} height={1} fill={palette[c]} />
      );
      x = x2;
    }
  });

  return (
    <svg
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
