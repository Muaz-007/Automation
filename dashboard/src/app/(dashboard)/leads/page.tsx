import Link from "next/link";
import { ChevronRight, Filter, Plus, Sparkles } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SeedDemoButton } from "@/components/dashboard/demo-data-button";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";
import type { LeadStatus, Prisma } from "@prisma/client";
import { formatRelativeTime, initials } from "@/lib/utils";

const statusFilters: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "new", label: "New" },
  { value: "qualifying", label: "Qualifying" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "qualifying",
  "hot",
  "warm",
  "cold",
  "won",
  "lost",
];

function leadSummary(data: Prisma.JsonValue) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "—";
  const d = data as Record<string, unknown>;
  const parts: string[] = [];
  if (d.budget) parts.push(`Budget: ${d.budget}`);
  if (d.area) parts.push(String(d.area));
  if (d.bedrooms) parts.push(`${d.bedrooms} BHK`);
  if (d.product) parts.push(`${d.product}`);
  if (d.service) parts.push(`${d.service}`);
  if (parts.length === 0) return "—";
  return parts.join(" · ");
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = (params.status ?? "all") as LeadStatus | "all";

  const tu = await requireTenant();
  const tenantId = tu.tenant_id;

  const where: Prisma.LeadWhereInput =
    activeFilter !== "all" && VALID_STATUSES.includes(activeFilter as LeadStatus)
      ? { tenant_id: tenantId, status: activeFilter as LeadStatus }
      : { tenant_id: tenantId };

  const [leads, byStatus, totalCount] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { customer: true },
      orderBy: { last_message_at: "desc" },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      where: { tenant_id: tenantId },
      _count: true,
    }),
    prisma.lead.count({ where: { tenant_id: tenantId } }),
  ]);

  const counts: Record<string, number> = { all: totalCount };
  byStatus.forEach((g) => (counts[g.status] = g._count));

  return (
    <>
      <Topbar title="Leads" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Leads</h2>
            <p className="text-sm text-muted-foreground">
              {leads.length} {activeFilter === "all" ? "total" : activeFilter} leads
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" /> More filters
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add lead
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => {
            const active = activeFilter === f.value;
            return (
              <Link
                key={f.value}
                href={f.value === "all" ? "/leads" : `/leads?status=${f.value}`}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    active
                      ? "bg-primary-foreground/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {counts[f.value] ?? 0}
                </span>
              </Link>
            );
          })}
        </div>

        {leads.length === 0 && totalCount === 0 ? (
          <Card className="border-primary/30 bg-accent/20">
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No leads yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Load demo data to explore, or connect WhatsApp to start capturing
                real leads.
              </p>
              <SeedDemoButton />
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Hot score</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Budget / Need</th>
                    <th className="px-4 py-3 font-medium">Last message</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                            {initials(lead.customer.name ?? "?")}
                          </div>
                          <div>
                            <div className="font-medium">
                              {lead.customer.name ?? lead.customer.phone}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {lead.customer.phone} · {lead.customer.city ?? "—"}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full ${
                                lead.hot_score > 70
                                  ? "bg-red-500"
                                  : lead.hot_score > 40
                                  ? "bg-amber-500"
                                  : "bg-zinc-400"
                              }`}
                              style={{ width: `${lead.hot_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium tabular-nums">
                            {lead.hot_score}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {lead.source ? (
                          <Badge variant="outline" className="font-normal">
                            {lead.source}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {leadSummary(lead.extracted_data)}
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {lead.last_message_at
                          ? formatRelativeTime(lead.last_message_at)
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="inline-flex items-center text-muted-foreground hover:text-foreground"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leads.length === 0 && (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">
                No leads match this filter.
              </div>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
