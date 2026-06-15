"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessagesSquare,
  Settings,
  LogOut,
  Database,
  Sparkles,
  X,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";
import { useMobileNav } from "@/components/dashboard/mobile-nav";
import { LogoMark } from "@/components/logo";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const navSections: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/leads", label: "Leads", icon: Users },
      { href: "/conversations", label: "Conversations", icon: MessagesSquare },
    ],
  },
  {
    heading: "Tools",
    items: [
      { href: "/playground", label: "Playground", icon: Sparkles },
      { href: "/inventory", label: "Inventory", icon: Database },
    ],
  },
  {
    heading: "Account",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

function SidebarBody({
  email,
  businessName,
  fullName,
  onClose,
}: {
  email: string;
  businessName: string;
  fullName: string;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <LogoMark size="sm" />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-display text-sm font-semibold leading-none">
            Whats<span className="text-primary">App</span>
            <span className="ml-1">Automate</span>
          </span>
          <span className="truncate text-xs text-muted-foreground mt-1">
            {businessName}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.heading} className="space-y-0.5">
            <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.heading}
            </div>
            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent/60 text-foreground"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  )}
                >
                  {/* Active indicator bar on the left */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary"
                    />
                  )}
                  <item.icon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-primary" : "group-hover:text-foreground",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {initials(fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">{fullName}</div>
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

export function Sidebar({
  email,
  businessName,
  fullName,
}: {
  email: string;
  businessName: string;
  fullName: string;
}) {
  const { open, setOpen } = useMobileNav();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-dvh w-60 shrink-0 border-r border-border bg-card md:block">
        <SidebarBody
          email={email}
          businessName={businessName}
          fullName={fullName}
        />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-foreground/50 md:hidden animate-in fade-in"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-200 md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarBody
          email={email}
          businessName={businessName}
          fullName={fullName}
          onClose={() => setOpen(false)}
        />
      </aside>
    </>
  );
}
