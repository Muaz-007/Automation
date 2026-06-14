import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNavProvider } from "@/components/dashboard/mobile-nav";
import { requireTenant } from "@/lib/dal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tu = await requireTenant();

  return (
    <MobileNavProvider>
      <div className="flex min-h-dvh">
        <Sidebar
          email={tu.email}
          businessName={tu.tenant.business_name}
          fullName={tu.full_name ?? tu.email.split("@")[0]}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </MobileNavProvider>
  );
}
