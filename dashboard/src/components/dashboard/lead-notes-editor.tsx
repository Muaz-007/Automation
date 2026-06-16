"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toaster";
import { updateLeadNotes } from "@/app/actions/lead";

export function LeadNotesEditor({
  leadId,
  initialNotes,
}: {
  leadId: string;
  initialNotes: string | null;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();
  const [value, setValue] = useState(initialNotes ?? "");

  const dirty = value !== (initialNotes ?? "");

  function save() {
    if (!dirty) return;
    start(async () => {
      try {
        await updateLeadNotes(leadId, value);
        toast("success", "Notes saved");
      } catch {
        toast("error", "Could not save notes");
      }
    });
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Private notes — only you can see these. e.g. 'Wants to close by Friday, prefers Phase 6'"
        rows={5}
        className="resize-none"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {dirty ? "Unsaved changes" : "All changes saved"}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={save}
          disabled={!dirty || pending}
        >
          {pending ? "Saving…" : "Save notes"}
        </Button>
      </div>
    </div>
  );
}
