import Link from "next/link";
import { LogoMark } from "@/components/logo";

const sections = [
  {
    heading: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/industries", label: "Industries" },
      { href: "/pricing", label: "Pricing" },
      { href: "/signup", label: "Get started" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "Who We Are" },
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Sign in" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <LogoMark size="md" />
              <div>
                <div className="font-display font-semibold leading-tight">
                  Whatsapp<span className="text-primary">Automate</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  AI for WhatsApp Business
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An AI WhatsApp assistant for SMBs in Pakistan. Capture every lead,
              24/7.
            </p>
          </div>

          {sections.map((s) => (
            <div key={s.heading}>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.heading}
              </div>
              <ul className="space-y-2 text-sm">
                {s.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} WhatsappAutomate. All rights reserved.</span>
          <span>Built in Lahore, Pakistan</span>
        </div>
      </div>
    </footer>
  );
}
