import Link from "next/link";
import { Activity, Apple, ArrowRight, Beef, Flame, Ruler, type LucideIcon } from "lucide-react";
import { cardLinkClass } from "@/components/ui/Card";
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

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Protein & macros": Beef,
  "Calories & energy": Flame,
  "Body measurements": Ruler,
  Nutrients: Apple,
  Activity: Activity,
};

function CategoryIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? Apple;
  return (
    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
      <Icon aria-hidden className="size-5" />
    </span>
  );
}

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
      <h1 className="mt-4 text-4xl sm:text-5xl">Free nutrition and health calculators</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Simple tools for protein, calories, body measurements, and nutrients. Every formula is sourced, and every result
        works in pounds, stone, or kilograms.
      </p>

      {CALCULATOR_CATEGORIES.map((cat) => {
        const inCat = pages.filter((p) => p.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section key={cat} aria-labelledby={`cat-${cat}`} className="mt-10">
            <h2 id={`cat-${cat}`} className="flex items-center gap-3 text-2xl sm:text-3xl">
              <CategoryIcon category={cat} />
              {cat}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inCat.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className={`${cardLinkClass} p-5`}>
                    <span className="flex items-center justify-between gap-2 font-bold group-hover:text-brand-700">
                      {p.name}
                      <ArrowRight aria-hidden className="size-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-700 motion-reduce:transition-none" />
                    </span>
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
                <Link href={`/${v.slug}/${v.variant}`} className="inline-flex min-h-11 items-center rounded-full border border-line bg-page px-4 text-sm text-ink no-underline transition-colors duration-200 hover:border-brand-600 hover:text-brand-700">
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
