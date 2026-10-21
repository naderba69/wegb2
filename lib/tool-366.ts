/**
 * 366 — Multiple Intelligences Critique — الذكاءات المتعددة نقد
 * Waterhouse 2006: classroom-ready application with tasks
 * Level: A0-B2 | Bloom: حلّل | Family: تلقين
 */
export const TOOL_366 = {
  id: 366,
  titleDe: "Multiple Intelligences Critique",
  titleAr: "الذكاءات المتعددة نقد",
  family: "تلقين",
  bloom: "حلّل",
  level: "A0-B2",
  research: "Waterhouse 2006",
  desc: "Multiple Intelligences Critique classroom application",
} as const;
export function tool366Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool366Check(v: number): boolean { return v>0; }
