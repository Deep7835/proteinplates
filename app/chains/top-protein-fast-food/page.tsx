import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { COUNTRY_LABELS, longDate, monthYear } from "@/lib/chains/format";
import { getAllChains } from "@/lib/chains/load";
import { latestCheckDate, proteinPer100Cal, topProteinAcrossChains } from "@/lib/chains/rank";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const LIMIT = 25;
const PATH = "/chains/top-protein-fast-food";

function pageTitle() {
  const latest = latestCheckDate(getAllChains());
  return `Top ${LIMIT} Highest Protein Fast Food Items${latest ? ` (${monthYear(latest)})` : ""}`;
}

export function generateMetadata() {
  return buildMetadata({
    title: pageTitle(),
    description: `The ${LIMIT} highest-protein menu items across popular US, UK, and Indian fast food chains, ranked from each chain's published nutrition data. See protein, calories, and protein per calorie.`,
    path: PATH,
  });
}

export default function TopProteinPage() {
  const chains = getAllChains();
  const items = topProteinAcrossChains(chains, LIMIT);
  const latest = latestCheckDate(chains);
  const title = pageTitle();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Restaurant Chains", path: "/chains" },
    { name: `Top ${LIMIT} protein items`, path: PATH },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          ...(latest
            ? [articleLd({ headline: title, description: `The ${LIMIT} highest-protein fast food items.`, path: PATH, datePublished: latest, dateModified: latest })]
            : []),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        These are the menu items with the most protein across every chain we track. We only rank items where the
        chain lists both protein and calories.
      </p>

      {items.length > 0 ? (
        <div className="mt-8 overflow-x-auto rounded-card border border-line">
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">Top {LIMIT} highest-protein items across restaurant chains</caption>
            <thead className="bg-surface text-left">
              <tr>
                <th scope="col" className="px-3 py-2">#</th>
                <th scope="col" className="px-3 py-2">Item</th>
                <th scope="col" className="px-3 py-2">Chain</th>
                <th scope="col" className="px-3 py-2 text-right">Protein (g)</th>
                <th scope="col" className="px-3 py-2 text-right">Calories</th>
                <th scope="col" className="px-3 py-2 text-right">Protein per 100 cal</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {items.map((i, n) => (
                <tr key={`${i.chain.slug}-${i.name}`} className="border-t border-line">
                  <td className="px-3 py-2 text-muted">{n + 1}</td>
                  <th scope="row" className="px-3 py-2 text-left font-medium">{i.name}</th>
                  <td className="px-3 py-2">
                    <Link href={`/chains/${i.chain.slug}`}>{i.chain.chain}</Link>{" "}
                    {i.chain.country.map((c) => (
                      <Badge key={c}>{COUNTRY_LABELS[c]}</Badge>
                    ))}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">{i.protein_g}</td>
                  <td className="px-3 py-2 text-right">{i.calories}</td>
                  <td className="px-3 py-2 text-right">{proteinPer100Cal(i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-8 text-muted">We’re adding chains now. Check back soon.</p>
      )}

      {latest && (
        <p className="mt-4 text-sm text-muted">
          From each chain’s published nutrition info (official wherever it exists). Most recent check:{" "}
          {longDate(latest)}. See each chain page for its exact source and check date.
        </p>
      )}

      <div className="mt-10 flex flex-col items-start gap-3 rounded-card bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-brand-900">Big numbers aren’t right for everyone. Find your own daily target.</p>
        <LinkButton href="/protein-calculator">Protein calculator</LinkButton>
      </div>
      <div className="mt-10 max-w-3xl">
        <Disclaimer />
      </div>
    </Container>
  );
}
