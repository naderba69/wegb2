/**
 * 294 — Self-Efficacy — الكفاءة الذاتية
 * Bandura 1977: mastery experiences → strongest efficacy source
 * Level: A0-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_294 = {
  id: 294,
  titleDe: "Self-Efficacy",
  titleAr: "الكفاءة الذاتية",
  family: "تلقين",
  bloom: "قيّم",
  level: "A0-B2",
  research: "Bandura 1977",
  desc: "mastery experiences → strongest efficacy source",
} as const;

export function tool294Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool294Check(v: number): boolean { return v > 0; }
