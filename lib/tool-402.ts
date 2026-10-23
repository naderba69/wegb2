/**
 * 402 — Explicit Correction — تصحيح صريح
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_402 = {
  id: 402,
  titleDe: "Explicit Correction",
  titleAr: "تصحيح صريح",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Explicit Correction classroom",
} as const;

export function tool402Gain(a:boolean):number{return a?1.2:1.0;}
export function tool402Check(v:number):boolean{return v>0;}
