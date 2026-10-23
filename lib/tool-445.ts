/**
 * 445 — Categorization — التصنيف
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_445 = {
  id: 445,
  titleDe: "Categorization",
  titleAr: "التصنيف",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Taylor 2003",
  desc: "Categorization",
} as const;

export function tool445Gain(a:boolean):number{return a?1.2:1.0;}
export function tool445Check(v:number):boolean{return v>0;}
