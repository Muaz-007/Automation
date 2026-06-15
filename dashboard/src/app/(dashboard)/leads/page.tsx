import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Filter, Plus, Sparkles } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SeedDemoButton } from "@/components/dashboard/demo-data-button";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";
import type { LeadStatus, Prisma } from "@prisma/client";
import { cn, formatRelativeTime, initials } from "@/lib/utils";

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

type SortKey = "name" | "status" | "hot_score" | "source" | "last_message";
type SortOrder = "asc" | "desc";

const SORTABLE: SortKey[] = ["name", "status", "hot_score", "source", "last_message"];

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

function buildOrderBy(
  sort: SortKey,
  order: SortOrder,
): Prisma.LeadOrderByWithRelationInput {
  switch (sort) {
    case "name":
      return { customer: { name: order } };
    case "status":
      return { status: order };
    case "hot_score":
      return { hot_score: order };
    case "source":
      return { source: order };
    case "last_message":
    default:
      return { last_message_at: order };
  }
}

function buildSortHref(
  basePath: string,
  status: string,
  currentSort: SortKey,
  currentOrder: SortOrder,
  targetSort: SortKey,
) {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  params.set("sort", targetSort);
  // Same column toggles order; different column starts desc
  const nextOrder =
    currentSort === targetSort && currentOrder === "desc" ? "asc" : "desc";
  params.set("order", nextOrder);
  const q = params.toString();
  return q ? `${basePath}?${q}` : basePath;
}

function SortIcon({
  active,
  order,
}: {
  active: boolean;
  order: SortOrder;
}) {
  if (!active) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
  return order === "asc" ? (
    <ArrowUp className="h-3 w-3 text-primary" />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" />
  );
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string; order?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = (params.status ?? "all") as LeadStatus | "all";
  const sort: SortKey = (SORTABLE.includes(params.sort as SortKey)
    ? params.sort
    : "last_message") as SortKey;
  const order: SortOrder = params.order === "asc" ? "asc" : "desc";

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
      orderBy: buildOrderBy(sort, order),
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

  const columns: {
    key: SortKey | null;
    label: string;
    className?: string;
  }[] = [
    { key: "name", label: "Customer", className: "px-6" },
    { key: "status", label: "Status" },
    { key: "hot_score", label: "Hot score" },
    { key: "source", label: "Source" },
    { key: null, label: "Budget / Need" },
    { key: "last_message", label: "Last message" },
    { key: null, label: "" },
  ];

  return (
    <>
      <Topbar title="Leads" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">Leads</h2>
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
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    active
                      ? "bg-primary-foreground/20"
                      : "bg-muted text-muted-foreground",
                  )}
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
          <>
            {/* Desktop table */}
            <Card className="hidden overflow-hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      {columns.map((c, i) => (
                        <th
                          key={i}
                          className={cn("py-3 font-medium", c.className ?? "px-4")}
                        >
                          {c.key ? (
                            <Link
                              href={buildSortHref(
                                "/leads",
                                activeFilter,
                                sort,
                                order,
                                c.key,
                              )}
                              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                            >
                              {c.label}
                              <SortIcon
                                active={sort === c.key}
                                order={order}
                              />
                            </Link>
                          ) : (
                            c.label
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="group transition-colors hover:bg-muted/40"
                      >
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground transition-transform group-hover:scale-105">
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
                        <td className="px-4 py-3.5">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className={cn(
                                  "h-full transition-all",
                                  lead.hot_score > 70
                                    ? "bg-red-500"
                                    : lead.hot_score > 40
                                      ? "bg-amber-500"
                                      : "bg-zinc-400",
                                )}
                                style={{ width: `${lead.hot_score}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium tabular-nums">
                              {lead.hot_score}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {lead.source ? (
                            <Badge variant="outline" className="font-normal">
                              {lead.source}
                            </Badge>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="max-w-56 truncate px-4 py-3.5 text-muted-foreground">
                          {leadSummary(lead.extracted_data)}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground">
                          {lead.last_message_at
                            ? formatRelativeTime(lead.last_message_at)
                            : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="inline-flex items-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
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

            {/* Mobile card list */}
            <div className="space-y-3 md:hidden">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {initials(lead.customer.name ?? "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">
                          {lead.customer.name ?? lead.customer.phone}
                        </span>
                        <StatusBadge status={lead.status} />
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">
                        {lead.customer.phone}
                        {lead.customer.city ? ` · ${lead.customer.city}` : ""}
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full",
                                lead.hot_score > 70
                                  ? "bg-red-500"
                                  : lead.hot_score > 40
                                    ? "bg-amber-500"
                                    : "bg-zinc-400",
                              )}
                              style={{ width: `${lead.hot_score}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-muted-foreground">
                            {lead.hot_score}
                          </span>
                        </div>
                        {lead.source && (
                          <Badge variant="outline" className="font-normal">
                            {lead.source}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1.5 truncate text-xs text-muted-foreground">
                        {leadSummary(lead.extracted_data)}
                      </div>

                      <div className="mt-2 text-[11px] text-muted-foreground">
                        {lead.last_message_at
                          ? formatRelativeTime(lead.last_message_at)
                          : "—"}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {leads.length === 0 && (
                <Card className="px-6 py-12 text-center text-sm text-muted-foreground">
                  No leads match this filter.
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
