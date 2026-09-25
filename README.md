# ProteinPlates

**Hit your protein target, even when eating out.**

A static SEO site for US, UK, and Indian readers:
- protein, TDEE, macro, and BMI calculators
- high-protein picks at restaurant chains, built from JSON data
- MDX guides
- audience hubs for GLP-1 users, gym-goers, women, men, and adults 50+

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Zod, and MDX. Every page is generated at build time. There is no database.

---

## 1. Setup

You need Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local    # then edit the values
npm run dev                   # http://localhost:3000
```

### Environment variables

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live domain, with no trailing slash (e.g. `https://proteinplates.com`). Used for canonical URLs, the sitemap, share images, and JSON-LD. |
| `NEXT_PUBLIC_ADS_ENABLED` | Set to `true` to show the reserved ad slots. Leave it unset or `false` to hide them. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Optional. Your Umami Cloud website ID. Turns on Umami analytics (cookie-free, with UTM/campaign reports). |
| `NEXT_PUBLIC_UMAMI_SCRIPT_URL` | Optional. Only if you self-host Umami; defaults to `https://cloud.umami.is/script.js`. |

The site name, tagline, contact email, and navigation are all set in [`lib/config/site.ts`](lib/config/site.ts).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local dev server. Edits to data files show up right away. |
| `npm run build` | Runs `validate-data` first, then builds the site. **The build fails if any data file is invalid.** |
| `npm run start` | Serves the production build. |
| `npm run test` | Runs the calculator and ranking tests (Vitest). |
| `npm run validate-data` | Checks every chain JSON file with Zod. Lists null fields, stale files (checked more than 60 days ago), likely typos, and missing TODO rows. |
| `npm run new-chain -- --slug=xyz` | Creates `data/chains/xyz.json` from the template, pre-filled from `data/chain-list.csv`. |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint checks. |

---

## 2. Deploy to Vercel (free tier)

1. Push this folder to a GitHub repo.
2. In Vercel, click **Add New → Project** and import the repo. Vercel detects Next.js automatically.
3. Under **Environment Variables**, add `NEXT_PUBLIC_SITE_URL` (your real domain).
4. Click **Deploy**.
5. Add your domain under **Settings → Domains**.

From then on, every push to `main` deploys automatically. If a data file is broken, the build fails and the live site stays on the last good version.

After the first deploy, submit `https://your-domain/sitemap.xml` in Google Search Console.

---

## 3. Add a new chain (about 20 a month)

1. **Add a row** to [`data/chain-list.csv`](data/chain-list.csv): `chain,slug,country,category,official_nutrition_url,priority`.
   - `country` is `US`, `UK`, or `IN`.
   - `category` must be one of the values in `CHAIN_CATEGORIES` in [`lib/schema/chain.ts`](lib/schema/chain.ts). Add a new category there first if you need one.
   - `priority` is 1 to 3. Priority 1 chains show first on the home page and in the calculator's "Eating out?" links.
2. **Create the file:**
   ```bash
   npm run new-chain -- --slug=xyz
   ```
3. **Fill in `data/chains/xyz.json`** from the chain's official nutrition page or PDF. Follow the data rules in section 6.
4. **Validate:**
   ```bash
   npm run validate-data
   ```
   Fix every error. For each field you left `null`, add a row to [`data/TODO-verify.csv`](data/TODO-verify.csv) (`chain,item,field,reason`).
5. **Preview** with `npm run dev` at `/chains/xyz`. Restart `npm run dev` after adding a **new** chain file, since the list of chain pages is read at start-up. Edits to existing files show up right away.
6. **Commit and push.** Vercel builds and deploys.

### Chain JSON fields

| Field | Notes |
|---|---|
| `chain`, `slug` | Display name and URL slug. The slug must match the file name. |
| `country` | `["US"]`, `["UK"]`, `["IN"]`, or more than one. |
| `category` | One value from `CHAIN_CATEGORIES`. |
| `official_nutrition_url` | The exact page or PDF you used (https). |
| `data_checked_date` | `YYYY-MM-DD`, the day you checked the source. The page H1 uses its month. |
| `intro_notes` | 2 or 3 plain sentences shown under the H1. |
| `glp1_menu_name` | The exact name of a labeled GLP-1 or high-protein menu, or `null`. |
| `reviewed_by` | A registered dietitian's name once reviewed, or `null` (the "Reviewed by" line is then hidden). |
| `source_type` | Optional. `"official"` (default) or `"third_party"`. |
| `source_name` | Required when `source_type` is `"third_party"`. The chain page then shows a clear third-party notice. |
| `items[]` | `name`, `category`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `fiber_g`, `sugar_g`, `sodium_mg` (number or `null`), optional `price`, and `custom_order_tip` (text, or `""`). |

Prices use local currency: GBP for UK-only chains, INR for India-only chains, and USD otherwise. India shows protein per ₹100.

---

## 4. Update data when a menu changes

1. Open the chain's official source again.
2. Update, add, or remove items in `data/chains/<slug>.json`.
3. Set `data_checked_date` to today. The H1 month, "Last updated", and sitemap date update on their own.
4. Remove any `TODO-verify.csv` rows you resolved.
5. Run `npm run validate-data`, then commit and push.

`validate-data` warns you when a file is more than 60 days old.

---

## 5. Add a guide

1. Create `content/articles/<slug>.mdx`. Copy the frontmatter from an existing guide:
   ```yaml
   title: "..."
   description: "50–170 characters, used as the meta description"
   date: "YYYY-MM-DD"
   updated: "YYYY-MM-DD"
   author: "..."
   reviewedBy: null            # or a name
   tags: ["..."]
   audience: glp1              # or a list: [gym, men]  (glp1 | gym | women | men | seniors)
   keyTakeaways: ["...", "..."]
   faqs:
     - question: "..."
       answer: "..."
   sources:
     - label: "..."
       url: "https://pubmed.ncbi.nlm.nih.gov/..."
   relatedChains: ["chipotle", "subway"]
   image:                      # required cover photo
     src: "/images/guides/<slug>.jpg"               # file in public/images/guides
     alt: "Describe what the photo actually shows"
     credit: "Photographer name"
     creditUrl: "https://unsplash.com/@username"
     sourceUrl: "https://unsplash.com/photos/<photo-id>"
   ```
   **Cover photos:** pick a free photo on [unsplash.com](https://unsplash.com) (not an "Unsplash+" one). Avoid recognizable faces and visible brand logos. Download it at 1600×900 and save it as `public/images/guides/<slug>.jpg`. One way: copy the photo's `images.unsplash.com/photo-...` address and add `?w=1600&h=900&fit=crop&q=80&fm=jpg` to the end. Next.js serves it resized as AVIF/WebP, and it doubles as the guide's social share image. Write your own alt text; Unsplash's descriptions are often wrong. The build fails if the file is missing. Every build also runs `npm run images`, which makes the small blurred preview shown while the photo loads (saved in `lib/images/placeholders.json`).
2. Write the body in Markdown. Use `##` and `###` headings, which build the table of contents automatically. You can use GFM tables and `<Callout title="...">...</Callout>`.
3. The guide shows up automatically on `/guides`, the matching `/for/<audience>` hub, the home page, and the sitemap.

Invalid frontmatter fails the build.

---

## 6. Data rules (important)

- **Never invent or estimate a number.** Use the chain's official nutrition page, PDF, or app first.
- If a chain publishes no nutrition data at all, a third-party source that lists the chain's numbers may be used. Mark it with `"source_type": "third_party"` and `source_name`, and the page will say so. Never use user-entered food-log databases or "approximate" values.
- A number you can't verify stays `null`. Add a row to `data/TODO-verify.csv` for it.
- Items with `null` protein or calories are **never ranked**.
- The only conversions allowed:
  - UK salt to sodium: `sodium_mg = salt_g / 2.5 × 1000`
  - per-100 g values to per portion, when the source gives the portion weight
- Use single-person portions. Leave out family meals, trays, and sharing boxes.

---

## 7. Where things live

```
app/                  Pages (App Router). sitemap.ts, robots.ts, opengraph-image.tsx
components/           UI: layout/, ui/, calculators/, chains/, guides/, seo/, monetization/
lib/calculators/      Pure calculator functions and their tests (no React). Reuse these for saved plans later.
lib/config/           Everything you might want to tweak:
  protein.ts          g/kg multipliers, with the source for each
  calories.ts         activity factors, goal calorie changes, macro styles
  goals.ts            "Best orders by goal", summary card, and GLP-1 rules
  example-foods.ts    USDA foods and the example days
  audiences.ts        /for/* hub content
  site.ts             name, URL, navigation
lib/chains/           Chain loading, validation, ranking, FAQs
lib/guides/           Guide loading and table of contents
lib/schema/           Zod schemas for chain JSON and guide frontmatter
lib/search/           Site search: index builder (served at /search-index.json) and matcher
public/images/        Photos (home hero, guide covers), all free Unsplash license, credited on the page
data/chains/          One JSON file per chain
data/chain-list.csv   Master list of chains to cover
data/TODO-verify.csv  Values still to verify
content/articles/     MDX guides
scripts/              validate-data.ts, new-chain.ts
```

### Search, dark mode, and print

- **Search** (`/search`): the index is built at build time from calculator pages, guides, chains (including item names), and hubs, and served as a static `/search-index.json`. Matching runs in the browser. Every word must match; titles weigh most. The page is `noindex`. New content shows up automatically on the next build.
- **Dark mode**: the header button switches themes and saves the choice in `localStorage`. With no saved choice, the site follows the device setting. Colors are the same token names in `app/globals.css`, with dark values under `[data-theme="dark"]`. Use the `dark:` variant only when a token can't do the job.
- **Print**: printouts are always light and hide the footer, ads, share buttons, back-to-top, and related links (`print:hidden`). FAQs open before printing.

### Analytics, security headers, and legal pages

- **Analytics (no cookies, so no cookie banner):** Vercel Web Analytics is built in. Turn it on in the Vercel dashboard under Project → Analytics. The free plan shows page views, referrers, countries, and devices (50,000 events a month). For UTM/campaign reports for free, create a site on [Umami Cloud](https://umami.is) and set `NEXT_PUBLIC_UMAMI_WEBSITE_ID`. Links copied with a calculator's "Copy link" button carry `utm_source=share&utm_medium=copied-link`. Tag your own campaign links the same way, e.g. `?utm_source=instagram&utm_medium=social&utm_campaign=launch`.
- **Security headers** (HSTS, no framing, nosniff, referrer and permissions policies) are set in `next.config.ts`.
- **Legal pages:** `/privacy` and `/terms` are templates. Have them reviewed before launch, and update them before you add ads, accounts, payments, or anything that uses cookies (that is also when you'd need a cookie banner).

### Monetization placeholders

- `<AdSlot position="after-intro | mid-content | end-content">` is already on chain and guide pages. It renders nothing unless `NEXT_PUBLIC_ADS_ENABLED=true`. It has a fixed height, so it causes no layout shift.
- `<AffiliateBox product reason href />` shows a labeled affiliate link with `rel="sponsored nofollow"`.
- `<PlanCTA />` links to `/meal-plan`, a landing page with a disabled form. There are no payments yet.

### Adding login, payments, or saved plans later

All the calculator math is pure functions in `lib/calculators` (for example, `calculateProteinPlan(profile)`). An API route or server action can reuse them as they are. The share URL format lives in `lib/calculators/form.ts`.

---

*Content is for education only and is not medical advice. See `/medical-disclaimer`.*
