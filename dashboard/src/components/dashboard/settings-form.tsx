"use client";

import { useTransition } from "react";
import { useToast } from "@/components/toaster";
import { updateTenant } from "@/app/actions/tenant";

export function SettingsForm({
  children,
  successMessage = "Settings saved",
}: {
  children: React.ReactNode;
  successMessage?: string;
}) {
  const { toast } = useToast();
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => {
        start(async () => {
          try {
            await updateTenant(fd);
            toast("success", successMessage);
          } catch {
            toast("error", "Something went wrong. Please try again.");
          }
        });
      }}
      data-pending={pending ? "" : undefined}
      className="contents"
    >
      {children}
    </form>
  );
}
