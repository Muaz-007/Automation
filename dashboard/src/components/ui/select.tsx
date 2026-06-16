"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  onChange?: (value: string) => void;
};

/**
 * Theme-matched single-select dropdown. Renders a hidden <input> so it submits
 * cleanly as part of a parent <form>. Closes on outside click or Escape.
 */
export function Select({
  name,
  options,
  defaultValue,
  placeholder = "Select…",
  id,
  className,
  onChange,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue ?? "");

  // Fire onChange when value changes (after the initial mount).
  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    onChange?.(value);
  }, [value, onChange]);
  const [highlight, setHighlight] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, options.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const o = options[highlight];
        if (o) {
          setValue(o.value);
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, highlight, options]);

  React.useEffect(() => {
    if (open && selected) {
      const idx = options.findIndex((o) => o.value === selected.value);
      if (idx >= 0) setHighlight(idx);
    }
  }, [open, selected, options]);

  React.useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlight] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} />
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className={cn(
            "truncate",
            !selected && "text-muted-foreground",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-auto rounded-md border border-border bg-card p-1 shadow-lg shadow-black/20"
          role="listbox"
        >
          <ul ref={listRef} className="space-y-0.5">
            {options.map((o, i) => {
              const isSelected = o.value === value;
              const isHighlighted = i === highlight;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => {
                    setValue(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-sm",
                    isHighlighted
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground",
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {isSelected && (
                    <Check className="ml-2 h-3.5 w-3.5 shrink-0 text-primary" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
