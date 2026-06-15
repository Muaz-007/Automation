import {
  Flame,
  LayoutDashboard,
  MessagesSquare,
  MessageCircle,
  Settings,
  Users,
  Database,
  UserPlus,
  TrendingUp,
} from "lucide-react";

/**
 * Static, decorative mockup of the dashboard for the landing page.
 * Pure presentation — no real data, no client state.
 */
export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      {/* glow */}
      <div
        aria-hidden
        className="absolute -inset-x-20 -top-10 -bottom-10 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.18),_transparent_60%)] blur-2xl"
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <div className="ml-4 hidden text-xs text-muted-foreground sm:block">
            app.whatsappautomate.com/dashboard
          </div>
        </div>

        <div className="grid grid-cols-12">
          {/* Sidebar */}
          <aside className="col-span-3 hidden border-r border-border bg-card p-3 md:block">
            <div className="mb-4 flex items-center gap-2 px-2 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold">WhatsappAutomate</div>
                <div className="text-muted-foreground">Prime Properties</div>
              </div>
            </div>
            <nav className="space-y-1 text-xs">
              {[
                { icon: LayoutDashboard, label: "Overview", active: true },
                { icon: Users, label: "Leads" },
                { icon: MessagesSquare, label: "Conversations" },
                { icon: Database, label: "Inventory" },
                { icon: Settings, label: "Settings" },
              ].map((i, k) => (
                <div
                  key={k}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 ${
                    i.active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <i.icon
                    className={`h-3.5 w-3.5 ${i.active ? "text-primary" : ""}`}
                  />
                  {i.label}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="col-span-12 p-5 md:col-span-9">
            {/* Heading */}
            <div className="mb-5">
              <div className="text-sm font-semibold">Welcome back, Prime Properties</div>
              <div className="text-xs text-muted-foreground">Today&apos;s snapshot of your business</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total Leads", value: "247", icon: Users, accent: "text-primary" },
                { label: "New Today", value: "12", icon: UserPlus, accent: "text-blue-500" },
                { label: "Hot Leads", value: "8", icon: Flame, accent: "text-red-500" },
                { label: "Conversations", value: "89", icon: MessagesSquare, accent: "text-emerald-500" },
              ].map((s, k) => (
                <div key={k} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    <s.icon className={`h-3.5 w-3.5 ${s.accent}`} />
                  </div>
                  <div className="mt-1 text-xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Recent activity + sidebar widgets */}
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card lg:col-span-2">
                <div className="border-b border-border px-3 py-2 text-xs font-semibold">
                  Recent activity
                </div>
                <div className="divide-y divide-border">
                  {[
                    { name: "Ahmed Khan", city: "Karachi · Facebook Ad", badge: "Hot", badgeColor: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", time: "8m" },
                    { name: "Fatima Ali", city: "Lahore · Direct", badge: "Warm", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", time: "1h" },
                    { name: "Bilal Hussain", city: "Islamabad · OLX", badge: "Qualifying", badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", time: "3h" },
                    { name: "Sana Malik", city: "Karachi · Instagram", badge: "New", badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", time: "15m" },
                  ].map((row, k) => (
                    <div key={k} className="flex items-center gap-3 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                        {row.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="truncate font-medium">{row.name}</span>
                          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${row.badgeColor}`}>
                            {row.badge}
                          </span>
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground">{row.city}</div>
                      </div>
                      <div className="text-[10px] text-muted-foreground">{row.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Conversion
                  </div>
                  <div className="text-xl font-bold">14%</div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-full w-[28%] rounded-full bg-primary" />
                  </div>
                </div>
                <div className="rounded-lg border border-primary/30 bg-accent/40 p-3">
                  <div className="mb-2 text-xs font-semibold">AI Status</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">WhatsApp</span>
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Connected
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Persona</span>
                      <span className="font-medium">Sara</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-medium">Real Estate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
