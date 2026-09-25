import Link from "next/link";
import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import { UMAMI_WEBSITE_ID } from "@/components/layout/SiteAnalytics";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles your information. Our calculators run in your browser, we don’t store the numbers you enter, and our analytics use no cookies.`,
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
        We don’t use tracking or advertising cookies. If you pick light or dark mode, your browser remembers that
        choice on your own device; it isn’t sent to us.
      </p>
      <h2>Analytics</h2>
      <p>
        We use Vercel Web Analytics to count visits and see which pages are popular. It doesn’t use cookies and
        doesn’t identify you. It records things like the page you viewed, the site that sent you, your country, and
        your device type. Visitors are counted with a short-lived code made from the request, which resets every day,
        so you can’t be tracked across days or other websites.
      </p>
      {UMAMI_WEBSITE_ID && (
        <p>
          We also use Umami, a cookie-free analytics service, to see which pages and campaigns (such as links tagged with
          “utm” codes) bring visitors. It doesn’t use cookies or collect personal information.
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
