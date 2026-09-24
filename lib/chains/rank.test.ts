import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Chain } from "@/lib/schema/chain";
import { chainFaqs } from "./faq";
import { chainTitle, monthYear } from "./format";
import {
  goalPicks,
  isRankable,
  latestCheckDate,
  mealBuilderItems,
  proteinPer100Cal,
  proteinPerPrice,
  relatedChains,
  summaryPicks,
  topAcrossChainsByRule,
  topProteinAcrossChains,
} from "./rank";
import { validateChainFile } from "./validate";

const FIXTURES = path.join(__dirname, "__fixtures__");
const load = (slug: string): Chain => {
  const r = validateChainFile(`${slug}.json`, readFileSync(path.join(FIXTURES, `${slug}.json`), "utf8"));
  if (!r.ok) throw new Error(r.errors.join("\n"));
  return r.chain;
};
const grill = load("fixture-grill");
const bakery = load("fixture-bakery");

describe("validateChainFile", () => {
  const good = readFileSync(path.join(FIXTURES, "fixture-grill.json"), "utf8");
  const mutate = (fn: (o: Record<string, unknown>) => void) => {
    const o = JSON.parse(good);
    fn(o);
    return JSON.stringify(o);
  };

  it("accepts a valid file", () => expect(validateChainFile("fixture-grill.json", good).ok).toBe(true));

  it.each([
    ["bad JSON", "{", /Invalid JSON/],
    ["slug not matching file name", good, /must match the file name/, "other.json"],
    ["negative protein", mutate((o) => ((o.items as Record<string, unknown>[])[0].protein_g = -1)), /items\.0\.protein_g/],
    ["protein as a string", mutate((o) => ((o.items as Record<string, unknown>[])[0].protein_g = "40")), /items\.0\.protein_g/],
    ["unknown field (typo)", mutate((o) => ((o.items as Record<string, unknown>[])[0].protien_g = 40)), /protien_g/],
    ["bad date", mutate((o) => (o.data_checked_date = "2026-13-45")), /data_checked_date/],
    ["unknown country", mutate((o) => (o.country = ["CA"])), /country/],
    ["unknown category", mutate((o) => (o.category = "tacos")), /category/],
    ["http URL", mutate((o) => (o.official_nutrition_url = "http://example.com")), /official_nutrition_url/],
    ["no items", mutate((o) => (o.items = [])), /items/],
    ["duplicate item names", mutate((o) => (o.items as unknown[]).push((o.items as unknown[])[0])), /Duplicate item name/],
  ])("rejects %s", (_label, text, pattern, file = "fixture-grill.json") => {
    const r = validateChainFile(file as string, text as string);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join("\n")).toMatch(pattern as RegExp);
  });
});

describe("ranking", () => {
  it("never ranks items with null protein or calories", () => {
    const burrito = grill.items.find((i) => i.name === "Seasonal Burrito")!;
    expect(isRankable(burrito)).toBe(false);
    expect(proteinPer100Cal(burrito)).toBeNull();
    const everywhere = [
      ...Object.values(summaryPicks(grill)),
      ...goalPicks(grill).flatMap((g) => g.items),
      ...mealBuilderItems(grill),
      ...topProteinAcrossChains([grill, bakery], 100),
    ];
    expect(everywhere.map((i) => i?.name)).not.toContain("Seasonal Burrito");
  });

  it("computes protein per 100 calories", () => {
    expect(proteinPer100Cal(grill.items[3])).toBe(17.8); // 32 / 180
  });

  it("picks the summary cards", () => {
    const p = summaryPicks(grill);
    expect(p.bestOverall?.name).toBe("Double Chicken Bowl");
    expect(p.bestLowCal?.name).toBe("Protein Cup"); // 17.8 g/100 cal, ≤ 400 cal
    // Chicken Salad would score highest (40 + 2×9 − 4 = 54) but gets 38% of calories from fat (> 35%).
    expect(p.bestGlp1?.name).toBe("Protein Cup");
  });

  it("applies goal rules from config", () => {
    const byId = Object.fromEntries(goalPicks(grill).map((g) => [g.rule.id, g.items.map((i) => i.name)]));
    expect(byId["muscle-gain"]).toEqual(["Double Chicken Bowl", "Chicken Salad", "Protein Cup"]);
    expect(byId["fat-loss"]).toEqual(["Protein Cup", "Chicken Salad", "Steak Taco (1)"]);
    // Veggie Bowl has null sugar; Chicken Salad is over the 35% fat limit.
    expect(byId["glp1"]).toEqual(["Protein Cup"]);
    // Sweet Tea (0 g) and Steak Taco (14 g) fall below the 15 g minimum; Veggie Bowl is 520 cal.
    expect(byId["under-500"]).toEqual(["Chicken Salad", "Protein Cup"]);
  });

  it("builds the 40g+ meal list: 40 g+ items first, only items with tips", () => {
    expect(mealBuilderItems(grill).map((i) => i.name)).toEqual(["Double Chicken Bowl", "Chicken Salad", "Veggie Bowl"]);
  });

  it("computes protein per dollar and per pound", () => {
    const usd = proteinPerPrice(grill);
    expect(usd.currency).toBe("USD");
    expect(usd.items[0]).toMatchObject({ name: "Protein Cup", proteinPerUnit: 8 });
    expect(proteinPerPrice(bakery)).toEqual({ currency: "GBP", items: [] });
    // India uses protein per ₹100: 32 g for ₹200 → 16 g per ₹100.
    const inr = proteinPerPrice({ ...grill, country: ["IN"], items: [{ ...grill.items[3], price: 200 }] });
    expect(inr).toMatchObject({ currency: "INR", items: [{ proteinPerUnit: 16 }] });
    expect(proteinPerPrice({ ...grill, country: ["US", "IN"] }).currency).toBe("USD");
  });

  it("leaves combos and set meals out of cross-chain rankings", () => {
    const withCombo = { ...grill, items: [...grill.items, { ...grill.items[0], name: "Mega Combo", category: "combo", protein_g: 99 }] };
    expect(topProteinAcrossChains([withCombo], 1)[0].name).toBe("Double Chicken Bowl");
    expect(summaryPicks(withCombo).bestOverall?.name).toBe("Double Chicken Bowl");
  });

  it("ranks top items across chains", () => {
    expect(topProteinAcrossChains([grill, bakery], 3).map((i) => `${i.chain.slug}:${i.name}`)).toEqual([
      "fixture-grill:Double Chicken Bowl",
      "fixture-grill:Chicken Salad",
      "fixture-grill:Protein Cup",
    ]);
  });

  it("picks the best items across chains for a rule, capped per chain", () => {
    const rule = { id: "t", label: "t", description: "", filter: { minProteinG: 10 }, sortBy: "protein" as const, limit: 5 };
    const picks = topAcrossChainsByRule([grill, bakery], rule, 4, 1).map((i) => `${i.chain.slug}:${i.name}`);
    expect(picks).toEqual(["fixture-grill:Double Chicken Bowl", "fixture-bakery:Tuna Baguette"]);
  });

  it("orders related chains by category, then country", () => {
    expect(relatedChains(grill, [grill, bakery]).map((c) => c.slug)).toEqual(["fixture-bakery"]);
    expect(latestCheckDate([grill, bakery])).toBe("2026-09-01");
  });
});

describe("chain page text", () => {
  it("builds the H1 from the check date", () => {
    expect(monthYear("2026-09-01")).toBe("September 2026");
    expect(chainTitle(grill)).toBe("Highest Protein Items at Fixture Grill (TEST DATA) (September 2026)");
  });

  it("writes 4–5 FAQs from the data", () => {
    const faqs = chainFaqs(grill);
    expect(faqs.length).toBeGreaterThanOrEqual(4);
    expect(faqs.length).toBeLessThanOrEqual(5);
    expect(faqs[0].answer).toContain("Double Chicken Bowl has the most protein");
    expect(faqs.find((f) => f.question.includes("GLP-1"))?.answer).toContain("Protein Plates");
    expect(chainFaqs(bakery).find((f) => f.question.includes("GLP-1"))?.answer).toContain("doesn’t have a labeled");
  });
});
