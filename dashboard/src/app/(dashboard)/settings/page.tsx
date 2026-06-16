import {
  AlertTriangle,
  Bell,
  Briefcase,
  CheckCircle2,
  Globe,
  MessageCircle,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { CopyButton } from "@/components/dashboard/copy-button";
import { SettingsTabLink } from "@/components/dashboard/settings-tab-link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { requireTenant } from "@/lib/dal";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { CURRENCY_OPTIONS, TIMEZONE_OPTIONS } from "@/lib/locale-options";

const TONE_OPTIONS = [
  { value: "formal", label: "Formal — buttoned-up, professional" },
  { value: "friendly", label: "Friendly — warm and approachable" },
  { value: "casual", label: "Casual — conversational, relaxed" },
];

const LANGUAGE_OPTIONS = [
  { value: "english", label: "English only" },
  { value: "urdu", label: "Urdu only" },
  { value: "roman_urdu", label: "Roman Urdu only" },
  { value: "mixed", label: "Mixed (auto-detect from customer)" },
];

const INDUSTRY_OPTIONS = [
  { value: "real_estate", label: "Real Estate" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "healthcare", label: "Healthcare" },
];

const RESPONSE_LENGTH_OPTIONS = [
  { value: "short", label: "Short — 1 sentence, terse" },
  { value: "medium", label: "Medium — 1-3 sentences (recommended)" },
  { value: "long", label: "Long — detailed, 3-5 sentences" },
];

const CURRENCY_SELECT_OPTIONS = CURRENCY_OPTIONS.map((c) => ({
  value: c.code,
  label: c.label,
}));

type TabKey =
  | "business"
  | "ai"
  | "whatsapp"
  | "localization"
  | "leads"
  | "notifications"
  | "danger";

const TABS: { key: TabKey; label: string; icon: typeof Briefcase }[] = [
  { key: "business", label: "Business profile", icon: Briefcase },
  { key: "ai", label: "AI assistant", icon: Sparkles },
  { key: "whatsapp", label: "WhatsApp connection", icon: MessageCircle },
  { key: "localization", label: "Localization", icon: Globe },
  { key: "leads", label: "Lead rules", icon: Sliders },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "danger", label: "Danger zone", icon: AlertTriangle },
];

function isValidTab(t: string | undefined): t is TabKey {
  return TABS.some((tab) => tab.key === t);
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab: TabKey = isValidTab(params.tab) ? params.tab : "business";

  const tu = await requireTenant();
  const tenant = tu.tenant;
  const isConnected = !!tenant.phone_number_id && !!tenant.whatsapp_token;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/webhook/whatsapp/${tenant.id}`;
  const verifyToken =
    process.env.META_WEBHOOK_VERIFY_TOKEN ??
    "(set META_WEBHOOK_VERIFY_TOKEN in .env)";

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar nav */}
          <nav className="lg:sticky lg:top-20 lg:self-start">
            <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.key} className="shrink-0">
                    <SettingsTabLink
                      href={`/settings?tab=${t.key}`}
                      label={t.label}
                      icon={<Icon className="h-4 w-4 shrink-0" />}
                      active={tab === t.key}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="min-w-0 space-y-6">
            {tab === "business" && (
              <SettingsForm successMessage="Business profile saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Business profile
                    </CardTitle>
                    <CardDescription>
                      Who you are. The AI uses this context when introducing
                      itself and answering customer questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="business_name">Business name</Label>
                        <Input
                          id="business_name"
                          name="business_name"
                          defaultValue={tenant.business_name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          id="industry"
                          name="industry"
                          options={INDUSTRY_OPTIONS}
                          defaultValue={tenant.industry}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_description">
                        Short description
                      </Label>
                      <Textarea
                        id="business_description"
                        name="business_description"
                        defaultValue={tenant.business_description ?? ""}
                        placeholder="e.g. We are a boutique real estate brokerage in DHA Lahore specializing in luxury homes and prime plots."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        1-3 sentences. The AI uses this when introducing the
                        business to new customers.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="business_website">Website</Label>
                        <Input
                          id="business_website"
                          name="business_website"
                          type="url"
                          defaultValue={tenant.business_website ?? ""}
                          placeholder="https://yourbusiness.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business_email">Contact email</Label>
                        <Input
                          id="business_email"
                          name="business_email"
                          type="email"
                          defaultValue={tenant.business_email ?? ""}
                          placeholder="hello@yourbusiness.com"
                        />
                        <p className="text-xs text-muted-foreground">
                          Used as fallback when no notification email is set
                          (Notifications tab).
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="submit">Save business profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </SettingsForm>
            )}

            {tab === "ai" && (
              <SettingsForm successMessage="AI settings saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> AI Assistant
                    </CardTitle>
                    <CardDescription>
                      How your AI replies to customers on WhatsApp
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ai_persona_name">Persona name</Label>
                        <Input
                          id="ai_persona_name"
                          name="ai_persona_name"
                          defaultValue={tenant.ai_persona_name ?? ""}
                          placeholder="e.g. Sara"
                        />
                        <p className="text-xs text-muted-foreground">
                          Customers see this name when chatting (e.g. &ldquo;Sara
                          from Prime Properties&rdquo;).
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ai_tone">Tone</Label>
                        <Select
                          id="ai_tone"
                          name="ai_tone"
                          options={TONE_OPTIONS}
                          defaultValue={tenant.ai_tone}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="language">Languages</Label>
                        <Select
                          id="language"
                          name="language"
                          options={LANGUAGE_OPTIONS}
                          defaultValue={tenant.language}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="response_length">Response length</Label>
                        <Select
                          id="response_length"
                          name="response_length"
                          options={RESPONSE_LENGTH_OPTIONS}
                          defaultValue={tenant.response_length}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="greeting_message">
                        Custom greeting (optional)
                      </Label>
                      <Textarea
                        id="greeting_message"
                        name="greeting_message"
                        defaultValue={tenant.greeting_message ?? ""}
                        placeholder="e.g. Hi! Welcome to Prime Properties. How can I help you today?"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground">
                        Override the AI&apos;s default opening message when a
                        customer first messages you. Leave empty for AI-generated
                        greeting.
                      </p>
                    </div>

                    <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted/30 p-4">
                      <div className="space-y-1">
                        <Label
                          htmlFor="use_emojis"
                          className="text-base font-medium"
                        >
                          Use emojis in replies
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          AI sprinkles 1-2 relevant emojis per reply (👍 🏠 ✅).
                          Recommended for casual/friendly tone.
                        </p>
                      </div>
                      <Switch
                        id="use_emojis"
                        name="use_emojis"
                        defaultChecked={tenant.use_emojis}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="system_prompt">
                        Custom system prompt (advanced)
                      </Label>
                      <Textarea
                        id="system_prompt"
                        name="system_prompt"
                        defaultValue={tenant.system_prompt ?? ""}
                        placeholder="Leave empty to use the default industry template…"
                        className="font-mono text-xs"
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        Overrides the industry-specific default prompt. Only edit
                        this if you know what you&apos;re doing — bad prompts can
                        break AI behavior.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="submit">Save AI settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </SettingsForm>
            )}

            {tab === "whatsapp" && (
              <SettingsForm successMessage="WhatsApp credentials saved">
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" /> WhatsApp
                          Business API
                        </CardTitle>
                        <CardDescription>
                          Paste credentials from Meta Developer Console → your
                          app → WhatsApp → API Setup
                        </CardDescription>
                      </div>
                      <Badge variant={isConnected ? "success" : "warning"}>
                        {isConnected ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> Connected
                          </>
                        ) : (
                          "Not connected"
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Display number</Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          defaultValue={tenant.phone_number ?? ""}
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number_id">Phone number ID</Label>
                        <Input
                          id="phone_number_id"
                          name="phone_number_id"
                          defaultValue={tenant.phone_number_id ?? ""}
                          placeholder="e.g. 123456789012345"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp_token">Access token</Label>
                      <Input
                        id="whatsapp_token"
                        name="whatsapp_token"
                        type="password"
                        defaultValue={tenant.whatsapp_token ?? ""}
                        placeholder="EAA... (permanent system-user token)"
                        className="font-mono text-xs"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use a permanent system-user token. Temporary tokens
                        expire in 24 hours.
                      </p>
                    </div>

                    <div className="space-y-3 rounded-md border border-border bg-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Meta webhook configuration
                      </p>
                      <div className="space-y-2">
                        <Label>Callback URL</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={webhookUrl}
                            className="font-mono text-xs"
                          />
                          <CopyButton text={webhookUrl} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Verify token</Label>
                        <div className="flex gap-2">
                          <Input
                            readOnly
                            value={verifyToken}
                            className="font-mono text-xs"
                          />
                          <CopyButton text={verifyToken} />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Paste both into Meta Developer Console → WhatsApp →
                        Configuration → Webhook. Subscribe to the{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5">
                          messages
                        </code>{" "}
                        field.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="submit">
                        {isConnected ? "Update credentials" : "Connect WhatsApp"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </SettingsForm>
            )}

            {tab === "localization" && (
              <SettingsForm successMessage="Localization saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Localization
                    </CardTitle>
                    <CardDescription>
                      Currency for inventory prices and timezone for scheduling
                      and alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Business currency</Label>
                        <Select
                          id="currency"
                          name="currency"
                          options={CURRENCY_SELECT_OPTIONS}
                          defaultValue={tenant.currency}
                        />
                        <p className="text-xs text-muted-foreground">
                          Inventory prices, AI replies, and dashboard amounts
                          are formatted in this currency.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          id="timezone"
                          name="timezone"
                          options={TIMEZONE_OPTIONS}
                          defaultValue={tenant.timezone}
                        />
                        <p className="text-xs text-muted-foreground">
                          Used for &ldquo;today&rdquo; calculations and
                          scheduled alerts.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="submit">Save localization</Button>
                    </div>
                  </CardContent>
                </Card>
              </SettingsForm>
            )}

            {tab === "leads" && (
              <SettingsForm successMessage="Lead rules saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sliders className="h-4 w-4" /> Lead rules
                    </CardTitle>
                    <CardDescription>
                      How leads are qualified and when they&apos;re marked hot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hot_lead_threshold">
                          Hot lead threshold
                        </Label>
                        <span className="text-sm font-medium tabular-nums text-foreground">
                          {tenant.hot_lead_threshold}/100
                        </span>
                      </div>
                      <Input
                        id="hot_lead_threshold"
                        name="hot_lead_threshold"
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        defaultValue={tenant.hot_lead_threshold}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        AI scores each lead 0-100. Leads scoring at or above
                        this threshold are auto-marked as <strong>hot</strong>{" "}
                        and trigger notifications. Lower = more alerts, higher =
                        only the strongest leads.
                      </p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>50 (broad)</span>
                        <span>75 (recommended)</span>
                        <span>100 (very strict)</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="submit">Save lead rules</Button>
                    </div>
                  </CardContent>
                </Card>
              </SettingsForm>
            )}

            {tab === "notifications" && (
              <SettingsForm successMessage="Notifications saved">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Notifications
                    </CardTitle>
                    <CardDescription>
                      Get alerts via email + n8n workflow on key lead events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="notification_email">
                        Notification email
                      </Label>
                      <Input
                        id="notification_email"
                        name="notification_email"
                        type="email"
                        defaultValue={tenant.notification_email ?? ""}
                        placeholder="alerts@yourbusiness.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        Where alerts are sent. Falls back to your contact email
                        (Business profile tab) if empty.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-base font-medium">
                        Alert me on
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Only checked events trigger notifications. Other events
                        are still logged but stay quiet.
                      </p>
                    </div>

                    <NotifyToggle
                      name="notify_on_created"
                      label="New lead created"
                      desc="A brand-new customer messages your WhatsApp for the first time"
                      defaultChecked={tenant.notify_on_created}
                    />
                    <NotifyToggle
                      name="notify_on_hot"
                      label="Lead marked hot"
                      desc="A lead crosses the hot threshold (set in Lead rules)"
                      defaultChecked={tenant.notify_on_hot}
                    />
                    <NotifyToggle
                      name="notify_on_handoff"
                      label="Customer needs you"
                      desc="AI determined the customer wants a human (asks for owner, ready to pay, etc.)"
                      defaultChecked={tenant.notify_on_handoff}
                    />
                    <NotifyToggle
                      name="notify_on_won"
                      label="Lead closed (won)"
                      desc="A lead transitions to won status — celebration alert"
                      defaultChecked={tenant.notify_on_won}
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="submit">Save notifications</Button>
                    </div>
                  </CardContent>
                </Card>
              </SettingsForm>
            )}

            {tab === "danger" && (
              <Card className="border-destructive/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" /> Danger zone
                  </CardTitle>
                  <CardDescription>
                    Permanent actions. Cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/5 p-4">
                    <div>
                      <p className="font-medium">Delete account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your tenant and all associated data
                        (leads, conversations, inventory).
                      </p>
                    </div>
                    <Button variant="destructive" disabled>
                      Delete account
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Account deletion is not enabled in this build. Contact
                    support to delete your data.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NotifyToggle({
  name,
  label,
  desc,
  defaultChecked,
}: {
  name: string;
  label: string;
  desc: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-border bg-muted/20 p-4">
      <div className="space-y-1">
        <Label htmlFor={name} className="text-base font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch id={name} name={name} defaultChecked={defaultChecked} />
    </div>
  );
}
