import Link from "next/link";
import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} handles your information. Our calculators run in your browser and we don’t store the numbers you enter.`,
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
      <h2>Cookies, analytics, and ads</h2>
      <p>
        We don’t currently use analytics, advertising, or tracking cookies. If we add them in the future, we will
        update this page first and ask for your consent where the law requires it.
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
