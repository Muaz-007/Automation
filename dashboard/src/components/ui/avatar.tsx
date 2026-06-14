import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  fallback,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { fallback?: string }) {
  return (
    <div
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-semibold text-[var(--accent-foreground)]",
        className,
      )}
      {...props}
    >
      {fallback}
    </div>
  );
}
