/**
 * 471 — Spaced Mobile — متباعد جوّال
 * Family: الذاكرة | Bloom: طبّق | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_471 = {
  id: 471,
  titleDe: "Spaced Mobile",
  titleAr: "متباعد جوّال",
  family: "الذاكرة",
  bloom: "طبّق",
  level: "A1-B2",
  research: "Thornton 2005",
  desc: "Spaced Mobile",
} as const;

export function tool471Gain(a:boolean):number{return a?1.2:1.0;}
export function tool471Check(v:number):boolean{return v>0;}
