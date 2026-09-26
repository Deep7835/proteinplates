import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { BackToTop } from "@/components/layout/BackToTop";
import { Footer } from "@/components/layout/Footer";
import Script from "next/script";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { SiteAnalytics } from "@/components/layout/SiteAnalytics";
import { gaBootScript } from "@/lib/analytics/consent";
import { site } from "@/lib/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Only weight 600 is used (headings, logo, hero stats), so load that one weight instead of the full variable font.
const fraunces = Fraunces({ subsets: ["latin"], weight: "600", variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  verification: { google: site.googleSiteVerification },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#115c48" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1513" },
  ],
};

// Runs before paint: saved choice, else device setting. Prevents a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${inter.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {site.googleAnalyticsId && <script dangerouslySetInnerHTML={{ __html: gaBootScript(site.googleAnalyticsId) }} />}
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <SiteAnalytics />
        {site.googleAnalyticsId && (
          <>
            {/* Loaded after the page is idle so it doesn't slow the first view. Consent defaults are set in <head>. */}
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.googleAnalyticsId}`} strategy="lazyOnload" />
            <CookieConsent />
          </>
        )}
      </body>
    </html>
  );
}
