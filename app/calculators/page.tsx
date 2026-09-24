import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { CALCULATORS } from "@/components/calculators/registry";
import { getCalculatorPages, mainCalculatorPages } from "@/lib/calculators/pages";
import { CALCULATOR_CATEGORIES } from "@/lib/schema/calculatorPage";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Free Nutrition & Health Calculators",
  description:
    "Free protein, calorie, TDEE, macro, BMR, BMI, body fat, water, fiber, keto, and more calculators. Simple, sourced, and easy to use in lb, stone, or kg.",
  path: "/calculators",
});

export default function CalculatorsHubPage() {
  const pages = mainCalculatorPages().filter((p) => p.slug in CALCULATORS);
  const variants = getCalculatorPages().filter((p) => p.variant !== null);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl sm:text-4xl">Free nutrition and health calculators</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Simple tools for protein, calories, body measurements, and nutrients. Every formula is sourced, and every result
        works in pounds, stone, or kilograms.
      </p>

      {CALCULATOR_CATEGORIES.map((cat) => {
        const inCat = pages.filter((p) => p.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section key={cat} aria-labelledby={`cat-${cat}`} className="mt-10">
            <h2 id={`cat-${cat}`} className="text-2xl">{cat}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inCat.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="flex h-full flex-col rounded-card border border-line p-5 text-ink no-underline shadow-card hover:border-brand-600"
                  >
                    <span className="font-bold">{p.name}</span>
                    <span className="mt-2 text-sm text-muted">{p.intro}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {variants.length > 0 && (
        <section aria-labelledby="popular" className="mt-12">
          <h2 id="popular" className="text-2xl">Popular calculator searches</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {variants.map((v) => (
              <li key={`${v.slug}/${v.variant}`}>
                <Link href={`/${v.slug}/${v.variant}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-sm no-underline hover:border-brand-600">
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Container>
  );
}
