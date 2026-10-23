/**
 * 800 — Ecological Affordances — إمكانات بيئية
 * Family: SLA | Bloom: فهم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_800 = {
  id: 800,
  titleDe: "Ecological Affordances",
  titleAr: "إمكانات بيئية",
  family: "SLA",
  bloom: "فهم",
  level: "A1-B2",
  research: "van Lier 2000",
  desc: "Ecological Affordances",
} as const;

export function tool800Gain(a:boolean):number{return a?1.2:1.0;}
export function tool800Check(v:number):boolean{return v>0;}
