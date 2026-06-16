import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Industries — WhatsappAutomate",
  description:
    "Pre-trained AI templates for real estate, e-commerce, and healthcare — the three industries that lose the most sales to slow WhatsApp replies.",
};

const industries = [
  {
    icon: Building2,
    tag: "Real Estate",
    tagVariant: "default" as const,
    title: "Brokers, Agencies & Property Dealers",
    subtitle: "Never miss a property inquiry again",
    painPoints: [
      "100+ inquiries per ad — humanly impossible to reply to all",
      "Hot buyers go to competitors who reply first",
      "After-hours and weekend leads completely missed",
      "Repetitive qualifying questions waste agent time",
    ],
    capabilities: [
      "Auto-qualify by budget, area, BHK, buy/rent, timeline",
      "Share property catalogs, brochures, and location maps in-chat",
      "Schedule site visits with calendar booking",
      "Hot-lead alerts to your phone the moment a serious buyer surfaces",
      "Multi-agent routing for agencies",
    ],
    sampleConvo: {
      customer: "Hi, I'm looking for a 3-bedroom house in DHA Phase 6, budget around 1.5 crore.",
      ai: "Hi! Got it — budget and area noted. Which day works better for a site visit, Saturday or Sunday?",
    },
    pricing: "$29/mo (Solo Agent) — $79/mo (Agency)",
  },
  {
    icon: ShoppingBag,
    tag: "E-commerce",
    tagVariant: "info" as const,
    title: "Online Sellers, D2C & Instagram Stores",
    subtitle: "Convert inquiries into orders, on autopilot",
    painPoints: [
      "200+ daily Instagram inquiries to handle manually",
      "Customers ask the same 10 questions over and over",
      "Cart abandonment because replies are slow",
      "COD orders not getting confirmed in time",
    ],
    capabilities: [
      "Product catalog auto-share with prices and variants",
      "Take orders inside WhatsApp — size, color, address",
      "COD confirmation flow with automatic follow-up",
      "Order status updates (confirmed, shipped, delivered)",
      "Abandoned-cart recovery campaigns",
    ],
    sampleConvo: {
      customer: "Hi, do you have black hoodie size M in stock?",
      ai: "Yes, black hoodie size M is available — $25. Want to place an order? I'll just need your address and preferred payment method.",
    },
    pricing: "$19/mo (Starter) — $49/mo (Growth)",
  },
  {
    icon: Stethoscope,
    tag: "Healthcare",
    tagVariant: "success" as const,
    title: "Clinics, Dentists & Aesthetic Centers",
    subtitle: "Book appointments while you sleep",
    painPoints: [
      "Front-desk staff overwhelmed during peak hours",
      "After-hours appointment requests go unanswered",
      "No-shows because patients aren't reminded",
      "Same FAQs about timings, services, prices repeated daily",
    ],
    capabilities: [
      "24/7 appointment booking with real-time slot availability",
      "Auto-reminders (24hr, 2hr, 30min before) to reduce no-shows",
      "Pre-consultation intake forms (symptoms, history)",
      "Treatment package recommendations for aesthetic clinics",
      "Multi-doctor / multi-branch routing",
    ],
    sampleConvo: {
      customer: "Is there an appointment available for a skin consultation on Saturday?",
      ai: "Saturday has 3 open slots: 11 AM, 2 PM, and 4:30 PM. Which one do you prefer?",
    },
    pricing: "$25/mo (Solo Doctor) — $59/mo (Multi-Doctor)",
  },
];

export default function IndustriesPage() {
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
          <Badge variant="muted" className="mb-4">Industries</Badge>
          <h1 className="font-display text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Built for the businesses that{" "}
            <em className="font-serif text-primary not-italic">
              <span className="italic">live on WhatsApp</span>
            </em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We specialize in three verticals where WhatsApp is the primary
            sales channel and slow replies cost real money.
          </p>
        </div>
      </section>

      {/* Industry deep-dives */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl space-y-20 px-6">
          {industries.map((ind, idx) => (
            <div key={ind.tag} className="grid gap-8 md:grid-cols-5">
              {/* Left column: icon + tag */}
              <div className="md:col-span-2">
                <div className="sticky top-24 space-y-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <ind.icon className="h-7 w-7" />
                  </div>
                  <Badge variant={ind.tagVariant}>{ind.tag}</Badge>
                  <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                    {ind.title}
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    {ind.subtitle}
                  </p>
                  <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">
                    <span className="text-muted-foreground">Starting at </span>
                    <span className="font-medium text-foreground">{ind.pricing}</span>
                  </div>
                </div>
              </div>

              {/* Right column: pain points + capabilities + sample */}
              <div className="space-y-6 md:col-span-3">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      The pain
                    </h3>
                    <ul className="space-y-2.5 text-sm">
                      {ind.painPoints.map((p) => (
                        <li key={p} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500/70" />
                          <span className="text-foreground/85">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-primary/30 bg-accent/20">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                      What the AI does
                    </h3>
                    <ul className="space-y-2.5 text-sm">
                      {ind.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Sample conversation */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Sample conversation
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2 text-sm">
                        {ind.sampleConvo.customer}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground">
                        {ind.sampleConvo.ai}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {idx < industries.length - 1 && (
                <div className="md:col-span-5">
                  <div className="h-px w-full bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Your industry, your AI
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick a template, customize the persona, and you&apos;re live in 10
            minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg">
                <Clock className="h-4 w-4" /> Start free trial
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                See all features
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
