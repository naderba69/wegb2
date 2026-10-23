/**
 * 730 — Global Citizenship — مواطنة عالمية
 * Family: Immersion | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_730 = {
  id: 730,
  titleDe: "Global Citizenship",
  titleAr: "مواطنة عالمية",
  family: "Immersion",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Oxfam 2015",
  desc: "Global Citizenship",
} as const;

export function tool730Gain(a:boolean):number{return a?1.2:1.0;}
export function tool730Check(v:number):boolean{return v>0;}
