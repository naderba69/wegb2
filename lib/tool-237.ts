/**
 * 237 — Diagnostisches Assessment — التقويم التشخيصي
 * Family: تقويم | Bloom: قيّم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_237 = {
  id: 237,
  titleDe: "Diagnostisches Assessment",
  titleAr: "التقويم التشخيصي",
  family: "تقويم",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Hughes 2003",
  when: "vor Kurs, vor Modul",
} as const;

export function diagnosticAreas(): string[] { return ["Hören","Lesen","Schreiben","Sprechen","Grammatik","Wortschatz"]; }
export function needsDiagnostic(score: number): boolean { return score < 0.6; }
