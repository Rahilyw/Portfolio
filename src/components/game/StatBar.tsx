export default function StatBar({
  label,
  value,
  max = 100,
  color = "bg-tealsurf",
}: {
  label: string;
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const blocks = 12;
  const filled = Math.round((pct / 100) * blocks);

  return (
    <div className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-2 sm:grid-cols-[9rem_1fr_2.75rem]">
      <span className="font-press text-[9px] uppercase leading-tight text-foam sm:text-[10px]">
        {label}
      </span>
      <div
        className="flex h-4 gap-0.5 border-2 border-ink bg-ocean-deep p-0.5"
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {Array.from({ length: blocks }, (_, i) => (
          <span
            key={i}
            className={`h-full flex-1 ${i < filled ? `stat-cell ${color}` : "bg-transparent"}`}
            style={i < filled ? { animationDelay: `${i * 60}ms` } : undefined}
          />
        ))}
      </div>
      <span className="font-press text-right text-[10px] text-mustard tabular-nums">{value}</span>
    </div>
  );
}
