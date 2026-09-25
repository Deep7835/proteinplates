"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export type TableRow = {
  name: string;
  category: string;
  protein: number | null;
  calories: number | null;
  per100: number | null;
  fiber: number | null;
  /** False when protein or calories is missing. These rows always sort to the bottom. */
  rankable: boolean;
  /** Link to the item's own page, when it has one. */
  href?: string | null;
  /** Name of a third-party source, when this item's numbers don't come from the chain's own data. */
  thirdParty?: string | null;
};

type SortKey = "name" | "protein" | "calories" | "per100" | "fiber";
const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "name", label: "Item", numeric: false },
  { key: "protein", label: "Protein (g)", numeric: true },
  { key: "calories", label: "Calories", numeric: true },
  { key: "per100", label: "Protein per 100 cal", numeric: true },
  { key: "fiber", label: "Fiber (g)", numeric: true },
];

/**
 * Rendered to full HTML on the server (crawlable). Sorting and the category filter run in the browser.
 * Empty values, and rows that can't be ranked, always sort last on number columns.
 */
export function ChainTable({ rows, caption }: { rows: TableRow[]; caption: string }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "per100", dir: "desc" });
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => [...new Set(rows.map((r) => r.category))].sort(), [rows]);

  const visible = useMemo(() => {
    const list = category === "all" ? rows : rows.filter((r) => r.category === category);
    const { key, dir } = sort;
    return [...list].sort((a, b) => {
      if (key === "name") return dir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (a.rankable !== b.rankable) return a.rankable ? -1 : 1;
      const av = a[key];
      const bv = b[key];
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      return dir === "asc" ? av - bv : bv - av;
    });
  }, [rows, sort, category]);

  function toggle(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "name" || key === "calories" ? "asc" : "desc" }));
  }

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-3 flex items-center gap-2">
          <label htmlFor="item-category" className="text-sm font-medium">
            Show
          </label>
          <select
            id="item-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-line bg-page px-3 text-sm"
          >
            <option value="all">All items ({rows.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c} ({rows.filter((r) => r.category === c).length})
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="overflow-x-auto rounded-card border border-line" tabIndex={0} role="region" aria-label={caption}>
        <table className="w-full min-w-[640px] text-sm">
          <caption className="sr-only">{caption}. Select a column heading to sort.</caption>
          <thead className="bg-surface">
            <tr>
              {COLUMNS.map((c, i) => {
                const active = sort.key === c.key;
                const Icon = active ? (sort.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                    className={`p-0 font-semibold ${c.numeric ? "text-right" : "text-left"} ${i === 0 ? "sticky left-0 z-10 bg-surface" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      className={`flex min-h-11 w-full items-center gap-1 px-3 py-2 ${c.numeric ? "justify-end" : ""} ${active ? "text-brand-800" : ""}`}
                    >
                      {c.label}
                      <Icon aria-hidden className="size-3.5 shrink-0" />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {visible.map((r) => (
              <tr key={r.name} className="border-t border-line">
                <th scope="row" className="sticky left-0 bg-page px-3 py-2 text-left font-medium">
                  {r.href ? <Link href={r.href}>{r.name}</Link> : r.name}
                  {r.thirdParty && (
                    <span className="ml-1 text-accent-800" title={`From ${r.thirdParty}`}>
                      †<span className="sr-only"> (from {r.thirdParty})</span>
                    </span>
                  )}
                  <span className="block text-xs font-normal text-muted">
                    {r.category}
                    {!r.rankable && " · not ranked"}
                  </span>
                </th>
                <td className="px-3 py-2 text-right font-semibold">{r.protein ?? "—"}</td>
                <td className="px-3 py-2 text-right">{r.calories ?? "—"}</td>
                <td className="px-3 py-2 text-right">{r.per100 ?? "—"}</td>
                <td className="px-3 py-2 text-right">{r.fiber ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">
        “—” means the source doesn’t list that number. Items without protein or calories are never ranked.
        {rows.some((r) => r.thirdParty) && (
          <> † Not in the chain’s official data we checked; numbers from {[...new Set(rows.map((r) => r.thirdParty).filter(Boolean))].join(", ")}, a third-party site.</>
        )}
        {rows.some((r) => r.href) && <> Tap an item for its full nutrition page.</>}
      </p>
    </div>
  );
}
