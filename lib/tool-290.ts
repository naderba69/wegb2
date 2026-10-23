/**
 * 290 — Self-Management — الإدارة الذاتية
 * Family: تلقين | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_290 = {
  id: 290,
  titleDe: "Self-Management",
  titleAr: "الإدارة الذاتية",
  family: "تلقين",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Mirza 2016",
  desc: "teach learners to manage load themselves",
} as const;

export function tool290Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool290Check(v: number): boolean { return v > 0; }
