import { describe, expect, it } from "vitest";
import { formatWeight, ftInToCm, kgToLb, lbToKg, toCm, toKg } from "./units";

describe("units", () => {
  it("converts pounds and kilograms both ways", () => {
    expect(lbToKg(100)).toBeCloseTo(45.359, 3);
    expect(kgToLb(lbToKg(172))).toBeCloseTo(172, 9);
  });

  it("converts stone + pounds (UK)", () => {
    expect(toKg({ units: "uk", st: 11, lb: 4, ft: 5, in: 6 })).toBeCloseTo(lbToKg(158), 9);
  });

  it("converts feet + inches to cm", () => {
    expect(ftInToCm(5, 10)).toBeCloseTo(177.8, 6);
    expect(toCm({ units: "us", lb: 150, ft: 6, in: 0 })).toBeCloseTo(182.88, 6);
    expect(toCm({ units: "metric", kg: 70, cm: 170 })).toBe(170);
  });

  it("formats weight in each unit system", () => {
    expect(formatWeight(68.04, "us")).toBe("150 lb");
    expect(formatWeight(68.04, "uk")).toBe("10 st 10 lb");
    expect(formatWeight(lbToKg(154), "uk")).toBe("11 st");
    expect(formatWeight(68.04, "metric")).toBe("68 kg");
  });
});
