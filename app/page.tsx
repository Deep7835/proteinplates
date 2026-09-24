import Image from "next/image";
import heroPhoto from "@/public/images/home-hero.jpg";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Calculator, Dumbbell, Heart, Leaf, Store, Sunrise, Trophy, UtensilsCrossed, Zap, type LucideIcon } from "lucide-react";
import { ProteinCalculator } from "@/components/calculators/ProteinCalculator";
import { ChainCard } from "@/components/chains/ChainCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PlanCTA } from "@/components/monetization/PlanCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { cardLinkClass } from "@/components/ui/Card";
import { GuideCard } from "@/components/guides/GuideCard";
import { toCardData } from "@/lib/chains/cards";
import { featuredChainLinks, getAllChains, getChain, getChainsByPriority } from "@/lib/chains/load";
import { mainCalculatorPages } from "@/lib/calculators/pages";
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

// Hero photo (free Unsplash license), saved in public/images. Static import gives a blur placeholder while it loads.
const HERO_IMAGE = {
  src: heroPhoto,
  alt: "A bowl of sliced grilled meat with rice and vegetables",
  credit: "stefan cruceru",
  creditUrl: "https://unsplash.com/@stefan_cruceru",
  sourceUrl: "https://unsplash.com/photos/LndA2Thz58c",
};
// The floating card on the hero shows this chain's top protein pick, straight from its data file.
const HERO_PICK_CHAIN = "chipotle";

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Calculator, title: "Get your number", text: "Our calculator gives your daily protein target and a per-meal goal." },
  { icon: Store, title: "Pick where you're eating", text: "Open any of the chains we cover in the US, UK, and India." },
  { icon: UtensilsCrossed, title: "Order the best match", text: "See the highest-protein items, sorted, with the source for every number." },
];

const AUDIENCE_ICONS: Record<string, LucideIcon> = { glp1: Leaf, gym: Dumbbell, women: Heart, men: Zap, seniors: Sunrise };

function AudienceIcon({ slug }: { slug: string }) {
  const Icon = AUDIENCE_ICONS[slug] ?? Leaf;
  return (
    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
      <Icon aria-hidden className="size-5" />
    </span>
  );
}

export default function HomePage() {
  const chains = getChainsByPriority().slice(0, 8);
  const guides = getAllGuides().slice(0, 3);
  const heroChain = getChain(HERO_PICK_CHAIN);
  const heroCard = heroChain ? toCardData(heroChain) : null;
  const topPick = heroCard?.topPick ? { ...heroCard.topPick, chain: heroCard.name, slug: heroCard.slug } : null;
  const stats = [
    { value: getAllChains().length, label: "restaurant chains" },
    { value: mainCalculatorPages().length, label: "free calculators" },
    { value: getAllGuides().length, label: "sourced guides" },
  ];

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-page">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-page px-3 py-1 text-sm font-medium text-brand-800 shadow-card ring-1 ring-brand-200">
              <BadgeCheck aria-hidden className="size-4 text-brand-600" /> Free, sourced, no sign-up
            </p>
            <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{site.tagline}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Find out how much protein you need. Then see the best high-protein orders at the places you already eat.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <LinkButton href="#calculator">
                Find my protein target <ArrowRight aria-hidden className="size-4" />
              </LinkButton>
              <LinkButton href="/chains" variant="secondary">Browse restaurant chains</LinkButton>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
              {stats.map((st) => (
                <div key={st.label} className="flex flex-col">
                  <dt className="text-xs font-medium text-muted sm:text-sm">{st.label}</dt>
                  <dd className="order-first font-display text-2xl font-semibold text-ink sm:text-3xl">{st.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden sm:block">
            <div className="relative aspect-video overflow-hidden rounded-[1.75rem] bg-surface shadow-lift">
              {/* Lazy on purpose: the photo is hidden on phones, and a lazy image there is never downloaded. */}
              <Image src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill placeholder="blur" sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
            </div>
            {topPick && (
              <Link
                href={`/chains/${topPick.slug}`}
                className="absolute -bottom-6 left-4 flex max-w-xs items-center gap-3 rounded-2xl border border-line bg-page p-3 pr-4 text-ink no-underline shadow-lift transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:-left-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-800">
                  <Trophy aria-hidden className="size-5" />
                </span>
                <span className="text-sm leading-snug">
                  <span className="block text-xs font-medium text-muted">Top pick at {topPick.chain}</span>
                  <span className="block font-semibold">{topPick.name}</span>
                  <span className="font-semibold text-brand-700">{topPick.protein} g protein</span>
                </span>
              </Link>
            )}
            <p className="mt-9 text-right text-xs text-muted">
              Photo by{" "}
              <a href={`${HERO_IMAGE.creditUrl}?utm_source=proteinplates&utm_medium=referral`} rel="noopener nofollow">
                {HERO_IMAGE.credit}
              </a>{" "}
              on{" "}
              <a href={`${HERO_IMAGE.sourceUrl}?utm_source=proteinplates&utm_medium=referral`} rel="noopener nofollow">
                Unsplash
              </a>
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="how-it-works" className="border-y border-line bg-page">
        <Container className="py-10">
          <h2 id="how-it-works" className="sr-only">How it works</h2>
          <ol className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200">
                  <step.icon aria-hidden className="size-6" />
                </span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-brand-700">Step {i + 1}</span>
                  <span className="mt-0.5 block font-semibold">{step.title}</span>
                  <span className="mt-1 block text-sm text-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Section id="calculator" eyebrow="Step 1" title="Your daily protein target" intro="Enter your details. Your results update as you type.">
        <ProteinCalculator idPrefix="home" chainLinks={featuredChainLinks()} />
      </Section>

      {chains.length > 0 && (
        <Section tone="muted" eyebrow="Eat out" title="High-protein orders at chains you know" intro="The highest-protein orders at popular chains in the US, UK, and India, from sourced nutrition data.">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {chains.map((c) => (
              <li key={c.slug}>
                <ChainCard chain={toCardData(c)} />
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/chains">
              All restaurant chains <ArrowRight aria-hidden className="size-4" />
            </LinkButton>
            <LinkButton href="/chains/top-protein-fast-food" variant="secondary">Top 25 highest-protein items</LinkButton>
            <LinkButton href="/chains/glp1-friendly" variant="secondary">GLP-1-friendly menus</LinkButton>
          </div>
        </Section>
      )}

      <Section eyebrow="For you" title="Protein for your life stage and goal">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((a) => (
            <li key={a.slug}>
              <Link href={`/for/${a.slug}`} className={`${cardLinkClass} p-5`}>
                <AudienceIcon slug={a.slug} />
                <span className="mt-4 font-bold group-hover:text-brand-700">{AUDIENCE_HUBS[a.slug].title}</span>
                <span className="mt-2 text-sm text-muted">{AUDIENCE_HUBS[a.slug].description}</span>
                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700">
                  Read more{" "}
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {guides.length > 0 && (
        <Section tone="muted" eyebrow="Learn" title="Latest guides" intro="Short, sourced answers to the questions people ask most.">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <LinkButton href="/guides" variant="secondary">
              All guides <ArrowRight aria-hidden className="size-4" />
            </LinkButton>
          </div>
        </Section>
      )}

      <Container className="py-10">
        <PlanCTA />
      </Container>
    </>
  );
}
