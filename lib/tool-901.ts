/**
 * 901 — Clipping Lappe — اقتطاع لابي
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_901 = {
  id: 901,
  titleDe: "Clipping Lappe",
  titleAr: "اقتطاع لابي",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "Lappe 2007",
  desc: "Clipping Lappe",
} as const;

export function tool901Gain(a:boolean):number{return a?1.2:1.0;}
export function tool901Check(v:number):boolean{return v>0;}
