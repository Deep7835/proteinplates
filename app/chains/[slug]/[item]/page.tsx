import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Footprints, Minus } from "lucide-react";
import { MacroBar } from "@/components/calculators/MacroBar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/monetization/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { cardLinkClass } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { FaqList } from "@/components/ui/FaqList";
import { longDate } from "@/lib/chains/format";
import { itemHref, itemPagesFor, pieceCount, portionTable } from "@/lib/chains/items";
import { BURN_ACTIVITIES, burnTable, dailyShare, goalFits, higherProteinSwaps, macroShare, proteinRank } from "@/lib/chains/itemFacts";
import { getAllChains, getChain } from "@/lib/chains/load";
import { proteinPer100Cal } from "@/lib/chains/rank";
import { getAllGuides } from "@/lib/guides/load";
import { breadcrumbLd, faqLd, type Faq } from "@/lib/seo/jsonld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";
import type { Chain, ChainItem } from "@/lib/schema/chain";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllChains().flatMap((c) => itemPagesFor(c).map((p) => ({ slug: c.slug, item: p.slug })));
}

function findPage(slug: string, itemSlug: string) {
  const chain = getChain(slug);
  return chain ? (itemPagesFor(chain).find((p) => p.slug === itemSlug) ?? null) : null;
}

const g = (v: number | null) => (v === null ? "—" : `${v} g`);

/** Where this item's numbers come from: its own third-party source, or the chain's source. */
function sourceOf(chain: Chain, item: ChainItem) {
  if (item.source) return { official: false, name: item.source.name, url: item.source.url, checked: item.source.checked };
  const official = chain.source_type === "official";
  return {
    official,
    name: official ? `${chain.chain}’s official nutrition information` : (chain.source_name ?? "a third-party source"),
    url: chain.official_nutrition_url,
    checked: chain.data_checked_date,
  };
}

function lead(chain: Chain, item: ChainItem) {
  const parts = [`${item.calories} calories`];
  if (item.protein_g !== null) parts.push(`${item.protein_g} g of protein`);
  const rest = [item.carbs_g !== null && `${item.carbs_g} g of carbs`, item.fat_g !== null && `${item.fat_g} g of fat`].filter(Boolean);
  const serving = item.serving_g ? ` (${item.serving_g} g serving)` : "";
  return `${chain.chain}’s ${item.name} has ${parts.join(" and ")}${rest.length ? `, with ${rest.join(" and ")}` : ""}${serving}.`;
}

function buildFaqs(chain: Chain, item: ChainItem): Faq[] {
  const src = sourceOf(chain, item);
  const per100 = proteinPer100Cal(item);
  const rank = proteinRank(chain, item);
  const pc = pieceCount(item.name);
  const faqs: Faq[] = [
    {
      question: `How many calories are in ${chain.chain} ${item.name}?`,
      answer: `${lead(chain, item)} That is about ${dailyShare(item.calories!)}% of a 2,000-calorie day. Source: ${src.name}, checked ${longDate(src.checked)}.`,
    },
  ];
  if (item.protein_g !== null && per100 !== null) {
    faqs.push({
      question: `How much protein is in ${chain.chain} ${item.name}?`,
      answer: `It has ${item.protein_g} g of protein, or ${per100} g per 100 calories.${rank ? ` That ranks #${rank.rank} of ${rank.of} ${chain.chain} items we list by protein per calorie.` : ""}`,
    });
  }
  if (pc) {
    const table = portionTable(item)!;
    const five = table.find((p) => p.pieces === 5)!;
    const one = table.find((p) => p.pieces === 1)!;
    faqs.push({
      question: `How many calories are in 5 pieces of ${chain.chain} ${pc.base}?`,
      answer: `About ${five.calories} calories${five.protein_g !== null ? ` and ${five.protein_g} g of protein` : ""}, calculated from the ${pc.pieces}-piece numbers (about ${one.calories} calories per piece). Pieces vary in size, so treat this as an estimate.`,
    });
  }
  const fatLoss = goalFits(item).find((f) => f.rule.id === "fat-loss");
  if (fatLoss) {
    faqs.push({
      question: `Is ${chain.chain} ${item.name} good for weight loss?`,
      answer: fatLoss.fits
        ? `It fits our fat-loss rule: 600 calories or less with at least 6 g of protein per 100 calories. Weight loss depends on your whole day, so check your target with our calorie calculator.`
        : `It doesn’t meet our fat-loss rule (600 calories or less with at least 6 g of protein per 100 calories). It can still fit your day; the swaps on this page give more protein for the calories.`,
    });
  }
  faqs.push({
    question: "Where do these numbers come from?",
    answer: src.official
      ? `From ${src.name}, checked ${longDate(src.checked)}. Recipes and portions change, so check the chain’s latest info if you need exact numbers.`
      : `From ${src.name}, a third-party site, checked ${longDate(src.checked)}. This item isn’t in the chain’s official data we checked, so the numbers may not match what you’re served.`,
  });
  return faqs;
}

export async function generateMetadata({ params }: PageProps<"/chains/[slug]/[item]">): Promise<Metadata> {
  const { slug, item: itemSlug } = await params;
  const page = findPage(slug, itemSlug);
  if (!page) return {};
  const { chain, item } = page;
  const pc = pieceCount(item.name);
  const perPiece = pc ? Math.round(item.calories! / pc.pieces) : null;
  let description = `${chain.chain} ${item.name} has ${item.calories} calories${item.protein_g !== null ? ` and ${item.protein_g} g protein` : ""}${
    perPiece ? ` (about ${perPiece} per piece)` : ""
  }. See carbs, fat, higher-protein swaps, and how long it takes to walk off.`;
  if (description.length > 165) description = `${chain.chain} ${item.name}: ${item.calories} calories${item.protein_g !== null ? `, ${item.protein_g} g protein` : ""}. Full nutrition and higher-protein swaps.`;
  return buildMetadata({
    title: `${chain.chain} ${item.name} Calories & Protein`,
    description,
    path: `/chains/${chain.slug}/${itemSlug}`,
    type: "article",
    image: `/chains/${chain.slug}/opengraph-image`,
  });
}

export default async function ItemPage({ params }: PageProps<"/chains/[slug]/[item]">) {
  const { slug, item: itemSlug } = await params;
  const page = findPage(slug, itemSlug);
  if (!page) notFound();
  const { chain, item } = page;
  const kcal = item.calories!;
  const path = `/chains/${chain.slug}/${itemSlug}`;
  const src = sourceOf(chain, item);
  const macros = macroShare(item);
  const per100 = proteinPer100Cal(item);
  const rank = proteinRank(chain, item);
  const pc = pieceCount(item.name);
  const portions = portionTable(item);
  const swaps = higherProteinSwaps(chain, item);
  const fits = goalFits(item);
  const burn = burnTable(kcal);
  const faqs = buildFaqs(chain, item);
  const guide = getAllGuides().find((gd) => gd.relatedChains.includes(chain.slug) && gd.topic === "Eating out");
  const extras = [
    { label: "Fiber", value: item.fiber_g, unit: "g" },
    { label: "Sugar", value: item.sugar_g, unit: "g" },
    { label: "Sodium", value: item.sodium_mg, unit: "mg" },
  ];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Restaurant Chains", path: "/chains" },
    { name: chain.chain, path: `/chains/${chain.slug}` },
    { name: item.name, path },
  ];
  const nutrition: Record<string, string> = { "@type": "NutritionInformation", calories: `${kcal} calories` };
  if (item.protein_g !== null) nutrition.proteinContent = `${item.protein_g} g`;
  if (item.carbs_g !== null) nutrition.carbohydrateContent = `${item.carbs_g} g`;
  if (item.fat_g !== null) nutrition.fatContent = `${item.fat_g} g`;
  if (item.fiber_g !== null) nutrition.fiberContent = `${item.fiber_g} g`;
  if (item.sugar_g !== null) nutrition.sugarContent = `${item.sugar_g} g`;
  if (item.sodium_mg !== null) nutrition.sodiumContent = `${item.sodium_mg} mg`;
  if (item.serving_g) nutrition.servingSize = `${item.serving_g} g`;

  return (
    <>
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "MenuItem", name: `${chain.chain} ${item.name}`, url: absoluteUrl(path), nutrition },
          faqLd(faqs),
          breadcrumbLd(crumbs),
        ]}
      />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mt-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{chain.chain}</Badge>
            <Badge>{item.category}</Badge>
            {!src.official && <Badge tone="accent">Third-party data</Badge>}
          </div>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            {chain.chain} {item.name}: Calories &amp; Nutrition
          </h1>
          <p className="mt-4 text-lg">{lead(chain, item)}</p>
          <p className="mt-2 text-sm text-muted">
            Source: {src.name} · checked {longDate(src.checked)}
          </p>
        </div>

        {/* Headline numbers */}
        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Calories", value: `${kcal}`, strong: true },
            { label: "Protein", value: g(item.protein_g), strong: true },
            { label: "Carbs", value: g(item.carbs_g) },
            { label: "Fat", value: g(item.fat_g) },
          ].map((s) => (
            <div key={s.label} className={`flex flex-col rounded-card border p-4 ${s.strong ? "border-brand-200 bg-brand-50" : "border-line bg-page"}`}>
              <dt className="text-sm text-muted">{s.label}</dt>
              <dd className="order-first font-display text-3xl font-semibold tabular-nums text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid max-w-3xl gap-6 rounded-card border border-line p-5 sm:grid-cols-[1fr_auto] sm:items-center">
          {macros ? (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Where the calories come from</h2>
              <div className="mt-3">
                <MacroBar macros={macros} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">The source doesn’t list all three macros, so we can’t show the calorie split.</p>
          )}
          <div className="sm:border-l sm:border-line sm:pl-6 sm:text-center">
            <p className="font-display text-3xl font-semibold tabular-nums">{dailyShare(kcal)}%</p>
            <p className="text-sm text-muted">of a 2,000-calorie day</p>
          </div>
        </div>

        <p className="mt-3 max-w-3xl text-sm text-muted">
          {extras.some((e) => e.value !== null)
            ? extras.map((e) => `${e.label}: ${e.value === null ? "not listed" : `${e.value} ${e.unit}`}`).join(" · ")
            : `${src.official ? `${chain.chain}’s listing` : src.name} doesn’t include fiber, sugar, or sodium for this item.`}
        </p>

        <AdSlot position="after-intro" />

        <div className="mt-12 max-w-3xl space-y-12">
          {portions && pc && (
            <section aria-labelledby="pieces">
              <h2 id="pieces" className="text-2xl sm:text-3xl">
                Calories in 1 to 10 pieces of {chain.chain} {pc.base}
              </h2>
              <p className="mt-2 text-muted">
                Worked out from the {pc.pieces}-piece numbers ({Math.round(kcal / pc.pieces)} calories per piece). Pieces vary in
                size, so these are estimates.
              </p>
              <div className="mt-4 overflow-x-auto rounded-card border border-line" tabIndex={0} role="region" aria-label="Calories by number of pieces">
                <table className="w-full min-w-[420px] text-sm tabular-nums">
                  <thead className="bg-surface text-left">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-semibold">Pieces</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">Calories</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">Protein</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">Carbs</th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portions.map((p) => {
                      const listed = p.pieces === pc.pieces;
                      return (
                        <tr key={p.pieces} className={`border-t border-line ${listed ? "bg-brand-50" : ""}`}>
                          <th scope="row" className="px-3 py-2 text-left font-medium">
                            {p.pieces} pc{listed && <span className="ml-2 text-xs font-normal text-brand-800">(listed)</span>}
                          </th>
                          <td className="px-3 py-2 text-right font-semibold">{p.calories}</td>
                          <td className="px-3 py-2 text-right">{g(p.protein_g)}</td>
                          <td className="px-3 py-2 text-right">{g(p.carbs_g)}</td>
                          <td className="px-3 py-2 text-right">{g(p.fat_g)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {item.protein_g !== null && per100 !== null && (
            <section aria-labelledby="protein">
              <h2 id="protein" className="text-2xl sm:text-3xl">Is it a good protein pick?</h2>
              <p className="mt-2">
                It gives <strong>{per100} g of protein per 100 calories</strong>
                {rank && (
                  <>
                    , #{rank.rank} of {rank.of} {chain.chain} items we list
                  </>
                )}
                . Here’s how it does on the same goal rules we use on the{" "}
                <Link href={`/chains/${chain.slug}`}>{chain.chain} page</Link>:
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {fits.map(({ rule, fits: ok }) => (
                  <li key={rule.id} className="flex gap-3 rounded-xl border border-line p-3 text-sm">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${ok ? "bg-brand-50 text-brand-700" : "bg-surface text-muted"}`}
                    >
                      {ok ? <Check aria-hidden className="size-4" /> : <Minus aria-hidden className="size-4" />}
                    </span>
                    <span>
                      <span className="font-semibold">
                        {rule.label}: {ok ? "fits" : "doesn’t fit"}
                      </span>
                      <span className="block text-muted">{rule.description}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {swaps.items.length > 0 && (
            <section aria-labelledby="swaps">
              <h2 id="swaps" className="text-2xl sm:text-3xl">
                {swaps.fallback ? `Top protein picks at ${chain.chain}` : `Higher-protein swaps at ${chain.chain}`}
              </h2>
              <p className="mt-2 text-muted">
                {swaps.fallback
                  ? "Nothing on the menu we list beats this for protein at similar calories. These are the chain’s best protein-per-calorie items."
                  : "At least as much protein, for about the same calories or fewer."}
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {swaps.items.map((s) => {
                  const href = itemHref(chain, s);
                  const body = (
                    <>
                      <span className="font-semibold leading-snug group-hover:text-brand-700">{s.name}</span>
                      <span className="mt-2 text-sm">
                        <span className="font-semibold text-brand-700">{s.protein_g} g protein</span>
                        <span className="text-muted"> · {s.calories} cal</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={s.name}>
                      {href ? (
                        <Link href={href} className={`${cardLinkClass} p-4`}>
                          {body}
                        </Link>
                      ) : (
                        <div className="flex h-full flex-col rounded-card border border-line p-4">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section aria-labelledby="burn">
            <h2 id="burn" className="text-2xl sm:text-3xl">How long to walk off {kcal} calories?</h2>
            <p className="mt-2 text-muted">
              A rough guide using the Compendium of Physical Activities (calories ≈ MET × body weight in kg × hours). Your
              real burn depends on your body and pace.
            </p>
            <div className="mt-4 overflow-x-auto rounded-card border border-line" tabIndex={0} role="region" aria-label="Minutes of activity to burn these calories">
              <table className="w-full min-w-[420px] text-sm tabular-nums">
                <thead className="bg-surface text-left">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-semibold">Body weight</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Footprints aria-hidden className="size-4" /> Brisk walk
                      </span>
                    </th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Run (6 mph)</th>
                  </tr>
                </thead>
                <tbody>
                  {burn.map((b) => (
                    <tr key={b.kg} className="border-t border-line">
                      <th scope="row" className="px-3 py-2 text-left font-medium">
                        {b.lb} lb ({b.kg} kg)
                      </th>
                      <td className="px-3 py-2 text-right">about {b.walk} min</td>
                      <td className="px-3 py-2 text-right">about {b.run} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted">
              Brisk walking = {BURN_ACTIVITIES.walk.label} (MET {BURN_ACTIVITIES.walk.met}); running = {BURN_ACTIVITIES.run.label} (MET{" "}
              {BURN_ACTIVITIES.run.met}). Try your own weight in our <Link href="/calories-burned-calculator">calories burned calculator</Link>.
            </p>
          </section>

          <div className="flex flex-col items-start gap-4 rounded-card border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium text-brand-900">How much protein do you need in a day? Find your target in 30 seconds.</p>
            <LinkButton href="/protein-calculator">Protein calculator</LinkButton>
          </div>

          <FaqList faqs={faqs} />

          <section aria-labelledby="more" className="space-y-3">
            <h2 id="more" className="text-2xl">More from {chain.chain}</h2>
            <p>
              <Link href={`/chains/${chain.slug}`} className="inline-flex items-center gap-1 font-semibold">
                See all {chain.items.length} {chain.chain} items by protein <ArrowRight aria-hidden className="size-4" />
              </Link>
            </p>
            {guide && (
              <p>
                Guide: <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </p>
            )}
          </section>

          <section aria-labelledby="source" className="text-sm text-muted">
            <h2 id="source" className="sr-only">Source</h2>
            {src.official ? (
              <p>
                Nutrition data from{" "}
                <a href={src.url} rel="noopener nofollow" target="_blank">
                  {src.name}
                </a>
                , checked {longDate(src.checked)}.
              </p>
            ) : (
              <p className="rounded-card bg-warn-50 p-3 text-warn-800">
                These numbers come from{" "}
                <a href={src.url} rel="noopener nofollow" target="_blank" className="text-warn-800">
                  {src.name}
                </a>
                , a third-party site, checked {longDate(src.checked)}. This item isn’t in {chain.chain}’s official nutrition data we
                checked, so the numbers may not match what you’re served.
              </p>
            )}
            <p className="mt-2">
              <Link href="/editorial-policy">How we check our data</Link>
            </p>
          </section>

          <Disclaimer />
        </div>
      </Container>
    </>
  );
}
