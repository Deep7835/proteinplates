import { describe, expect, it } from "vitest";
import { itemSlug, pieceCount, portionTable } from "./items";
import type { ChainItem } from "@/lib/schema/chain";

const item = (name: string, calories: number | null, protein: number | null): ChainItem => ({
  name, category: "chicken", calories, protein_g: protein, carbs_g: 16, fat_g: 13, fiber_g: null, sugar_g: null, sodium_mg: null, custom_order_tip: "",
});

describe("itemSlug", () => {
  it("makes readable URLs", () => {
    expect(itemSlug("Smoky Red Chicken (2 pc)")).toBe("smoky-red-chicken-2-pc");
    expect(itemSlug("Hot & Crispy Chicken (1 pc)")).toBe("hot-and-crispy-chicken-1-pc");
    expect(itemSlug("Taco Mexicana - Veg")).toBe("taco-mexicana-veg");
  });
});

describe("pieceCount", () => {
  it("reads the piece count", () => {
    expect(pieceCount("Smoky Red Chicken (2 pc)")).toEqual({ base: "Smoky Red Chicken", pieces: 2 });
    expect(pieceCount("Chicken Nuggets (20 pc)")).toEqual({ base: "Chicken Nuggets", pieces: 20 });
    expect(pieceCount("Popcorn Chicken (Large)")).toBeNull();
  });
});

describe("portionTable", () => {
  it("scales the listed pack: 2 pc Smoky Red (342 kcal, 42 g) → 5 pc is 855 kcal, 105 g", () => {
    const five = portionTable(item("Smoky Red Chicken (2 pc)", 342, 42))!.find((p) => p.pieces === 5)!;
    expect(five.calories).toBe(855);
    expect(five.protein_g).toBe(105);
    expect(five.carbs_g).toBe(40);
    expect(five.fat_g).toBe(32.5);
  });
  it("always includes the listed pack size", () => {
    expect(portionTable(item("Chicken Nuggets (9 pc)", 378, 22.56))!.some((p) => p.pieces === 9)).toBe(true);
  });
  it("returns null for items without a piece count or calories", () => {
    expect(portionTable(item("Fries (Medium)", 299, 7))).toBeNull();
    expect(portionTable(item("Hot Wings (3 pc)", null, 17))).toBeNull();
  });
});
