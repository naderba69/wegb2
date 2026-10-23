/**
 * 812 — Attention Robinson — انتباه روبنسون
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_812 = {
  id: 812,
  titleDe: "Attention Robinson",
  titleAr: "انتباه روبنسون",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Robinson 1995",
  desc: "Attention Robinson",
} as const;

export function tool812Gain(a:boolean):number{return a?1.2:1.0;}
export function tool812Check(v:number):boolean{return v>0;}
