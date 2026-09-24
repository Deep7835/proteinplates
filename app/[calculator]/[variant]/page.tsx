import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorTemplate } from "@/components/calculators/CalculatorTemplate";
import { CALCULATORS } from "@/components/calculators/registry";
import { featuredChainLinks } from "@/lib/chains/load";
import { calculatorVariants, getCalculatorPage, getCalculatorPages } from "@/lib/calculators/pages";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCalculatorPages()
    .filter((p) => p.variant !== null && p.slug in CALCULATORS)
    .map((p) => ({ calculator: p.slug, variant: p.variant as string }));
}

export async function generateMetadata({ params }: PageProps<"/[calculator]/[variant]">): Promise<Metadata> {
  const { calculator, variant } = await params;
  const page = getCalculatorPage(calculator, variant);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle ?? page.title, description: page.description, path: `/${calculator}/${variant}` });
}

export default async function CalculatorVariantRoute({ params }: PageProps<"/[calculator]/[variant]">) {
  const { calculator, variant } = await params;
  const page = getCalculatorPage(calculator, variant);
  if (!page || !(calculator in CALCULATORS)) notFound();
  return <CalculatorTemplate page={page} variants={calculatorVariants(calculator)} chainLinks={featuredChainLinks()} />;
}
