import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ItemStats } from "@/components/chains/ItemLine";
import { COUNTRY_LABELS } from "@/lib/chains/format";
import { getAllChains } from "@/lib/chains/load";
import { summaryPicks } from "@/lib/chains/rank";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

const PATH = "/chains/glp1-friendly";

export const metadata = buildMetadata({
  title: "Restaurant Chains With GLP-1 and High-Protein Menus",
  description:
    "US, UK, and Indian restaurant chains with labeled GLP-1-friendly or high-protein menus, plus the best small, high-protein pick at each one.",
  path: PATH,
});

export default function Glp1FriendlyPage() {
  const chains = getAllChains().filter((c) => c.glp1_menu_name);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Restaurant Chains", path: "/chains" },
    { name: "GLP-1-friendly menus", path: PATH },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl sm:text-4xl">Chains with GLP-1 and high-protein menus</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        More chains now label menus for people on GLP-1 medications or who want more protein. These menus often mean
        smaller portions with more protein. Here is every chain we track that has one.
      </p>

      {chains.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {chains.map((c) => {
            const pick = summaryPicks(c).bestGlp1;
            return (
              <li key={c.slug} className="rounded-card border border-line p-5 shadow-card">
                <h2 className="text-xl">
                  <Link href={`/chains/${c.slug}`} className="text-ink">{c.chain}</Link>
                </h2>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="accent">{c.glp1_menu_name}</Badge>
                  {c.country.map((x) => (
                    <Badge key={x}>{COUNTRY_LABELS[x]}</Badge>
                  ))}
                </p>
                {pick && (
                  <p className="mt-3 text-sm">
                    Our GLP-1-friendly pick: <span className="font-medium">{pick.name}</span>
                    <br />
                    <ItemStats item={pick} />
                  </p>
                )}
                <p className="mt-3 text-sm">
                  <Link href={`/chains/${c.slug}`}>See all {c.chain} picks</Link>
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 text-muted">We’re adding chains now. Check back soon.</p>
      )}

      <div className="mt-10 flex flex-col items-start gap-3 rounded-card bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-brand-900">On a GLP-1 medication? See how much protein to aim for each day.</p>
        <LinkButton href="/protein-calculator?goal=glp1">Protein calculator</LinkButton>
      </div>
      <div className="mt-10 max-w-3xl">
        <Disclaimer />
      </div>
    </Container>
  );
}
