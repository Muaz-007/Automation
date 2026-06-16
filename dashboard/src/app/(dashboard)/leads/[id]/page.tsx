import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Phone,
  StickyNote,
  UserCheck,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChatThread } from "@/components/dashboard/chat-thread";
import { LeadStatusEditor } from "@/components/dashboard/lead-status-editor";
import { LeadNotesEditor } from "@/components/dashboard/lead-notes-editor";
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
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold">
                      {lead.customer.name ?? lead.customer.phone}
                    </h3>
                    <div className="truncate text-sm text-muted-foreground">
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
                  {lead.last_message_at && (
                    <Row
                      icon={MessageSquare}
                      label="Last message"
                      value={formatRelativeTime(lead.last_message_at)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status &amp; score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Stage</span>
                  <LeadStatusEditor
                    leadId={lead.id}
                    currentStatus={lead.status}
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hot score</span>
                    <span className="font-semibold tabular-nums">
                      {lead.hot_score}/100
                    </span>
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
                <CardTitle className="flex items-center gap-2 text-base">
                  <StickyNote className="h-4 w-4" /> Private notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadNotesEditor
                  leadId={lead.id}
                  initialNotes={lead.notes}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Extracted by AI</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(extracted).length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nothing extracted yet — AI will populate this as the
                    conversation unfolds.
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
                        <dd className="text-right font-medium">
                          {String(v)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                WhatsApp conversation
              </h3>
              <Badge variant="success">
                <span className="mr-0.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                AI live
              </Badge>
            </div>

            {messages.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h4 className="mb-1 text-base font-semibold">
                    No messages yet
                  </h4>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Conversations appear here once the customer messages your
                    WhatsApp number.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ChatThread messages={messages} />
            )}
          </div>
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
