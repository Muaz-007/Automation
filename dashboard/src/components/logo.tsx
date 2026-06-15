import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZES: Record<
  Size,
  { mark: string; markIcon: string; wordmark: string; gap: string }
> = {
  sm: { mark: "h-7 w-7", markIcon: "h-3.5 w-3.5", wordmark: "text-sm", gap: "gap-2" },
  md: { mark: "h-9 w-9", markIcon: "h-4 w-4", wordmark: "text-base", gap: "gap-2.5" },
  lg: { mark: "h-12 w-12", markIcon: "h-6 w-6", wordmark: "text-xl", gap: "gap-3" },
};

/**
 * Brand mark — a chat-bubble glyph with an embedded spark, gradient-filled.
 * Pure SVG, scales cleanly, supports light + dark mode.
 */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: Size;
}) {
  const sz = SIZES[size];
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl shadow-sm",
        "bg-linear-to-br from-emerald-500 to-emerald-700",
        sz.mark,
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("text-white", sz.markIcon)}
        aria-hidden
      >
        {/* Chat bubble outline */}
        <path
          d="M21 11.5a8.38 8.38 0 0 1-3.8 7L18 22l-4.3-2.1A9 9 0 1 1 21 11.5Z"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <path
          d="M21 11.5a8.38 8.38 0 0 1-3.8 7L18 22l-4.3-2.1A9 9 0 1 1 21 11.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* Inner spark (AI accent) */}
        <path
          d="M12 8.2v1.4M12 13.2v1.4M9.2 11.5h-1.4M16.2 11.5h-1.4M10.4 9.9l-1-1M14.5 13.9l-1-1M10.4 13.1l-1 1M14.5 9l-1 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/**
 * Full logo: mark + wordmark.
 * Wordmark uses font-display (Bricolage / Instrument fallback) with a tight tracking.
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
      ? "hidden sm:inline"
      : hideTextOn === "md"
        ? "hidden md:inline"
        : "";

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
        Whatsapp<span className="text-primary">Automate</span>
      </span>
    </span>
  );
}
