import { describe, expect, it } from "vitest";
import { DEFAULT_FORM, convertFormUnits, convertLength, formFromSearchParams, formToProfile, formToSearchParams, type ProteinFormState } from "./form";

describe("protein form", () => {
  it("round-trips through the share URL", () => {
    const f: ProteinFormState = { ...DEFAULT_FORM, units: "uk", sex: "male", age: "52", weight: "12", weight2: "3", height: "5", height2: "11", activity: "moderate", goal: "glp1", meals: 4 };
    const qs = formToSearchParams(f).toString();
    expect(qs).toBe("units=uk&sex=m&age=52&w=12&w2=3&h=5&h2=11&act=moderate&goal=glp1&meals=4");
    expect(formFromSearchParams(new URLSearchParams(qs))).toEqual(f);
  });

  it("ignores junk values in the URL", () => {
    const f = formFromSearchParams(new URLSearchParams("units=xx&age=<script>&goal=hack&meals=9&w=150"));
    expect(f).toMatchObject({ units: "us", age: DEFAULT_FORM.age, goal: DEFAULT_FORM.goal, meals: 3, weight: "150" });
  });

  it("returns null when the URL has no calculator params", () => {
    expect(formFromSearchParams(new URLSearchParams("utm_source=x"))).toBeNull();
  });

  it("converts the default form to a valid profile", () => {
    const r = formToProfile(DEFAULT_FORM);
    expect(r.ok).toBe(true);
  });

  it("reports errors for missing values", () => {
    const r = formToProfile({ ...DEFAULT_FORM, weight: "" });
    expect(r).toMatchObject({ ok: false, errors: { weight: expect.any(String) } });
  });

  it("converts tape measurements between inches and cm", () => {
    expect(convertLength("13", "us", "metric")).toBe("33");
    expect(convertLength("33", "metric", "uk")).toBe("13");
    expect(convertLength("30", "us", "uk")).toBe("30");
  });

  it("keeps the same body size when switching units", () => {
    const uk = convertFormUnits({ ...DEFAULT_FORM, weight: "165", height: "5", height2: "5" }, "uk");
    expect(uk).toMatchObject({ weight: "11", weight2: "11", height: "5", height2: "5" });
    const metric = convertFormUnits(uk, "metric");
    expect(metric).toMatchObject({ weight: "75", height: "165" });
  });
});
