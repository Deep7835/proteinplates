import Link from "next/link";
import { ChainFilters } from "@/components/chains/ChainFilters";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { toCardData } from "@/lib/chains/cards";
import { CATEGORY_LABELS } from "@/lib/chains/format";
import { getAllChains } from "@/lib/chains/load";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "High-Protein Orders at US, UK, and Indian Restaurant Chains",
  description:
    "Find the highest-protein menu items at popular US, UK, and Indian fast food and restaurant chains. Filter by country and food type. Every number is sourced.",
  path: "/chains",
});

export default function ChainsPage() {
  const chains = getAllChains();
  const used = new Set(chains.map((c) => c.category));
  const categories = Object.entries(CATEGORY_LABELS)
    .filter(([value]) => used.has(value as keyof typeof CATEGORY_LABELS))
    .map(([value, label]) => ({ value, label }));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Restaurant Chains", path: "/chains" },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl sm:text-4xl">High-protein orders at restaurant chains</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Pick a chain to see its highest-protein items, the best orders for your goal, and simple ways to add protein.
        Numbers come from each chain’s official nutrition info. If a chain doesn’t publish any, we say so on its page.
      </p>
      <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
        <Link href="/chains/top-protein-fast-food">Top 25 highest-protein items</Link>
        <Link href="/chains/glp1-friendly">Chains with GLP-1 or high-protein menus</Link>
      </p>
      <div className="mt-8">
        <ChainFilters chains={chains.map(toCardData)} categories={categories} />
      </div>
    </Container>
  );
}
