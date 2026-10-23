/**
 * 856 — Context Dependent Memory — ذاكرة سياقية
 * Family: الذاكرة | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_856 = {
  id: 856,
  titleDe: "Context Dependent Memory",
  titleAr: "ذاكرة سياقية",
  family: "الذاكرة",
  bloom: "فهم",
  level: "A1-B2",
  research: "Godden 1975",
  desc: "Context Dependent Memory",
} as const;

export function tool856Gain(a:boolean):number{return a?1.2:1.0;}
export function tool856Check(v:number):boolean{return v>0;}
