/**
 * 409 — Self-Correction — تصحيح ذاتي
 * Family: تلقين | Bloom: قيّم | Level: A1-B2
 * Auto-generated from content/tools.yaml — do not edit manually — run npm run gen:tools
 */
export const TOOL_409 = {
  id: 409,
  titleDe: "Self-Correction",
  titleAr: "تصحيح ذاتي",
  family: "تلقين",
  bloom: "قيّم",
  level: "A1-B2",
  research: "Edge 1989",
  desc: "Self-Correction classroom",
} as const;

export function tool409Gain(a:boolean):number{return a?1.2:1.0;}
export function tool409Check(v:number):boolean{return v>0;}
