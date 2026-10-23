/**
 * 502 — Grammaticality Judgment — حكم نحوي
 * Family: SLA | Bloom: قيّم | Level: A2-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_502 = {
  id: 502,
  titleDe: "Grammaticality Judgment",
  titleAr: "حكم نحوي",
  family: "SLA",
  bloom: "قيّم",
  level: "A2-B2",
  research: "Mandell 1999",
  desc: "Grammaticality Judgment",
} as const;

export function tool502Gain(a:boolean):number{return a?1.2:1.0;}
export function tool502Check(v:number):boolean{return v>0;}
