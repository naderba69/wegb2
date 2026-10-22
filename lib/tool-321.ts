/**
 * 321 — Phraseology — علم العبارات
 * Cowie 1998: applied to German teaching — classroom integration via tasks
 * Level: A2-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_321 = {
  id: 321,
  titleDe: "Phraseology",
  titleAr: "علم العبارات",
  family: "طرائق",
  bloom: "فهم",
  level: "A2-B2",
  research: "Cowie 1998",
  desc: "Phraseology applied in classroom",
} as const;
export function tool321Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool321Check(v: number): boolean { return v>0; }
