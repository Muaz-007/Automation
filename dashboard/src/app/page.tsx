import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";
import { TiltCard } from "@/components/tilt-card";

const briefFeatures = [
  {
    icon: MessageCircle,
    title: "24/7 AI Conversations",
    desc: "Instant replies — even at 3am or on weekends.",
  },
  {
    icon: Sparkles,
    title: "Industry-Specific AI",
    desc: "Pre-trained for real estate, e-commerce, and clinics.",
  },
  {
    icon: LayoutDashboard,
    title: "Lead Dashboard",
    desc: "All leads in one place. Hot, warm, cold — filtered, scored, assigned.",
  },
];

const briefIndustries = [
  {
    icon: Building2,
    tag: "Real Estate",
    tagVariant: "default" as const,
    title: "Brokers & Agencies",
    desc: "Auto-qualify by budget, area, BHK. Share property catalogs, schedule visits, get hot-lead alerts.",
  },
  {
    icon: ShoppingBag,
    tag: "E-commerce",
    tagVariant: "info" as const,
    title: "Online Sellers",
    desc: "Product catalog, order taking in WhatsApp, COD confirmation, abandoned-cart recovery.",
  },
  {
    icon: Stethoscope,
    tag: "Healthcare",
    tagVariant: "success" as const,
    title: "Clinics & Doctors",
    desc: "24/7 appointment booking, auto-reminders, intake forms, treatment packages.",
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
    role: "Saaya Closet, Lahore",
    initials: "MT",
  },
  {
    quote:
      "Our receptionist couldn't take appointments after hours. The AI booked 60% more bookings in the very first month.",
    name: "Dr. Layla Mansoor",
    role: "Glow Aesthetic Clinic, Dubai",
    initials: "LM",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_50%)] opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"
        />
        {/* Subtle dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [mask-image:radial-gradient(ellipse_at_top,_black_30%,_transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            color: "var(--muted-foreground)",
          }}
        />
        {/* Floating chat-bubble decorations */}
        <FloatingBubble className="left-6 top-32 hidden md:block" delay={0} />
        <FloatingBubble
          className="right-8 top-44 hidden md:block"
          delay={0.4}
          variant="alt"
        />
        <FloatingBubble
          className="left-20 top-72 hidden lg:block"
          delay={0.8}
          variant="small"
        />

        <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-16 pb-12">
          <div className="mx-auto max-w-3xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="success" className="mb-5">
              <Sparkles className="h-3 w-3" /> Where every talk has potential
            </Badge>
            <h1 className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Capture every WhatsApp lead —{" "}
              <em className="font-serif text-primary not-italic relative">
                <span className="italic">automatically</span>
                <svg
                  aria-hidden
                  viewBox="0 0 220 12"
                  className="absolute -bottom-2 left-0 w-full text-primary/40"
                >
                  <path
                    d="M2 8 C 60 -2, 160 -2, 218 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </em>
              , 24/7
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
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

        {/* Dashboard preview with mouse-follow 3D tilt */}
        <div id="preview" className="mx-auto max-w-7xl px-6 pb-20">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <TiltCard intensity={4} className="cursor-default">
              <DashboardPreview />
            </TiltCard>
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
                <div className="font-display text-2xl font-bold text-primary md:text-3xl">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief industries */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Industries</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Built for the businesses that live on WhatsApp
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pre-trained AI templates for the three industries that lose the
              most sales to slow replies.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {briefIndustries.map((ind) => (
              <Card
                key={ind.tag}
                className="card-3d group relative overflow-hidden border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <ind.icon className="h-5 w-5" />
                    </div>
                    <Badge variant={ind.tagVariant}>{ind.tag}</Badge>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{ind.title}</h3>
                  <p className="text-sm text-muted-foreground">{ind.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/industries">
              <Button variant="outline">
                Explore industries
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brief features */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Features</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to run on WhatsApp
            </h2>
            <p className="mt-4 text-muted-foreground">
              From the first hello to a closed deal — automated.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {briefFeatures.map((f) => (
              <Card
                key={f.title}
                className="card-3d group border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
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
          <div className="mt-10 text-center">
            <Link href="/features">
              <Button variant="outline">
                See all features
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="muted" className="mb-3">Loved by founders</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
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

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--accent)_0%,_transparent_70%)] opacity-80"
        />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
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

/**
 * Decorative floating chat-bubble for the hero background.
 * Three sizes; subtle drop-shadow + slow float animation.
 */
function FloatingBubble({
  className = "",
  delay = 0,
  variant = "default",
}: {
  className?: string;
  delay?: number;
  variant?: "default" | "alt" | "small";
}) {
  const size =
    variant === "small" ? "h-12 w-12" : variant === "alt" ? "h-16 w-16" : "h-14 w-14";
  const tone =
    variant === "alt"
      ? "from-emerald-300/60 to-emerald-500/35"
      : "from-emerald-400/70 to-emerald-600/45";
  return (
    <div
      aria-hidden
      className={`absolute -z-10 ${className} animate-float`}
      style={{
        animationDelay: `${delay}s`,
        perspective: "600px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`relative ${size} flex items-center justify-center rounded-2xl border border-primary/40 bg-linear-to-br ${tone} shadow-2xl shadow-primary/20 backdrop-blur-sm`}
        style={{ transform: "translateZ(20px)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 text-white drop-shadow-md"
          aria-hidden
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-3.8 7L18 22l-4.3-2.1A9 9 0 1 1 21 11.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.2"
          />
        </svg>
        {/* Soft drop shadow under the bubble (gives it the "floating" feel) */}
        <div
          aria-hidden
          className="absolute -bottom-3 left-1/2 h-2 w-3/4 -translate-x-1/2 rounded-full bg-emerald-900/20 blur-md"
        />
      </div>
    </div>
  );
}
