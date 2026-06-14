"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureTenantForUser } from "@/lib/dal";

export type AuthState = { error?: string } | undefined;

type Industry = "real_estate" | "ecommerce" | "healthcare";

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const businessName = String(formData.get("business") ?? "").trim();
  const industry = String(formData.get("industry") ?? "real_estate") as Industry;

  if (!email || !password || !businessName) {
    return { error: "Please fill in all fields." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { business_name: businessName, industry },
    },
  });

  if (error) return { error: error.message };
  if (!data.user) {
    return { error: "Sign-up did not return a user — try again." };
  }

  try {
    await ensureTenantForUser(data.user.id, email, {
      business_name: businessName,
      industry,
    });
  } catch (e) {
    console.error("Tenant bootstrap failed:", e);
    return { error: "Account created but tenant setup failed. Please contact support." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
