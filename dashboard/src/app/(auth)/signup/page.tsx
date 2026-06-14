"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, type AuthState } from "@/app/actions/auth";

const industries = [
  { id: "real_estate", label: "Real Estate", icon: Building2 },
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "healthcare", label: "Healthcare", icon: Stethoscope },
];

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUp,
    undefined,
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Start your 14-day trial
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No credit card required. Cancel anytime.
      </p>

      <form action={action} className="mt-8 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business">Business name</Label>
          <Input
            id="business"
            name="business"
            placeholder="Prime Properties"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Industry</Label>
          <div className="grid grid-cols-3 gap-2">
            {industries.map((ind, i) => (
              <label
                key={ind.id}
                className="relative flex cursor-pointer flex-col items-center gap-2 rounded-md border border-border bg-background p-3 text-xs has-[input:checked]:border-primary has-[input:checked]:bg-accent has-[input:checked]:text-accent-foreground"
              >
                <input
                  type="radio"
                  name="industry"
                  value={ind.id}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                <ind.icon className="h-5 w-5" />
                <span className="font-medium">{ind.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@business.com"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Create password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
          {!pending && <ArrowRight className="h-4 w-4" />}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="#" className="underline">Terms</Link> and{" "}
          <Link href="#" className="underline">Privacy Policy</Link>.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
