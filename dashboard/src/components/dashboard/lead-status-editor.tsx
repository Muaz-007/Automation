"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/toaster";
import { updateLeadStatus } from "@/app/actions/lead";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "qualifying", label: "Qualifying" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
  { value: "cold", label: "Cold" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function LeadStatusEditor({
  leadId,
  currentStatus,
}: {
  leadId: string;
  currentStatus: string;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();

  function handleChange(newStatus: string) {
    if (newStatus === currentStatus) return;
    start(async () => {
      try {
        await updateLeadStatus(leadId, newStatus);
        toast("success", `Status updated to "${newStatus}"`);
      } catch {
        toast("error", "Could not update status. Try again.");
      }
    });
  }

  return (
    <div className="space-y-1.5" data-pending={pending ? "" : undefined}>
      <Select
        name="status"
        options={STATUS_OPTIONS}
        defaultValue={currentStatus}
        onChange={handleChange}
      />
      {pending && (
        <p className="text-xs text-muted-foreground">Saving…</p>
      )}
    </div>
  );
}
