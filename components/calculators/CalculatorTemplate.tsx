import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/guides/mdx-components";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { AdSlot } from "@/components/monetization/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { getCalculatorPage } from "@/lib/calculators/pages";
import { longDate } from "@/lib/chains/format";
import type { NavLink } from "@/lib/config/site";
import type { CalculatorPage } from "@/lib/schema/calculatorPage";
import { breadcrumbLd, faqLd, webApplicationLd } from "@/lib/seo/jsonld";
import { CALCULATORS } from "./registry";

type Props = { page: CalculatorPage; variants: CalculatorPage[]; chainLinks: NavLink[] };

/** Layout for every calculator page and keyword landing page: tool, explainer, FAQ, sources, JSON-LD. */
export async function CalculatorTemplate({ page, variants, chainLinks }: Props) {
  const main = page.variant ? getCalculatorPage(page.slug) : page;
  const path = page.variant ? `/${page.slug}/${page.variant}` : `/${page.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Calculators", path: "/calculators" },
    ...(page.variant && main ? [{ name: main.name, path: `/${page.slug}` }] : []),
    { name: page.name, path },
  ];
  const { content } = await compileMDX({
    source: page.body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } },
  });
  const render = CALCULATORS[page.slug];
  const related = page.related
    .map((r) => (r.startsWith("/") ? { href: r, label: r } : { href: `/${r}`, label: getCalculatorPage(r)?.name ?? r }))
    .filter((r) => r.label);
  const siblings = variants.filter((v) => v.variant !== page.variant);

  return (
    <>
      <JsonLd data={[webApplicationLd({ name: page.name, description: page.description, path }), breadcrumbLd(crumbs), faqLd(page.faqs)]} />
      <Container className="py-8 sm:py-10">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="mt-4 text-3xl sm:text-4xl">{page.title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">{page.intro}</p>
        <p className="mt-2 text-sm text-muted">Last updated {longDate(page.updated)}</p>
        <div className="mt-8">{render({ preset: page.preset, chainLinks, isMainPage: !page.variant })}</div>

        {(siblings.length > 0 || page.variant) && (
          <nav aria-labelledby="versions" className="mt-10 print:hidden">
            <h2 id="versions" className="text-lg">
              {page.variant ? "More versions of this calculator" : "Popular versions"}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {page.variant && main && (
                <li>
                  <Link href={`/${page.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-sm no-underline hover:border-brand-600">
                    {main.name}
                  </Link>
                </li>
              )}
              {siblings.map((v) => (
                <li key={v.variant}>
                  <Link href={`/${v.slug}/${v.variant}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-sm no-underline hover:border-brand-600">
                    {v.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <AdSlot position="mid-content" />

        <article className="prose prose-slate dark:prose-invert mt-12 max-w-3xl prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-brand-700">
          {content}
        </article>

        <div className="mt-12 max-w-3xl">
          <FaqList faqs={page.faqs} />
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-calcs" className="mt-12 max-w-3xl print:hidden">
            <h2 id="related-calcs" className="text-xl">Related calculators</h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-medium">
              {related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/calculators">All calculators</Link>
              </li>
            </ul>
          </section>
        )}

        {page.sources.length > 0 && (
          <section aria-labelledby="sources-title" className="mt-12 max-w-3xl">
            <h2 id="sources-title" className="text-xl">Sources</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
              {page.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} rel="noopener" target="_blank">{s.label}</a>
                </li>
              ))}
            </ol>
          </section>
        )}
        <AdSlot position="end-content" />
      </Container>
    </>
  );
}
