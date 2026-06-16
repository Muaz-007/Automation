"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobileNav } from "@/components/dashboard/mobile-nav";

export function Topbar({ title }: { title: string }) {
  const { setOpen } = useMobileNav();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <h1 className="truncate text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
