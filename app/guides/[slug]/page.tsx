import type { Metadata } from "next";
import Image from "next/image";
import { Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ChainCard } from "@/components/chains/ChainCard";
import { KeyTakeaways } from "@/components/guides/KeyTakeaways";
import { mdxComponents } from "@/components/guides/mdx-components";
import { Sources } from "@/components/guides/Sources";
import { Toc } from "@/components/guides/Toc";
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
import { longDate } from "@/lib/chains/format";
import { getChain } from "@/lib/chains/load";
import { audiences } from "@/lib/config/site";
import { getAllGuides, getGuide } from "@/lib/guides/load";
import { extractToc } from "@/lib/guides/toc";
import { articleLd, breadcrumbLd, faqLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { blurFor, placeholderStyle } from "@/lib/images/placeholder";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.metaTitle ?? guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    type: "article",
    image: guide.image.src,
    imageSize: { width: 1600, height: 900 },
  });
}

// Goal preselected on the calculator link, based on the guide's first audience.
const GOAL_FOR_AUDIENCE: Record<string, string> = { glp1: "glp1", gym: "build", seniors: "aging", women: "maintain", men: "build" };

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path },
  ];
  const { content } = await compileMDX({
    source: guide.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } },
  });
  const toc = extractToc(guide.body);
  const related = guide.relatedChains.map(getChain).filter((c) => c !== undefined);
  const goal = GOAL_FOR_AUDIENCE[guide.audience[0]] ?? "maintain";

  return (
    <>
      <JsonLd
        data={[
          articleLd({
            headline: guide.title,
            description: guide.description,
            path,
            datePublished: guide.date,
            dateModified: guide.updated,
            author: guide.author,
            reviewedBy: guide.reviewedBy,
            image: guide.image.src,
          }),
          faqLd(guide.faqs),
          breadcrumbLd(crumbs),
        ]}
      />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />
        <div className="mx-auto mt-4 max-w-3xl">
          <span className="flex flex-wrap gap-1.5">
            {guide.audience.map((a) => (
              <Badge key={a} tone="brand">{audiences.find((x) => x.slug === a)?.label}</Badge>
            ))}
          </span>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-lg text-muted">{guide.description}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span>By {guide.author}</span>
            {guide.reviewedBy && <span>Reviewed by {guide.reviewedBy}</span>}
            <span aria-hidden>·</span>
            <span>Updated {longDate(guide.updated)}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5" /> {guide.readingMinutes} min read
            </span>
          </p>
        </div>

        {/* Cover photo: the largest element on the page, so it loads first. */}
        <figure className="mx-auto mt-8 max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-card bg-surface shadow-card" style={placeholderStyle(blurFor(guide.image.src))}>
            <Image src={guide.image.src} alt={guide.image.alt} fill preload sizes="(min-width: 960px) 896px, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-right text-xs text-muted">
            Photo by{" "}
            <a href={`${guide.image.creditUrl}?utm_source=proteinplates&utm_medium=referral`} rel="noopener nofollow">
              {guide.image.credit}
            </a>{" "}
            on{" "}
            <a href={`${guide.image.sourceUrl}?utm_source=proteinplates&utm_medium=referral`} rel="noopener nofollow">
              Unsplash
            </a>
          </figcaption>
        </figure>

        <div className="mx-auto max-w-3xl">
          <div className="mt-10 space-y-6">
            <KeyTakeaways items={guide.keyTakeaways} />
            <Toc items={toc} />
          </div>
          <AdSlot position="after-intro" />

          <article className="prose prose-slate dark:prose-invert prose-h1:font-semibold prose-h2:font-semibold mt-10 max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-brand-700">
            {content}
          </article>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-card border border-brand-200 bg-brand-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            {guide.calculator ? (
              <>
                <p className="font-medium text-brand-900">Get your own numbers with our free calculator.</p>
                <LinkButton href={guide.calculator}>Open the calculator</LinkButton>
              </>
            ) : (
              <>
                <p className="font-medium text-brand-900">Find your own daily protein target in 30 seconds.</p>
                <LinkButton href={`/protein-calculator?goal=${goal}`}>Protein calculator</LinkButton>
              </>
            )}
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related-chains" className="mt-12">
              <h2 id="related-chains" className="text-2xl">High-protein picks when you eat out</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((c) => (
                  <li key={c.slug}>
                    <ChainCard chain={toCardData(c)} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <AdSlot position="end-content" />
          <div className="mt-12">
            <PlanCTA />
          </div>
          <div className="mt-12">
            <FaqList faqs={guide.faqs} />
          </div>
          <div className="mt-12">
            <Sources sources={guide.sources} />
          </div>
          <p className="mt-8 text-sm text-muted">
            More for:{" "}
            {guide.audience.map((a, i) => (
              <span key={a}>
                {i > 0 && ", "}
                <a href={`/for/${a}`}>{audiences.find((x) => x.slug === a)?.label}</a>
              </span>
            ))}
          </p>
          <div className="mt-8">
            <Disclaimer />
          </div>
        </div>
      </Container>
    </>
  );
}
