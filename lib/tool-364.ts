/**
 * 364 — Differentiation — التمايز الفردي
 * Tomlinson 2001: classroom-ready application with tasks
 * Level: A0-B2 | Bloom: أنشئ | Family: طرائق
 */
export const TOOL_364 = {
  id: 364,
  titleDe: "Differentiation",
  titleAr: "التمايز الفردي",
  family: "طرائق",
  bloom: "أنشئ",
  level: "A0-B2",
  research: "Tomlinson 2001",
  desc: "Differentiation classroom application",
} as const;
export function tool364Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool364Check(v: number): boolean { return v>0; }
