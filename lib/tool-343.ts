/**
 * 343 — Morphology Awareness — الوعي الصرفي
 * Carlisle 2000: classroom-ready application with tasks
 * Level: A2-B1 | Bloom: حلّل | Family: SLA
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
