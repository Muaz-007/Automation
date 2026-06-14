"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do I need a WhatsApp Business account to use this?",
    a: "Yes. You'll connect your existing WhatsApp Business number through the Meta Cloud API — we walk you through it during onboarding. Setup takes ~10 minutes.",
  },
  {
    q: "Will the AI reply in Urdu / Roman Urdu?",
    a: "Haan. AI automatically detects the customer's language and replies in the same one — English, Urdu, Roman Urdu, ya mixed.",
  },
  {
    q: "Can I take over a conversation from the AI?",
    a: "Bilkul. Dashboard mein lead detail page se aap khud manually reply kar sakte hain. AI pause ho jata hai jab aap takeover karte hain.",
  },
  {
    q: "Kya integrations available hain (Shopify, Zoho, etc.)?",
    a: "Built-in integrations Shopify and Zoho for the Growth plan and above. Custom integrations available on Pro and Enterprise.",
  },
  {
    q: "Kitne din mein setup ho jata hai?",
    a: "Most clients are live within 24 hours. WhatsApp Business API verification se Meta side se 1–2 din lag sakte hain.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No long-term contracts. Cancel monthly subscription anytime from Settings.",
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
