import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProteinCalculator } from "@/components/calculators/ProteinCalculator";
import { ChainCard } from "@/components/chains/ChainCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PlanCTA } from "@/components/monetization/PlanCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { toCardData } from "@/lib/chains/cards";
import { featuredChainLinks, getChainsByPriority } from "@/lib/chains/load";
import { AUDIENCE_HUBS } from "@/lib/config/audiences";
import { audiences, site } from "@/lib/config/site";
import { getAllGuides } from "@/lib/guides/load";
import { organizationLd, websiteLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: `${site.name}: Protein Calculator and High-Protein Restaurant Picks`,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  const chains = getChainsByPriority().slice(0, 8);
  const guides = getAllGuides().slice(0, 3);

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <section className="bg-brand-50 py-14 sm:py-20">
        <Container>
          <h1 className="max-w-3xl text-4xl sm:text-5xl">{site.tagline}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Find out how much protein you need. Then see the best high-protein orders at the places you already eat.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="#calculator">Find my protein target</LinkButton>
            <LinkButton href="/chains" variant="secondary">Browse restaurant chains</LinkButton>
          </div>
        </Container>
      </section>

      <Section id="calculator" title="Protein calculator" intro="Enter your details. Your results update as you type.">
        <ProteinCalculator idPrefix="home" chainLinks={featuredChainLinks()} />
      </Section>

      {chains.length > 0 && (
        <Section tone="muted" title="Eat out smarter" intro="The highest-protein orders at popular chains in the US, UK, and India, from sourced nutrition data.">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chains.map((c) => (
              <li key={c.slug}>
                <ChainCard chain={toCardData(c)} />
              </li>
            ))}
          </ul>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-medium">
            <Link href="/chains">All restaurant chains</Link>
            <Link href="/chains/top-protein-fast-food">Top 25 highest-protein items</Link>
            <Link href="/chains/glp1-friendly">GLP-1-friendly menus</Link>
          </p>
        </Section>
      )}

      <Section title="Protein for your life stage and goal">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/for/${a.slug}`}
                className="flex h-full flex-col rounded-card border border-line p-5 text-ink no-underline shadow-card hover:border-brand-600"
              >
                <span className="font-bold">{AUDIENCE_HUBS[a.slug].title}</span>
                <span className="mt-2 text-sm text-muted">{AUDIENCE_HUBS[a.slug].description}</span>
                <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-brand-700">
                  Read more <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {guides.length > 0 && (
        <Section tone="muted" title="Latest guides">
          <ul className="grid gap-4 md:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guides/${g.slug}`}
                  className="flex h-full flex-col rounded-card border border-line bg-page p-5 text-ink no-underline shadow-card hover:border-brand-600"
                >
                  <span className="font-bold">{g.title}</span>
                  <span className="mt-2 text-sm text-muted">{g.description}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-medium">
            <Link href="/guides">All guides</Link>
          </p>
        </Section>
      )}

      <Container className="py-10">
        <PlanCTA />
      </Container>
    </>
  );
}
