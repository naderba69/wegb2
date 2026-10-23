/**
 * 635 — Markedness — تميّز
 * Family: SLA | Bloom: فهم | Level: B1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_635 = {
  id: 635,
  titleDe: "Markedness",
  titleAr: "تميّز",
  family: "SLA",
  bloom: "فهم",
  level: "B1-B2",
  research: "Eckman 1977",
  desc: "Markedness",
} as const;

export function tool635Gain(a:boolean):number{return a?1.2:1.0;}
export function tool635Check(v:number):boolean{return v>0;}
