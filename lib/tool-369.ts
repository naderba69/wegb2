/**
 * 369 — Self-Directed Learning — التعلّم الموجه ذاتياً
 * Knowles 1975: classroom-ready application with tasks
 * Level: A1-B2 | Bloom: أنشئ | Family: تلقين
 */
export const TOOL_369 = {
  id: 369,
  titleDe: "Self-Directed Learning",
  titleAr: "التعلّم الموجه ذاتياً",
  family: "تلقين",
  bloom: "أنشئ",
  level: "A1-B2",
  research: "Knowles 1975",
  desc: "Self-Directed Learning classroom application",
} as const;
export function tool369Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool369Check(v: number): boolean { return v>0; }
