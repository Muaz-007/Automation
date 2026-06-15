import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZES: Record<
  Size,
  { mark: string; wordmark: string; gap: string }
> = {
  sm: { mark: "h-7 w-7", wordmark: "text-sm", gap: "gap-2" },
  md: { mark: "h-9 w-9", wordmark: "text-base", gap: "gap-2.5" },
  lg: { mark: "h-12 w-12", wordmark: "text-xl", gap: "gap-3" },
};

/**
 * Brand mark — an AI sparkle with a smaller secondary spark, gradient-filled.
 * Standalone SVG (no container box) — premium, distinct, scales cleanly.
 */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: Size;
}) {
  const sz = SIZES[size];
  // Unique gradient ID per instance to avoid SVG defs conflicts when the
  // component is rendered multiple times on the same page.
  const gradId = `logo-grad-${size}`;

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "drop-shadow-[0_3px_8px_rgb(16_185_129/0.35)]",
        sz.mark,
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="4"
            y1="2"
            x2="28"
            y2="30"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="55%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient
            id={`${gradId}-2`}
            x1="20"
            y1="4"
            x2="30"
            y2="14"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Main 4-point AI sparkle with curved arms */}
        <path
          d="M16 2.5
             C 16 2.5  16.6 12  18.4 13.7
             C 20.1 15.5  29.5 16  29.5 16
             C 29.5 16  20.1 16.5  18.4 18.3
             C 16.6 20  16 29.5 16 29.5
             C 16 29.5  15.4 20  13.6 18.3
             C 11.9 16.5  2.5 16  2.5 16
             C 2.5 16  11.9 15.5  13.6 13.7
             C 15.4 12  16 2.5 16 2.5 Z"
          fill={`url(#${gradId})`}
        />

        {/* Small secondary sparkle (top-right accent) */}
        <path
          d="M25 4
             C 25 4  25.3 7.5  26.1 8.3
             C 26.9 9.1  30.5 9.5  30.5 9.5
             C 30.5 9.5  26.9 9.9  26.1 10.7
             C 25.3 11.5  25 15 25 15
             C 25 15  24.7 11.5  23.9 10.7
             C 23.1 9.9  19.5 9.5  19.5 9.5
             C 19.5 9.5  23.1 9.1  23.9 8.3
             C 24.7 7.5  25 4 25 4 Z"
          fill={`url(#${gradId}-2)`}
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

/**
 * Full logo: mark + wordmark.
 * Wordmark uses the display font with a tight letter-spacing.
 */
export function Logo({
  size = "md",
  className,
  hideTextOn,
}: {
  size?: Size;
  className?: string;
  /** Hide the wordmark below this Tailwind breakpoint. e.g. "sm" = hide < sm */
  hideTextOn?: "sm" | "md";
}) {
  const sz = SIZES[size];
  const hideClass =
    hideTextOn === "sm"
      ? "hidden sm:inline-flex"
      : hideTextOn === "md"
        ? "hidden md:inline-flex"
        : "inline-flex";

  return (
    <span className={cn("inline-flex items-center", sz.gap, className)}>
      <LogoMark size={size} />
      <span
        className={cn(
          "font-display font-semibold tracking-tight text-foreground",
          sz.wordmark,
          hideClass,
        )}
      >
        Whats<span className="text-primary">App</span>
        <span className="ml-1 text-foreground/85">Automate</span>
      </span>
    </span>
  );
}
