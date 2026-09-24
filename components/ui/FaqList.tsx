import type { Faq } from "@/lib/seo/jsonld";

/** Visible FAQ list. Pair with faqLd(faqs) so the JSON-LD matches the page text exactly. */
export function FaqList({ faqs, title = "Frequently asked questions" }: { faqs: Faq[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title">
      <h2 id="faq-title" className="text-2xl">{title}</h2>
      <div className="mt-4 divide-y divide-line rounded-card border border-line">
        {faqs.map((f) => (
          <details key={f.question} className="group p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{f.question}</h3>
              <span aria-hidden className="text-xl text-brand-700 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
