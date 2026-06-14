import Link from "next/link";
import { MessageSquare, Search, Sparkles } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SeedDemoButton } from "@/components/dashboard/demo-data-button";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";
import { formatRelativeTime, initials } from "@/lib/utils";

export default async function ConversationsPage() {
  const tu = await requireTenant();
  const tenantId = tu.tenant_id;

  const customers = await prisma.customer.findMany({
    where: { tenant_id: tenantId },
    include: {
      conversations: {
        orderBy: { created_at: "desc" },
        take: 1,
      },
      leads: {
        orderBy: { last_message_at: "desc" },
        take: 1,
      },
      _count: { select: { conversations: true } },
    },
  });

  const threads = customers
    .filter((c) => c.conversations.length > 0)
    .map((c) => ({
      customer: c,
      lastMsg: c.conversations[0],
      msgCount: c._count.conversations,
      leadId: c.leads[0]?.id ?? null,
    }))
    .sort(
      (a, b) =>
        new Date(b.lastMsg.created_at).getTime() -
        new Date(a.lastMsg.created_at).getTime(),
    );

  return (
    <>
      <Topbar title="Conversations" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Conversations</h2>
            <p className="text-sm text-muted-foreground">
              All WhatsApp threads handled by your AI assistant
            </p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone…"
              className="h-9 w-72 pl-9"
            />
          </div>
        </div>

        {threads.length === 0 ? (
          <Card className="border-primary/30 bg-accent/20">
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No conversations yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Load demo data to see what conversations look like.
              </p>
              <SeedDemoButton />
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {threads.map(({ customer, lastMsg, msgCount, leadId }) => {
                const inner = (
                  <>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {initials(customer.name ?? "?")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">
                          {customer.name ?? customer.phone}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(lastMsg.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {lastMsg.role === "assistant" ? "AI" : "Customer"}:
                        </span>{" "}
                        {lastMsg.message}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="muted" className="text-[10px]">
                          <MessageSquare className="h-3 w-3" /> {msgCount} msgs
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {customer.phone}
                        </span>
                      </div>
                    </div>
                  </>
                );

                const className =
                  "flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/40";

                return leadId ? (
                  <Link key={customer.id} href={`/leads/${leadId}`} className={className}>
                    {inner}
                  </Link>
                ) : (
                  <div key={customer.id} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
