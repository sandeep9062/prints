import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/* Currency                                                                   */
/* -------------------------------------------------------------------------- */
/**
 * Every price in this store is quoted in Indian Rupees, so money is formatted
 * through one helper instead of ad-hoc `₹${n.toLocaleString()}` / USD blocks.
 * `en-IN` gives the lakh/crore grouping Indians expect (₹12,34,567).
 */
export const CURRENCY_CODE = "INR";

const inrWhole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrWithPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format an amount as INR.
 * @param amount  Number to format. Non-finite/missing values collapse to ₹0.
 * @param decimals Pass true to keep 2 decimal places (dashboards/totals).
 */
export function formatINR(
  amount: number | null | undefined,
  options?: { decimals?: boolean },
): string {
  const value = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return options?.decimals ? inrWithPaise.format(value) : inrWhole.format(value);
}
