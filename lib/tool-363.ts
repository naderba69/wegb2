/**
 * 363 — Scaffolding ZPD Advanced — السقالات المتقدمة
 * Wood 1976: classroom-ready application with tasks
 * Level: A0-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_363 = {
  id: 363,
  titleDe: "Scaffolding ZPD Advanced",
  titleAr: "السقالات المتقدمة",
  family: "طرائق",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Wood 1976",
  desc: "Scaffolding ZPD Advanced classroom application",
} as const;
export function tool363Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool363Check(v: number): boolean { return v>0; }
