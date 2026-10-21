/**
 * 307 — Compensation Strategies — التعويضية
 * Oxford 1990: guessing, circumlocution, gesture
 * Level: A2-B2 | Bloom: أنشئ | Family: SLA
 */
export const TOOL_307 = {
  id: 307,
  titleDe: "Compensation Strategies",
  titleAr: "التعويضية",
  family: "SLA",
  bloom: "أنشئ",
  level: "A2-B2",
  research: "Oxford 1990",
  desc: "guessing, circumlocution, gesture",
} as const;

export function tool307Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool307Check(v: number): boolean { return v > 0; }
