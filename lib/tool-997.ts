/**
 * 997 — Washback Alderson — أثر رجعي ألدرسون
 * Family: تقويم | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_997 = {
  id: 997,
  titleDe: "Washback Alderson",
  titleAr: "أثر رجعي ألدرسون",
  family: "تقويم",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Alderson 1993",
  desc: "Washback Alderson",
} as const;

export function tool997Gain(a:boolean):number{return a?1.2:1.0;}
export function tool997Check(v:number):boolean{return v>0;}
