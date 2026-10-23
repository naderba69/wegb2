/**
 * 413 — Modified Output — إخراج معدّل
 * Family: SLA | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_413 = {
  id: 413,
  titleDe: "Modified Output",
  titleAr: "إخراج معدّل",
  family: "SLA",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Swain 2005",
  desc: "Modified Output classroom",
} as const;

export function tool413Gain(a:boolean):number{return a?1.2:1.0;}
export function tool413Check(v:number):boolean{return v>0;}
