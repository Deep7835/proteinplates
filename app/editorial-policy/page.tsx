import Link from "next/link";
import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Editorial Policy: How We Source and Update Nutrition Data",
  description: `How ${site.name} gets restaurant nutrition data, checks it, handles missing numbers, and keeps it up to date.`,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <ProsePage title="Editorial policy" path="/editorial-policy" updated={site.staticPagesUpdated}>
      <p>We want you to trust every number on this site. Here is how we get our data and keep it accurate.</p>

      <h2>Where our restaurant data comes from</h2>
      <ol>
        <li>
          <strong>Official sources first.</strong> We use each chain’s own nutrition page, nutrition PDF, or
          official app. Every chain page links to the exact source we used and shows the date we checked it.
        </li>
        <li>
          <strong>Third-party sources only as a last resort.</strong> A few chains don’t publish nutrition
          information at all. For those, we may use another site that lists the chain’s numbers. When we do, the
          chain page says so clearly in a highlighted note and names the source.
        </li>
      </ol>

      <h2>We never make up numbers</h2>
      <ul>
        <li>We never guess or estimate nutrition values.</li>
        <li>If a chain doesn’t list a number, like fiber or sugar, we leave it blank (shown as “—”).</li>
        <li>
          Items without both protein and calories are <strong>never ranked</strong> in our top picks or lists.
        </li>
        <li>If two official sources disagree, we use the chain’s main nutrition source and note the conflict for review.</li>
      </ul>

      <h2>The only conversions we make</h2>
      <ul>
        <li>
          <strong>Salt to sodium:</strong> UK chains list salt, not sodium. We show sodium as salt ÷ 2.5, which is the
          rule UK and EU food labels use.
        </li>
        <li>
          <strong>Per 100 g to per portion:</strong> if a chain only lists values per 100 g but also gives the
          portion weight, we multiply to get the value per portion.
        </li>
      </ul>

      <h2>How we pick the “best” orders</h2>
      <p>
        Our picks follow simple, fixed rules, like “at least 20 g protein and 450 calories or less.” The same rules
        apply to every chain. We don’t take payment to rank any item.
      </p>

      <h2>How we check and update data</h2>
      <ul>
        <li>Every data file is checked by an automatic test before the site is published. A file with an error can’t go live.</li>
        <li>We re-check each chain at least every 60 days, and sooner when a chain changes its menu.</li>
        <li>Every chain page shows the date we last checked its data.</li>
      </ul>

      <h2>Health content</h2>
      <p>
        Our guides cite research and official guidelines, listed at the end of each guide. We write in plain
        language and avoid hype. Our content is for education only. See our{" "}
        <Link href="/medical-disclaimer">medical disclaimer</Link>.
      </p>

      <h2>Spot a mistake?</h2>
      <p>
        Menus change fast. If you see a number that looks wrong, please <Link href="/contact">tell us</Link>. We fix
        errors as soon as we can.
      </p>
    </ProsePage>
  );
}
