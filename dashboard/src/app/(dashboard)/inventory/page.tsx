import { Database, Plus, Upload } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  return (
    <>
      <Topbar title="Inventory" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
            <p className="text-sm text-muted-foreground">
              Properties, products, or services your AI can reference in chat
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" /> Upload CSV
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add item
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">No inventory yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Your properties, products, or services will appear here. Upload a
              CSV or add items manually.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" /> Upload CSV
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4" /> Add manually
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
