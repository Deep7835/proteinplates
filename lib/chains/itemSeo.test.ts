import { describe, expect, it } from "vitest";
import type { Chain, ChainItem } from "@/lib/schema/chain";
import { aliasesFor, itemDescription, itemTitle, per100g, similarItemsElsewhere } from "./itemSeo";

const item = (name: string, category: string, calories: number, protein: number | null, extra: Partial<ChainItem> = {}): ChainItem => ({
  name, category, calories, protein_g: protein, carbs_g: 24.8, fat_g: 11.4, fiber_g: null, sugar_g: null, sodium_mg: null, custom_order_tip: "", ...extra,
});
const chain = (slug: string, name: string, items: ChainItem[]) => ({ slug, chain: name, items }) as unknown as Chain;

describe("itemTitle", () => {
  it("puts the answer first and stays short enough for phones", () => {
    const t = itemTitle({ chain: "McDonald's India" }, item("Pizza McPuff", "side", 225, 5.5));
    expect(t).toBe("Pizza McPuff Calories: 225 kcal, 5.5 g Protein | McDonald's India");
    expect(t.length).toBeLessThanOrEqual(68);
  });
  it("shortens long pizza names before dropping the chain", () => {
    const t = itemTitle({ chain: "Domino's India" }, item("Pepper Barbeque Chicken & Onion Pizza (Regular, New Hand Tossed)", "pizza", 697, 32.7));
    expect(t.length).toBeLessThanOrEqual(68);
    expect(t).toContain("697 kcal");
    expect(t).toContain("(Regular)");
  });
});

describe("itemDescription", () => {
  it("starts with the full answer and includes a search alias", () => {
    const d = itemDescription({ chain: "McDonald's India" }, item("Pizza McPuff", "side", 225, 5.5, { serving_g: 87 }), ["McPuff"]);
    expect(d).toBe("McDonald's India’s Pizza McPuff has 225 calories, 5.5 g protein, 24.8 g carbs and 11.4 g fat per 87 g serving. Also called McPuff.");
    expect(d.length).toBeLessThanOrEqual(160);
  });
});

describe("aliasesFor", () => {
  it("finds aliases by chain and item", () => {
    expect(aliasesFor({ slug: "mcdonalds-india" }, { name: "Pizza McPuff" })).toContain("McPuff");
    expect(aliasesFor({ slug: "kfc-india" }, { name: "Pizza McPuff" })).toEqual([]);
  });
});

describe("per100g", () => {
  it("works from the serving weight", () => {
    expect(per100g(225, 87)).toBe(258.6);
    expect(per100g(225, null)).toBeNull();
  });
});

describe("similarItemsElsewhere", () => {
  const mcd = chain("mcdonalds-india", "McDonald's India", [item("McSpicy Paneer Burger", "burger", 647, 20.3)]);
  const bk = chain("burger-king-india", "Burger King India", [item("Paneer Royale Burger", "burger", 600, 18.5), item("Crispy Chicken", "burger", 299, 12.4)]);
  const kfc = chain("kfc-india", "KFC India", [item("Paneer Zinger", "burger", 643, 24), item("Paneer Wrap", "wrap", 500, 15)]);
  const uk = chain("greggs", "Greggs", [item("Paneer Bake", "burger", 400, 10)]);
  it("matches the same kind of item at other item-page chains only", () => {
    const s = similarItemsElsewhere(mcd, mcd.items[0], [mcd, bk, kfc, uk]);
    expect(s.map((i) => i.name)).toEqual(["Paneer Zinger", "Paneer Royale Burger"]);
  });
});
