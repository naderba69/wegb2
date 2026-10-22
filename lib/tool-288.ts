/**
 * 288 — Transient Information — المعلومات العابرة
 * Leahy 2003: spoken transient → provide permanent transcript
 * Level: A1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_288 = {
  id: 288,
  titleDe: "Transient Information",
  titleAr: "المعلومات العابرة",
  family: "طرائق",
  bloom: "فهم",
  level: "A1-B2",
  research: "Leahy 2003",
  desc: "spoken transient → provide permanent transcript",
} as const;

export function tool288Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool288Check(v: number): boolean { return v > 0; }
