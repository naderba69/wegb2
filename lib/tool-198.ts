/**
 * 198 — Fehlerhafte Generierung — التوليد الخاطئ المفيد
 * Family: تقويم | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_198 = {
  id: 198,
  titleDe: "Fehlerhafte Generierung",
  titleAr: "التوليد الخاطئ المفيد",
  family: "تقويم",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Potts 2014",
  gain: "error + feedback > study",
} as const;

export function errorfulGain(attempted: boolean, feedbackGiven: boolean): number {
  if (attempted && feedbackGiven) return 1.3;
  if (attempted) return 1.1;
  return 1.0;
}
export function shouldAllowError(level: string): boolean {
  return level === "B1" || level === "B2";
}
