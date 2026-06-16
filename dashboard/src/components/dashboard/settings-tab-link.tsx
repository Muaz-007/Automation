"use client";

import Link from "next/link";
import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
};

function PendingIndicator({ activeIcon }: { activeIcon: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return pending ? (
    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
  ) : (
    <>{activeIcon}</>
  );
}

/**
 * Tab nav link that shows a subtle spinner while navigation is in-flight.
 * useLinkStatus is a Next.js hook — must live inside a child of <Link>.
 *
 * Note: `icon` is accepted as a pre-rendered ReactNode (not a component) so
 * server-side parents can pass it without violating the RSC serialization
 * boundary — function components can't cross from server → client props.
 */
export function SettingsTabLink({ href, label, icon, active }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <PendingIndicator activeIcon={icon} />
      <span>{label}</span>
    </Link>
  );
}
