import Link from "next/link";
import { Callout } from "./Callout";

export const MEDICAL_DISCLAIMER =
  "Not medical advice. If you have kidney disease, diabetes, or take prescription medication, talk to your doctor or a registered dietitian before changing your protein intake.";

/** The one required disclaimer. Used under every calculator result and at the bottom of chain pages. */
export function Disclaimer() {
  return (
    <Callout tone="warn">
      {MEDICAL_DISCLAIMER}{" "}
      <Link href="/medical-disclaimer" className="font-medium text-warn-800 underline">
        Read our full disclaimer
      </Link>
      .
    </Callout>
  );
}
