/**
 * 791 — Deaf Bilingualism — ثنائية صم
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_791 = {
  id: 791,
  titleDe: "Deaf Bilingualism",
  titleAr: "ثنائية صم",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Mayer 2007",
  desc: "Deaf Bilingualism",
} as const;

export function tool791Gain(a:boolean):number{return a?1.2:1.0;}
export function tool791Check(v:number):boolean{return v>0;}
