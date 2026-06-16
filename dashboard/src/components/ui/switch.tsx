"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  name: string;
  defaultChecked?: boolean;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

/**
 * Themed toggle switch. Renders a hidden checkbox so it submits naturally
 * inside a parent <form>. Also emits a hidden "__name__present" marker so
 * the server action can distinguish "unchecked" from "field not rendered".
 */
export function Switch({
  name,
  defaultChecked = false,
  id,
  disabled,
  className,
  "aria-label": ariaLabel,
}: SwitchProps) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        type="hidden"
        name={`__${name}__present`}
        value="1"
      />
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => setChecked(e.target.checked)}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked
            ? "bg-[var(--primary)]"
            : "bg-[var(--muted)] border border-[var(--border)]",
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
    </label>
  );
}
