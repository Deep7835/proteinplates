import { describe, expect, it } from "vitest";
import type { Chain, ChainItem } from "@/lib/schema/chain";
import { burnMinutes, dailyShare, higherProteinSwaps, macroShare, proteinRank } from "./itemFacts";

const it_ = (name: string, calories: number, protein: number, carbs = 20, fat = 10): ChainItem => ({
  name, category: "chicken", calories, protein_g: protein, carbs_g: carbs, fat_g: fat, fiber_g: null, sugar_g: null, sodium_mg: null, custom_order_tip: "",
});
const chain = { slug: "x", items: [it_("A", 342, 42), it_("B", 640, 39), it_("C", 224, 5), it_("D", 300, 40)] } as unknown as Chain;

describe("burnMinutes (calories ≈ MET × kg × hours)", () => {
  it("855 kcal of brisk walking (MET 4.8) at 70 kg is about 155 min", () => {
    // 855 / (4.8 × 70) h = 2.545 h = 152.7 min → nearest 5 = 155
    expect(burnMinutes(855, 70, 4.8)).toBe(155);
  });
});

describe("macroShare", () => {
  it("splits calories by 4/4/9", () => {
    const m = macroShare(it_("A", 342, 42, 16, 13))!;
    expect(m.protein.percent + m.carbs.percent + m.fat.percent).toBeGreaterThanOrEqual(99);
    expect(m.protein.percent).toBe(48); // 168 of 349 kcal
  });
});

describe("proteinRank and swaps", () => {
  it("ranks by protein per 100 calories", () => {
    expect(proteinRank(chain, chain.items[3])).toEqual({ rank: 1, of: 4 });
    expect(proteinRank(chain, chain.items[2])).toEqual({ rank: 4, of: 4 });
  });
  it("suggests items with more protein for similar or fewer calories", () => {
    const s = higherProteinSwaps(chain, chain.items[1]);
    expect(s.fallback).toBe(false);
    expect(s.items.map((i) => i.name)).toEqual(["D", "A"]);
  });
  it("falls back to the chain's best when nothing beats the item", () => {
    expect(higherProteinSwaps(chain, chain.items[3]).fallback).toBe(true);
  });
});

describe("dailyShare", () => {
  it("is a share of 2,000 calories", () => expect(dailyShare(450)).toBe(23));
});
