/**
 * 315 — Discourse Markers — روابط الخطاب
 * Schiffrin 1987: applied to German teaching — classroom integration via tasks
 * Level: A2-B2 | Bloom: طبّق | Family: طرائق
 */
export const TOOL_315 = {
  id: 315,
  titleDe: "Discourse Markers",
  titleAr: "روابط الخطاب",
  family: "طرائق",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Schiffrin 1987",
  desc: "Discourse Markers applied in classroom",
} as const;
export function tool315Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool315Check(v: number): boolean { return v>0; }
