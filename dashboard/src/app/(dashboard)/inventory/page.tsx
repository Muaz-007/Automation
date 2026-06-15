import Link from "next/link";
import { Database, Plus, Upload } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CsvUpload } from "@/components/dashboard/csv-upload";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";
import { formatRelativeTime } from "@/lib/utils";

function formatPrice(pkr: number | null) {
  if (pkr === null) return "—";
  return `Rs. ${pkr.toLocaleString("en-PK")}`;
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "upload" ? "upload" : "list";

  const tu = await requireTenant();
  const tenantId = tu.tenant_id;

  const items = await prisma.inventoryItem.findMany({
    where: { tenant_id: tenantId },
    orderBy: { created_at: "desc" },
    take: 200,
  });

  return (
    <>
      <Topbar title="Inventory" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Inventory
            </h2>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length === 1 ? "" : "s"} — your AI will
              reference these in conversations
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/inventory?tab=upload">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" /> Upload CSV
              </Button>
            </Link>
            <Link href="/inventory/new">
              <Button size="sm">
                <Plus className="h-4 w-4" /> Add item
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1 text-sm w-fit">
          <Link
            href="/inventory"
            className={`rounded-md px-3 py-1.5 transition-colors ${
              tab === "list"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All items
          </Link>
          <Link
            href="/inventory?tab=upload"
            className={`rounded-md px-3 py-1.5 transition-colors ${
              tab === "upload"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload CSV
          </Link>
        </div>

        {tab === "upload" ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-semibold">
                Bulk upload from CSV
              </h3>
              <p className="mb-5 mt-1 text-sm text-muted-foreground">
                CSV must include a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">name</code>,{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">title</code>, or{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">service</code> column. Unknown columns are stored as custom fields.
              </p>
              <CsvUpload />
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">No inventory yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Add a single item manually, or bulk upload a CSV with properties,
                products, or services.
              </p>
              <div className="flex gap-2">
                <Link href="/inventory?tab=upload">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" /> Upload CSV
                  </Button>
                </Link>
                <Link href="/inventory/new">
                  <Button size="sm">
                    <Plus className="h-4 w-4" /> Add manually
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">SKU / ID</th>
                    <th className="px-4 py-3 font-medium">Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-3.5">
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="mt-0.5 max-w-md truncate text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {item.category ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 font-medium tabular-nums">
                        {formatPrice(item.price_pkr)}
                      </td>
                      <td className="px-4 py-3.5">
                        {item.status ? (
                          <Badge variant="muted" className="font-normal">
                            {item.status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {item.external_id ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {formatRelativeTime(item.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
