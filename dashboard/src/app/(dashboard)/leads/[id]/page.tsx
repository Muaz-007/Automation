import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarPlus,
  Mail,
  Phone,
  Tag,
  UserCheck,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";
import { formatRelativeTime, initials } from "@/lib/utils";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tu = await requireTenant();
  const tenantId = tu.tenant_id;

  const lead = await prisma.lead.findFirst({
    where: { id, tenant_id: tenantId },
    include: { customer: true },
  });
  if (!lead) notFound();

  const messages = await prisma.conversation.findMany({
    where: { tenant_id: tenantId, customer_id: lead.customer_id },
    orderBy: { created_at: "asc" },
  });

  const extracted =
    typeof lead.extracted_data === "object" &&
    lead.extracted_data !== null &&
    !Array.isArray(lead.extracted_data)
      ? (lead.extracted_data as Record<string, unknown>)
      : {};

  return (
    <>
      <Topbar title="Lead detail" />
      <div className="p-6 space-y-6">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to leads
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
                    {initials(lead.customer.name ?? "?")}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {lead.customer.name ?? lead.customer.phone}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {lead.customer.city ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <Row icon={Phone} label="Phone" value={lead.customer.phone} />
                  <Row
                    icon={Mail}
                    label="Source"
                    value={lead.source ?? "Direct"}
                  />
                  <Row
                    icon={UserCheck}
                    label="Created"
                    value={formatRelativeTime(lead.created_at)}
                  />
                </div>

                <div className="mt-6 flex gap-2">
                  <Button size="sm" className="flex-1">
                    <CalendarPlus className="h-4 w-4" /> Schedule
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Tag className="h-4 w-4" /> Tag
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stage</span>
                  <StatusBadge status={lead.status} />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hot score</span>
                    <span className="font-semibold">{lead.hot_score}/100</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Extracted data</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(extracted).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing extracted yet.
                  </p>
                ) : (
                  <dl className="space-y-2 text-sm">
                    {Object.entries(extracted).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-start justify-between gap-3"
                      >
                        <dt className="capitalize text-muted-foreground">
                          {k.replace(/_/g, " ")}
                        </dt>
                        <dd className="font-medium text-right">{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>WhatsApp conversation</CardTitle>
              <Badge variant="success">AI live</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No messages yet.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.role === "user"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.message}</p>
                      <p
                        className={`mt-1 text-[10px] ${
                          m.role === "user"
                            ? "text-muted-foreground"
                            : "text-primary-foreground/70"
                        }`}
                      >
                        {formatRelativeTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 border-t border-border pt-4">
                <input
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Take over and reply manually…"
                />
                <Button size="sm">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex flex-1 items-center justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
