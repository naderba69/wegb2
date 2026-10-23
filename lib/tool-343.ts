/**
 * 343 — Morphology Awareness — الوعي الصرفي
 * Family: SLA | Bloom: حلّل | Level: A2-B1
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_343 = {
  id: 343,
  titleDe: "Morphology Awareness",
  titleAr: "الوعي الصرفي",
  family: "SLA",
  bloom: "حلّل",
  level: "A2-B1",
  research: "Carlisle 2000",
  desc: "Morphology Awareness classroom application",
} as const;

export function tool343Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool343Check(v: number): boolean { return v>0; }
