/**
 * 945 — CAF Framework Housen — إطار CAF هاوسن
 * Family: تقويم | Bloom: قيّم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_945 = {
  id: 945,
  titleDe: "CAF Framework Housen",
  titleAr: "إطار CAF هاوسن",
  family: "تقويم",
  bloom: "قيّم",
  level: "B1-B2",
  research: "Housen 2012",
  desc: "CAF Framework Housen",
} as const;

export function tool945Gain(a:boolean):number{return a?1.2:1.0;}
export function tool945Check(v:number):boolean{return v>0;}
