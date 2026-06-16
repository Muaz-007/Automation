"use server";

import { revalidatePath } from "next/cache";
import type { LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/dal";

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "qualifying",
  "warm",
  "hot",
  "cold",
  "won",
  "lost",
];

function isValidStatus(s: string): s is LeadStatus {
  return (VALID_STATUSES as string[]).includes(s);
}

/**
 * Update the qualification stage of a lead. Used from the lead detail page —
 * lets the owner manually override the AI's status (e.g. mark a lead as won
 * after closing the deal offline).
 */
export async function updateLeadStatus(leadId: string, status: string) {
  const tu = await requireTenant();
  if (!isValidStatus(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const result = await prisma.lead.updateMany({
    where: { id: leadId, tenant_id: tu.tenant_id },
    data: { status },
  });
  if (result.count === 0) {
    throw new Error("Lead not found");
  }

  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/leads");
}

/**
 * Save owner notes on a lead. Plain text, multi-line allowed.
 */
export async function updateLeadNotes(leadId: string, notes: string) {
  const tu = await requireTenant();
  const trimmed = notes.trim();

  const result = await prisma.lead.updateMany({
    where: { id: leadId, tenant_id: tu.tenant_id },
    data: { notes: trimmed === "" ? null : trimmed },
  });
  if (result.count === 0) {
    throw new Error("Lead not found");
  }

  revalidatePath(`/leads/${leadId}`);
}
