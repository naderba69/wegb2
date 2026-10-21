/**
 * 325 — Proverbs Sprichwörter — الأمثال
 * Mieder 2004: applied to German teaching — classroom integration via tasks
 * Level: B1-B2 | Bloom: فهم | Family: Narrative
 */
export const TOOL_325 = {
  id: 325,
  titleDe: "Proverbs Sprichwörter",
  titleAr: "الأمثال",
  family: "Narrative",
  bloom: "فهم",
  level: "B1-B2",
  research: "Mieder 2004",
  desc: "Proverbs Sprichwörter applied in classroom",
} as const;
export function tool325Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool325Check(v: number): boolean { return v>0; }
