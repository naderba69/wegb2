/**
 * 638 — Psychotypology — تصنيف نفسي
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_638 = {
  id: 638,
  titleDe: "Psychotypology",
  titleAr: "تصنيف نفسي",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Kellerman 1979",
  desc: "Psychotypology",
} as const;

export function tool638Gain(a:boolean):number{return a?1.2:1.0;}
export function tool638Check(v:number):boolean{return v>0;}
