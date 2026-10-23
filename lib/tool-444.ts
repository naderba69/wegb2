/**
 * 444 — Schematization — القولبة
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_444 = {
  id: 444,
  titleDe: "Schematization",
  titleAr: "القولبة",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Langacker 2008",
  desc: "Schematization",
} as const;

export function tool444Gain(a:boolean):number{return a?1.2:1.0;}
export function tool444Check(v:number):boolean{return v>0;}
