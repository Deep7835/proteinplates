import { ProsePage } from "@/components/layout/Prose";
import { MEDICAL_DISCLAIMER } from "@/components/ui/Disclaimer";
import { site } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Medical Disclaimer",
  description: `${site.name} provides general nutrition information for education only. It is not medical advice.`,
  path: "/medical-disclaimer",
});

export default function MedicalDisclaimerPage() {
  return (
    <ProsePage title="Medical disclaimer" path="/medical-disclaimer" updated={site.staticPagesUpdated}>
      <p>
        <strong>{MEDICAL_DISCLAIMER}</strong>
      </p>
      <p>
        Everything on {site.name}, including our calculators, restaurant guides, and articles, is for general
        education only. It is not medical, nutrition, or diet advice for you as a person, and it does not replace
        advice from your doctor, registered dietitian, or other qualified health professional.
      </p>
      <h2>Calculators give estimates</h2>
      <p>
        Our calculators use published equations and research-based ranges. Your real needs can be different
        because of your health, medicines, activity, and other factors.
      </p>
      <h2>GLP-1 medicines</h2>
      <p>
        Our content about GLP-1 medicines (such as Ozempic, Wegovy, Zepbound, and Mounjaro) covers food choices only.
        We do not give advice about doses, injections, or side effects. Ask your prescriber or care team about your
        medicine.
      </p>
      <h2>When to talk to a professional first</h2>
      <ul>
        <li>You have kidney disease, liver disease, diabetes, or another long-term condition.</li>
        <li>You take prescription medicine.</li>
        <li>You are pregnant or breastfeeding.</li>
        <li>You have, or have had, an eating disorder.</li>
        <li>You are under 18.</li>
      </ul>
      <h2>Restaurant data</h2>
      <p>
        Restaurant nutrition comes from each chain’s published information and may change without notice. Portion
        sizes and recipes vary by location. Check with the restaurant if you need exact numbers, for example because
        of an allergy.
      </p>
      <p>If you think you have a medical emergency, call your local emergency number right away.</p>
    </ProsePage>
  );
}
