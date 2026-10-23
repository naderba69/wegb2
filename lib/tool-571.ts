/**
 * 571 — Decentering — نزع تمركز
 * Family: Immersion | Bloom: حلّل | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_571 = {
  id: 571,
  titleDe: "Decentering",
  titleAr: "نزع تمركز",
  family: "Immersion",
  bloom: "حلّل",
  level: "B1-B2",
  research: "Byram 2008",
  desc: "Decentering",
} as const;

export function tool571Gain(a:boolean):number{return a?1.2:1.0;}
export function tool571Check(v:number):boolean{return v>0;}
