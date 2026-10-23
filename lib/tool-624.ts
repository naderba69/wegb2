/**
 * 624 — Native Language Magnet — مغناطيس لغة أم
 * Family: SLA | Bloom: فهم | Level: A0-A2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_624 = {
  id: 624,
  titleDe: "Native Language Magnet",
  titleAr: "مغناطيس لغة أم",
  family: "SLA",
  bloom: "فهم",
  level: "A0-A2",
  research: "Kuhl 2000",
  desc: "Native Language Magnet",
} as const;

export function tool624Gain(a:boolean):number{return a?1.2:1.0;}
export function tool624Check(v:number):boolean{return v>0;}
