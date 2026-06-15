import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Inbox,
  MessagesSquare,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Sparkline, TrendPill } from "@/components/dashboard/sparkline";
import {
  SeedDemoButton,
  ClearDemoButton,
} from "@/components/dashboard/demo-data-button";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";
import { formatRelativeTime, initials } from "@/lib/utils";

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const startOfDayAgo = (n: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
};

const industryLabel: Record<string, string> = {
  real_estate: "Real Estate",
  ecommerce: "E-commerce",
  healthcare: "Healthcare",
};

/** Bucket a list of dated rows into N daily buckets ending today (oldest first). */
function bucketByDay<T extends { created_at: Date }>(rows: T[], days: number) {
  const buckets = Array(days).fill(0);
  const today = startOfToday();
  for (const r of rows) {
    const d = new Date(r.created_at);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor(
      (today.getTime() - d.getTime()) / 86_400_000,
    );
    if (diff >= 0 && diff < days) {
      buckets[days - 1 - diff] += 1;
    }
  }
  return buckets;
}

export default async function DashboardPage() {
  const tu = await requireTenant();
  const tenantId = tu.tenant_id;
  const today = startOfToday();
  const yesterday = startOfDayAgo(1);
  const sevenDaysAgo = startOfDayAgo(6);

  const [
    totalLeads,
    newToday,
    newYesterday,
    hotLeads,
    convosToday,
    convosYesterday,
    wonLeads,
    recentLeads,
    last7Leads,
    last7Convos,
    last7HotLeads,
  ] = await Promise.all([
    prisma.lead.count({ where: { tenant_id: tenantId } }),
    prisma.lead.count({
      where: { tenant_id: tenantId, created_at: { gte: today } },
    }),
    prisma.lead.count({
      where: {
        tenant_id: tenantId,
        created_at: { gte: yesterday, lt: today },
      },
    }),
    prisma.lead.count({ where: { tenant_id: tenantId, status: "hot" } }),
    prisma.conversation.count({
      where: { tenant_id: tenantId, created_at: { gte: today } },
    }),
    prisma.conversation.count({
      where: {
        tenant_id: tenantId,
        created_at: { gte: yesterday, lt: today },
      },
    }),
    prisma.lead.count({ where: { tenant_id: tenantId, status: "won" } }),
    prisma.lead.findMany({
      where: { tenant_id: tenantId },
      include: { customer: true },
      orderBy: { last_message_at: "desc" },
      take: 5,
    }),
    prisma.lead.findMany({
      where: { tenant_id: tenantId, created_at: { gte: sevenDaysAgo } },
      select: { created_at: true },
    }),
    prisma.conversation.findMany({
      where: { tenant_id: tenantId, created_at: { gte: sevenDaysAgo } },
      select: { created_at: true },
    }),
    prisma.lead.findMany({
      where: {
        tenant_id: tenantId,
        status: "hot",
        updated_at: { gte: sevenDaysAgo },
      },
      select: { created_at: true },
    }),
  ]);

  const conversionRate =
    totalLeads === 0 ? 0 : Math.round((wonLeads / totalLeads) * 100);

  if (totalLeads === 0) {
    return (
      <>
        <Topbar title="Overview" />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Welcome, {tu.tenant.business_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Your dashboard is empty — let&apos;s get you started.
            </p>
          </div>

          <Card className="border-primary/30 bg-accent/30">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Inbox className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No leads yet</h3>
              <p className="mb-6 max-w-md text-sm text-muted-foreground">
                Connect your WhatsApp number in Settings to start receiving real
                leads, or load demo data to explore the dashboard with sample
                customers and conversations.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <SeedDemoButton size="lg" />
                <Link href="/settings">
                  <Button variant="outline" size="lg">
                    Connect WhatsApp
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const leadsSeries = bucketByDay(last7Leads, 7);
  const convosSeries = bucketByDay(last7Convos, 7);
  const hotSeries = bucketByDay(last7HotLeads, 7);
  const totalSeries = leadsSeries.reduce<number[]>((acc, v, i) => {
    const prev = i === 0 ? totalLeads - leadsSeries.reduce((a, b) => a + b, 0) : acc[i - 1];
    acc.push(prev + v);
    return acc;
  }, []);

  type StatCard = {
    label: string;
    value: number;
    icon: typeof Users;
    accent: string;
    series: number[];
    current: number;
    previous: number;
  };

  const stats: StatCard[] = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      accent: "text-primary",
      series: totalSeries,
      current: totalLeads,
      previous: totalLeads - newToday,
    },
    {
      label: "New Today",
      value: newToday,
      icon: UserPlus,
      accent: "text-blue-500",
      series: leadsSeries,
      current: newToday,
      previous: newYesterday,
    },
    {
      label: "Hot Leads",
      value: hotLeads,
      icon: Flame,
      accent: "text-red-500",
      series: hotSeries,
      current: hotLeads,
      previous: Math.max(0, hotLeads - hotSeries[hotSeries.length - 1]),
    },
    {
      label: "Conversations Today",
      value: convosToday,
      icon: MessagesSquare,
      accent: "text-emerald-500",
      series: convosSeries,
      current: convosToday,
      previous: convosYesterday,
    },
  ];

  return (
    <>
      <Topbar title="Overview" />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Welcome back, {tu.tenant.business_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Today&apos;s snapshot of your business
            </p>
          </div>
          <ClearDemoButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-md bg-muted p-1.5 ${s.accent}`}>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                  <TrendPill current={s.current} previous={s.previous} />
                </div>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="font-display text-3xl font-bold leading-none tabular-nums">
                    {s.value}
                  </p>
                  <Sparkline
                    data={s.series}
                    width={88}
                    height={32}
                    className={s.accent}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-display">Recent activity</CardTitle>
              <Link href="/leads">
                <Button variant="ghost" size="sm">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="px-0">
              <div className="divide-y divide-border">
                {recentLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {initials(lead.customer.name ?? "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {lead.customer.name ?? lead.customer.phone}
                        </span>
                        <StatusBadge status={lead.status} />
                      </div>
                      <div className="truncate text-sm text-muted-foreground">
                        {lead.customer.city ?? "—"} · {lead.source ?? "Direct"}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      {lead.last_message_at
                        ? formatRelativeTime(lead.last_message_at)
                        : "—"}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Conversion rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-bold tabular-nums">
                  {conversionRate}%
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {wonLeads} won / {totalLeads} total leads
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all"
                    style={{ width: `${Math.min(conversionRate * 2, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/40 bg-accent/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-base">
                  <Zap className="h-4 w-4 text-primary" />
                  AI Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">WhatsApp</span>
                  <Badge
                    variant={tu.tenant.phone_number_id ? "success" : "warning"}
                  >
                    {tu.tenant.phone_number_id ? "Connected" : "Not connected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AI Persona</span>
                  <span className="font-medium">
                    {tu.tenant.ai_persona_name ?? "Assistant"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">
                    {industryLabel[tu.tenant.industry]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge variant="outline" className="capitalize">
                    {tu.tenant.plan}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
