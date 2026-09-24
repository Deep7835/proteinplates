"use client";

import { useState } from "react";
import { convertFormUnits, type BodyFormState } from "@/lib/calculators/form";
import type { UnitSystem } from "@/lib/calculators/units";

/** Local form state for calculators built on the shared body inputs. */
export function useBodyForm<T extends BodyFormState>(initial: T) {
  const [form, setForm] = useState<T>(initial);
  const set = (patch: Partial<T>) => setForm((f) => ({ ...f, ...patch }));
  const setUnits = (u: UnitSystem) => setForm((f) => convertFormUnits(f, u));
  return { form, set, setUnits };
}
