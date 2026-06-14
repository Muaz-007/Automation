"use client";

import { useState, useTransition } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { seedDemoData, clearDemoData } from "@/app/actions/tenant";

export function SeedDemoButton({
  variant = "default",
  size = "default",
}: {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant={variant}
      size={size}
      disabled={pending}
      onClick={() => start(() => seedDemoData())}
    >
      <Sparkles className="h-4 w-4" />
      {pending ? "Loading…" : "Load demo data"}
    </Button>
  );
}

export function ClearDemoButton() {
  const [pending, start] = useTransition();
  const [confirm, setConfirm] = useState(false);

  if (!confirm) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirm(true)}>
        <Trash2 className="h-4 w-4" /> Clear demo data
      </Button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Are you sure?</span>
      <Button
        variant="destructive"
        size="sm"
        disabled={pending}
        onClick={() => start(() => clearDemoData())}
      >
        Delete all
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirm(false)}>
        Cancel
      </Button>
    </div>
  );
}
