"use client";

import { useEffect, useState } from "react";

type Topic = { id: string; label: string; count: number };

/**
 * Filter chips for the guide list. The cards are server-rendered; this only sets data-filter on the list
 * (CSS on the page hides cards from other topics) and keeps the choice in the URL (?topic=...) so it can be shared.
 */
export function TopicFilter({ listId, topics, total }: { listId: string; topics: Topic[]; total: number }) {
  const [active, setActive] = useState("all");

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("topic");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the shared URL once, after hydration
    if (fromUrl && topics.some((t) => t.id === fromUrl)) setActive(fromUrl);
  }, [topics]);

  useEffect(() => {
    document.getElementById(listId)?.setAttribute("data-filter", active);
    const url = new URL(window.location.href);
    if (active === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", active);
    window.history.replaceState(null, "", url);
  }, [active, listId]);

  const shown = active === "all" ? total : (topics.find((t) => t.id === active)?.count ?? 0);
  const chips = [{ id: "all", label: "All guides", count: total }, ...topics];

  return (
    <div className="mt-8">
      <div role="group" aria-label="Filter guides by topic" className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const on = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c.id)}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-200 ${
                on ? "border-brand-700 bg-brand-700 text-page" : "border-line bg-page text-ink hover:border-brand-600 hover:text-brand-700"
              }`}
            >
              {c.label}
              <span className={`rounded-full px-1.5 text-xs ${on ? "bg-page/20" : "bg-surface text-muted"}`}>{c.count}</span>
            </button>
          );
        })}
      </div>
      <p role="status" className="sr-only">
        Showing {shown} {shown === 1 ? "guide" : "guides"}
      </p>
    </div>
  );
}
