import Link from "next/link";
import { ProsePage } from "@/components/layout/Prose";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: `About ${site.name}`,
  description: `${site.name} helps you hit your protein target at home and when you eat out, with free calculators and sourced restaurant nutrition guides.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage title={`About ${site.name}`} path="/about" updated={site.staticPagesUpdated}>
      <p>
        {site.name} has one goal: to help you <strong>hit your protein target, even when you eat out</strong>.
      </p>
      <p>
        Protein helps you feel full, keep muscle, and stay strong as you age. But most nutrition advice stops at the
        kitchen door. Real life includes drive-thrus, coffee runs, and lunch at the sandwich shop. We want to make
        those moments easy.
      </p>
      <h2>What we offer</h2>
      <ul>
        <li>
          <strong>Free calculators</strong> for <Link href="/protein-calculator">protein</Link>,{" "}
          <Link href="/tdee-calculator">calories (TDEE)</Link>, <Link href="/macro-calculator">macros</Link>, and{" "}
          <Link href="/bmi-calculator">BMI</Link>.
        </li>
        <li>
          <strong>Restaurant guides</strong> for popular <Link href="/chains">US, UK, and Indian chains</Link>, with
          the highest-protein orders and simple ways to add more.
        </li>
        <li>
          <strong>Plain-English guides</strong> for <Link href="/for/glp1">people on GLP-1 medicines</Link>,{" "}
          <Link href="/for/gym">gym-goers</Link>, and <Link href="/for/seniors">adults 50+</Link>.
        </li>
      </ul>
      <h2>How we work</h2>
      <p>
        We use each chain’s official nutrition information whenever it exists, and we never make up numbers. Read
        our <Link href="/editorial-policy">editorial policy</Link> to see exactly how we source and update our data.
      </p>
      <p>
        Our content is for education only. It is not medical advice. See our{" "}
        <Link href="/medical-disclaimer">medical disclaimer</Link>.
      </p>
      <h2>Get in touch</h2>
      <p>
        Found a mistake or have an idea? <Link href="/contact">Contact us</Link>. We read every message.
      </p>
    </ProsePage>
  );
}
