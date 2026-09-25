import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuildAMeal } from "@/components/chains/BuildAMeal";
import { ChainCard } from "@/components/chains/ChainCard";
import { ChainTable, type TableRow } from "@/components/chains/ChainTable";
import { itemHref } from "@/lib/chains/items";
import { GoalPicks } from "@/components/chains/GoalPicks";
import { ProteinPerPrice } from "@/components/chains/ProteinPerPrice";
import { SummaryCards } from "@/components/chains/SummaryCards";
import { AdSlot } from "@/components/monetization/AdSlot";
import { PlanCTA } from "@/components/monetization/PlanCTA";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { FaqList } from "@/components/ui/FaqList";
import { toCardData } from "@/lib/chains/cards";
import { chainFaqs } from "@/lib/chains/faq";
import { CATEGORY_LABELS, COUNTRY_LABELS, CURRENCY_DISPLAY, chainTitle, longDate, monthYear } from "@/lib/chains/format";
import { getAllChains, getChain } from "@/lib/chains/load";
import { goalPicks, isRankable, mealBuilderItems, proteinPer100Cal, proteinPerPrice, relatedChains, summaryPicks } from "@/lib/chains/rank";
import { MEAL_BUILDER } from "@/lib/config/goals";
import { articleLd, breadcrumbLd, faqLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllChains().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chains/[slug]">): Promise<Metadata> {
  const chain = getChain((await params).slug);
  if (!chain) return {};
  const top = summaryPicks(chain).bestOverall;
  const count = chain.items.length;
  const description = top
    ? `The top protein pick at ${chain.chain} is ${top.name} with ${top.protein_g} g protein and ${top.calories} calories. Compare ${count} items by protein per calorie. Updated ${monthYear(chain.data_checked_date)}.`
    : `Compare ${count} ${chain.chain} menu items by protein, calories, and fiber. Updated ${monthYear(chain.data_checked_date)}.`;
  return buildMetadata({
    title: chainTitle(chain),
    description,
    path: `/chains/${chain.slug}`,
    type: "article",
    image: `/chains/${chain.slug}/opengraph-image`,
  });
}

export default async function ChainPage({ params }: PageProps<"/chains/[slug]">) {
  const chain = getChain((await params).slug);
  if (!chain) notFound();

  const name = chain.chain;
  const path = `/chains/${chain.slug}`;
  const title = chainTitle(chain);
  const picks = summaryPicks(chain);
  const goals = goalPicks(chain);
  const builder = mealBuilderItems(chain);
  const perPrice = proteinPerPrice(chain);
  const faqs = chainFaqs(chain);
  const related = relatedChains(chain, getAllChains());
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Restaurant Chains", path: "/chains" },
    { name, path },
  ];
  const rows: TableRow[] = chain.items.map((i) => ({
    name: i.name,
    category: i.category,
    protein: i.protein_g,
    calories: i.calories,
    per100: proteinPer100Cal(i),
    fiber: i.fiber_g,
    rankable: isRankable(i),
    href: itemHref(chain, i),
    thirdParty: i.source?.name ?? null,
  }));

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            headline: title,
            description: `High-protein menu picks at ${name}, from ${chain.source_type === "official" ? "official" : "third-party"} nutrition data.`,
            path,
            datePublished: chain.data_checked_date,
            dateModified: chain.data_checked_date,
            reviewedBy: chain.reviewed_by,
            image: `${path}/opengraph-image`,
          }),
          faqLd(faqs),
          breadcrumbLd(crumbs),
        ]}
      />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl sm:text-4xl">{title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          {chain.country.map((c) => (
            <Badge key={c}>{COUNTRY_LABELS[c]}</Badge>
          ))}
          <Badge>{CATEGORY_LABELS[chain.category]}</Badge>
          {chain.glp1_menu_name && <Badge tone="accent">{chain.glp1_menu_name}</Badge>}
          <span>Last updated {longDate(chain.data_checked_date)}</span>
          {chain.reviewed_by && <span>· Reviewed by {chain.reviewed_by}</span>}
        </div>
        {chain.intro_notes && <p className="mt-4 max-w-3xl text-lg">{chain.intro_notes}</p>}
        <AdSlot position="after-intro" />

        <section aria-labelledby="picks" className="mt-8">
          <h2 id="picks" className="sr-only">Top picks</h2>
          <SummaryCards picks={picks} />
        </section>

        <section aria-labelledby="all-items" className="mt-12">
          <h2 id="all-items" className="text-2xl">All {name} items by protein</h2>
          <p className="mt-1 text-muted">Sorted by protein per 100 calories. Tap a column to sort.</p>
          <div className="mt-4">
            <ChainTable rows={rows} caption={`${name} menu items with protein, calories, and fiber`} />
          </div>
        </section>

        <AdSlot position="mid-content" />

        <section aria-labelledby="by-goal" className="mt-12">
          <h2 id="by-goal" className="text-2xl">Best orders by goal</h2>
          <div className="mt-4">
            <GoalPicks groups={goals} />
          </div>
        </section>

        {builder.length > 0 && (
          <section aria-labelledby="build" className="mt-12">
            <h2 id="build" className="text-2xl">Build a {MEAL_BUILDER.targetProteinG}g+ protein meal at {name}</h2>
            <p className="mt-1 text-muted">Simple ways to order for more protein.</p>
            <div className="mt-4">
              <BuildAMeal items={builder} />
            </div>
          </section>
        )}

        {perPrice.items.length > 0 && (
          <section aria-labelledby="per-price" className="mt-12">
            <h2 id="per-price" className="text-2xl">{CURRENCY_DISPLAY[perPrice.currency].heading}</h2>
            <p className="mt-1 text-muted">Prices vary by location. These are the prices we saw.</p>
            <div className="mt-4">
              <ProteinPerPrice items={perPrice.items} currency={perPrice.currency} />
            </div>
          </section>
        )}

        <div className="mt-12 max-w-3xl">
          <FaqList faqs={faqs} />
        </div>

        <section aria-labelledby="source" className="mt-12 max-w-3xl space-y-1 text-sm text-muted">
          <h2 id="source" className="sr-only">Source</h2>
          {chain.source_type === "official" ? (
            <p>
              Nutrition data from{" "}
              <a href={chain.official_nutrition_url} rel="noopener nofollow" target="_blank">
                {name}’s official nutrition information
              </a>
              , checked {longDate(chain.data_checked_date)}.
            </p>
          ) : (
            <p className="rounded-card bg-warn-50 p-3 text-warn-800">
              {name} doesn’t publish full nutrition information, so these numbers come from{" "}
              <a href={chain.official_nutrition_url} rel="noopener nofollow" target="_blank" className="text-warn-800">
                {chain.source_name}
              </a>
              , a third-party source, checked {longDate(chain.data_checked_date)}. They may not match what you’re served.
            </p>
          )}
          {chain.reviewed_by && <p>Reviewed by {chain.reviewed_by}.</p>}
          <p>Last updated {longDate(chain.data_checked_date)}. <Link href="/editorial-policy">How we check our data</Link>.</p>
        </section>

        <section aria-labelledby="related" className="mt-12">
          <h2 id="related" className="text-2xl">Keep exploring</h2>
          {related.length > 0 && (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((c) => (
                <li key={c.slug}>
                  <ChainCard chain={toCardData(c)} />
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            <li><Link href="/chains/top-protein-fast-food">Top 25 highest-protein fast food items</Link></li>
            <li><Link href="/chains/glp1-friendly">GLP-1-friendly chain menus</Link></li>
            <li><Link href="/chains">All restaurant chains</Link></li>
          </ul>
          <div className="mt-6 flex flex-col items-start gap-3 rounded-card bg-brand-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium text-brand-900">How much protein do you need? Get your daily target in 30 seconds.</p>
            <LinkButton href="/protein-calculator">Protein calculator</LinkButton>
          </div>
        </section>

        <div className="mt-10">
          <PlanCTA />
        </div>
        <AdSlot position="end-content" />
        <div className="mt-10 max-w-3xl">
          <Disclaimer />
        </div>
      </Container>
    </>
  );
}
