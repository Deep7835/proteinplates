import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorTemplate } from "@/components/calculators/CalculatorTemplate";
import { CALCULATORS } from "@/components/calculators/registry";
import { featuredChainLinks } from "@/lib/chains/load";
import { calculatorVariants, getCalculatorPage, mainCalculatorPages } from "@/lib/calculators/pages";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return mainCalculatorPages()
    .filter((p) => p.slug in CALCULATORS)
    .map((p) => ({ calculator: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[calculator]">): Promise<Metadata> {
  const page = getCalculatorPage((await params).calculator);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle ?? page.title, description: page.description, path: `/${page.slug}` });
}

export default async function CalculatorRoute({ params }: PageProps<"/[calculator]">) {
  const { calculator } = await params;
  const page = getCalculatorPage(calculator);
  if (!page || !(calculator in CALCULATORS)) notFound();
  return <CalculatorTemplate page={page} variants={calculatorVariants(calculator)} chainLinks={featuredChainLinks()} />;
}
