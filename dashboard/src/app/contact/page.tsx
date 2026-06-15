import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteNav } from "@/components/landing/site-nav";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Contact — WhatsappAutomate",
  description:
    "Get in touch with the WhatsappAutomate team for sales, support, or partnership inquiries.",
};

const COMPANY_NAME = "WhatsappAutomate";
const CONTACT_EMAIL = "muaz.developments@gmail.com";
const SUPPORT_EMAIL = "muaz.developments@gmail.com";
const BUSINESS_ADDRESS = "Lahore, Pakistan";

export default function ContactPage() {
  return (
    <div className="min-h-dvh">
      <SiteNav />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We&apos;d love to hear from you. Reach out for sales, support, or
          partnership inquiries — we typically respond within one business day.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Sales &amp; Partnerships</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Questions about plans, pricing, or volume discounts.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Customer Support</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Help with your account, setup, or troubleshooting.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Address</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {BUSINESS_ADDRESS}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Phone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Available on request via email — we&apos;ll schedule a call.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted/40 p-6">
          <h2 className="font-semibold">About {COMPANY_NAME}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {COMPANY_NAME} is a WhatsApp automation platform that helps small
            and medium businesses in Pakistan capture and qualify leads 24/7
            using AI. We integrate directly with the official Meta WhatsApp
            Cloud API and serve real estate, e-commerce, and healthcare
            verticals.
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
