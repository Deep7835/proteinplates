import { describe, expect, it } from "vitest";
import { cardTitle, topicId } from "./cardTitle";

describe("cardTitle", () => {
  it("keeps the question and drops the subtitle", () => {
    expect(cardTitle("How Many Carbs on Keto? Your Daily Limit, Explained")).toBe("How Many Carbs on Keto?");
  });
  it("drops the colon and subtitle", () => {
    expect(cardTitle("Protein on Ozempic: What to Eat to Keep Your Muscle")).toBe("Protein on Ozempic");
  });
  it("leaves plain titles alone", () => {
    expect(cardTitle("How Much Protein Do You Need After 50?")).toBe("How Much Protein Do You Need After 50?");
    expect(cardTitle("What Is BMR? Your Basal Metabolic Rate, Explained Simply")).toBe("What Is BMR?");
  });
  it("drops a trailing bracketed note", () => {
    expect(cardTitle("How to Eat 100g of Protein a Day (Without Protein Shakes)")).toBe("How to Eat 100g of Protein a Day");
  });
  it("keeps the full title when the first part is too short to stand alone", () => {
    expect(cardTitle("BMR: What It Means")).toBe("BMR: What It Means");
  });
});

describe("topicId", () => {
  it("makes a safe id", () => {
    expect(topicId("Carbs & fat")).toBe("carbs-fat");
    expect(topicId("Calories & weight loss")).toBe("calories-weight-loss");
  });
});
