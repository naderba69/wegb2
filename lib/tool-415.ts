/**
 * 415 — Pushed Output — إخراج مدفوع
 * Family: SLA | Bloom: أنشئ | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_415 = {
  id: 415,
  titleDe: "Pushed Output",
  titleAr: "إخراج مدفوع",
  family: "SLA",
  bloom: "أنشئ",
  level: "B1-B2",
  research: "Swain 1985",
  desc: "Pushed Output classroom",
} as const;

export function tool415Gain(a:boolean):number{return a?1.2:1.0;}
export function tool415Check(v:number):boolean{return v>0;}
