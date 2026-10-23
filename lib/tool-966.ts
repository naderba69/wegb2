/**
 * 966 — Wellbeing Oxford — رفاهية أوكسفورد
 * Family: تلقين | Bloom: فهم | Level: A0-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_966 = {
  id: 966,
  titleDe: "Wellbeing Oxford",
  titleAr: "رفاهية أوكسفورد",
  family: "تلقين",
  bloom: "فهم",
  level: "A0-B2",
  research: "Oxford 2016",
  desc: "Wellbeing Oxford",
} as const;

export function tool966Gain(a:boolean):number{return a?1.2:1.0;}
export function tool966Check(v:number):boolean{return v>0;}
