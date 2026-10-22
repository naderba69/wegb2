/**
 * 237 — Diagnostic Assessment — التقويم التشخيصي
 * Hughes 2003: identify strengths/weaknesses before course → personalize path
 * Level: A0-B2 | Bloom: قيّم | Family: تقويم
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
