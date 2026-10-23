/**
 * 594 — Reading Anxiety — قلق قراءة
 * Family: SLA | Bloom: حلّل | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_594 = {
  id: 594,
  titleDe: "Reading Anxiety",
  titleAr: "قلق قراءة",
  family: "SLA",
  bloom: "حلّل",
  level: "A1-B2",
  research: "Saito 1999",
  desc: "Reading Anxiety",
} as const;

export function tool594Gain(a:boolean):number{return a?1.2:1.0;}
export function tool594Check(v:number):boolean{return v>0;}
