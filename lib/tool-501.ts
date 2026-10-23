/**
 * 501 — Elicited Imitation — محاكاة مستثارة
 * Family: SLA | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_501 = {
  id: 501,
  titleDe: "Elicited Imitation",
  titleAr: "محاكاة مستثارة",
  family: "SLA",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Erlam 2006",
  desc: "Elicited Imitation",
} as const;

export function tool501Gain(a:boolean):number{return a?1.2:1.0;}
export function tool501Check(v:number):boolean{return v>0;}
