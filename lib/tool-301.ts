/**
 * 301 — Language Anxiety — قلق اللغة
 * Horwitz 1986: communication apprehension, test anxiety, fear
 * Level: A0-B2 | Bloom: حلّل | Family: SLA
 */
export const TOOL_301 = {
  id: 301,
  titleDe: "Language Anxiety",
  titleAr: "قلق اللغة",
  family: "SLA",
  bloom: "حلّل",
  level: "A0-B2",
  research: "Horwitz 1986",
  desc: "communication apprehension, test anxiety, fear",
} as const;

export function tool301Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool301Check(v: number): boolean { return v > 0; }
