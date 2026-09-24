// ALL protein multipliers live here. Values are grams of protein per kg of body weight per day.
// Every value cites its source. Items marked "VERIFY" are editorial choices waiting for sign-off.

export const GOALS = ["lose", "maintain", "build", "glp1", "aging"] as const;
export type Goal = (typeof GOALS)[number];

export const GOAL_LABELS: Record<Goal, string> = {
  lose: "Lose fat",
  maintain: "Maintain weight",
  build: "Build muscle",
  glp1: "On a GLP-1 medication",
  aging: "Healthy aging (50+)",
};

export type GramsPerKgRange = { min: number; max: number };

export const PROTEIN_G_PER_KG: Record<Goal, GramsPerKgRange> = {
  // min 0.8 = RDA for adults (Institute of Medicine DRI, 2005).
  // max 1.2 = VERIFY: editorial upper bound for a general adult, not from a single source.
  maintain: { min: 0.8, max: 1.2 },

  // 1.6–2.2: Morton et al., Br J Sports Med 2018 (PMID 28698222). Gains in lean mass plateau at
  // ~1.6 g/kg/day; the paper suggests ~2.2 g/kg/day (upper 95% CI) to maximize gains.
  // ISSN position stand (Jäger 2017, PMID 28642676) gives 1.4–2.0 for most exercising people.
  build: { min: 1.6, max: 2.2 },

  // 1.6–2.2: same sources as "build". ISSN (PMID 28642676) notes higher intakes help keep lean
  // mass during a calorie deficit.
  lose: { min: 1.6, max: 2.2 },

  // 1.2–1.6: joint advisory on nutrition with GLP-1 therapy (Mozaffarian et al., Obesity 2025,
  // PMID 40445127): "1.2–1.6 g/kg body weight/day ... proposed during active weight reduction".
  // The same paper warns that actual weight can overestimate needs in obesity (see reference weight).
  glp1: { min: 1.2, max: 1.6 },

  // 1.0–1.2: PROT-AGE Study Group (Bauer et al., JAMDA 2013, PMID 23867520).
  // Note: PROT-AGE targets adults over 65. We apply it from 50+ per the site brief (VERIFY).
  aging: { min: 1.0, max: 1.2 },
};

// Adults at or above this age never get a minimum below OLDER_ADULT_MIN_G_PER_KG (PROT-AGE, above).
export const OLDER_ADULT_AGE = 50;
export const OLDER_ADULT_MIN_G_PER_KG = 1.0;

// Reference weight: above this BMI, protein is based on the weight at REFERENCE_BMI for the
// person's height, because body fat does not raise protein needs (Mozaffarian 2025, above).
// Threshold is 30 (obesity) so muscular people with a BMI of 25–30 keep their real weight.
// REFERENCE_BMI equals the threshold so the target never jumps down at BMI 30 (decided 2026-09-24).
export const REFERENCE_WEIGHT_BMI_THRESHOLD = 30;
export const REFERENCE_BMI = 30;

// Daily targets are rounded to this many grams for a friendlier display.
export const ROUND_DAILY_TARGET_TO_G = 5;

export const PROTEIN_SOURCES = [
  {
    label:
      "Institute of Medicine. Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. National Academies Press, 2005.",
    url: "https://doi.org/10.17226/10490",
  },
  {
    label:
      "Bauer J, et al. Evidence-based recommendations for optimal dietary protein intake in older people: a position paper from the PROT-AGE Study Group. J Am Med Dir Assoc. 2013.",
    url: "https://pubmed.ncbi.nlm.nih.gov/23867520/",
  },
  {
    label: "Jäger R, et al. International Society of Sports Nutrition Position Stand: protein and exercise. J Int Soc Sports Nutr. 2017.",
    url: "https://pubmed.ncbi.nlm.nih.gov/28642676/",
  },
  {
    label:
      "Morton RW, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. Br J Sports Med. 2018.",
    url: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
  },
  {
    label:
      "Mozaffarian D, et al. Nutritional priorities to support GLP-1 therapy for obesity: a joint Advisory from ACLM, ASN, OMA, and TOS. Obesity. 2025.",
    url: "https://pubmed.ncbi.nlm.nih.gov/40445127/",
  },
  {
    label:
      "Mifflin MD, et al. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990.",
    url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
  },
] as const;
