import { cn } from "@/lib/utils";

/**
 * Tiny inline sparkline. Takes a series of numbers and renders a smooth
 * line + filled area. Pure SVG, no JS, scales cleanly.
 */
export function Sparkline({
  data,
  width = 80,
  height = 28,
  className,
  stroke = "currentColor",
}: {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
}) {
  if (!data || data.length === 0) {
    return null;
  }

  // Normalize data to fit in the viewbox
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const linePath =
    "M " + points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ");

  const areaPath =
    `M 0 ${height} L ` +
    points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ") +
    ` L ${width} ${height} Z`;

  // Last value marker
  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
      style={{ color: stroke }}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={areaPath}
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d={linePath}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastX}
        cy={lastY}
        r="2"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Small trend pill: shows +12% (green) / -5% (red) / — (gray).
 */
export function TrendPill({
  current,
  previous,
  className,
}: {
  current: number;
  previous: number;
  className?: string;
}) {
  if (previous === 0 && current === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground",
          className,
        )}
      >
        —
      </span>
    );
  }

  if (previous === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
          className,
        )}
      >
        New
      </span>
    );
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  const positive = pct > 0;
  const negative = pct < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        positive &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
        negative &&
          "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
        !positive &&
          !negative &&
          "bg-muted text-muted-foreground",
        className,
      )}
    >
      {positive ? "↑" : negative ? "↓" : "→"}
      {Math.abs(pct)}%
    </span>
  );
}
