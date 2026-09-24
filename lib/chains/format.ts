import type { Chain, Country, Currency } from "@/lib/schema/chain";

/** "2026-09-24" → "September 2026" (UTC so the build machine's timezone never shifts the month). */
export function monthYear(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

/** "2026-09-24" → "September 24, 2026" */
export function longDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function chainTitle(chain: Chain): string {
  return `Highest Protein Items at ${chain.chain} (${monthYear(chain.data_checked_date)})`;
}

export const CATEGORY_LABELS: Record<Chain["category"], string> = {
  burgers: "Burgers",
  chicken: "Chicken",
  mexican: "Mexican",
  sandwiches: "Sandwiches",
  coffee: "Coffee",
  bakery: "Bakery",
  healthy: "Healthy",
  asian: "Asian",
  pizza: "Pizza",
  smoothies: "Smoothies",
  indian: "Indian",
};

export const COUNTRY_LABELS: Record<Country, string> = { US: "US", UK: "UK", IN: "India" };

/**
 * How "protein per price" is shown for each currency. Rupee prices are much larger numbers,
 * so India uses protein per ₹100 instead of per ₹1.
 */
export const CURRENCY_DISPLAY: Record<Currency, { locale: string; per: number; perLabel: string; heading: string }> = {
  USD: { locale: "en-US", per: 1, perLabel: "$1", heading: "Protein per dollar" },
  GBP: { locale: "en-GB", per: 1, perLabel: "£1", heading: "Protein per pound" },
  INR: { locale: "en-IN", per: 100, perLabel: "₹100", heading: "Protein per ₹100" },
};

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(CURRENCY_DISPLAY[currency].locale, { style: "currency", currency, maximumFractionDigits: currency === "INR" ? 0 : 2 }).format(amount);
}
