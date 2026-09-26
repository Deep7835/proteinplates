// Site-wide settings. Change the name and URL here (URL comes from NEXT_PUBLIC_SITE_URL).

export const site = {
  name: "Protein Per Meal",
  tagline: "Hit your protein target, even when eating out.",
  description:
    "Free protein calculator and high-protein picks at popular US, UK, and Indian restaurant chains. Simple, sourced nutrition info for gym-goers, GLP-1 users, and adults 50+.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, ""),
  locale: "en_US",
  contactEmail: "hello@example.com",
  // Used as lastModified in the sitemap for static pages (about, policies, etc.).
  staticPagesUpdated: "2026-09-25",
} as const;

export type NavLink = { href: string; label: string };

export const mainNav: NavLink[] = [
  { href: "/protein-calculator", label: "Protein Calculator" },
  { href: "/calculators", label: "Calculators" },
  { href: "/chains", label: "Restaurant Chains" },
  { href: "/guides", label: "Guides" },
  { href: "/for/glp1", label: "GLP-1" },
  { href: "/for/seniors", label: "50+" },
];

/** Footer shortlist. The full list lives on /calculators (built from content/calculators). */
export const calculatorLinks: NavLink[] = [
  { href: "/protein-calculator", label: "Protein Calculator" },
  { href: "/calorie-calculator", label: "Calorie Calculator" },
  { href: "/macro-calculator", label: "Macro Calculator" },
  { href: "/tdee-calculator", label: "TDEE Calculator" },
  { href: "/calculators", label: "All calculators" },
];

export const audiences = [
  { slug: "glp1", label: "On a GLP-1 medication", short: "GLP-1" },
  { slug: "gym", label: "Gym-goers", short: "Gym" },
  { slug: "women", label: "Women", short: "Women" },
  { slug: "men", label: "Men", short: "Men" },
  { slug: "seniors", label: "Adults 50+", short: "50+" },
] as const;

export type AudienceSlug = (typeof audiences)[number]["slug"];

export const footerLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/medical-disclaimer", label: "Medical Disclaimer" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
];
