"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search leads, conversations…"
            className="h-9 w-72 pl-9"
          />
        </div>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-4 px-1 text-[10px]"
          >
            3
          </Badge>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
