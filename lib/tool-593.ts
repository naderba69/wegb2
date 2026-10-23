/**
 * 593 — Writing Anxiety — قلق كتابة
 * Family: SLA | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_593 = {
  id: 593,
  titleDe: "Writing Anxiety",
  titleAr: "قلق كتابة",
  family: "SLA",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Cheng 2004",
  desc: "Writing Anxiety",
} as const;

export function tool593Gain(a:boolean):number{return a?1.2:1.0;}
export function tool593Check(v:number):boolean{return v>0;}
