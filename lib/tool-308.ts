/**
 * 308 — Memory Strategies — استراتيجيات الذاكرة
 * Family: الذاكرة | Bloom: تذكّر | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_308 = {
  id: 308,
  titleDe: "Memory Strategies",
  titleAr: "استراتيجيات الذاكرة",
  family: "الذاكرة",
  bloom: "تذكّر",
  level: "A0-B2",
  research: "Oxford 1990",
  desc: "grouping, imagery, structured review",
} as const;

export function tool308Gain(applied: boolean): number { return applied ? 1.2 : 1.0; }
export function tool308Check(v: number): boolean { return v > 0; }
