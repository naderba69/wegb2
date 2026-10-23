/**
 * 368 — Self-Regulation Zimmerman — التنظيم الذاتي
 * Family: تلقين | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_368 = {
  id: 368,
  titleDe: "Self-Regulation Zimmerman",
  titleAr: "التنظيم الذاتي",
  family: "تلقين",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Zimmerman 2000",
  desc: "Self-Regulation Zimmerman classroom application",
} as const;

export function tool368Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool368Check(v: number): boolean { return v>0; }
