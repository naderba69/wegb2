/**
 * 297 — Competence Support — دعم الكفاءة
 * Family: تلقين | Bloom: طبّق | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_297 = {
  id: 297,
  titleDe: "Competence Support",
  titleAr: "دعم الكفاءة",
  family: "تلقين",
  bloom: "طبّق",
  level: "A2-B2",
  research: "Deci 2000",
  desc: "optimal challenge + feedback",
} as const;

export function tool297Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool297Check(v: number): boolean { return v > 0; }
