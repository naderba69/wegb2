/**
 * 367 — Learner Autonomy — استقلالية المتعلّم
 * Holec 1981: classroom-ready application with tasks
 * Level: A1-B2 | Bloom: قيّم | Family: تلقين
 */
export const TOOL_367 = {
  id: 367,
  titleDe: "Learner Autonomy",
  titleAr: "استقلالية المتعلّم",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Holec 1981",
  desc: "Learner Autonomy classroom application",
} as const;
export function tool367Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool367Check(v: number): boolean { return v>0; }
