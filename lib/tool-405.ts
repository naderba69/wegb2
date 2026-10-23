/**
 * 405 — Repetition Feedback — تكرار تصحيحي
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_405 = {
  id: 405,
  titleDe: "Repetition Feedback",
  titleAr: "تكرار تصحيحي",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Repetition Feedback classroom",
} as const;

export function tool405Gain(a:boolean):number{return a?1.2:1.0;}
export function tool405Check(v:number):boolean{return v>0;}
