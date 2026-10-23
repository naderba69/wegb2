/**
 * 786 — Endangered Languages — لغات مهددة
 * Family: Immersion | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_786 = {
  id: 786,
  titleDe: "Endangered Languages",
  titleAr: "لغات مهددة",
  family: "Immersion",
  bloom: "فهم",
  level: "A1-B2",
  research: "Crystal 2000",
  desc: "Endangered Languages",
} as const;

export function tool786Gain(a:boolean):number{return a?1.2:1.0;}
export function tool786Check(v:number):boolean{return v>0;}
