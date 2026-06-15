"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do I need a WhatsApp Business account to use this?",
    a: "Yes. You'll connect your existing WhatsApp Business number through the Meta Cloud API — we walk you through it during onboarding. Setup takes about 10 minutes.",
  },
  {
    q: "Will the AI reply in Urdu / Roman Urdu?",
    a: "Yes. The AI automatically detects the customer's language and replies in the same one — English, Urdu, Roman Urdu, or mixed.",
  },
  {
    q: "Can I take over a conversation from the AI?",
    a: "Absolutely. From the lead detail page in your dashboard you can reply manually at any time. The AI pauses when you take over.",
  },
  {
    q: "Which integrations are available (Shopify, Zoho, etc.)?",
    a: "Built-in integrations with Shopify and Zoho are available on the Growth plan and above. Custom integrations are available on Pro and Enterprise.",
  },
  {
    q: "How long does setup take?",
    a: "Most clients are live within 24 hours. WhatsApp Business API verification on Meta's side can take 1–2 days.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No long-term contracts. Cancel your monthly subscription anytime from the Settings page.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/40"
            >
              <span className="font-medium">{f.q}</span>
              <ChevronDown
                className={cn(
                  "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid overflow-hidden transition-all",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm text-muted-foreground">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
