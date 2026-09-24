import type { ReactNode } from "react";
import type { NavLink } from "@/lib/config/site";
import { BmiCalculator } from "./BmiCalculator";
import { MacroCalculator } from "./MacroCalculator";
import type { CalcPreset } from "./presets";
import { ProteinCalculator } from "./ProteinCalculator";
import { TdeeCalculator } from "./TdeeCalculator";
import { BmrCalculator } from "./tools/BmrCalculator";
import { BodyFatCalculator } from "./tools/BodyFatCalculator";
import { CalorieCalculator } from "./tools/CalorieCalculator";
import { CalorieDeficitCalculator } from "./tools/CalorieDeficitCalculator";
import { CaloriesBurnedCalculator } from "./tools/CaloriesBurnedCalculator";
import { FfmiCalculator } from "./tools/FfmiCalculator";
import { IdealWeightCalculator } from "./tools/IdealWeightCalculator";
import { LeanBodyMassCalculator } from "./tools/LeanBodyMassCalculator";
import { CarbCalculator, FiberCalculator, KetoCalculator, SugarIntakeCalculator } from "./tools/NutrientTargetsCalculator";
import { WaistToHeightCalculator } from "./tools/WaistToHeightCalculator";
import { WaistToHipCalculator } from "./tools/WaistToHipCalculator";
import { WaterIntakeCalculator } from "./tools/WaterIntakeCalculator";
import { WeightLossPercentCalculator } from "./tools/WeightLossPercentCalculator";

type RenderProps = { preset?: CalcPreset; chainLinks: NavLink[]; isMainPage: boolean };

/**
 * Every calculator, by URL slug. Page text lives in content/calculators/{slug}.mdx.
 * To add a calculator: build the component, add it here, and add its .mdx file.
 */
export const CALCULATORS: Record<string, (p: RenderProps) => ReactNode> = {
  "protein-calculator": ({ preset, chainLinks, isMainPage }) => <ProteinCalculator preset={preset} syncUrl={isMainPage} chainLinks={chainLinks} />,
  "macro-calculator": ({ preset }) => <MacroCalculator preset={preset} />,
  "tdee-calculator": ({ preset }) => <TdeeCalculator preset={preset} />,
  "calorie-calculator": ({ preset }) => <CalorieCalculator preset={preset} />,
  "calorie-deficit-calculator": ({ preset }) => <CalorieDeficitCalculator preset={preset} />,
  "bmr-calculator": ({ preset }) => <BmrCalculator preset={preset} />,
  "bmi-calculator": ({ preset }) => <BmiCalculator preset={preset} />,
  "body-fat-calculator": ({ preset }) => <BodyFatCalculator preset={preset} />,
  "ideal-weight-calculator": ({ preset }) => <IdealWeightCalculator preset={preset} />,
  "lean-body-mass-calculator": ({ preset }) => <LeanBodyMassCalculator preset={preset} />,
  "ffmi-calculator": ({ preset }) => <FfmiCalculator preset={preset} />,
  "waist-to-height-ratio-calculator": ({ preset }) => <WaistToHeightCalculator preset={preset} />,
  "waist-to-hip-ratio-calculator": ({ preset }) => <WaistToHipCalculator preset={preset} />,
  "weight-loss-percentage-calculator": ({ preset }) => <WeightLossPercentCalculator preset={preset} />,
  "water-intake-calculator": ({ preset }) => <WaterIntakeCalculator preset={preset} />,
  "fiber-calculator": ({ preset }) => <FiberCalculator preset={preset} />,
  "carb-calculator": ({ preset }) => <CarbCalculator preset={preset} />,
  "keto-calculator": ({ preset }) => <KetoCalculator preset={preset} />,
  "sugar-intake-calculator": ({ preset }) => <SugarIntakeCalculator preset={preset} />,
  "calories-burned-calculator": ({ preset }) => <CaloriesBurnedCalculator preset={preset} />,
};
