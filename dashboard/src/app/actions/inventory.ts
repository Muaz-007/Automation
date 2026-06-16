"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parse } from "csv-parse/sync";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";

export type ActionResult =
  | { ok: true; message?: string; count?: number }
  | { ok: false; error: string };

const KNOWN_TOP_LEVEL_KEYS = new Set([
  "id",
  "sku",
  "external_id",
  "name",
  "title",
  "service",
  "product",
  "category",
  "price",
  "price_pkr", // legacy column name — still accepted for backward compat in CSV uploads
  "price_usd",
  "status",
  "description",
]);

/**
 * Take a raw row from a CSV file and normalize it into our InventoryItem shape.
 * Any column we don't have a top-level field for is stored in `data` JSON.
 */
function mapRowToItem(row: Record<string, string>) {
  // Pick the best "name" source — depends on industry CSV
  const name =
    row.name?.trim() ||
    row.title?.trim() ||
    row.service?.trim() ||
    row.product?.trim();

  if (!name) return null;

  const externalId =
    row.id?.trim() || row.sku?.trim() || row.external_id?.trim() || null;

  const priceRaw =
    row.price?.trim() ||
    row.price_usd?.trim() ||
    row.price_pkr?.trim() ||
    "";
  const parsedPrice = priceRaw
    ? parseInt(priceRaw.replace(/[^0-9]/g, ""), 10)
    : null;
  const price = parsedPrice && !Number.isNaN(parsedPrice) ? parsedPrice : null;

  // Everything else (variants, colors, bedrooms, duration_minutes, etc.) → data
  const data: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(row)) {
    if (KNOWN_TOP_LEVEL_KEYS.has(k)) continue;
    if (v === undefined || v === null) continue;
    const trimmed = String(v).trim();
    if (!trimmed) continue;
    // Coerce common types
    if (trimmed === "true") data[k] = true;
    else if (trimmed === "false") data[k] = false;
    else if (/^-?\d+$/.test(trimmed)) data[k] = parseInt(trimmed, 10);
    else data[k] = trimmed;
  }

  return {
    external_id: externalId,
    name,
    category: row.category?.trim() || null,
    price,
    status: row.status?.trim() || null,
    description: row.description?.trim() || null,
    data,
  };
}

/**
 * Add a single inventory item from the manual form.
 * Used directly as <form action={addInventoryItem}>, so the signature is the
 * native server-action shape (one FormData arg, void return). It redirects
 * on success — no client state needed for the happy path.
 */
export async function addInventoryItem(formData: FormData): Promise<void> {
  const tu = await requireTenant();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    // The form has the `required` attr on the Name input, so this shouldn't
    // happen via the UI. Throw so Next.js renders the error boundary.
    throw new Error("Name is required.");
  }

  const priceRaw = String(formData.get("price") ?? "").trim();
  const parsedPrice = priceRaw
    ? parseInt(priceRaw.replace(/[^0-9]/g, ""), 10)
    : null;

  await prisma.inventoryItem.create({
    data: {
      tenant_id: tu.tenant_id,
      external_id: String(formData.get("external_id") ?? "").trim() || null,
      name,
      category: String(formData.get("category") ?? "").trim() || null,
      price: parsedPrice && !Number.isNaN(parsedPrice) ? parsedPrice : null,
      status: String(formData.get("status") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
    },
  });

  revalidatePath("/inventory");
  redirect("/inventory");
}

/**
 * Bulk-import inventory items from a CSV file uploaded by the user.
 */
export async function uploadInventoryCsv(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const tu = await requireTenant();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Select a CSV file to upload." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, error: "File too large. Max 2MB." };
  }

  let text: string;
  try {
    text = await file.text();
  } catch {
    return { ok: false, error: "Could not read the file." };
  }

  let rows: Record<string, string>[];
  try {
    rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
      relax_column_count: true,
    }) as Record<string, string>[];
  } catch (e) {
    return {
      ok: false,
      error: `CSV could not be parsed: ${e instanceof Error ? e.message : "unknown error"}`,
    };
  }

  if (rows.length === 0) {
    return { ok: false, error: "CSV is empty." };
  }

  const items = rows
    .map(mapRowToItem)
    .filter((i): i is NonNullable<typeof i> => i !== null)
    .map((i) => ({ ...i, tenant_id: tu.tenant_id }));

  if (items.length === 0) {
    return {
      ok: false,
      error: "No valid rows found. Make sure your CSV has a 'name', 'title', or 'service' column.",
    };
  }

  await prisma.inventoryItem.createMany({ data: items });

  revalidatePath("/inventory");
  return {
    ok: true,
    count: items.length,
    message: `${items.length} item${items.length === 1 ? "" : "s"} imported.`,
  };
}

export async function deleteInventoryItem(itemId: string) {
  const tu = await requireTenant();
  await prisma.inventoryItem.deleteMany({
    where: { id: itemId, tenant_id: tu.tenant_id },
  });
  revalidatePath("/inventory");
}
