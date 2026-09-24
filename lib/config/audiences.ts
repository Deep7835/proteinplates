import type { Goal } from "./protein";
import type { AudienceSlug } from "./site";

// Content for the /for/[audience] hub pages. Chain picks use a rule id from lib/config/goals.ts.

export type AudienceHub = {
  title: string;
  metaTitle: string;
  description: string;
  intro: string[];
  goal: Goal;
  pickRuleId: string;
  pickHeading: string;
  tips: string[];
};

export const AUDIENCE_HUBS: Record<AudienceSlug, AudienceHub> = {
  glp1: {
    title: "Protein on a GLP-1 medication",
    metaTitle: "Protein on Ozempic, Wegovy, Zepbound & Mounjaro: Food Guide",
    description:
      "How much protein to eat on a GLP-1 medicine, easy protein-first meals, and small high-protein orders at popular chains. Food guidance only.",
    intro: [
      "GLP-1 medicines like Ozempic, Wegovy, Zepbound, and Mounjaro can make you feel full fast. That makes it harder to eat enough protein, and protein helps you keep muscle while you lose weight.",
      "This page is about food only. For questions about your medicine, talk to your doctor or care team.",
    ],
    goal: "glp1",
    pickRuleId: "glp1",
    pickHeading: "Smaller, high-protein orders when you eat out",
    tips: [
      "Eat the protein part of your meal first.",
      "Try smaller meals more often, each with a protein food.",
      "Pick foods with lots of protein in a small portion, like Greek yogurt, eggs, fish, chicken, or tofu.",
      "Add strength exercise if your care team says it is safe for you.",
    ],
  },
  gym: {
    title: "Protein for gym-goers",
    metaTitle: "Protein for Muscle Gain: Calculator, Food Guide & Eating Out",
    description:
      "How much protein you need to build muscle, how to spread it through the day, and the highest-protein orders at popular fast food chains.",
    intro: [
      "If you lift weights, protein helps your muscles recover and grow. Research shows gains keep rising up to about 1.6 g of protein per kg of body weight a day, and some experts suggest up to 2.2 g/kg.",
      "Find your number below, then see the best high-protein orders when you are on the go.",
    ],
    goal: "build",
    pickRuleId: "muscle-gain",
    pickHeading: "Highest-protein orders at popular chains",
    tips: [
      "Spread protein across 3 to 5 meals and snacks.",
      "Have a protein-rich meal or snack after your workout.",
      "Double the meat at chains like Chipotle and Subway for a big protein boost.",
      "Most people don’t need shakes. Real food can get you there.",
    ],
  },
  women: {
    title: "Protein for women",
    metaTitle: "How Much Protein Do Women Need? Calculator & Easy Food Guide",
    description:
      "Find how much protein you need as a woman, with easy meals and lower-calorie, high-protein orders at popular restaurant chains.",
    intro: [
      "Many women eat less protein than they need, especially at breakfast. Getting enough helps you feel full, keep muscle, and stay strong as you age.",
      "If you are pregnant or breastfeeding, your needs are different, so ask your doctor or midwife.",
    ],
    goal: "maintain",
    pickRuleId: "under-500",
    pickHeading: "High-protein orders under 500 calories",
    tips: [
      "Add a protein food to breakfast, like eggs, Greek yogurt, or cottage cheese.",
      "Keep easy snacks on hand, like yogurt cups or hard-boiled eggs.",
      "Pair protein with strength exercise to keep muscle.",
    ],
  },
  men: {
    title: "Protein for men",
    metaTitle: "How Much Protein Do Men Need? Calculator & High-Protein Picks",
    description:
      "Find how much protein you need as a man, how to hit your target with real food, and the highest-protein orders at popular chains.",
    intro: [
      "How much protein you need depends on your size, age, and goal, not just on being a man. Bigger and more active people need more.",
      "Use the calculator to find your number, then see easy high-protein picks when you eat out.",
    ],
    goal: "build",
    pickRuleId: "muscle-gain",
    pickHeading: "Highest-protein orders at popular chains",
    tips: [
      "Build every meal around a protein food.",
      "Watch the calories on very large orders if you want to lose fat.",
      "Grilled options often give you more protein for fewer calories.",
    ],
  },
  seniors: {
    title: "Protein after 50",
    metaTitle: "How Much Protein Do You Need After 50? Calculator & Food Guide",
    description:
      "Protein needs rise with age. See how much protein adults 50+ need, easy foods to get it, and lighter high-protein orders at popular chains.",
    intro: [
      "As we age, our bodies use protein less efficiently. Experts on aging recommend at least 1.0 to 1.2 g of protein per kg of body weight a day for older adults, more than the 0.8 g/kg minimum for younger adults.",
      "If you have kidney disease, talk to your doctor before eating more protein.",
    ],
    goal: "aging",
    pickRuleId: "fat-loss",
    pickHeading: "Lighter, high-protein orders at popular chains",
    tips: [
      "Include protein at breakfast, lunch, and dinner, not just dinner.",
      "Soft, easy foods count: eggs, yogurt, cottage cheese, milk, lentil soup, and canned fish.",
      "Stay active, with both walking-type and strength exercise that is safe for you.",
    ],
  },
};
