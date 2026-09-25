import Link from "next/link";
import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: `The terms for using ${site.name}: our calculators and nutrition data are for education only, not medical advice, and restaurant names belong to their owners.`,
  path: "/terms",
});

// Template: have a lawyer review this before launch, and again before adding accounts, payments, or ads.
export default function TermsPage() {
  return (
    <ProsePage title="Terms of use" path="/terms" updated={site.staticPagesUpdated}>
      <p>
        By using {site.name} (“we”, “us”), you agree to these terms. If you don’t agree, please don’t use the site.
      </p>

      <h2>Education only, not medical advice</h2>
      <p>
        Everything on this site, including our calculators, guides, and restaurant picks, is general information for
        education. It is not medical, nutrition, or fitness advice for you, and it doesn’t replace a doctor or a
        registered dietitian. Talk to one before you change your diet, especially if you are pregnant, under 18, have a
        health condition such as kidney disease or diabetes, or take medicine. Read our full{" "}
        <Link href="/medical-disclaimer">medical disclaimer</Link>.
      </p>

      <h2>Nutrition data</h2>
      <p>
        We take restaurant nutrition numbers from each chain’s own published information where we can. When a chain
        doesn’t publish a number, we either leave it blank or, for some items, use a third-party source, which we label
        on the page. Chains change recipes, portions, and menus, and they differ by country and region, so the numbers
        may not match what you’re served. We show the date we last checked each source. See{" "}
        <Link href="/editorial-policy">how we check our data</Link>.
      </p>

      <h2>Calculators are estimates</h2>
      <p>
        Our calculators use published formulas and the numbers you enter. The results are estimates for an average
        person and can be wrong for you. Some results, like calories for a different number of pieces or minutes to burn
        off a meal, are worked out from other numbers, and we say so on the page.
      </p>

      <h2>Restaurant names and trademarks</h2>
      <p>
        Restaurant names, menu item names, and brands on this site belong to their owners. We use them only to describe
        what’s on their menus. {site.name} is independent and is not affiliated with, sponsored by, or endorsed by any
        restaurant we write about.
      </p>

      <h2>Photos</h2>
      <p>
        Photos on our guides are free photos from Unsplash, used under the Unsplash License and credited to each
        photographer on the page. Photos are for illustration and may not show the exact menu item.
      </p>

      <h2>Links and affiliate links</h2>
      <p>
        We link to restaurant websites, research, and other sites we don’t control. Their terms and privacy policies
        apply when you visit them. Some links in the future may be affiliate links, which means we may earn a
        commission. We label those links clearly, and they don’t change our rankings or advice.
      </p>

      <h2>Using our content</h2>
      <p>
        You’re welcome to link to any page and to share your calculator results. Please don’t copy large parts of the
        site, republish our data tables, or scrape the site without written permission.
      </p>

      <h2>No guarantees</h2>
      <p>
        We work hard to keep the site accurate and available, but we provide it “as is”, without warranties of any
        kind. To the extent the law allows, we aren’t responsible for any loss or harm that comes from using the site or
        relying on its information. Nothing in these terms limits rights you have under the law where you live.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. When we do, we’ll change the “Last updated” date above. Using the site after a change
        means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <Link href="/contact">Contact us</Link>. See also our{" "}
        <Link href="/privacy">privacy policy</Link>.
      </p>
    </ProsePage>
  );
}
