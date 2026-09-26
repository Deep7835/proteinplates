import Link from "next/link";
import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { CF_BEACON_TOKEN, UMAMI_WEBSITE_ID } from "@/components/layout/SiteAnalytics";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles your information. Our calculators run in your browser, we don’t store the numbers you enter, and analytics cookies are used only if you accept them.`,
  path: "/privacy",
});

// Template: have this reviewed before you add analytics, ads, accounts, or payments.
export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy policy" path="/privacy" updated={site.staticPagesUpdated}>
      <p>We keep this simple: we collect as little as possible.</p>
      <h2>Our calculators</h2>
      <p>
        Our calculators run in your web browser. The numbers you type, like your age, weight, and height, are not
        sent to us or stored by us. If you use “Copy link to these results,” your numbers are placed in the link
        itself, so anyone you share the link with can see them.
      </p>
      <h2>Accounts and forms</h2>
      <p>We don’t offer accounts right now, and our meal plan page doesn’t collect any information yet.</p>
      <h2>Cookies</h2>
      <p>
        We use cookies only for Google Analytics, and only if you choose <strong>Accept</strong> in our cookie banner.
        These cookies are named <code>_ga</code> and <code>_ga_…</code> and last up to 2 years. If you choose{" "}
        <strong>Reject</strong>, Google Analytics runs without cookies and sends only limited, cookie-free signals that
        help us estimate how many people visit. You can change your choice at any time with <strong>Cookie settings</strong>{" "}
        at the bottom of every page.
      </p>
      <p>
        Your light or dark mode choice and your cookie choice are saved in your own browser (not as cookies) and aren’t
        sent to us.
      </p>
      <h2>Analytics</h2>
      <p>
        We use Google Analytics 4, a service from Google, to see which pages help people most. It records things like
        the pages you view, how you arrived (for example from a search, another site, or a link with campaign “utm”
        tags), your approximate location (country and city), and your device and browser. It doesn’t tell us who you
        are, and Google says Google Analytics 4 doesn’t log or store IP addresses. Google processes this data under its
        own policies; see{" "}
        <a href="https://policies.google.com/technologies/partner-sites" rel="noopener nofollow">
          how Google uses information from sites that use its services
        </a>
        .
      </p>
      {CF_BEACON_TOKEN && (
        <p>
          We also use Cloudflare Web Analytics, which doesn’t use cookies, to count visits and see how fast pages load.
        </p>
      )}
      {UMAMI_WEBSITE_ID && (
        <p>
          We also use Umami, a cookie-free analytics service, to see which pages and campaigns bring visitors. It doesn’t
          use cookies or collect personal information.
        </p>
      )}
      <h2>Ads</h2>
      <p>
        We don’t show ads right now. If we add them, or anything else that uses cookies, we will update this page first
        and ask for your consent where the law requires it.
      </p>
      <h2>Hosting</h2>
      <p>
        Our website host may keep standard server logs, such as IP addresses and the pages requested, to keep the site
        secure and working.
      </p>
      <h2>Links to other sites</h2>
      <p>We link to restaurant websites and research sources. Their privacy policies apply when you visit them.</p>
      <h2>Contact</h2>
      <p>
        Questions about privacy? <Link href="/contact">Contact us</Link>.
      </p>
    </ProsePage>
  );
}
