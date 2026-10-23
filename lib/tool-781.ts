/**
 * 781 — Subtractive Bilingualism — ثنائية انتقاصية
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_781 = {
  id: 781,
  titleDe: "Subtractive Bilingualism",
  titleAr: "ثنائية انتقاصية",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lambert 1974",
  desc: "Subtractive Bilingualism",
} as const;

export function tool781Gain(a:boolean):number{return a?1.2:1.0;}
export function tool781Check(v:number):boolean{return v>0;}
