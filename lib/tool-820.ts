/**
 * 820 — Uptake Lyster — استيعاب ليستر
 * Family: SLA | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_820 = {
  id: 820,
  titleDe: "Uptake Lyster",
  titleAr: "استيعاب ليستر",
  family: "SLA",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Lyster 1997",
  desc: "Uptake Lyster",
} as const;

export function tool820Gain(a:boolean):number{return a?1.2:1.0;}
export function tool820Check(v:number):boolean{return v>0;}
