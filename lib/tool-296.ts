/**
 * 296 — Autonomy Support — دعم الاستقلالية
 * Reeve 2009: choice, rationale, acknowledge feelings
 * Level: A1-B2 | Bloom: طبّق | Family: تلقين
 */
export const TOOL_296 = {
  id: 296,
  titleDe: "Autonomy Support",
  titleAr: "دعم الاستقلالية",
  family: "تلقين",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Reeve 2009",
  desc: "choice, rationale, acknowledge feelings",
} as const;

export function tool296Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool296Check(v: number): boolean { return v > 0; }
