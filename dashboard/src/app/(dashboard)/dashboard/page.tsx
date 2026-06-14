import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Inbox,
  MessagesSquare,
  Sparkles,
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

const industryLabel: Record<string, string> = {
  real_estate: "Real Estate",
  ecommerce: "E-commerce",
  healthcare: "Healthcare",
};

export default async function DashboardPage() {
  const tu = await requireTenant();
  const tenantId = tu.tenant_id;
  const today = startOfToday();

  const [
    totalLeads,
    newToday,
    hotLeads,
    convosToday,
    wonLeads,
    recentLeads,
  ] = await Promise.all([
    prisma.lead.count({ where: { tenant_id: tenantId } }),
    prisma.lead.count({ where: { tenant_id: tenantId, created_at: { gte: today } } }),
    prisma.lead.count({ where: { tenant_id: tenantId, status: "hot" } }),
    prisma.conversation.count({
      where: { tenant_id: tenantId, created_at: { gte: today } },
    }),
    prisma.lead.count({ where: { tenant_id: tenantId, status: "won" } }),
    prisma.lead.findMany({
      where: { tenant_id: tenantId },
      include: { customer: true },
      orderBy: { last_message_at: "desc" },
      take: 5,
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
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome, {tu.tenant.business_name} 👋
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

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      accent: "text-primary",
    },
    {
      label: "New Today",
      value: newToday,
      icon: UserPlus,
      accent: "text-blue-500",
    },
    {
      label: "Hot Leads",
      value: hotLeads,
      icon: Flame,
      accent: "text-red-500",
      delta: hotLeads > 0 ? "Needs attention" : undefined,
    },
    {
      label: "Conversations Today",
      value: convosToday,
      icon: MessagesSquare,
      accent: "text-emerald-500",
    },
  ];

  return (
    <>
      <Topbar title="Overview" />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {tu.tenant.business_name} 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              Aapke business ka aaj ka snapshot
            </p>
          </div>
          <ClearDemoButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="mt-2 text-3xl font-bold">{s.value}</p>
                    {s.delta && (
                      <p className="mt-1 text-xs text-muted-foreground">{s.delta}</p>
                    )}
                  </div>
                  <div className={`rounded-md bg-muted p-2 ${s.accent}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Recent activity</CardTitle>
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
                    className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted"
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Conversion rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{conversionRate}%</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {wonLeads} won / {totalLeads} total leads
                </p>
                <div className="mt-4 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min(conversionRate * 2, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/40 bg-accent/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
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
