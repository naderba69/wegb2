/**
 * 965 — Resilience Oxford — صمود أوكسفورد
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_965 = {
  id: 965,
  titleDe: "Resilience Oxford",
  titleAr: "صمود أوكسفورد",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Oxford 2017",
  desc: "Resilience Oxford",
} as const;

export function tool965Gain(a:boolean):number{return a?1.2:1.0;}
export function tool965Check(v:number):boolean{return v>0;}
