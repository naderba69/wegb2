/**
 * 818 — Explicit Feedback — تغذية صريحة
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_818 = {
  id: 818,
  titleDe: "Explicit Feedback",
  titleAr: "تغذية صريحة",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Ellis 2009",
  desc: "Explicit Feedback",
} as const;

export function tool818Gain(a:boolean):number{return a?1.2:1.0;}
export function tool818Check(v:number):boolean{return v>0;}
