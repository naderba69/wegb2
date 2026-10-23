/**
 * 857 — State Dependent Memory — ذاكرة حالة
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_857 = {
  id: 857,
  titleDe: "State Dependent Memory",
  titleAr: "ذاكرة حالة",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "Eich 1980",
  desc: "State Dependent Memory",
} as const;

export function tool857Gain(a:boolean):number{return a?1.2:1.0;}
export function tool857Check(v:number):boolean{return v>0;}
