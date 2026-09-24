import type { Faq } from "@/lib/seo/jsonld";
import type { Chain } from "@/lib/schema/chain";
import { longDate } from "./format";
import { mealBuilderItems, proteinPer100Cal, rankableItems, summaryPicks } from "./rank";

const sentence = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** 4–5 FAQs written from the chain's own data. Questions without data are skipped. */
export function chainFaqs(chain: Chain): Faq[] {
  const name = chain.chain;
  const picks = summaryPicks(chain);
  const faqs: Faq[] = [];

  if (picks.bestOverall) {
    const i = picks.bestOverall;
    faqs.push({
      question: `What is the highest protein item at ${name}?`,
      answer: `${i.name} has the most protein on our list, with ${i.protein_g} g of protein and ${i.calories} calories.`,
    });
  }
  if (picks.bestLowCal) {
    const i = picks.bestLowCal;
    faqs.push({
      question: `What is the best low-calorie, high-protein option at ${name}?`,
      answer: `${i.name} gives you ${i.protein_g} g of protein for ${i.calories} calories. That’s ${proteinPer100Cal(i)} g of protein per 100 calories.`,
    });
  }
  faqs.push({
    question: `Does ${name} have a high-protein or GLP-1 menu?`,
    answer: chain.glp1_menu_name
      ? `Yes. ${name} offers the “${chain.glp1_menu_name}.” You can also use our GLP-1-friendly picks on this page, which favor smaller portions with more protein and less sugar.`
      : `${name} doesn’t have a labeled GLP-1 or high-protein menu that we know of. Our GLP-1-friendly picks on this page show smaller orders with more protein and less sugar.`,
  });
  const builder = mealBuilderItems(chain);
  if (builder.length > 0) {
    const i = builder[0];
    faqs.push({
      question: `How can I get 40 grams of protein at ${name}?`,
      answer:
        i.protein_g >= 40
          ? `Order ${i.name} (${i.protein_g} g protein). ${sentence(i.custom_order_tip)}`
          : `Start with ${i.name} (${i.protein_g} g protein). ${sentence(i.custom_order_tip)} Add a high-protein side to pass 40 g.`,
    });
  }
  const count = rankableItems(chain).length;
  faqs.push({
    question: `Where does this ${name} nutrition info come from?`,
    answer:
      chain.source_type === "official"
        ? `We use ${name}’s official nutrition information only, and last checked it on ${longDate(chain.data_checked_date)}. We compared ${count} menu items. Menus change, so check the official source before you order if you need exact numbers.`
        : `${name} doesn’t publish full nutrition information, so we used ${chain.source_name}, a third-party source, last checked on ${longDate(chain.data_checked_date)}. We compared ${count} menu items. These numbers may not match what you’re served.`,
  });
  return faqs.slice(0, 5);
}
