import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FAQ } from "@/components/landing/faq";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: MessageCircle,
    title: "24/7 AI Conversations",
    desc: "Instant replies to every WhatsApp message — even at 3am or on weekends.",
  },
  {
    icon: Sparkles,
    title: "Industry-Specific AI",
    desc: "Specialized agents for Real Estate, E-commerce, and Clinics — pre-trained for your vertical.",
  },
  {
    icon: LayoutDashboard,
    title: "Lead Dashboard",
    desc: "All leads in one place. Filter by hot, warm, or cold; assign to team members; track status.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Tenant Secure",
    desc: "Your data stays yours. Row-level security and encrypted credentials end-to-end.",
  },
  {
    icon: Zap,
    title: "n8n-Powered Workflows",
    desc: "Built on the n8n automation engine — fast, reliable, infinitely customizable.",
  },
  {
    icon: Bot,
    title: "Document-Trained AI",
    desc: "Upload your website or PDFs — the AI builds a knowledge base of your business automatically.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "₨ 4,999",
    period: "/month",
    desc: "Solo agents and small stores",
    features: [
      "1 WhatsApp number",
      "500 conversations/month",
      "Basic AI templates",
      "Lead dashboard",
    ],
    cta: "Start free trial",
  },
  {
    name: "Growth",
    price: "₨ 12,999",
    period: "/month",
    desc: "Most popular for SMBs",
    features: [
      "2 WhatsApp numbers",
      "2,000 conversations/month",
      "All industry templates",
      "Document-trained AI",
      "Multi-user team",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₨ 24,999",
    period: "/month",
    desc: "Scaling businesses",
    features: [
      "5 WhatsApp numbers",
      "10,000 conversations/month",
      "API + integrations",
      "Priority support",
      "Custom workflows",
    ],
    cta: "Talk to sales",
  },
];

const testimonials = [
  {
    quote:
      "23 leads were captured automatically on day one. Our sales grew 40% in the first month.",
    name: "Ali Hassan",
    role: "Prime Properties, Karachi",
    initials: "AH",
  },
  {
    quote:
      "We used to handle 200+ Instagram inquiries every day manually. Now AI handles 80% — we just ship orders.",
    name: "Maryam Tariq",
    role: "Saaya Closet (Online Boutique)",
    initials: "MT",
  },
  {
    quote:
      "Our receptionist couldn't take appointments after hours. The AI booked 60% more bookings in the very first month.",
    name: "Dr. Sara Iqbal",
    role: "Glow Aesthetic Clinic, Lahore",
    initials: "SI",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold">WhatsappAutomate</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_50%)] opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
        <div className="mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-12">
          <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="success" className="mb-4">
              <Sparkles className="h-3 w-3" /> AI for WhatsApp Business
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
              Capture every WhatsApp lead —{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                automatically
              </span>
              , 24/7
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              An AI assistant for real estate, e-commerce, and clinics that
              chats with your customers on WhatsApp, qualifies leads, and hands
              them to you in a clean dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start 14-day free trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#preview">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See it in action
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required &middot; Setup in 10 minutes
            </p>
          </div>
        </div>

        {/* Dashboard preview */}
        <div id="preview" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: "Response time", value: "< 5 sec" },
              { label: "Uptime", value: "99.9%" },
              { label: "Languages", value: "Urdu + English" },
              { label: "Industries", value: "3 specialized" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-primary md:text-3xl">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Industries</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Built for the businesses that live on WhatsApp
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pre-trained AI templates for the three industries that lose the
              most sales to slow replies.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <IndustryCard
              icon={Building2}
              tag="Real Estate"
              tagVariant="default"
              title="Brokers & Agencies"
              points={[
                "Auto-qualify by budget, area, BHK",
                "Share property catalogs in chat",
                "Schedule site visits",
                "Hot-lead alerts to your phone",
              ]}
            />
            <IndustryCard
              icon={ShoppingBag}
              tag="E-commerce"
              tagVariant="info"
              title="Online Sellers"
              points={[
                "Product catalog auto-share",
                "Order taking in WhatsApp",
                "COD confirmation",
                "Abandoned cart recovery",
              ]}
            />
            <IndustryCard
              icon={Stethoscope}
              tag="Healthcare"
              tagVariant="success"
              title="Clinics & Doctors"
              points={[
                "24/7 appointment booking",
                "Auto-reminders to reduce no-shows",
                "Pre-consultation intake forms",
                "Treatment packages",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Features</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to run on WhatsApp
            </h2>
            <p className="mt-4 text-muted-foreground">
              From the first hello to a closed deal — automated.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="group border-border transition-all hover:border-primary/40 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Loved by founders</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Real businesses, real results
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-6">
                  <div className="mb-4 text-yellow-500" aria-hidden>
                    ★★★★★
                  </div>
                  <blockquote className="text-sm leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Pricing</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pay monthly, cancel anytime. ROI in your first closed deal.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pricing.map((p) => (
              <Card
                key={p.name}
                className={
                  p.highlight
                    ? "relative border-primary/60 shadow-xl shadow-primary/10"
                    : "border-border"
                }
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                    {p.name}
                  </div>
                  <div className="mb-1">
                    <span className="text-3xl font-bold">{p.price}</span>
                    <span className="text-muted-foreground">{p.period}</span>
                  </div>
                  <p className="mb-6 text-sm text-muted-foreground">{p.desc}</p>
                  <ul className="mb-6 space-y-2 text-sm">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <Button
                      className="w-full"
                      variant={p.highlight ? "default" : "outline"}
                    >
                      {p.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-12 text-center">
            <Badge variant="muted" className="mb-3">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--accent)_0%,_transparent_70%)] opacity-80"
        />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Stop losing leads to slow replies
          </h2>
          <p className="mt-4 text-muted-foreground">
            Set up in 10 minutes. First lead captured tonight.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg">
                <Clock className="h-4 w-4" /> Start free trial
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>© {new Date().getFullYear()} WhatsappAutomate</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function IndustryCard({
  icon: Icon,
  tag,
  tagVariant,
  title,
  points,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  tagVariant: "default" | "info" | "success";
  title: string;
  points: string[];
}) {
  return (
    <Card className="group relative overflow-hidden border-border transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant={tagVariant}>{tag}</Badge>
        </div>
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        <ul className="space-y-2 text-sm">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
