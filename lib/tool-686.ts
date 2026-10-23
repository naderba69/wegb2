/**
 * 686 — Given New — معطى/جديد
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_686 = {
  id: 686,
  titleDe: "Given New",
  titleAr: "معطى/جديد",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Clark 1975",
  desc: "Given New",
} as const;

export function tool686Gain(a:boolean):number{return a?1.2:1.0;}
export function tool686Check(v:number):boolean{return v>0;}
