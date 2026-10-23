/**
 * 396 — Testing Effect Adv — أثر الاختبار متقدم
 * Family: الذاكرة | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_396 = {
  id: 396,
  titleDe: "Testing Effect Adv",
  titleAr: "أثر الاختبار متقدم",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Roediger 2011",
  desc: "Testing Effect Adv classroom",
} as const;

export function tool396Gain(a: boolean): number { return a?1.2:1.0; }
export function tool396Check(v:number):boolean { return v>0; }
