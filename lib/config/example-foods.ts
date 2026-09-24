// Common US, UK, and Indian foods for the "What this looks like in food" example days.
// Protein values: USDA FoodData Central (https://fdc.nal.usda.gov), SR Legacy unless noted, grams per 100 g,
// checked 2026-09-24. fdcId lets anyone re-check a value at https://fdc.nal.usda.gov/food-details/{fdcId}.
// Portion sizes are ordinary household portions; the label always shows the gram weight used.

export type Food = {
  fdcId: number;
  usdaName: string;
  proteinPer100g: number;
  gramsPerUnit: number;
  /** Label for 1 unit. `{g}` = grams. */
  one: string;
  /** Label for n units. `{n}` = count, `{g}` = grams. */
  many: string;
};

export const FOODS = {
  egg: { fdcId: 171287, usdaName: "Egg, whole, raw, fresh", proteinPer100g: 12.6, gramsPerUnit: 50, one: "1 large egg", many: "{n} large eggs" },
  chicken: { fdcId: 171477, usdaName: "Chicken, broilers or fryers, breast, meat only, cooked, roasted", proteinPer100g: 31, gramsPerUnit: 28.35, one: "1 oz ({g} g) roast chicken breast", many: "{n} oz ({g} g) roast chicken breast" },
  salmon: { fdcId: 175168, usdaName: "Fish, salmon, Atlantic, farmed, cooked, dry heat", proteinPer100g: 22.1, gramsPerUnit: 28.35, one: "1 oz ({g} g) baked salmon", many: "{n} oz ({g} g) baked salmon" },
  beef: { fdcId: 174755, usdaName: "Beef, ground, 93% lean meat / 7% fat, crumbles, cooked, pan-browned", proteinPer100g: 28.9, gramsPerUnit: 28.35, one: "1 oz ({g} g) lean beef mince, cooked", many: "{n} oz ({g} g) lean beef mince, cooked" },
  tuna: { fdcId: 173709, usdaName: "Fish, tuna, light, canned in water, drained solids", proteinPer100g: 19.4, gramsPerUnit: 28.35, one: "1 oz ({g} g) canned tuna in water, drained", many: "{n} oz ({g} g) canned tuna in water, drained" },
  tofu: { fdcId: 172475, usdaName: "Tofu, raw, firm, prepared with calcium sulfate", proteinPer100g: 17.3, gramsPerUnit: 28.35, one: "1 oz ({g} g) firm tofu", many: "{n} oz ({g} g) firm tofu" },
  greekYogurt: { fdcId: 170894, usdaName: "Yogurt, Greek, plain, nonfat", proteinPer100g: 10.2, gramsPerUnit: 113, one: "½ cup ({g} g) plain nonfat Greek yogurt", many: "{n} × ½ cup ({g} g) plain nonfat Greek yogurt" },
  cottageCheese: { fdcId: 172182, usdaName: "Cheese, cottage, lowfat, 2% milkfat", proteinPer100g: 10.4, gramsPerUnit: 113, one: "½ cup ({g} g) cottage cheese", many: "{n} × ½ cup ({g} g) cottage cheese" },
  milk: { fdcId: 171267, usdaName: "Milk, reduced fat, fluid, 2% milkfat", proteinPer100g: 3.3, gramsPerUnit: 244, one: "1 cup ({g} g) 2% / semi-skimmed milk", many: "{n} cups ({g} g) 2% / semi-skimmed milk" },
  cheddar: { fdcId: 173414, usdaName: "Cheese, cheddar", proteinPer100g: 22.9, gramsPerUnit: 28, one: "1 oz ({g} g) cheddar", many: "{n} oz ({g} g) cheddar" },
  lentils: { fdcId: 172421, usdaName: "Lentils, mature seeds, cooked, boiled, without salt", proteinPer100g: 9.02, gramsPerUnit: 99, one: "½ cup ({g} g) cooked lentils", many: "{n} × ½ cup ({g} g) cooked lentils" },
  blackBeans: { fdcId: 173735, usdaName: "Beans, black, mature seeds, cooked, boiled, without salt", proteinPer100g: 8.86, gramsPerUnit: 86, one: "½ cup ({g} g) black beans", many: "{n} × ½ cup ({g} g) black beans" },
  kidneyBeans: { fdcId: 174285, usdaName: "Beans, kidney, red, mature seeds, canned, drained solids", proteinPer100g: 7.98, gramsPerUnit: 130, one: "½ cup ({g} g) kidney beans", many: "{n} × ½ cup ({g} g) kidney beans" },
  bakedBeans: { fdcId: 175182, usdaName: "Beans, baked, canned, plain or vegetarian", proteinPer100g: 4.75, gramsPerUnit: 127, one: "½ cup ({g} g) baked beans", many: "{n} × ½ cup ({g} g) baked beans" },
  edamame: { fdcId: 168411, usdaName: "Edamame, frozen, prepared", proteinPer100g: 11.9, gramsPerUnit: 78, one: "½ cup ({g} g) edamame", many: "{n} × ½ cup ({g} g) edamame" },
  bread: { fdcId: 172688, usdaName: "Bread, whole-wheat, commercially prepared", proteinPer100g: 12.4, gramsPerUnit: 32, one: "1 slice ({g} g) whole-wheat bread", many: "{n} slices ({g} g) whole-wheat bread" },
  tortilla: { fdcId: 167535, usdaName: "Tortillas, ready-to-bake or -fry, flour, shelf stable", proteinPer100g: 8.01, gramsPerUnit: 45, one: "1 flour tortilla ({g} g)", many: "{n} flour tortillas ({g} g)" },
  oats: { fdcId: 173904, usdaName: "Cereals, oats, regular and quick, not fortified, dry", proteinPer100g: 13.2, gramsPerUnit: 40, one: "½ cup ({g} g) oats", many: "{n} × ½ cup ({g} g) oats" },
  rice: { fdcId: 168878, usdaName: "Rice, white, long-grain, regular, enriched, cooked", proteinPer100g: 2.69, gramsPerUnit: 158, one: "1 cup ({g} g) cooked rice", many: "{n} cups ({g} g) cooked rice" },
  potato: { fdcId: 170093, usdaName: "Potatoes, baked, flesh and skin, without salt", proteinPer100g: 2.5, gramsPerUnit: 173, one: "1 medium baked potato ({g} g)", many: "{n} medium baked potatoes ({g} g)" },
  broccoli: { fdcId: 169967, usdaName: "Broccoli, cooked, boiled, drained, without salt", proteinPer100g: 2.38, gramsPerUnit: 156, one: "1 cup ({g} g) broccoli", many: "{n} cups ({g} g) broccoli" },
  spinach: { fdcId: 168462, usdaName: "Spinach, raw", proteinPer100g: 2.86, gramsPerUnit: 30, one: "1 cup ({g} g) spinach", many: "{n} cups ({g} g) spinach" },
  peanutButter: { fdcId: 172470, usdaName: "Peanut butter, smooth style, without salt", proteinPer100g: 22.2, gramsPerUnit: 16, one: "1 tbsp ({g} g) peanut butter", many: "{n} tbsp ({g} g) peanut butter" },
  banana: { fdcId: 173944, usdaName: "Bananas, raw", proteinPer100g: 1.09, gramsPerUnit: 118, one: "1 medium banana", many: "{n} medium bananas" },
  // Indian foods
  paneer: { fdcId: 2705740, usdaName: "Cheese, paneer (FNDDS)", proteinPer100g: 15.86, gramsPerUnit: 50, one: "{g} g paneer", many: "{g} g paneer" },
  roti: { fdcId: 171844, usdaName: "Bread, chapati or roti, plain, commercially prepared", proteinPer100g: 11.2, gramsPerUnit: 40, one: "1 roti ({g} g)", many: "{n} rotis ({g} g)" },
  moongDal: { fdcId: 174257, usdaName: "Mung beans, mature seeds, cooked, boiled, without salt", proteinPer100g: 7.02, gramsPerUnit: 101, one: "½ cup ({g} g) cooked moong dal", many: "{n} × ½ cup ({g} g) cooked moong dal" },
  chickpeas: { fdcId: 173757, usdaName: "Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt", proteinPer100g: 8.86, gramsPerUnit: 82, one: "½ cup ({g} g) cooked chana", many: "{n} × ½ cup ({g} g) cooked chana" },
  chickenCurry: { fdcId: 171478, usdaName: "Chicken, broilers or fryers, breast, meat only, cooked, stewed", proteinPer100g: 29, gramsPerUnit: 28.35, one: "1 oz ({g} g) chicken breast, curried", many: "{n} oz ({g} g) chicken breast, curried" },
  peanuts: { fdcId: 173806, usdaName: "Peanuts, all types, dry-roasted, without salt", proteinPer100g: 24.4, gramsPerUnit: 28, one: "1 oz ({g} g) roasted peanuts", many: "{n} oz ({g} g) roasted peanuts" },
  blueberries: { fdcId: 171711, usdaName: "Blueberries, raw", proteinPer100g: 0.74, gramsPerUnit: 74, one: "½ cup ({g} g) blueberries", many: "{n} × ½ cup ({g} g) blueberries" },
} as const satisfies Record<string, Food>;

export type FoodId = keyof typeof FOODS;

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export type MealTemplate = {
  slot: MealSlot;
  name: string;
  /** The protein food whose amount is scaled to hit the target. */
  main: { food: FoodId; minUnits: number; maxUnits: number };
  /** Fixed extras. */
  sides: { food: FoodId; units: number }[];
};

export type DayTemplate = { title: string; meals: MealTemplate[] };

// Example days. With 3 meals a day the snack is skipped.
export const EXAMPLE_DAYS: DayTemplate[] = [
  {
    title: "Classic day",
    meals: [
      { slot: "breakfast", name: "Eggs on toast", main: { food: "egg", minUnits: 1, maxUnits: 6 }, sides: [{ food: "bread", units: 2 }] },
      { slot: "lunch", name: "Chicken wrap", main: { food: "chicken", minUnits: 2, maxUnits: 10 }, sides: [{ food: "tortilla", units: 1 }, { food: "spinach", units: 1 }] },
      { slot: "dinner", name: "Salmon, rice, and broccoli", main: { food: "salmon", minUnits: 2, maxUnits: 10 }, sides: [{ food: "rice", units: 1 }, { food: "broccoli", units: 1 }] },
      { slot: "snack", name: "Greek yogurt and berries", main: { food: "greekYogurt", minUnits: 1, maxUnits: 4 }, sides: [{ food: "blueberries", units: 1 }] },
    ],
  },
  {
    title: "Quick and easy day",
    meals: [
      { slot: "breakfast", name: "Greek yogurt and berries", main: { food: "greekYogurt", minUnits: 1, maxUnits: 4 }, sides: [{ food: "blueberries", units: 1 }] },
      { slot: "lunch", name: "Tuna sandwich", main: { food: "tuna", minUnits: 2, maxUnits: 10 }, sides: [{ food: "bread", units: 2 }] },
      { slot: "dinner", name: "Beef and bean chili", main: { food: "beef", minUnits: 2, maxUnits: 10 }, sides: [{ food: "kidneyBeans", units: 1 }] },
      { slot: "snack", name: "Cottage cheese", main: { food: "cottageCheese", minUnits: 1, maxUnits: 3 }, sides: [] },
    ],
  },
  {
    title: "Vegetarian day",
    meals: [
      { slot: "breakfast", name: "Cheesy scrambled eggs on toast", main: { food: "egg", minUnits: 1, maxUnits: 6 }, sides: [{ food: "cheddar", units: 1 }, { food: "bread", units: 1 }] },
      { slot: "lunch", name: "Tofu and spinach rice bowl", main: { food: "tofu", minUnits: 2, maxUnits: 16 }, sides: [{ food: "rice", units: 1 }, { food: "spinach", units: 1 }] },
      { slot: "dinner", name: "Baked potato with cottage cheese and beans", main: { food: "cottageCheese", minUnits: 1, maxUnits: 4 }, sides: [{ food: "potato", units: 1 }, { food: "bakedBeans", units: 1 }] },
      { slot: "snack", name: "Greek yogurt with peanut butter", main: { food: "greekYogurt", minUnits: 1, maxUnits: 4 }, sides: [{ food: "peanutButter", units: 1 }] },
    ],
  },
  {
    title: "Indian day",
    meals: [
      { slot: "breakfast", name: "Egg bhurji with roti", main: { food: "egg", minUnits: 1, maxUnits: 6 }, sides: [{ food: "roti", units: 1 }] },
      { slot: "lunch", name: "Chicken curry with rice", main: { food: "chickenCurry", minUnits: 2, maxUnits: 10 }, sides: [{ food: "rice", units: 1 }] },
      { slot: "dinner", name: "Paneer tikka with moong dal", main: { food: "paneer", minUnits: 1, maxUnits: 5 }, sides: [{ food: "moongDal", units: 1 }] },
      { slot: "snack", name: "Hung curd with roasted peanuts", main: { food: "greekYogurt", minUnits: 1, maxUnits: 4 }, sides: [{ food: "peanuts", units: 1 }] },
    ],
  },
];
