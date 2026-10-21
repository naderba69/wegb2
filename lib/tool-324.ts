/**
 * 324 — Idioms — التعابير الاصطلاحية
 * Nunberg 1994: applied to German teaching — classroom integration via tasks
 * Level: B1-B2 | Bloom: فهم | Family: طرائق
 */
export const TOOL_324 = {
  id: 324,
  titleDe: "Idioms",
  titleAr: "التعابير الاصطلاحية",
  family: "طرائق",
  bloom: "فهم",
  level: "B1-B2",
  research: "Nunberg 1994",
  desc: "Idioms applied in classroom",
} as const;
export function tool324Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool324Check(v: number): boolean { return v>0; }
