/**
 * 967 — Empathy Mercer — تعاطف ميرسر
 * Family: Immersion | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_967 = {
  id: 967,
  titleDe: "Empathy Mercer",
  titleAr: "تعاطف ميرسر",
  family: "Immersion",
  bloom: "فهم",
  level: "A1-B2",
  research: "Mercer 2016",
  desc: "Empathy Mercer",
} as const;

export function tool967Gain(a:boolean):number{return a?1.2:1.0;}
export function tool967Check(v:number):boolean{return v>0;}
