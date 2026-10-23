/**
 * 472 — Gamified SRS — تكرار مُلعّب
 * Family: Gamification | Bloom: طبّق | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_472 = {
  id: 472,
  titleDe: "Gamified SRS",
  titleAr: "تكرار مُلعّب",
  family: "Gamification",
  bloom: "طبّق",
  level: "A0-B2",
  research: "Deterding 2011",
  desc: "Gamified SRS",
} as const;

export function tool472Gain(a:boolean):number{return a?1.2:1.0;}
export function tool472Check(v:number):boolean{return v>0;}
