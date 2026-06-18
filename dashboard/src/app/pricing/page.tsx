import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { FAQ } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "Pricing — Talkential",
  description:
    "Simple, transparent pricing for Talkential. Free 14-day trial. No credit card required. ROI in your first closed deal.",
};

const tiers = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    localPrice: "≈ ₨ 4,999 PKR",
    desc: "Solo agents and small online stores getting started",
    features: [
      "1 WhatsApp number",
      "500 conversations/month",
      "Basic AI templates",
      "Lead dashboard",
      "Email support",
    ],
    excludes: [
      "Document-trained AI",
      "Multi-user team",
      "Integrations",
    ],
    cta: "Start free trial",
    href: "/signup",
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    localPrice: "≈ ₨ 12,999 PKR",
    desc: "Most popular — for SMBs scaling their sales",
    features: [
      "2 WhatsApp numbers",
      "2,000 conversations/month",
      "All industry templates",
      "Document-trained AI (PDFs, website)",
      "Multi-user team (up to 5)",
      "Slack & email notifications",
      "Priority email support",
    ],
    excludes: ["API access", "Custom workflows"],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    localPrice: "≈ ₨ 24,999 PKR",
    desc: "Scaling businesses with complex workflows",
    features: [
      "5 WhatsApp numbers",
      "10,000 conversations/month",
      "All Growth features",
      "API + webhook access",
      "Shopify / Zoho integrations",
      "Custom n8n workflows",
      "Priority support (4hr SLA)",
    ],
    excludes: [],
    cta: "Talk to sales",
    href: "/contact",
  },
];

const comparison = [
  { feature: "WhatsApp numbers", starter: "1", growth: "2", pro: "5" },
  { feature: "Monthly conversations", starter: "500", growth: "2,000", pro: "10,000" },
  { feature: "Industry templates", starter: "Basic only", growth: "All", pro: "All + custom" },
  { feature: "Document-trained AI", starter: false, growth: true, pro: true },
  { feature: "Team members", starter: "1", growth: "5", pro: "Unlimited" },
  { feature: "Integrations (Shopify, Zoho)", starter: false, growth: false, pro: true },
  { feature: "API access", starter: false, growth: false, pro: true },
  { feature: "Custom workflows", starter: false, growth: false, pro: true },
  { feature: "Support", starter: "Email", growth: "Priority email", pro: "Priority (4hr SLA)" },
];

export default function PricingPage() {
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
          <Badge variant="muted" className="mb-4">Pricing</Badge>
          <h1 className="font-display text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Simple, transparent{" "}
            <em className="font-serif text-primary not-italic">
              <span className="italic">pricing</span>
            </em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Pay monthly, cancel anytime. 14-day free trial on every plan. ROI in
            your first closed deal.
          </p>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
            {tiers.map((t) => (
              <Card
                key={t.name}
                className={
                  t.highlight
                    ? "relative flex flex-col border-primary/60 shadow-xl shadow-primary/10"
                    : "flex flex-col border-border"
                }
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most popular</Badge>
                  </div>
                )}
                <CardContent className="flex flex-1 flex-col p-7">
                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                    {t.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-display text-4xl font-bold">{t.price}</span>
                    <span className="text-muted-foreground">{t.period}</span>
                  </div>
                  <div className="mb-3 text-xs text-muted-foreground">
                    {t.localPrice}
                  </div>
                  <p className="mb-7 text-sm text-muted-foreground">{t.desc}</p>
                  <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                    {t.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {t.excludes.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-muted-foreground/70"
                      >
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={t.href} className="mt-auto">
                    <Button
                      className="w-full"
                      variant={t.highlight ? "default" : "outline"}
                    >
                      {t.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans: 14-day free trial. No credit card required. WhatsApp
            messaging fees billed by Meta directly to your account.
            <br />
            <span className="text-xs">
              Prices in USD. Pakistani businesses can be billed in PKR — local
              equivalent shown below each plan.
            </span>
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Compare plans
            </h2>
            <p className="mt-4 text-muted-foreground">
              All plans include WhatsApp Cloud API integration, AI-powered
              conversations, and lead dashboard.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-6 py-4 font-semibold">Feature</th>
                  <th className="px-6 py-4 font-semibold">Starter</th>
                  <th className="px-6 py-4 font-semibold text-primary">Growth</th>
                  <th className="px-6 py-4 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparison.map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium">{row.feature}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {renderCell(row.starter)}
                    </td>
                    <td className="px-6 py-3 text-foreground">
                      {renderCell(row.growth)}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {renderCell(row.pro)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <Badge variant="muted" className="mb-3">FAQ</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Try it free for 14 days
          </h2>
          <p className="mt-4 text-muted-foreground">
            No credit card required. Cancel anytime. Set up in 10 minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg">
                <Clock className="h-4 w-4" /> Start free trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Talk to sales
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

function renderCell(value: string | boolean) {
  if (value === true) return <CheckCircle2 className="h-4 w-4 text-primary" />;
  if (value === false) return <X className="h-4 w-4 text-muted-foreground/40" />;
  return value;
}
