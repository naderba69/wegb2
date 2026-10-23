/**
 * 404 — Clarification Request — طلب توضيح
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_404 = {
  id: 404,
  titleDe: "Clarification Request",
  titleAr: "طلب توضيح",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lyster 1998",
  desc: "Clarification Request classroom",
} as const;

export function tool404Gain(a:boolean):number{return a?1.2:1.0;}
export function tool404Check(v:number):boolean{return v>0;}
