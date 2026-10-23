/**
 * 367 — Learner Autonomy — استقلالية المتعلّم
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
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
