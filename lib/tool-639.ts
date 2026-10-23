/**
 * 639 — Multilingual Awareness — وعي متعدد
 * Family: SLA | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_639 = {
  id: 639,
  titleDe: "Multilingual Awareness",
  titleAr: "وعي متعدد",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Jessner 2006",
  desc: "Multilingual Awareness",
} as const;

export function tool639Gain(a:boolean):number{return a?1.2:1.0;}
export function tool639Check(v:number):boolean{return v>0;}
