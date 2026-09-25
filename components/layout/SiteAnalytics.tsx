import Script from "next/script";

/**
 * Privacy-friendly, cookie-free analytics (so no cookie banner is needed). Both are off until you set their env var:
 * - Cloudflare Web Analytics: NEXT_PUBLIC_CF_BEACON_TOKEN (Cloudflare dashboard → Analytics & Logs → Web Analytics).
 *   Free: page views, referrers, countries, devices, Core Web Vitals. If your domain is on Cloudflare you can instead
 *   turn on "automatic setup" there and leave this unset.
 * - Umami Cloud: NEXT_PUBLIC_UMAMI_WEBSITE_ID. Its free plan adds UTM/campaign reports.
 */
export const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

export function SiteAnalytics() {
  return (
    <>
      {CF_BEACON_TOKEN && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          strategy="afterInteractive"
        />
      )}
      {UMAMI_WEBSITE_ID && <Script src={UMAMI_SCRIPT_URL} data-website-id={UMAMI_WEBSITE_ID} strategy="afterInteractive" />}
    </>
  );
}
