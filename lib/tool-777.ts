/**
 * 777 — Threshold Hypothesis — فرضية عتبة
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_777 = {
  id: 777,
  titleDe: "Threshold Hypothesis",
  titleAr: "فرضية عتبة",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Cummins 1976",
  desc: "Threshold Hypothesis",
} as const;

export function tool777Gain(a:boolean):number{return a?1.2:1.0;}
export function tool777Check(v:number):boolean{return v>0;}
