import { CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { CopyButton } from "@/components/dashboard/copy-button";
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
import { requireTenant } from "@/lib/dal";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const tu = await requireTenant();
  const tenant = tu.tenant;
  const isConnected = !!tenant.phone_number_id && !!tenant.whatsapp_token;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/webhook/whatsapp/${tenant.id}`;
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN ?? "(set META_WEBHOOK_VERIFY_TOKEN in .env)";

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your AI assistant, WhatsApp connection, and business profile
          </p>
        </div>

        {/* WhatsApp connection */}
        <SettingsForm successMessage="WhatsApp credentials saved">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> WhatsApp Business API
                  </CardTitle>
                  <CardDescription>
                    Paste credentials from Meta Developer Console → your app → WhatsApp → API Setup
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
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                  Use a permanent system-user token. Temporary tokens expire in 24 hours.
                </p>
              </div>

              <div className="rounded-md border border-border bg-muted/40 p-3 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Meta webhook configuration
                </p>
                <div className="space-y-2">
                  <Label>Callback URL</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={webhookUrl} className="font-mono text-xs" />
                    <CopyButton text={webhookUrl} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Verify token</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={verifyToken} className="font-mono text-xs" />
                    <CopyButton text={verifyToken} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste both into Meta Developer Console → WhatsApp → Configuration → Webhook. Subscribe to the
                  <code className="mx-1 rounded bg-muted px-1.5 py-0.5">messages</code> field.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="submit">
                  {isConnected ? "Update credentials" : "Connect WhatsApp"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </SettingsForm>

        {/* AI persona */}
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
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ai_persona_name">Persona name</Label>
                  <Input
                    id="ai_persona_name"
                    name="ai_persona_name"
                    defaultValue={tenant.ai_persona_name ?? ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    Customers will see this name (e.g. &ldquo;Sara from Prime
                    Properties&rdquo;).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ai_tone">Tone</Label>
                  <select
                    id="ai_tone"
                    name="ai_tone"
                    defaultValue={tenant.ai_tone}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="formal">Formal</option>
                    <option value="friendly">Friendly</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Languages</Label>
                <select
                  id="language"
                  name="language"
                  defaultValue={tenant.language}
                  className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="english">English only</option>
                  <option value="urdu">Urdu only</option>
                  <option value="roman_urdu">Roman Urdu only</option>
                  <option value="mixed">Mixed (auto-detect)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system_prompt">
                  Custom system prompt (optional)
                </Label>
                <Textarea
                  id="system_prompt"
                  name="system_prompt"
                  defaultValue={tenant.system_prompt ?? ""}
                  placeholder="Leave empty to use the default industry template…"
                  className="font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Override the default industry prompt. Use this for advanced
                  customization only.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="submit">Save AI settings</Button>
              </div>
            </CardContent>
          </Card>
        </SettingsForm>

        {/* Business profile */}
        <SettingsForm successMessage="Business profile saved">
          <Card>
            <CardHeader>
              <CardTitle>Business profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <select
                    id="industry"
                    name="industry"
                    defaultValue={tenant.industry}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="real_estate">Real Estate</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="healthcare">Healthcare</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">Save profile</Button>
              </div>
            </CardContent>
          </Card>
        </SettingsForm>

        {/* Danger zone */}
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Danger zone</CardTitle>
            <CardDescription>
              Permanent actions. Cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete account</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
