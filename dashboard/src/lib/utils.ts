import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

const CURRENCY_LOCALE: Record<string, string> = {
  PKR: "en-PK",
  INR: "en-IN",
  AED: "en-AE",
  SAR: "ar-SA",
  GBP: "en-GB",
  EUR: "en-IE",
  USD: "en-US",
};

/**
 * Format an integer amount in major units using the tenant's currency
 * (e.g. 1999 + USD → "$1,999", 1999 + PKR → "₨1,999").
 */
export function formatCurrency(amount: number, currency = "USD") {
  const locale = CURRENCY_LOCALE[currency] ?? "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Unknown ISO code — fall back to plain number with code suffix
    return `${amount.toLocaleString("en-US")} ${currency}`;
  }
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
