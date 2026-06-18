import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Heart,
  Lock,
  MapPin,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Who We Are — Talkential",
  description:
    "Talkential is built in Lahore for SMBs worldwide. Learn about our mission to bring enterprise-grade AI to every WhatsApp Business on the planet.",
};

const values = [
  {
    icon: Users,
    title: "Customer first",
    desc: "We build for SMBs — real estate brokers, online sellers, clinics — not enterprises. Every feature exists because a customer asked for it.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    desc: "Your data is yours. We never use customer messages to train AI models. Row-level security, encrypted credentials, full data deletion on request.",
  },
  {
    icon: MapPin,
    title: "Speaks your customers' language",
    desc: "English, Urdu, Roman Urdu, Arabic, Spanish, Hindi, mixed — Gemini handles natural code-switching the way your customers actually talk. Local context is a feature, not an afterthought.",
  },
  {
    icon: Heart,
    title: "Honest pricing",
    desc: "Monthly plans you can cancel anytime. No setup fees, no hidden enterprise upcharges, no minimums. You pay only when we deliver value.",
  },
];

export default function AboutPage() {
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
          <Badge variant="muted" className="mb-4">Who we are</Badge>
          <h1 className="font-display text-balance text-4xl font-bold tracking-tight md:text-5xl">
            We&apos;re here so no small business{" "}
            <em className="font-serif text-primary not-italic">
              <span className="italic">ever misses a lead</span>
            </em>{" "}
            again
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Talkential is an AI assistant for small and medium businesses
            around the world that live and die by WhatsApp. Built in Lahore,
            serving SMBs from Karachi to Dubai to São Paulo.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-2">
            <Badge variant="muted">Our story</Badge>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Why we started this
          </h2>
          <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground/85">
            <p>
              Across emerging markets — Pakistan, India, the Gulf, Southeast
              Asia, Latin America — WhatsApp is the silent backbone of small
              business. A property broker in DHA. A clothing seller in Anarkali.
              A skin clinic in Dubai. A boutique in São Paulo. Every one of
              them runs their entire sales pipeline through WhatsApp messages —
              often on their personal phone, often alone.
            </p>
            <p>
              And every one of them loses sales the same way: a message comes
              in at 11pm, on a Sunday, during a rush. By the time they reply,
              the customer has moved to someone faster. The bigger the
              business, the more painful this gets.
            </p>
            <p>
              We saw this happen to friends and family running real businesses.
              Enterprise solutions exist — but they&apos;re built for Fortune
              500 companies, priced in dollars at enterprise rates, and require
              IT teams nobody has. SMBs were left with no real option except
              hiring more people, or losing leads.
            </p>
            <p className="font-medium text-foreground">
              So we built Talkential — enterprise-grade AI for WhatsApp,
              priced and shaped for the businesses that actually need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">What we believe</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Our values
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four principles guide everything we ship.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <Card key={v.title} className="border-border">
                <CardContent className="p-7">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 font-display text-lg font-semibold">
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {v.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Badge variant="muted" className="mb-3">Who we serve</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Three industries, one platform
              </h2>
              <p className="mt-4 text-muted-foreground">
                We deliberately focus on three verticals where WhatsApp is the
                primary sales channel — instead of being a generic chatbot,
                we&apos;re a specialist for businesses that live on chat.
              </p>
              <div className="mt-6">
                <Link href="/industries">
                  <Button variant="outline">
                    Explore industries
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Real Estate", desc: "Brokers, agencies, property dealers" },
                { label: "E-commerce", desc: "Online sellers, D2C brands, Instagram stores" },
                { label: "Healthcare", desc: "Clinics, dentists, aesthetic centers" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <div className="font-medium">{row.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {row.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder / team */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <Badge variant="muted" className="mb-3">The team</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              A small, focused team
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;re bootstrapped, independent, and shipping fast.
            </p>
          </div>

          <Card className="mt-12 border-border">
            <CardContent className="p-8">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-700 font-display text-2xl font-bold text-white shadow-lg">
                  MA
                </div>
                <div>
                  <div className="font-display text-xl font-semibold">
                    Muaz Ali
                  </div>
                  <div className="mb-3 text-sm text-muted-foreground">
                    Founder &amp; Builder
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Building Talkential to solve a problem I saw up close:
                    SMBs losing real money because they can&apos;t answer
                    WhatsApp messages fast enough. Background in software
                    engineering, based in Lahore — building for businesses
                    everywhere.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary" />
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Join the businesses already automating WhatsApp
          </h2>
          <p className="mt-4 text-muted-foreground">
            14-day free trial. No credit card. Setup in 10 minutes.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg">
                <Clock className="h-4 w-4" /> Start free trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Get in touch
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
