import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `Get in touch with ${site.name}. Report a nutrition data mistake, suggest a restaurant chain, or ask a question.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ProsePage title="Contact us" path="/contact">
      <p>We’d love to hear from you. Email us at:</p>
      <p>
        <a href={`mailto:${site.contactEmail}`} className="text-lg font-semibold">
          {site.contactEmail}
        </a>
      </p>
      <h2>Helpful things to include</h2>
      <ul>
        <li>
          <strong>Found a data mistake?</strong> Tell us the chain, the item, and the number that looks wrong. A link
          to the chain’s nutrition page helps a lot.
        </li>
        <li>
          <strong>Want a new chain?</strong> Tell us the chain name and the country.
        </li>
      </ul>
      <p>We can’t give personal medical or diet advice. Please ask your doctor or a registered dietitian.</p>
    </ProsePage>
  );
}
