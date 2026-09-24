import type { TocItem } from "@/lib/guides/toc";

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-labelledby="toc-title" className="rounded-card border border-line bg-surface p-5">
      <h2 id="toc-title" className="text-sm font-semibold uppercase tracking-wide text-muted">
        On this page
      </h2>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.id} className={i.level === 3 ? "pl-4" : ""}>
            <a href={`#${i.id}`} className="text-ink no-underline hover:text-brand-700 hover:underline">
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
