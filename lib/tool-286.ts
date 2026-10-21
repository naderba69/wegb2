/**
 * 286 — Isolated Elements — العناصر المعزولة
 * Pollock 2002: teach elements separately then combine
 * Level: A1-B2 | Bloom: حلّل | Family: طرائق
 */
export const TOOL_286 = {
  id: 286,
  titleDe: "Isolated Elements",
  titleAr: "العناصر المعزولة",
  family: "طرائق",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Pollock 2002",
  desc: "teach elements separately then combine",
} as const;

export function tool286Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool286Check(v: number): boolean { return v > 0; }
