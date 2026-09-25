import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { GuideCard } from "@/components/guides/GuideCard";
import { TopicFilter } from "@/components/guides/TopicFilter";
import { JsonLd } from "@/components/seo/JsonLd";
import { topicId } from "@/lib/guides/cardTitle";
import { getAllGuides, getGuide } from "@/lib/guides/load";
import { GUIDE_TOPICS } from "@/lib/schema/article";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Nutrition Guides: Simple, Sourced Advice for Real Life",
  description:
    "Easy-to-read guides on protein, calories, carbs, fiber, water, and body measurements. Sourced advice for GLP-1 users, gym-goers, women, men, and adults 50+.",
  path: "/guides",
});

// Shown as the big card at the top of the list.
const FEATURED_GUIDE = "how-to-eat-100g-protein-a-day";
const LIST_ID = "guide-list";

export default function GuidesPage() {
  const all = getAllGuides();
  const featured = getGuide(FEATURED_GUIDE) ?? all[0];
  // Grouped by topic (in topic order), featured first.
  const guides = [featured, ...GUIDE_TOPICS.flatMap((t) => all.filter((g) => g.topic === t && g.slug !== featured.slug))];
  const topics = GUIDE_TOPICS.map((t) => ({ id: topicId(t), label: t, count: all.filter((g) => g.topic === t).length })).filter((t) => t.count > 0);
  // When a topic is picked, hide cards from other topics (no JavaScript needed to render the cards themselves).
  const filterCss = topics.map((t) => `#${LIST_ID}[data-filter="${t.id}"] > li:not([data-topic="${t.id}"]){display:none}`).join("");
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-4xl sm:text-5xl">Nutrition guides</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted">
        Short, sourced guides on protein, calories, and nutrients, and how to hit your targets with real food, at home or eating out.
      </p>

      <TopicFilter listId={LIST_ID} topics={topics} total={all.length} />

      <style>{filterCss}</style>
      <ul id={LIST_ID} data-filter="all" className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g, i) => (
          <li key={g.slug} data-topic={topicId(g.topic)} className={i === 0 ? "sm:col-span-2 lg:col-span-3" : ""}>
            <GuideCard guide={g} headingLevel="h2" variant={i === 0 ? "featured" : "default"} eager={i === 0} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
