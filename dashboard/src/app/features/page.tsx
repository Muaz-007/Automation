import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Clock,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Features — WhatsappAutomate",
  description:
    "Discover the AI-powered features that turn WhatsApp into your most productive sales channel — 24/7 conversations, lead scoring, industry templates, document-trained AI, and more.",
};

const features = [
  {
    icon: MessageCircle,
    title: "24/7 AI Conversations",
    desc: "Your AI assistant replies to every WhatsApp message within seconds — at 3am, on holidays, during peak rush. Customers never wait, you never miss a lead.",
    bullets: [
      "Sub-5-second response time",
      "Automatic language detection (English, Urdu, Roman Urdu, mixed)",
      "Natural conversational tone you can customize",
    ],
  },
  {
    icon: Sparkles,
    title: "Industry-Specific AI",
    desc: "Pre-trained templates for Real Estate, E-commerce, and Healthcare. The AI knows what questions to ask, what data to extract, and how to qualify leads for your specific business.",
    bullets: [
      "Real Estate: budget, area, BHK, timeline",
      "E-commerce: product, variant, quantity, address",
      "Healthcare: service, preferred date, intake forms",
    ],
  },
  {
    icon: LayoutDashboard,
    title: "Lead Dashboard",
    desc: "Every WhatsApp conversation becomes a structured lead. Status, hot score, extracted attributes — all in one clean view. Filter, assign, follow up.",
    bullets: [
      "Status pipeline: new → qualifying → warm → hot → won",
      "Auto-calculated hot score 0–100",
      "Filter by status, source, date",
    ],
  },
  {
    icon: Bot,
    title: "Document-Trained AI",
    desc: "Upload your website, product catalog, FAQ, or PDFs. The AI builds a knowledge base of your business and answers customer questions with your actual data.",
    bullets: [
      "Website URL ingestion",
      "PDF / brochure parsing",
      "Custom system prompt overrides",
    ],
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    desc: "Connect to Shopify, Zoho, Slack, Google Sheets, or any of 400+ tools via n8n workflows. Push hot leads, sync orders, send notifications — all automated.",
    bullets: [
      "Hot-lead Slack / WhatsApp alerts to your team",
      "Auto-sync to your CRM",
      "Drip campaigns and abandoned-cart recovery",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Multi-Tenant Security",
    desc: "Your data stays yours. Per-business row-level security, encrypted credentials, audit logs. We never use your customer messages to train AI models.",
    bullets: [
      "Row-level security on every query",
      "Encrypted credential storage",
      "GDPR-compatible data deletion",
    ],
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Connect WhatsApp",
    desc: "Paste your Meta WhatsApp credentials in Settings or use one-click OAuth (coming soon).",
  },
  {
    step: "2",
    title: "Customize your AI",
    desc: "Pick your industry, set your AI persona name, tone, and language. Upload your business knowledge.",
  },
  {
    step: "3",
    title: "Leads flow in",
    desc: "Every WhatsApp message is handled by AI 24/7. You manage qualified leads from the dashboard.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-dvh">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_50%)] opacity-50"
        />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <Badge variant="muted" className="mb-4">Features</Badge>
          <h1 className="font-display text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to{" "}
            <em className="font-serif text-primary not-italic">
              <span className="italic">close more deals</span>
            </em>{" "}
            on WhatsApp
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A complete AI sales assistant that lives inside WhatsApp — built for
            small and medium businesses that depend on chat.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg">
                Start 14-day free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group border-border transition-all hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="p-8">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-transform group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 font-display text-xl font-semibold">
                    {f.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                  <ul className="space-y-2 text-sm">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span className="text-foreground/80">{b}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">How it works</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Live in 10 minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three steps from signup to your first AI-handled WhatsApp lead.
            </p>
          </div>
          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            {/* Connecting line on desktop */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-linear-to-r from-transparent via-primary/40 to-transparent md:block"
            />
            {howItWorks.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="relative z-10 mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-background font-display text-xl font-bold text-primary shadow-sm">
                  {s.step}
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Ready to capture every lead?
          </h2>
          <p className="mt-4 text-muted-foreground">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg">
                <Clock className="h-4 w-4" /> Start free trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                See pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
