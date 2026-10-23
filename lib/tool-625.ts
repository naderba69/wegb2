/**
 * 625 — Critical Period Hypothesis — فترة حرجة
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_625 = {
  id: 625,
  titleDe: "Critical Period Hypothesis",
  titleAr: "فترة حرجة",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Lenneberg 1967",
  desc: "Critical Period Hypothesis",
} as const;

export function tool625Gain(a:boolean):number{return a?1.2:1.0;}
export function tool625Check(v:number):boolean{return v>0;}
