import { Sparkles } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { PlaygroundChat } from "@/components/dashboard/playground-chat";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";

const TEST_PHONE = "+10000000001";

export default async function PlaygroundPage() {
  const tu = await requireTenant();

  // Load any existing playground conversation
  const customer = await prisma.customer.findUnique({
    where: {
      tenant_id_phone: { tenant_id: tu.tenant_id, phone: TEST_PHONE },
    },
  });
  let initial: { id: string; role: "user" | "assistant"; text: string }[] = [];
  if (customer) {
    const msgs = await prisma.conversation.findMany({
      where: { tenant_id: tu.tenant_id, customer_id: customer.id },
      orderBy: { created_at: "asc" },
      take: 50,
    });
    initial = msgs
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        text: m.message,
      }));
  }

  return (
    <>
      <Topbar title="Playground" />
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Playground</h2>
              <Badge variant="info">Test mode</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Test your AI conversation without setting up WhatsApp. Powered by Gemini Flash.
            </p>
          </div>
        </div>

        <PlaygroundChat initialMessages={initial} />
      </div>
    </>
  );
}
