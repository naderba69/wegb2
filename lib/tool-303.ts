/**
 * 303 — Learning Strategies Oxford — استراتيجيات التعلّم
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_303 = {
  id: 303,
  titleDe: "Learning Strategies Oxford",
  titleAr: "استراتيجيات التعلّم",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Oxford 1990",
  desc: "direct + indirect strategies taxonomy",
} as const;

export function tool303Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool303Check(v: number): boolean { return v > 0; }
