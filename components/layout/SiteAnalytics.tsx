import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

/**
 * Privacy-friendly, cookie-free analytics (no cookie banner needed):
 * - Vercel Web Analytics: always on. Enable it in the Vercel dashboard (Project → Analytics). Free plan: page views,
 *   referrers, countries, devices. UTM reports need Vercel's paid Web Analytics Plus.
 * - Umami Cloud (optional): set NEXT_PUBLIC_UMAMI_WEBSITE_ID to turn it on. Its free plan includes UTM/campaign reports.
 */
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

export function SiteAnalytics() {
  return (
    <>
      {/* Vercel serves its analytics script only on Vercel deployments (where VERCEL=1 at build time). */}
      {process.env.VERCEL && <Analytics />}
      {UMAMI_WEBSITE_ID && <Script src={UMAMI_SCRIPT_URL} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />}
    </>
  );
}
