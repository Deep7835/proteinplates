import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/guides/GuideCard";
import { notFound } from "next/navigation";
import { ProteinCalculator } from "@/components/calculators/ProteinCalculator";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { COUNTRY_LABELS } from "@/lib/chains/format";
import { featuredChainLinks, getAllChains } from "@/lib/chains/load";
import { proteinPer100Cal, topAcrossChainsByRule } from "@/lib/chains/rank";
import { AUDIENCE_HUBS } from "@/lib/config/audiences";
import { GOAL_RULES } from "@/lib/config/goals";
import { audiences, type AudienceSlug } from "@/lib/config/site";
import { guidesForAudience } from "@/lib/guides/load";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return audiences.map((a) => ({ audience: a.slug }));
}

const hubFor = (slug: string) => (slug in AUDIENCE_HUBS ? AUDIENCE_HUBS[slug as AudienceSlug] : undefined);

export async function generateMetadata({ params }: PageProps<"/for/[audience]">): Promise<Metadata> {
  const { audience } = await params;
  const hub = hubFor(audience);
  if (!hub) return {};
  return buildMetadata({ title: hub.metaTitle, description: hub.description, path: `/for/${audience}` });
}

export default async function AudienceHubPage({ params }: PageProps<"/for/[audience]">) {
  const { audience } = await params;
  const hub = hubFor(audience);
  if (!hub) notFound();

  const path = `/for/${audience}`;
  const label = audiences.find((a) => a.slug === audience)?.label ?? hub.title;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: label, path },
  ];
  const rule = GOAL_RULES.find((r) => r.id === hub.pickRuleId);
  const picks = rule ? topAcrossChainsByRule(getAllChains(), rule, 8, 2) : [];
  const guides = guidesForAudience(audience);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl sm:text-4xl">{hub.title}</h1>
        <div className="mt-3 max-w-2xl space-y-3 text-lg text-muted">
          {hub.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <section aria-labelledby="calc" className="mt-10">
          <h2 id="calc" className="sr-only">Protein calculator</h2>
          <ProteinCalculator initialGoal={hub.goal} idPrefix={`hub-${audience}`} chainLinks={featuredChainLinks()} />
        </section>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <section aria-labelledby="tips" className="lg:col-span-1">
            <h2 id="tips" className="text-2xl">Simple tips</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {hub.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="guides" className="lg:col-span-2">
            <h2 id="guides" className="text-2xl">Guides for you</h2>
            {guides.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <GuideCard guide={g} variant="compact" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-muted">
                New guides are coming soon. For now, see <Link href="/guides">all guides</Link>.
              </p>
            )}
          </section>
        </div>

        {picks.length > 0 && (
          <section aria-labelledby="picks" className="mt-14">
            <h2 id="picks" className="text-2xl">{hub.pickHeading}</h2>
            {rule && <p className="mt-1 text-muted">{rule.description}</p>}
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {picks.map((i) => (
                <li key={`${i.chain.slug}-${i.name}`} className="rounded-card border border-line p-4">
                  <p className="text-sm text-muted">
                    <Link href={`/chains/${i.chain.slug}`}>{i.chain.chain}</Link>{" "}
                    {i.chain.country.map((c) => (
                      <Badge key={c}>{COUNTRY_LABELS[c]}</Badge>
                    ))}
                  </p>
                  <p className="mt-1 font-semibold">{i.name}</p>
                  <p className="mt-1 text-sm tabular-nums">
                    <strong className="text-brand-800">{i.protein_g} g protein</strong> · {i.calories} cal · {proteinPer100Cal(i)} g per 100 cal
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/chains">See all restaurant chains</Link>
            </p>
          </section>
        )}

        <div className="mt-12 max-w-3xl">
          <Disclaimer />
        </div>
      </Container>
    </>
  );
}
