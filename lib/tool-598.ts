/**
 * 598 — Resilience — صمود
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_598 = {
  id: 598,
  titleDe: "Resilience",
  titleAr: "صمود",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Oxford 2017",
  desc: "Resilience",
} as const;

export function tool598Gain(a:boolean):number{return a?1.2:1.0;}
export function tool598Check(v:number):boolean{return v>0;}
