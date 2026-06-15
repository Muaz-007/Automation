import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireTenant } from "@/lib/dal";
import { addInventoryItem } from "@/app/actions/inventory";

const industryHints: Record<
  string,
  { categoryHint: string; statusHint: string; example: string }
> = {
  real_estate: {
    categoryHint: "e.g. House, Apartment, Plot",
    statusHint: "available / under_offer / sold",
    example: "3 Bed House in DHA Phase 6",
  },
  ecommerce: {
    categoryHint: "e.g. Hoodies, Shoes, Accessories",
    statusHint: "in_stock / low_stock / out_of_stock",
    example: "Black Oversized Hoodie",
  },
  healthcare: {
    categoryHint: "e.g. Dermatology, Aesthetic, Laser",
    statusHint: "available / unavailable",
    example: "Initial Skin Consultation",
  },
};

export default async function NewInventoryItemPage() {
  const tu = await requireTenant();
  const hint =
    industryHints[tu.tenant.industry] ?? industryHints.real_estate;

  return (
    <>
      <Topbar title="Add inventory item" />
      <div className="p-6 space-y-6 max-w-3xl">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to inventory
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Add new item</CardTitle>
            <CardDescription>
              Add a single property / product / service to your inventory.
              Your AI will be able to reference it in WhatsApp conversations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addInventoryItem} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={hint.example}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder={hint.categoryHint}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="external_id">External ID / SKU</Label>
                  <Input
                    id="external_id"
                    name="external_id"
                    placeholder="Optional reference code"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price_pkr">Price (PKR)</Label>
                  <Input
                    id="price_pkr"
                    name="price_pkr"
                    type="number"
                    min="0"
                    placeholder="2499"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Input
                    id="status"
                    name="status"
                    placeholder={hint.statusHint}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Short description the AI can use when answering customer questions."
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-border pt-5">
                <Link href="/inventory">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Save item</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
