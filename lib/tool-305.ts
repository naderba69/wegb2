/**
 * 305 — Cognitive Strategies — المعرفية
 * O Malley 1990: repetition, resourcing, translation
 * Level: A1-B2 | Bloom: طبّق | Family: SLA
 */
export const TOOL_305 = {
  id: 305,
  titleDe: "Cognitive Strategies",
  titleAr: "المعرفية",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "O Malley 1990",
  desc: "repetition, resourcing, translation",
} as const;

export function tool305Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool305Check(v: number): boolean { return v > 0; }
