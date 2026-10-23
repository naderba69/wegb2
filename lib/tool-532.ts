/**
 * 532 — Implicit Learning — تعلم ضمني
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_532 = {
  id: 532,
  titleDe: "Implicit Learning",
  titleAr: "تعلم ضمني",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Rebuschat 2015",
  desc: "Implicit Learning",
} as const;

export function tool532Gain(a:boolean):number{return a?1.2:1.0;}
export function tool532Check(v:number):boolean{return v>0;}
