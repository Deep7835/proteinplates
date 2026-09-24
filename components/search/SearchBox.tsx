"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { SearchDoc } from "@/lib/search/index";
import { SEARCH_LIMIT, searchDocs } from "@/lib/search/match";

const SUGGESTIONS = ["protein calculator", "calorie deficit", "body fat", "Chipotle", "grilled chicken", "GLP-1", "fiber"];

/** Site search. The index is a static JSON file loaded on this page only; the query lives in ?q=. */
export function SearchBox() {
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [q, setQ] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of ?q= after hydration
    if (initial) setQ(initial);
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setDocs)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }, [q]);

  const results = useMemo(() => (docs ? searchDocs(docs, q) : []), [docs, q]);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <label htmlFor="site-search" className="sr-only">
          Search the site
        </label>
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
        <input
          id="site-search"
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Calculators, guides, chains, menu items…"
          className="h-14 w-full rounded-card border border-line bg-page pl-12 pr-4 text-lg shadow-card"
          autoComplete="off"
        />
      </form>

      <p role="status" className="mt-3 text-sm text-muted">
        {failed
          ? "Search couldn’t load. Please refresh the page."
          : !docs
            ? "Loading…"
            : q.trim()
              ? `${results.length === SEARCH_LIMIT ? "Top " : ""}${results.length} result${results.length === 1 ? "" : "s"} for “${q.trim()}”`
              : `Search ${docs.length} pages.`}
      </p>

      {!q.trim() && (
        <div className="mt-4">
          <p className="text-sm font-medium">Popular searches</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => setQ(s)}
                  className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-sm hover:border-brand-600"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-6 divide-y divide-line rounded-card border border-line">
          {results.map((r) => (
            <li key={r.u}>
              <Link href={r.u} className="block p-4 text-ink no-underline hover:bg-surface">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{r.k}</span>
                <span className="mt-0.5 block font-semibold">{r.t}</span>
                <span className="mt-1 block text-sm text-muted">{r.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {docs && q.trim() && results.length === 0 && (
        <p className="mt-6 text-muted">
          No matches. Try a simpler word, or browse <Link href="/calculators">calculators</Link>, <Link href="/guides">guides</Link>, or{" "}
          <Link href="/chains">chains</Link>.
        </p>
      )}
    </div>
  );
}
