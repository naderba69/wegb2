/**
 * 560 — Rater Training — تدريب مقيم
 * Family: تقويم | Bloom: طبّق | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_560 = {
  id: 560,
  titleDe: "Rater Training",
  titleAr: "تدريب مقيم",
  family: "تقويم",
  bloom: "طبّق",
  level: "B1-B2",
  research: "McNamara 1996",
  desc: "Rater Training",
} as const;

export function tool560Gain(a:boolean):number{return a?1.2:1.0;}
export function tool560Check(v:number):boolean{return v>0;}
