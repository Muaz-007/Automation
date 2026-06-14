import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

const tenantUserWithTenant = {
  include: { tenant: true },
} satisfies Prisma.TenantUserDefaultArgs;

export type TenantUserWithTenant = Prisma.TenantUserGetPayload<
  typeof tenantUserWithTenant
>;

export const getCurrentTenantUser = cache(
  async (): Promise<TenantUserWithTenant | null> => {
    const user = await getCurrentUser();
    if (!user) return null;
    return prisma.tenantUser.findUnique({
      where: { auth_user_id: user.id },
      ...tenantUserWithTenant,
    });
  },
);

export async function ensureTenantForUser(
  userId: string,
  email: string,
  meta: {
    business_name?: string;
    industry?: "real_estate" | "ecommerce" | "healthcare";
    full_name?: string;
  } = {},
): Promise<TenantUserWithTenant> {
  const existing = await prisma.tenantUser.findUnique({
    where: { auth_user_id: userId },
    ...tenantUserWithTenant,
  });
  if (existing) return existing;

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        business_name: meta.business_name ?? "My Business",
        industry: meta.industry ?? "real_estate",
        ai_persona_name: "Assistant",
      },
    });
    return tx.tenantUser.create({
      data: {
        tenant_id: tenant.id,
        auth_user_id: userId,
        email,
        full_name: meta.full_name ?? null,
        role: "owner",
      },
      ...tenantUserWithTenant,
    });
  });
}

export const requireTenant = cache(async (): Promise<TenantUserWithTenant> => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const meta = (user.user_metadata ?? {}) as {
    business_name?: string;
    industry?: "real_estate" | "ecommerce" | "healthcare";
    full_name?: string;
  };

  return ensureTenantForUser(user.id, user.email ?? "", meta);
});
