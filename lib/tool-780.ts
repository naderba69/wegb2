/**
 * 780 — Additive Bilingualism — ثنائية إضافية
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_780 = {
  id: 780,
  titleDe: "Additive Bilingualism",
  titleAr: "ثنائية إضافية",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lambert 1974",
  desc: "Additive Bilingualism",
} as const;

export function tool780Gain(a:boolean):number{return a?1.2:1.0;}
export function tool780Check(v:number):boolean{return v>0;}
