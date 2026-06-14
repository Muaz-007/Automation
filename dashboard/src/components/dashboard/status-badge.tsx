import { Badge } from "@/components/ui/badge";
import type { LeadStatus } from "@prisma/client";

const map: Record<
  LeadStatus,
  {
    variant: "default" | "success" | "warning" | "destructive" | "info" | "muted";
    label: string;
  }
> = {
  new: { variant: "info", label: "New" },
  qualifying: { variant: "warning", label: "Qualifying" },
  hot: { variant: "destructive", label: "Hot" },
  warm: { variant: "warning", label: "Warm" },
  cold: { variant: "muted", label: "Cold" },
  won: { variant: "success", label: "Won" },
  lost: { variant: "muted", label: "Lost" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
